<template>
    <h1>Order History</h1>
    <div v-if="isLoading" class="loading-message">Loading Your Order History...</div>
    <div v-else>
      <h2>Your orders over the past 6 months</h2>

      <div v-for="order in orderHistory" :key="order._id" class="order-items-container">
        <div class="order-id-container">
          <h2>Order ID - <span class="order-id">{{ order.orders.orderId }}</span></h2>
          <img v-show="copiedOrderId === order.orders.orderId" src="@/assets/checkMark.png" alt="Copied" class="copy-button">
          <img v-show="copiedOrderId === null" src="@/assets/copy.png" alt="Copy" @click="copyOrderId(order.orders.orderId)" class="copy-button">
        </div>

        <div class="order-details-container">
          <div class="order-details-left">
            <h4>Delivery Address</h4>
            <div class = "order-details-left-inner-container">
              <p class="detail-content">{{ order.orders.deliveryAddress.firstName + " " + order.orders.deliveryAddress.lastName}}</p>
              <p class="detail-content">{{ order.orders.deliveryAddress.addressLine1 }}</p>
              <p class="detail-content">{{ order.orders.deliveryAddress.addressLine2 }}</p>
              <p class="detail-content">{{ order.orders.deliveryAddress.postcode }}</p>
              <p class="detail-content">{{ order.orders.deliveryAddress.city }}, {{ order.orders.deliveryAddress.state }}</p>
            </div>
          </div>

          <div class="order-details-right">
            <div class ="order-details-left-inner-container">
              <h4>Payment amount</h4>
              <p class="order-detail">RM{{ order.orders.paymentAmount }}</p>
              <h4>Order Date</h4>
              <p class="order-detail">{{ order.orders.createdAt }}</p>
              <h4>Status</h4>
              <p class="order-detail">{{ order.orders.status }}</p>
            </div>
          </div>    
        </div>

        <h2 class="big-title">Ordered Items</h2>
        <div class="ordered-items-container"> 
            <div v-for="(item, index) in order.orders.cart" :key="index" class="ordered-item">
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

</template>

<script>
export default {
  name: 'ViewOrderHistory',
  data() {
    return {
      orderHistory: [],
      isLoading: false, 
      email: '',
      copiedOrderId: null, 
    };
  },
  async created() {
    await this.getUserInfo();
    this.fetchOrderHistory();
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

    async fetchOrderHistory() {
      try {
        const token = localStorage.getItem('token');
        this.isLoading = true;
        const response = await this.$axios.post(`${this.$api_path}/orderHistory`, { email: this.email }, { headers: { Authorization: token } });
        this.orderHistory = response.data.orderHistory;
      } catch (error) {
        console.error('Error fetching order history:', error);
      } finally {
        this.isLoading = false;
      }
    },
    copyOrderId(orderId) {
        navigator.clipboard.writeText(orderId)
          .then(() => {
            // Set the copied order ID and remove it after 3 seconds
            this.copiedOrderId = orderId;
            setTimeout(() => {
              this.copiedOrderId = null;
            }, 1000);
          })
          .catch((error) => {
            console.error('Error copying order ID:', error);
          });
      },
  }
};
</script>

<style scoped>
@import '@/style/containers.css';
@import '@/style/textStyle.css';

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
.ordered-item{
  display: flex; flex-direction: row; 
}
.copy-button{
  width: 3%; margin-left: 1%; cursor: pointer;
}
.order-id{
  border: 1px solid black; padding: 1px;
  border-radius: 5px;

}


</style>