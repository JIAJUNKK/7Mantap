<template>
    <div v-for="(address, index) in userAddresses" :key="index">
          <div class="edit-title-header">
            <h2>{{ index === 0 ? 'Default Delivery Address' : 'Delivery Address ' + (index + 1) }}</h2>
            <span class="edit-text-toggle" @click="toggleEdit(index)">Edit</span>
          </div>
          <button v-if="index !== 0" @click="setDefaultAddress(index)" class="small-cancel-button">Set as Default</button>

          <div class="inner-information-container" v-show="!address.isEditDeliveryVisible">
          <small>First Name</small>
          <h5>{{ address.firstName }}</h5>
          <small>Last Name</small>
          <h5>{{ address.lastName }}</h5>
          <small>Address Line 1</small>
          <h5>{{ address.addressLine1 }}</h5>
          <small>Address Line 2</small>
          <h5>{{ address.addressLine2 }}</h5>
          <small>City</small>
          <h5>{{ address.city }}</h5>
          <small>State</small>
          <h5>{{ address.state }}</h5>
          <small>Postcode</small>
          <h5>{{ address.postcode }}</h5>
          </div>

          <div class="form-container" v-show="address.isEditDeliveryVisible">
          <form>
              <div>
              <label for="firstName">First Name<span class="required">*</span></label>
              <input class = "big-input-field" type="text" v-model="address.firstName" required>
              </div>
              <div>
              <label for="lastName">Last Name<span class="required">*</span></label>
              <input class = "big-input-field" type="text" v-model="address.lastName" required>
              </div>
              <div>
              <label for="addressLine1">Address Line 1<span class="required">*</span></label>
              <input class = "big-input-field" type="text" v-model="address.addressLine1" required>
              </div>
              <div>
              <label for="addressLine2">Address Line 2</label>
              <input class = "big-input-field" type="text" v-model="address.addressLine2">
              </div>
              <div>
              <label for="city">City<span class="required">*</span></label>
              <input class = "big-input-field" type="text" v-model="address.city" required>
              </div>
              <div>
              <label for="state">State<span class="required">*</span></label>
              <input class = "big-input-field" type="text" v-model="address.state" required>
              </div>
              <div>
              <label for="postcode">Postcode<span class="required">*</span></label>
              <input class = "big-input-field" type="text" v-model="address.postcode" required>
              </div>
              <button class = "big-submit-button" type="submit" @click="saveAddress(address, index)">Save Edit</button>
              <button class = "big-cancel-button" type="button" @click="toggleEdit(index)">Cancel</button>
          </form>
          </div>
    </div>
</template>

<script>
export default {
  name: 'DeliveryAddressBook',
  data() {
    return {
      isEditDeliveryVisible: false,
      userAddresses: [],
    };
  },
  created() {
    this.getUserDetails();
  },
  methods: {
    toggleEdit(index) {
        this.userAddresses[index].isEditDeliveryVisible = !this.userAddresses[index].isEditDeliveryVisible;
        this.userAddresses.forEach((address, idx) => {
        if (idx !== index) {
            address.isEditDeliveryVisible = false;
        }
        });
    },
    async setDefaultAddress(index) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
        const response = await this.$axios.post(`${this.$api_path}/setDefaultAddress`, { defaultAddressIndex: index }, { headers: { Authorization: token } });
        console.log(response.data);
        alert("Default address changed successfully");
        setTimeout(() => {
          window.location.reload();
        }, 0);

        } catch (error) {
        console.error('Error updating default address index:', error);
        }
      }
    },
    async getUserDetails() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const AddressResponse = await this.$axios.post(`${this.$api_path}/getUserAddress`, null, { headers: { Authorization: token } });
          if (AddressResponse.data && AddressResponse.data.address) {
            this.userAddresses = AddressResponse.data.address;
          }
        } catch (error) {
          console.error('Error fetching user address:', error);
        }
      }
    },
    async saveAddress(address, index) {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const addressData = {
                    firstName: address.firstName,
                    lastName: address.lastName,
                    addressLine1: address.addressLine1,
                    addressLine2: address.addressLine2,
                    city: address.city,
                    state: address.state,
                    postcode: address.postcode
                };
                const response = await this.$axios.post(`${this.$api_path}/updateUserAddress/${index}`, { address: addressData }, { headers: { Authorization: token } });
                console.log(response.data);
                alert("Delivery Address Has Been Updated Successfully!");
                this.reset();
                this.toggleEdit(index); 
                setTimeout(() => {
                    window.location.reload();
                }, 0);
            } catch (error) {
                console.error('Error updating user address:', error);
            }
        }
    },
  }
};
</script>

<style scoped>
@import '@/style/containers.css';
@import '@/style/textStyle.css';
@import '@/style/buttons.css';
@import '@/style/inputField.css';
.inner-information-container{
  border: 2px solid black;
  padding: 10px; margin: 10px;
}

</style>
