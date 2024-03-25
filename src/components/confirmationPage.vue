<template>
  <div class="confirmation-page">
    <h1 class="confirmation-title">THANK YOU FOR SHOPPING AT 7MANTAP!</h1>
    <p class="success-message">Your order has been successfully placed!</p>
    
    <!-- Display order details -->
    <div class="order-details-container">
        <h1>Order Details <span v-show="!showMobileOrderID" class = "order-id">{{ orderID }}</span></h1>
        <h4 v-show="showMobileOrderID">Order ID</h4>        
        <span v-show="showMobileOrderID" class = "order-id">{{ orderID }}</span>
        <h5><router-link to="/UserProfile/Order-History/order-history-view">View Order</router-link></h5>
        <h4>Ordered on - {{orderDate}}</h4>
        <h4>Order Value - RM{{totalAmount}}</h4>
        <div class="order-inner-details">
            <div class="order-details-left">
                <div class="order-details-left-inner-container">
                    <h2 class="big-title">Delivery Address</h2>
                    <p class="detail-content">{{ deliveryAddress.addressLine1 }}</p>
                    <p class="detail-content">{{ deliveryAddress.addressLine2 }}</p>
                    <p class="detail-content">{{ deliveryAddress.postcode }}</p>
                    <p class="detail-content">{{ deliveryAddress.city }}, {{ deliveryAddress.state }}</p>
                </div>

                <div class="order-details-left-inner-container">
                    <h2 class="big-title">Email</h2>
                    <p class="detail-content">{{ email }}</p>
                </div>

                <div class="order-details-left-inner-container">
                    <h2 class="big-title">Status</h2>
                    <p class="detail-content">{{ orderStatus }}</p>
                </div>
            </div>

            <div class="order-details-right">
                <h2 class="big-title">Ordered Items</h2>
                <div v-for="(item, index) in cart" :key="index" class="ordered-items-container">
                <img :src="item.imageSrc" :alt="item.name" class="ordered-item-image">
                <div class="ordered-item-details">
                    <p class="item-name">{{ item.name }}</p>
                    <p>Quantity - <span class="item-name">{{ item.count }}</span></p>
                    <p>Size - <span class="item-name">{{ item.size }}</span></p>
                </div>
                </div>
            </div>
        </div>

    </div>

  </div>
</template>

<script>
export default {
  name: 'ConfirmationPage',
  props: {
    orderData: {
      type: Object,
      required: true
    }
  },
  created() {
    this.setDetails();
  },
  data() {
    return {
      cart: [],
      deliveryAddress: {},
      email: '',
      orderID: '',
      totalAmount: 0,
      orderDate: '',
      orderStatus: '',
      showMobileOrderID: false, 
    }
  },
  mounted() {
    this.detectMobile();
    window.addEventListener('resize', this.detectMobile);
  },
  unmounted() {
    window.removeEventListener('resize', this.detectMobile);
  },
  methods: {
    setDetails() {
      const receivedOrderData = JSON.parse(this.orderData);
      this.cart = receivedOrderData.cart || [];
      this.deliveryAddress = receivedOrderData.deliveryAddress || {};
      this.email = receivedOrderData.email || '';
      this.orderID = receivedOrderData.orderId || '';
      this.totalAmount = receivedOrderData.paymentAmount || 0;
      this.orderDate = receivedOrderData.createdAt ? new Date(receivedOrderData.createdAt).toLocaleDateString() : '';
      this.orderStatus = receivedOrderData.status;
    },
    detectMobile() {
      this.showMobileOrderID = window.innerWidth <= 600; 
    }
  }
}
</script>

<style scoped>
@import '@/style/containers.css';
@import '@/style/textStyle.css';
@import '@/style/mobileView.css';

.order-details-right{
    overflow-y: auto;
    background-color: white;
    max-height: 300px;
}
.confirmation-page {
    background-color: #FAF9F6;
    text-align: left;
    max-width: 70%;
    margin: 0 auto;
    padding: 1% 5% 5% 5%;
    border-radius: 10px;
    margin-bottom: 10%;
}
.confirmation-title {
    font-size: 2.5rem;
    text-align: center;
}
.big-title{
  margin-bottom: 0;
}
</style>
