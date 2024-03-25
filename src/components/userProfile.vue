<template>
  <div class="user-profile-main-container">

    <div class="small-information-container">
      <h1><router-link to="/UserProfile" class = "router-link-title">My Account</router-link></h1><br>
      <div class="user-settings">
        <p ><router-link to="/UserProfile/AccountSettings" class = "router-link-title">Account Information</router-link></p>
        <p><router-link to="/UserProfile/Contact-us" class = "router-link-title">Contact Us</router-link></p>
        <p><router-link to="/UserProfile/Feedback" class = "router-link-title">Feedback</router-link></p>
        <p><router-link to="/UserProfile/Order-History" class = "router-link-title">Order History</router-link></p><br>
        <p><button @click="logout" class="small-cancel-button">Logout</button></p>
      </div>
    </div>

    <div class="big-div-container-right">
      <div class="big-information-container" v-show="isUSerProfile">
        <div class="inner-information-container">
          <h2>User Details</h2>
          <p><strong>Email:</strong> {{ email }}</p>
          <p><strong>Username:</strong> {{ username }}</p>
          <p><strong>Points:</strong> {{ points }}</p>
      </div>
    </div>

    </div>

    <router-view class = "big-div-container-right" v-show="!isUSerProfile"></router-view>
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
  data() {
    return {
      username: '',
      email: '',
      points: 0,
    };
  },
  created() {
    this.getUserInfo();
  },
  computed:{
    isUSerProfile(){
      return this.$router.currentRoute.value.path === '/UserProfile';
    }
  },
  methods: {
    getUserInfo() {
      const token = localStorage.getItem('token');
      if (token) {
        this.$axios.post(`${this.$api_path}/getUserInfo`, null, { headers: { Authorization: token } })
          .then(response => {
            this.username = response.data.username;
            this.email = response.data.email;
            this.points = response.data.point;
          })
          
          .catch(error => {
            console.error('Error fetching user info:', error);
          });
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.$emit('logoutUser');
      this.$router.push('/registration');
      localStorage.clear();
      setTimeout(() => {
        window.location.reload();
      }, 0); 
    },
  }
};
</script>

<style scoped>
@import '@/style/mobileView.css';
@import '@/style/buttons.css';
.big-information-container{
    text-align: left;
}
.small-cancel-button{
    padding: 1.2vw;
    margin-bottom: 1vw;
    width: 80%;
}

</style>
