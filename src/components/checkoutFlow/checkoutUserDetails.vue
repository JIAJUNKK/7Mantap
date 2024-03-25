<template>
    <div v-if="editSection !== 'userDetails'" class="inner-information-container">
        <div class = "edit-title-header">
            <h1>Your Details</h1>
            <span class="edit-text-toggle" @click="toggleEdit('userDetails')">Edit</span>
        </div>
        <p><strong>Email:</strong> {{ email }}</p>
        <p><strong>Username:</strong> {{ username }}</p>
    </div>

    <div v-if="editSection === 'userDetails'" class="form-container">
        <div class = "edit-title-header">
            <h1>Edit Details</h1>
            <span class = "edit-text-toggle" @click="cancelEdit" >Cancel</span>
        </div>
        <form @submit.prevent="updateUserDetails">
            <div>
                <label>Email<span class="required">*</span></label><br>
                <input class = "big-input-field" type="email" v-model="editedUserInfo.email" required>
            </div>

            <div>
                <label>Date of Birth<span class="required">*</span></label><br>
                <input class = "big-input-field" type="date" v-model="editedUserInfo.dob">
            </div>            
            <button class = "big-submit-button" type="submit">Save Changes</button>
            <button class = "big-cancel-button" type="button" @click="cancelEdit">Cancel</button>
        </form>
    </div>
</template>

<script>
export default {
    name: "CheckoutUserDetails",
    data() {
        return {
        editSection: null,
        editedUserInfo: { 
            email: '',
            dob: '',
        },     
        email: '',
        username: '',  
    }
        
    },
    created() {
        this.getUserDetails();
    },
    methods: {
        async getUserDetails() {
            const token = localStorage.getItem('token');
            if (token) {
                try{
                    const userDetails = await this.$axios.post(`${this.$api_path}/getUserInfo`, null, { headers: { Authorization: token } })
                    if (userDetails.data){
                        this.username = userDetails.data.username;
                        this.email = userDetails.data.email;  
                        this.editedUserInfo.email =  userDetails.data.email;     
                        this.editedUserInfo.dob =  userDetails.data.dob;         
                    }
                }catch(error){
                    console.error('Error fetching user details:', error);
                }
            }
        },
        updateUserDetails(){
            this.email = this.editedUserInfo.email;
            this.dob = this.editedUserInfo.dob;
            this.editSection = null;
        },
        toggleEdit(section) {
            this.editSection = section;
            if (section === "deliveryAddress"){
                this.editingAddress = { ...this.selectedAddress };
            }
        },
        cancelEdit() {
            this.editSection = null;
        },
    },
}
</script>

<style scoped>
@import '@/style/containers.css';
@import '@/style/textStyle.css';

</style>
