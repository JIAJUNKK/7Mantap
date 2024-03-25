<template>
    <div class="form-container">
        <h1 class="big-title">Edit Details</h1>
        <form @submit.prevent="updateDetails">
            <div>
            <label>Email<span class="required">*</span></label><br>
                <input class = "big-input-field" type="email" v-model="editedUserInfo.email" required>
            </div>

            <div>
                <label>Username<span class="required">*</span></label><br>
                <input class = "big-input-field" type="text" v-model="editedUserInfo.username" required>
            </div>

            <div>
                <label>Date of Birth<span class="required">*</span></label><br>
                <input class = "big-input-field" type="date" v-model="editedUserInfo.dob">
            </div>

            <div>
                <label>Gender</label><br>
                <select class = "big-input-field" v-model="editedUserInfo.gender">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Prefer not to say</option>
                </select>
            </div>
            
            <button class = "big-submit-button" type="submit">Save Changes</button>
            <button class = "big-cancel-button" @click="goBack" type="button">Cancel</button>
        </form>
    </div>
</template>


<script>
export default {
    name: 'EditDetails',
    data() {
        return {
        editedUserInfo: { // Initialize editedUserInfo object
            email: '',
            username: '',
            dob: '',
            gender: ''
        },
        userInfo: {},// Store user information
        };
    },
    created() {
        const token = localStorage.getItem('token');
        if (token) {
        this.$axios.post(`${this.$api_path}/getUserInfo`, null, { headers: { Authorization: token } })
            .then(response => {
                this.userInfo = response.data;
                this.editedUserInfo.email = this.userInfo.email;
                this.editedUserInfo.username = this.userInfo.username;
                this.editedUserInfo.dob = this.userInfo.dob;
                this.editedUserInfo.gender = this.userInfo.gender;
            })
            .catch(error => {
            console.error('Error fetching user info:', error);
            });
        }
    },
    methods: {
        updateDetails() {
            const token = localStorage.getItem('token');
            if (token) {
                this.$axios.post(`${this.$api_path}/updateUserDetails`, this.editedUserInfo, { headers: { Authorization: token } })
                .then(response => {
                    alert('User details updated successfully');
                })
                .catch(error => {
                    console.error('Error updating user details:', error);
                });
            }
            this.goBack();
        },       
        logout() {
            localStorage.removeItem('token');
            this.$emit('logoutUser');
            this.$router.push('/registration');
            localStorage.clear();
            setTimeout(() => {
            window.location.reload();
            }, 0); // 2000 milliseconds (2 seconds) delay before reloading
        },
        goBack() {
            this.$emit('editingFinished'); // Emit event to notify the parent component
            this.$router.go(-1);
            window.location.reload();
        },
    }
}
</script>

<style scoped>
@import '@/style/containers.css';
@import '@/style/buttons.css';
@import '@/style/inputField.css';
@import '@/style/textStyle.css';
@import '@/style/mobileView.css';

</style>