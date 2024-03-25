<template>
        <div v-if="editSection !== 'billingAddress'" class="inner-information-container">
            <div class = "edit-title-header">
                <h1>Billing Address</h1>
                <span v-show="!billingAddress.firstName" class="edit-text-toggle" @click="toggleEdit('billingAddress')">Add</span>
                <span v-show="billingAddress.firstName" class="edit-text-toggle" @click="toggleEdit('billingAddress')">Edit</span>
            </div>
            <h5>{{ billingAddress.firstName + " " + billingAddress.lastName }}</h5>
            <h5>{{ billingAddress.addressLine1 }}</h5>
            <h5>{{ billingAddress.addressLine2 }}</h5>
            <h5>{{ billingAddress.postcode + " " + billingAddress.city}}</h5>
            <h5>{{ billingAddress.state }}</h5>

        </div>

        <div v-if="editSection === 'billingAddress'" class="form-container">
            <div class = "edit-title-header">
                <h1>Edit Billing Address</h1>
                <span @click="cancelEdit" class = "edit-text-toggle">Cancel</span>
            </div>
            <form>
                <div>
                <label for="firstName">First Name<span class="required">*</span></label>
                <input class = "big-input-field" type="text" v-model="billingAddress.firstName" required>
                </div>
                <div>
                <label for="lastName">Last Name<span class="required">*</span></label>
                <input class = "big-input-field" type="text" v-model="billingAddress.lastName" required>
                </div>
                <div>
                <label for="addressLine1">Address Line 1<span class="required">*</span></label>
                <input class = "big-input-field" type="text" v-model="billingAddress.addressLine1" required>
                </div>
                <div>
                <label for="addressLine2">Address Line 2</label>
                <input class = "big-input-field" type="text" v-model="billingAddress.addressLine2">
                </div>
                <div>
                <label for="city">City<span class="required">*</span></label>
                <input class = "big-input-field" type="text" v-model="billingAddress.city" required>
                </div>
                <div>
                <label for="state">State<span class="required">*</span></label>
                <input class = "big-input-field" type="text" v-model="billingAddress.state" required>
                </div>
                <div>
                <label for="postcode">Postcode<span class="required">*</span></label>
                <input class = "big-input-field" type="text" v-model="billingAddress.postcode" required>
                </div>
                <button class = "big-submit-button" type="submit" @click="updateBillingAddress">Save Edit</button>
                <button class = "big-cancel-button" type="button" @click="cancelEdit">Cancel</button>
            </form>
        </div>
</template>

<script>
export default {
    name: "CheckoutBillingAddress",
    data() {
        return {
        editSection: null,
        billingAddress: {
            firstName: '',
            lastName: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postcode: ''
        },
    }
    },
    created() {
        this.getUserDetails();
    },
    methods: {
        async getUserDetails() {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const billingResponse = await this.$axios.post(`${this.$api_path}/getBillingAddress`, null, { headers: { Authorization: token } })
                    if (billingResponse.data && billingResponse.data.billingAddress) {
                        this.billingAddress = billingResponse.data.billingAddress;
                    }
                } catch (error) {
                    console.error('Error fetching billing address:', error);
                }
            }
        },
        updateBillingAddress(){
            const token = localStorage.getItem('token');
            if (token) {
                this.$axios.post(`${this.$api_path}/updateBillingAddress`, { address: this.billingAddress }, { headers: { Authorization: token } })
                .then(response => {
                    alert('Billing address created successfully');
                })
                .catch(error => {
                    console.error('Error creating billing address:', error);
                });
                setTimeout(() => {
                    window.location.reload();
                }, 0);
            }
        },
        toggleEdit(section) {
            this.editSection = section;
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
@import '@/style/buttons.css';
@import '@/style/inputField.css';

</style>
