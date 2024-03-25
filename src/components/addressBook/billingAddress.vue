<template>
    <div class="edit-title-header">
        <h2>Billing Address</h2>
        <span class="edit-text-toggle" @click="toggleBillingAddressEdit">Edit</span>
    </div>

    <div class="inner-information-container" v-show="!isEditBillingVisible">
        <small>First Name</small>
        <h5>{{ billingAddress.firstName }}</h5>
        <small>Last Name</small>
        <h5>{{ billingAddress.lastName }}</h5>
        <small>Address Line 1</small>
        <h5>{{ billingAddress.addressLine1 }}</h5>
        <small>Address Line 2</small>
        <h5>{{ billingAddress.addressLine2 }}</h5>
        <small>City</small>
        <h5>{{ billingAddress.city }}</h5>
        <small>State</small>
        <h5>{{ billingAddress.state }}</h5>
        <small>Postcode</small>
        <h5>{{ billingAddress.postcode }}</h5>
    </div>

    <div class="form-container" v-show="isEditBillingVisible">
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
            <button class = "big-submit-button" type="submit" @click="saveBillingAddress">Save Edit</button>
            <button class = "big-cancel-button" type="button" @click="toggleBillingAddressEdit">Cancel</button>
        </form>
    </div>
</template>

<script>
export default {
  name: 'BillingAddressBook',
  data() {
    return {
      isEditBillingVisible: false, 
      billingAddress: {
        firstName: '',
        lastName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postcode: ''
      },
    };
  },
  created() {
    this.getUserDetails();
  },
  methods: {
    toggleBillingAddressEdit(){
        this.isEditBillingVisible = !this.isEditBillingVisible;
    },
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
    saveBillingAddress() {
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
  }
};
</script>

<style scoped>
@import '@/style/containers.css';
@import '@/style/buttons.css';
@import '@/style/inputField.css';
@import '@/style/textStyle.css';
.inner-information-container{
  margin-bottom: 10%;
}
</style>
