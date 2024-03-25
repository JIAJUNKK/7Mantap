<template>
    <div class="shirt-detail-container">
        <div class="shirt-detail-image-container">
            <img :src="shirt.image" :alt="shirt.name" class="shirt-detail-img"/>
            <img v-show="!showDetailsBottom" src = "@/assets/shirts/backofshirt.png" class = "shirt-detail-img"/>
        </div>

        <div class="shirt-detail-description">
            <h2>{{ shirt.name }}</h2>
            <p>Price: RM{{ shirt.price }}</p>
            <div class="size-options">
                <div v-for="size in sizes" :key="size" class="size-option" @click="selectSize(size)" :class="{ selected: selectedSize === size }" :data-size="size">{{ size }}</div>
                <button class="big-submit-button" :disabled="!selectedSize" @click="addToCart">Add to Cart</button>
            </div>
        </div>
    </div>

    <div v-show="showDetailsBottom" class = "mobile-shirt-detail-container">
      <br><br>
      <h1>Shirt Details</h1>
      <img src = "@/assets/shirts/backofshirt.png" class = "shirt-detail-img"/>
    </div>
</template>

<script>
import { shirtsData } from '@/script/homePage';
import { addToCart } from '@/script/shoppingCart';

export default {
  computed: {
    shirt() {
      const productId = this.$route.params.productId;
      return shirtsData.find(shirt => shirt.productId === productId);
    },
    sizes() {
      return ['S', 'M', 'L', 'XL'];
    }
  },
  data() {
    return {
      selectedSize: null,
      showDetailsBottom: false, 
    };
  },
  mounted() {
    this.detectMobile();
    window.addEventListener('resize', this.detectMobile);
  },
  unmounted() {
    window.removeEventListener('resize', this.detectMobile);
  },
  methods: {
    selectSize(size) {
      this.selectedSize = size;
    },
    addToCart() {
      if (!this.selectedSize) {
        alert('Please select a size before adding to cart.');
        return;
      }
      const { name, price, image, productId} = this.shirt;
      // Call the addToCart function directly
      addToCart(this.$axios, this.$api_path, name, price, image, this.selectedSize, productId);
      alert('Item added to cart!');
    },
    detectMobile() {
      this.showDetailsBottom = window.innerWidth <= 600; 
    }
  },
};
</script>
<style scoped>
@import '@/style/shirtDetails.css';
@import '@/style/buttons.css';
@import '@/style/containers.css';
@import '@fortawesome/fontawesome-free/css/all.css';
@import '@/style/mobileView.css';

.big-submit-button{
    display: flex;
    justify-content: center; 
    font-weight: bold; 
    padding: 10%;
    cursor: pointer;
}
.big-submit-button[disabled]{
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
