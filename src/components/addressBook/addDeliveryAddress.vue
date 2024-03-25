<template>
    <button @click="toggleForm" class="big-submit-button" v-show="!isFormExpanded">Add New Delivery Address</button><br>
    <div class="form-container-container" v-show="isFormExpanded">
        <h2>Add A Delivery Address</h2><br>
        <form @submit.prevent="createUserAddress">
        <div>
            <label for="firstName">First Name<span class="required">*</span></label>
            <input class = "big-input-field" type="text" v-model="addingDeliveryAddress.firstName" required>
        </div>
        <div>
            <label for="lastName">Last Name<span class="required">*</span></label>
            <input class = "big-input-field" type="text" v-model="addingDeliveryAddress.lastName" required>
        </div>
        <div>
            <label for="addressLine1">Address Line 1<span class="required">*</span></label>
            <input class = "big-input-field" type="text" v-model="addingDeliveryAddress.addressLine1" required>
        </div>
        <div>
            <label for="addressLine2">Address Line 2</label>
            <input class = "big-input-field" type="text" v-model="addingDeliveryAddress.addressLine2">
        </div>
        <div>
            <label for="city">City<span class="required">*</span></label>
            <input class = "big-input-field" type="text" v-model="addingDeliveryAddress.city" required>
        </div>
        <div>
            <label for="state">State<span class="required">*</span></label>
            <input class = "big-input-field" type="text" v-model="addingDeliveryAddress.state" required>
        </div>
        <div>
            <label for="postcode">Postcode<span class="required">*</span></label>
            <input class = "big-input-field" type="text" v-model="addingDeliveryAddress.postcode" required>
        </div>
        <button class = "big-submit-button" type="submit">Save Address</button>
        <button class = "big-cancel-button" type="button" @click="toggleForm">Cancel</button>
        </form>
    </div>
</template>

<script>
export default {
  name: 'AddDeliveryAddressBook',
  data() {
    return {
      isFormExpanded: false,
      addingDeliveryAddress: {
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
  methods: {
    toggleForm() {
      this.isFormExpanded = !this.isFormExpanded;
    },
    reset() {
      this.addingDeliveryAddress.firstName = '';
      this.addingDeliveryAddress.lastName = '';
      this.addingDeliveryAddress.addressLine1 = '';
      this.addingDeliveryAddress.addressLine2 = '';
      this.addingDeliveryAddress.city = '';
      this.addingDeliveryAddress.state = '';
      this.addingDeliveryAddress.postcode = '';
    },
    async createUserAddress() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
            const addressData = {
                firstName: this.addingDeliveryAddress.firstName,
                lastName: this.addingDeliveryAddress.lastName,
                addressLine1: this.addingDeliveryAddress.addressLine1,
                addressLine2: this.addingDeliveryAddress.addressLine2,
                city: this.addingDeliveryAddress.city,
                state: this.addingDeliveryAddress.state,
                postcode: this.addingDeliveryAddress.postcode
            };
            const response = await this.$axios.post(`${this.$api_path}/createUserAddress`, { address: addressData }, { headers: { Authorization: token } });
            console.log(response.data); // Log the response from the backend
            alert("Delivery Address Has Been Added Successfully!");
            this.reset();
            setTimeout(() => {
                window.location.reload();
            }, 0);
        } catch (error) {
          alert('Address already exists');
        }
      }
      this.toggleForm();
    },
  }
};
</script>

<style scoped>
@import '@/style/containers.css';
@import '@/style/textStyle.css';
@import '@/style/buttons.css';
@import '@/style/inputField.css';
</style>
