<template>
<main class = "checkout-main-container">
    <div class = "checkout-left-container">
        <div class="big-information-container">
            <CheckoutUserDetails/>
        </div>

        <div class="big-information-container">
            <CheckoutBillingAddress/>
        </div>

        <div class = "big-information-container">
            <CheckoutDeliveryAddress/>
        </div>

        <h1>Shopping Bag</h1>
        <div class="big-information-container">
            <div v-show="cart.length>0" v-for="(item, index) in cart" :key="index">
                <div class="checkout-shopping-bag-item-details">
                <RouterLink :to="'/shirts/' + item.productId" class = "shirt-img-router-link">
                    <img :src="item.imageSrc" :alt="item.name" class="checkout-cart-item-img">
                </RouterLink>

                <div class="checkout-shopping-bag-item-info">
                    <div class = "checkout-shopping-bag-item-header">
                    <h5>{{ item.name }}</h5>
                    <img src="@/assets/bin.jpg" alt="Remove" @click="removeFromCart(index)" class="checkout-remove-btn">
                    </div>
                    <div class="checkout-item-details">
                        <p>Size: {{ item.size }}</p>
                        <p>Price (per unit): RM{{ item.price }}</p>
                        <p>Total: RM{{ (item.price * item.count).toFixed(2) }}</p>
                    </div>
                    <select v-model="item.count" @change="updateQuantity(item, index)" class = "checkout-item-quantity-select">
                    <option v-for="quantity in availableQuantities" :key="quantity" :value="quantity">{{ quantity }}</option>
                    </select>
                </div>
                </div>
            </div>
            <h2 v-show="cart.length === 0">Your cart is Empty. Continue Shopping</h2>
        </div>

        <h1>Payment</h1>
        <div class="big-information-container">
            <SecureCheckout :grandTotal="grandTotal" @payment-successful="handlePaymentSuccess" />
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
          <p v-if="grandTotal >= 150 || cart.length === 0">FREE</p>
        </div>
        <div class="breaker"></div> <!-- Add a breaker -->
        <div class="summary-item-container">
          <h2>Grand Total</h2>
          <h2>RM{{ (cart.length === 0 ? 0 : (grandTotal < 150 ? grandTotal + 10 : grandTotal)).toFixed(2) }}</h2>
        </div>
      </div>
    </div>
</main>

</template>

<script>
import { saveCartToLocalStorage } from '@/script/shoppingCart.js'
import { v4 as uuidv4 } from 'uuid';

import CheckoutUserDetails from '@/components/checkoutFlow/checkoutUserDetails.vue';
import CheckoutBillingAddress from '@/components/checkoutFlow/checkoutBillingAddress.vue';
import CheckoutDeliveryAddress from '@/components/checkoutFlow/checkoutDeliveryAddress.vue';
import SecureCheckout from '@/components/checkoutFlow/checkoutSecureCheckout.vue';
export default {
    name: "CheckoutPage",
    components: {
        CheckoutUserDetails,
        CheckoutBillingAddress,
        CheckoutDeliveryAddress,
        SecureCheckout,
    },
    data() {
        return {
            editSection: null,
            cart: [],
            availableQuantities: [1, 2, 3, 4, 5],
            totalItems: 0, 
            deliveryAddress:{},
            billingAddress:{},
            selectedIndex: 0,
            email: '',
            username: '',
    }
    },
    created() {
        this.getUserDetails();
        this.calculateTotalItems(); 
    },
    computed: {
        grandTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.count), 0);
        },
    },
    methods: {
        async handlePaymentSuccess() {
            if ( Object.keys(this.deliveryAddress).length === 0 ||  Object.keys(this.billingAddress).length === 0){
                alert("Please fill up your delivery address or billing address before submitting payment");
                return;
            }
            const orderId = uuidv4();
            const pointsToAdd = Math.floor(this.grandTotal / 10); // Calculate points to add

            const orderData = {
                orderId,
                deliveryAddress: this.deliveryAddress, 
                billingAddress: this.billingAddress,
                paymentAmount: this.grandTotal.toFixed(2),
                createdAt: new Date().toISOString().split('T')[0],
                email: this.email,
                username: this.username,
                cart: this.cart,
                status: "ordered"
            };
            try {
                const token = localStorage.getItem('token');
                if (token) {

                    await this.$axios.post(`${this.$api_path}/createOrder`, orderData, { headers: { Authorization: token } });
                    await this.$axios.post(`${this.$api_path}/addPoints`, { pointsToAdd }, { headers: { Authorization: token } });
                    console.log('Order created successfully:', orderData);
                    this.emptyCartOnServer();
                    this.$router.push({
                        name: 'ConfirmationPage',
                        query: { orderData: JSON.stringify(orderData) }
                    });
                } else {
                    console.error('Token not found in localStorage');
                }
                } catch (error) {
                console.error('Error creating order:', error);
            }
        },
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
        async updateCartOnServer() {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                await this.$axios.post(`${this.$api_path}/updateUserCart`, { cart: this.cart }, { headers: { Authorization: token } });
                } else {
                console.error('Token not found in localStorage');
                }
            } catch (error) {
                console.error('Error updating cart data on the server:', error);
            }
        },
        async getUserDetails() {
            const token = localStorage.getItem('token');
            if (token) {
                try{
                    const userDetails = await this.$axios.post(`${this.$api_path}/getUserInfo`, null, { headers: { Authorization: token } })
                    const deliveryAddressResponse = await this.$axios.post(`${this.$api_path}/getUserAddress`, null, { headers: { Authorization: token } });
                    const billingAddressResponse = await this.$axios.post(`${this.$api_path}/getBillingAddress`, null, { headers: { Authorization: token } });

                    if (userDetails.data || (deliveryAddressResponse)){    
                        if (deliveryAddressResponse.data.selectedAddressIndex === undefined){
                        this.selectedAddressIndex = 0;
                        }else{
                            this.selectedAddressIndex = deliveryAddressResponse.data.selectedAddressIndex;
                        }  
                        this.cart = userDetails.data.cart || [];
                        this.email = userDetails.data.email;
                        this.username = userDetails.data.username;
                        this.deliveryAddress = deliveryAddressResponse.data.address[this.selectedIndex];
                        this.billingAddress = billingAddressResponse.data.billingAddress;
                    }
                }catch(error){
                    console.log('Error fetching user details');
                }
            }
        },
        async emptyCartOnServer() {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                await this.$axios.post(`${this.$api_path}/updateUserCart`, { cart: []}, { headers: { Authorization: token } });
                localStorage.removeItem('shoppingCart');
                setTimeout(() => {
                    window.location.reload();
                }, 0);
                } else {
                console.error('Token not found in localStorage');
                }
            } catch (error) {
                console.log('Error updating cart data on the server');
            }
        },
    },
}
</script>

<style>
@import '@/style/containers.css';
@import '@/style/mobileView.css';

.big-information-container{
    overflow-y: auto;
    max-height: 600px;
}
.checkout-main-container{
    display: flex; flex-direction: row; justify-content: space-between;
}
.checkout-left-container{
    margin-left: 5%;
}


/* Shopping Bag */

.checkout-shopping-bag-container{
    background-color: #FAF9F6;
    margin-top: 0px; margin-right: 10%; 
    min-width: 600px; max-width: 600px; max-height: 1000px;
    text-align: center;
}
.checkout-shopping-bag-item-details{
    display: flex; flex-direction: row; 
}
.checkout-shopping-bag-item-header{
    display: flex; flex-direction: row; justify-content: space-between;
}
.checkout-shopping-bag-item-info{
    width: 100%; background-color: #FAF9F6;
    text-align: left;
}
.checkout-item-details{
    display: flex; flex-direction: row; justify-content: space-between;
    width: 80%;
}
.checkout-item-quantity-select{
    width: 25%;
    padding: 1vh 1vw 2vh 1vw;
    border: 1px solid black; 
    align-items: right;
    font-size: 1.5rem;
}
.checkout-cart-item-img{
    width: 70%;
    background-color: #FAF9F6;
}
.checkout-remove-btn{
    width: 10%; cursor: pointer;
}
.checkout-remove-btn:hover{
    transform: scale(1.2);
}

</style>
