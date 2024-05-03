<template>
  <div id="app">

    <div class="mobile-top-nav-container">
      <router-link to="/" class="logo"><img src="@/assets/logo.png"></router-link>
      <div class="mobile-user-links">
        <router-link to="/shoppingBag" class="cart-icon"><i class="fa-solid fa-cart-shopping"></i></router-link>
        <div class="hamburger-menu" @click="toggleMobileMenu">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

    </div>


    <!-- Navigation bar -->
    <nav class="top-bar" :class="{ 'collapsed': mobileMenuCollapsed }">
      <div class="main-links" v-if="!mobileMenuCollapsed">
        <router-link to="/">Home</router-link>
      </div>
      <div class="user-links" v-if="!mobileMenuCollapsed">
        <router-link :to="userProfileLink">{{ signedIn ? username : 'Sign in' }}</router-link>
        
        <router-link v-if="!isMobile" @mouseenter="openModal" @mouseleave="closeModal" to="/shoppingBag">Shopping Bag ({{ totalItems }})</router-link>
        <router-link v-if="isMobile" to="/shoppingBag">Shopping Bag ({{ totalItems }})</router-link>

        <a @click="logout" v-show="signedIn && !mobileMenuCollapsed">Log Out</a>
      </div>
    </nav>
    <!-- Router view -->
    <router-view 
    @quantityUpdated="handleQuantityUpdate" 
    @authenticationCheck="checkAuthentication" 
    @userLoggedIn="updateUser" 
    @logoutUser="logout"  
    >
    </router-view>
    <CartModal :cart="cart" ref="cartModal"></CartModal>
    <Mantap7Footer></Mantap7Footer>

  </div>
</template>
<script>
import { retrieveCartFromLocalStorage, saveCartToLocalStorage } from '@/script/shoppingCart.js'
import CartModal from '@/components/shoppingBagMiniView.vue'
import Mantap7Footer from '@/components/Mantap7Footer.vue'


export default {
  name: 'App',
  data() {
    return {
      cart: [],
      totalItems: 0,
      signedIn: false,
      username: '',
      mobileMenuCollapsed: false, 
    };
  },
  components: {
    CartModal,
    Mantap7Footer
  },
  created() {
    this.checkAuthentication();
  },
  mounted() {
    this.detectMobile();
    window.addEventListener('resize', this.detectMobile);
  },
  unmounted() {
    window.removeEventListener('resize', this.detectMobile);
  },
  computed: {
    userProfileLink() {
      return this.signedIn ? '/UserProfile' : '/registration'; 
    },
    isMobile() {
      return window.innerWidth <= 600; 
    }
  },
  methods: {
    loadCartFromServer() {
      const token = localStorage.getItem('token');
      if (token) {
        this.$axios.post(`${this.$api_path}/getUserInfo`, null, { headers: { Authorization: token } })
          .then(response => {
            this.cart = response.data.cart || [];
            this.calculateTotalItems();
          })
          .catch(error => {
            console.error('Error fetching user cart:', error);
          });
      }else{
        this.loadCartFromLocalStorage();
      }
    },
    loadCartFromLocalStorage() {
      this.cart = retrieveCartFromLocalStorage();
      this.calculateTotalItems();
    },
    calculateTotalItems() {
      this.totalItems = this.cart.reduce((total, item) => total + item.count, 0);

    },
    handleQuantityUpdate(updatedTotalItems) {
      this.totalItems = updatedTotalItems;
    },
    checkAuthentication() {
      const token = localStorage.getItem('token');
      if (token) {
        this.$axios.post(`${this.$api_path}/verifyToken`, null, { headers: { Authorization: token } })
          .then(response => {
            this.signedIn = true;
            this.username = 'My Account';
            this.loadCartFromServer();
          })
          .catch(error => {
            window.location.reload();
            console.error('Token verification failed:', error);
            localStorage.removeItem('token');
            alert("Your session has expired, please log in again");
            this.logout();
          });
      }else{
        this.loadCartFromLocalStorage();
      }
    },
    updateUser(username) {
      this.signedIn = !!username; 
      this.username = 'username' || '';
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
    openModal() {
      this.$refs.cartModal.openModal();
    },
    closeModal() {
      this.$refs.cartModal.closeModal();
    },
    toggleMobileMenu() {
      this.mobileMenuCollapsed = !this.mobileMenuCollapsed;
    },
    detectMobile() {
      this.mobileMenuCollapsed = window.innerWidth <= 600; 
    }
  },

};
</script>


<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px; 
}
.mobile-top-nav-container{
  display: flex; flex-direction: row; justify-content: space-between;
  align-items: center;
  background-color: #cccccc; 
  margin-top: -20px;
}
.top-bar {
  background-color: #cccccc; 
  padding: 30px; 
  margin-bottom: 20px; margin-top: -20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.main-links, .user-links{
  display: flex; 
}

.top-bar a, .mobile-top-nav-container a{
  text-decoration: none;
  color: black; 
  margin: 20px; 
  font-size: 1.5rem;
}

.top-bar a:hover {
  color: #000; 
  font-weight: bold;
  text-decoration: underline;
}

.mobile-user-links{
  display: flex; flex-direction: row; justify-content: space-between;
}
.logo, .cart-icon, .hamburger-menu{
  margin: 0;
  display: none; 
  cursor: pointer;
}

.hamburger-menu {
  align-self: center;
}
.logo img {
  max-width: 10vw; 
}
.hamburger-menu div {
  width: 25px;
  height: 3px;
  background-color: black;
  margin: 5px;
}

@media (max-width: 600px) {
  .top-bar{
    background-color: #cccccc; 
    padding: 0px; 
    margin-top: 0px;
  }
  .top-bar.collapsed .main-links,
  .top-bar.collapsed .user-links {
    display: none;
  }

  .hamburger-menu, .cart-icon, .logo{
    display: block;
  }

  .top-bar, .user-links {
    flex-direction: column;
    align-items: flex-start;
  }

}
</style>