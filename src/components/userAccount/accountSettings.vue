<template>
    <div class="big-div-container-right">
        <router-view v-show="isEditing" @editingFinished="setIsEditing(false)"></router-view>

        <div class = "big-information-container" v-show="!isEditing">
          <div class = "edit-title-header">
            <h2>My Details</h2>
            <router-link class = "edit-text-toggle" to="/UserProfile/AccountSettings/edit-details" @click="setIsEditing(true)">Edit</router-link>
          </div>
          <div class = "inner-information-container">
            <small>Email</small>
            <h5>{{ userInfo.email }}</h5>
            <br>
            <small>Username</small>
            <h5>{{ userInfo.username }}</h5>
            <br>
            <small>Date Of Birth</small>
            <h5>{{ userInfo.dob }}</h5>            
            <br>
            <small>Gender</small>
            <h5>{{ userInfo.gender }}</h5>
          </div>
        </div>

        <div class = "big-information-container" v-show="!isEditing">
          <div class = "edit-title-header">
            <h2>Address Book</h2>
            <router-link class="edit-text-toggle" to="/UserProfile/AccountSettings/address-book"  @click="setIsEditing(true)">Edit</router-link>
          </div>
          <div class="inner-information-container">
            <template v-if="address && address.billingAddress">
              <small>First Name</small>
              <h5>{{ address.billingAddress.firstName }}</h5>
              <small>Last Name</small>
              <h5>{{ address.billingAddress.lastName }}</h5>
              <br>
              <small>Billing Address</small>
              <h5>{{ address.billingAddress.addressLine1 }}</h5>
              <h5>{{ address.billingAddress.addressLine2 }}</h5>
              <h5>{{ address.billingAddress.state }}</h5>
              <h5>{{ address.billingAddress.city }}</h5>
              <h5>{{ address.billingAddress.postcode }}</h5>
            </template>

            <template v-else>
              <p>No billing address found.</p>
            </template>
          </div>
        </div>

        <div class = "big-information-container" v-show="!isEditing">
          <div class = "edit-title-header">
            <h2>User Security</h2>
            <router-link class = "edit-text-toggle" to="/UserProfile/AccountSettings/user-security"  @click="setIsEditing(true)">Edit</router-link>
          </div>
          <h4 class = "inner-information-container">You can change your password here</h4><br>
        </div>
    </div>
</template>

<script>
export default {
  name: 'AccountSettings',
  data() {
    return {
      userInfo: {},// Store user information
      address: {},
      isEditing: false,
    };
  },
  created() {
    this.getUserDetails();
  },
  methods: {
    async getUserDetails(){
      const token = localStorage.getItem('token');
      if(token){
        try {
          const detailsResponse = await this.$axios.post(`${this.$api_path}/getUserInfo`, null, { headers: { Authorization: token } });
          const addressResponse = await this.$axios.post(`${this.$api_path}/getBillingAddress`, null, { headers: { Authorization: token } });
          this.userInfo = detailsResponse.data;
          this.address = addressResponse.data;
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }else{
        console.error('User not authorised');
      }
    },
    setIsEditing(value) {
      this.isEditing = value;
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
    editingFinished() {
      this.isEditing = false; // Set isEditing to false when editing is finished
    },
  }
};
</script>

<style scoped>
@import '@/style/containers.css';
@import '@/style/mobileView.css';

/* Add any additional styles as needed */
</style>
