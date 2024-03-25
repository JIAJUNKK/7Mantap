<template>
  <div class="cart-modal" v-if="isModalOpen" @mouseleave="handleMouseLeave">
    <h2>Shopping Bag</h2>
    <div class="cart-content" @mouseenter="handleMouseEnter">
        <!-- Buttons -->
        <div class="buttons">
          <router-link to="/checkout" v-show="isUserSignedIn">
            <button class="checkout-button" :disabled="isCheckoutDisabled">Checkout</button>
          </router-link>

          <router-link to="/registration" v-show="!isUserSignedIn">
            <button class="checkout-button">Sign in</button>
          </router-link>

          <router-link to="/shoppingBag" v-show="isUserSignedIn">
            <button class="shopping-bag-button">Shopping Bag</button>
          </router-link>
        </div>

        <div class="order-summary">
          <div class="summary-item">
            <p>Total</p>
            <p>RM{{ calculateTotalOrderValue() }}</p>
          </div>
          <div class="summary-item">
            <p>Delivery Fee</p>
            <p v-if="calculateTotalOrderValue() > 0 && calculateTotalOrderValue() < 150">RM10.00</p>
            <p v-else>FREE</p>
          </div>
          <div class="breaker"></div> <!-- Add a breaker -->
          <div class="summary-item">
            <h2>Grand Total</h2>
            <h2>RM{{ calculateGrandTotal() }}</h2>
          </div>
        </div>

        <!-- List of Items -->
        <ul>
          <li v-for="(item, index) in cart" :key="index">
            <div class="item-details">
              <img :src="item.imageSrc" :alt="item.name" class="item-image">
              <div class="item-info">
                <p>{{ item.name }}</p>
                <h6>Size: {{ item.size }}</h6>
                <h6>Price: RM{{ item.price }}</h6>
                <h6>Quantity: {{ item.count }}</h6>
              </div>
            </div>
          </li>
        </ul>
    </div>
  </div>
</template>

<script>
import { retrieveCartFromLocalStorage } from '@/script/shoppingCart.js'
export default {
  data() {
    return {
      isModalOpen: false,
      cart: [], 
      isUserSignedIn: false,
    };
  },
  computed: {
    isCheckoutDisabled() {
      return this.cart.length === 0;
    }
  },
  methods: {
    openModal() {
      const token = localStorage.getItem('token');
      if (token) {
        this.$axios.post(`${this.$api_path}/getUserInfo`, null, { headers: { Authorization: token } })
          .then(response => {
            this.isUserSignedIn = true;
            this.cart = response.data.cart || [];
          })
          .catch(error => {
            console.error('Error fetching user cart:', error);
          })
          .finally(() => {
            this.isModalOpen = true;
          });
      } else {
        this.cart = retrieveCartFromLocalStorage();
        this.isModalOpen = true;
      }
    },
    closeModal() {
      this.isModalOpen = false;
    },
    handleMouseEnter() {
      this.isModalOpen = true;
    },
    handleMouseLeave(event) {
      if (!this.$el.contains(event.relatedTarget)) {
        this.isModalOpen = false;
      }
    },
    calculateTotalOrderValue() {
      if (this.cart && this.cart.length > 0) {
        const total = this.cart.reduce((total, item) => total + (item.price * item.count), 0);
        return total.toFixed(2);
      }
      return 0; 
    },
    calculateGrandTotal() {
      const totalOrderValue = parseFloat(this.calculateTotalOrderValue());
      if (totalOrderValue > 0 && totalOrderValue < 150) {
        return (totalOrderValue + 10.00).toFixed(2);
      }
      return totalOrderValue.toFixed(2);
    },
  }
};
</script>

<style scoped>
@import '@/style/shoppingBagMiniView.css';
@import '@/style/containers.css';
@import '@/style/textStyle.css';
@import '@/style/buttons.css';

.cart-modal .buttons button[disabled] {
  cursor: not-allowed; 
  opacity: 0.3;
}
</style>
