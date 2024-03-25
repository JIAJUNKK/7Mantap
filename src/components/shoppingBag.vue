<template>
  <div class="shopping-bag-container">

    <div class="shopping-bag-items-container">

    <div v-if="!isUserSignedIn && cart.length === 0" class="shopping-bag-empty-container">
      <h2>Your shopping bag is empty.</h2>
      <h4>Sign in to see or access saved items in your shopping bag</h4>
      <router-link to="/registration" class="edit-text-toggle">Sign in</router-link>
    </div>

    <div v-else-if="isUserSignedIn && cart.length === 0" class="shopping-bag-empty-container">
      <h2>Your shopping bag is empty.</h2>
    </div>

      <div v-else>
        <div v-for="(item, index) in cart" :key="index">
          <div class="shopping-bag-item-details">
            <RouterLink :to="'/shirts/' + item.productId" class = "shirt-img-router-link">
              <img :src="item.imageSrc" :alt="item.name" class="cart-item-img">
            </RouterLink>
            <div class="shopping-bag-item-info">
              <div class = "shopping-bag-item-header">
                <h2>{{ item.name }}</h2>
                <img src="@/assets/bin.jpg" alt="Remove" @click="removeFromCart(index)" class="remove-btn">
              </div>
              <div class="item-details">
                <p>Size: {{ item.size }}</p>
                <p>Price (per unit): RM{{ item.price }}</p>
                <p>Total: RM{{ (item.price * item.count).toFixed(2) }}</p>
              </div>
              <select v-model="item.count" @change="updateQuantity(item, index)" class = "item-quantity-select">
                <option v-for="quantity in availableQuantities" :key="quantity" :value="quantity">{{ quantity }}</option>
              </select>
            </div>

          </div>
        </div>
      </div>

    </div>

    <div class="order-summary-container">
      <div class="summary-details-container">
        <div class="summary-item-container">
          <p>Total</p>
          <p>RM{{ grandTotal.toFixed(2) }}</p>
        </div>
        <div class="summary-item-container">
          <p v-if="grandTotal < 150 && cart.length != 0">Delivery Fee</p>
          <p v-if="grandTotal < 150 && cart.length != 0">RM10.00</p>
          <p v-if="grandTotal >= 150 || cart.length === 0">Delivery Fee</p>
          <p v-if="grandTotal >= 150 || cart.length === 0">RM0.00</p>
        </div>
        <div class="breaker"></div> <!-- Add a breaker -->
        <div class="summary-item-container">
          <h2>Grand Total</h2>
          <h2>RM{{ (cart.length === 0 ? 0 : (grandTotal < 150 ? grandTotal + 10 : grandTotal)).toFixed(2) }}</h2>
        </div>
      </div>
      <router-link to="/checkout" v-show="isUserSignedIn">
        <button class="big-submit-button" :disabled="isCheckoutDisabled">Checkout</button>
      </router-link>
      <router-link to="/registration" v-show="!isUserSignedIn">
        <button class="big-submit-button">Sign in</button>
      </router-link>
    </div>

  </div>
</template>

<script>
import { retrieveCartFromLocalStorage, saveCartToLocalStorage } from '@/script/shoppingCart.js'
export default {
  name: 'ShoppingBag',
  data() {
    return {
      cart: [],
      availableQuantities: [1, 2, 3, 4, 5],
      totalItems: 0, 
      isUserSignedIn: false,
    };
  },
  created() {
    this.getCart();
    this.calculateTotalItems(); 
  },
  computed: {
    grandTotal() {
      return this.cart.reduce((total, item) => total + (item.price * item.count), 0);
    },
    isCheckoutDisabled() {
      return this.cart.length === 0;
    }
  },
  methods: {
    removeFromCart(index) {
      this.cart.splice(index, 1);
      this.updateCartOnServer();
      saveCartToLocalStorage(this.cart);
    },
    updateQuantity() {
      this.calculateTotalItems();
      this.updateCartOnServer();
      saveCartToLocalStorage(this.cart);
    },
    calculateTotalItems() {
      this.totalItems = this.cart.reduce((total, item) => total + item.count, 0);
      this.$emit('quantityUpdated', this.totalItems);
    },
    getCart() {
      const token = localStorage.getItem('token');
      if (token) {
        this.$axios.post(`${this.$api_path}/getUserInfo`, null, { headers: { Authorization: token } })
          .then(response => {
            console.log('User cart response:', response);
            this.cart = response.data.cart || [];
          })
          .catch(error => {
            console.error('Error fetching user cart:', error);
          });
        this.isUserSignedIn = true;
      }else{
        this.cart = retrieveCartFromLocalStorage();
      }
    },
    async updateCartOnServer() {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await this.$axios.post(`${this.$api_path}/updateUserCart`, { cart: this.cart }, { headers: { Authorization: token } });
          console.log('Cart data updated successfully on the server');
        } else {
          console.error('Token not found in localStorage');
        }
      } catch (error) {
        console.error('Error updating cart data on the server:', error);
      }
    },
  },
  watch: {
    cart: {
      handler() {
        this.calculateTotalItems(); 
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
@import '@/style/shoppingBag.css';
@import '@/style/containers.css';
@import '@/style/mobileView.css';

.shopping-bag-container {
    display: flex; flex-direction: row;
    align-items: flex-start;
    margin-left: 5vw;
    margin-top: 10vh; margin-right: 5vw;
}

.big-submit-button[disabled] {
  cursor: not-allowed;
  opacity: 0.3;
}


</style>
