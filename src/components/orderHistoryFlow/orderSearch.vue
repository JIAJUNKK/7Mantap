<template>
    <h1>Search Order History</h1>
    <div class="input-field-with-text-container">
      <input class="big-input-field" type="text" v-model="searchQuery" placeholder="Enter Order ID">
      <span v-show="!showSearchButton" class="inline-text" @click="searchOrder">SEARCH</span>
      <button v-show="showSearchButton" class="big-submit-button" @click="searchOrder"> SEARCH</button>
    </div>

    <!-- Display search results -->
    <div v-if="searchResults && searchResults.orders && searchResults.orders.length > 0">
      <h2 class="big-title">Search Results</h2>
      <div v-for="order in searchResults.orders" :key="order.orderId" class="order-items-container">

        <h2>Order ID - <span class = "order-id">{{ order.orderId }}</span></h2>

        <div class="order-details-container">
          <div class="order-details-left">
            <h4>Delivery Address</h4>
            <div class = "detail">
              <p class="detail-content">{{ order.deliveryAddress.firstName + " " + order.deliveryAddress.lastName}}</p>
              <p class="detail-content">{{ order.deliveryAddress.addressLine1 }}</p>
              <p class="detail-content">{{ order.deliveryAddress.addressLine2 }}</p>
              <p class="detail-content">{{ order.deliveryAddress.postcode }}</p>
              <p class="detail-content">{{ order.deliveryAddress.city }}, {{ order.deliveryAddress.state }}</p>
            </div>
          </div>

          <div class="order-details-right">
            <h4>Payment amount</h4>
            <p class="order-detail">RM{{ order.paymentAmount }}</p>
            <h4>Order Date</h4>
            <p class="order-detail">{{ order.createdAt }}</p>
            <h4>Status</h4>
            <p class="order-detail">{{ order.status }}</p>
          </div>   

        </div>

        <h2 class="big-title">Ordered Items</h2>
        <div class="ordered-items-container"> 
            <div v-for="(item, index) in order.cart" :key="index" class="ordered-item">
                <img :src="item.imageSrc" :alt="item.name" class="item-image">
                <div class="ordered-item-details">
                      <p class="item-name">{{ item.name }}</p>
                      <p>Price - RM<span class="item-name">{{ item.price }}</span></p>
                      <p>Quantity - <span class="item-name">{{ item.count }}</span></p>
                      <p>Size - <span class="item-name">{{ item.size }}</span></p>
                </div>
            </div>
        </div>


      </div>
    </div>


    <div v-else>
      <p>No orders found.</p>
    </div>


</template>



<script>
export default {
  name: 'SearchOrderHistory',
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      email: '',
      showSearchButton: false,
    };
  },
  mounted() {
    this.detectMobile();
    window.addEventListener('resize', this.detectMobile);
  },
  unmounted() {
    window.removeEventListener('resize', this.detectMobile);
  },
  
  async created() {
    await this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await this.$axios.post(`${this.$api_path}/getUserInfo`, null, { headers: { Authorization: token } });
          this.email = response.data.email;
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
    },
    async searchOrder() {
      try {
        const token = localStorage.getItem('token');
        const response = await this.$axios.post(`${this.$api_path}/searchOrder`, { orderId: this.searchQuery, email: this.email }, { headers: { Authorization: token } });
        this.searchResults = response.data.orderHistory;
        console.log(this.searchResults)
      } catch (error) {
        console.error('Error searching order:', error);
      }
    },
    detectMobile() {
      this.showSearchButton = window.innerWidth <= 600; 
    }
  }
};
</script>

<style scoped>
@import '@/style/containers.css';
@import '@/style/buttons.css';
@import '@/style/inputField.css';
.order-items-container{
  border: 2px solid black;
  border-radius: 5px;
  padding: 20px;
  margin: 20px;
  background-color: #f9f9f9;
  text-align: left;
}
.order-details-container{
  display: flex; flex-direction: row; justify-content: space-between;
}

.ordered-items-container {
  overflow-y: auto;
  background-color: white;
  max-height: 300px;
  flex-direction: column;
}
.order-items {
  margin-top: 20px;
  overflow-y: auto;
  background-color: white;
}
/* Add your scoped styles here */
</style>
