<template>
    <div class="card-element-container">
      <div>
        <label for="firstName">First Name<span class="required">*</span></label><br>
        <input class = "big-input-field" type="text" id="firstName" v-model="firstName" required>
      </div>

      <div>
        <label for="lastName">Last Name<span class="required">*</span></label><br>
        <input class = "big-input-field" type="text" id="lastName" v-model="lastName" required>
      </div>

      
      <div class="form-group">
        <label for="cardNumber">Card Number<span class="required">*</span></label>
        <div id="cardNumber" ref="cardNumber"></div>
      </div>

      <div class="date-cvv-container">
          <div class = "date-container">
            <label for="expiryDate">Expiry Date<span class="required">*</span></label>
            <div id="expiryDate" ref="expiryDate"></div>
          </div>

          <div class = "cvv-container">
            <label for="cvv">CVV<span class="required">*</span></label>
            <div id="cvv" ref="cvv"></div>
          </div>
      </div>

      <button 
        class="big-submit-button" 
        @click="submitPayment" 
        :disabled="isSubmitDisabled"
        :class="{ 'disabled': isSubmitDisabled }"
      >
        {{ processing ? 'Processing...' : 'Submit Payment' }}
      </button>
    </div>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js';

export default {
  name: "SecureCheckout",
  data() {
    return {
      stripe: null,
      card: null,
      processing: false,
      errorMessage: null,
      firstName: '',
      lastName: '',
    };
  },
  props: {
    grandTotal: {
      type: Number,
      required: true,
    },
  },
  computed: {
    // Compute the disabled state of the submit payment button
    isSubmitDisabled() {
      return this.processing || this.grandTotal === 0;
    },
  },
  mounted() {
    this.loadStripe();
  },
  methods: {
    // Method to load Stripe elements
    async loadStripe() {
      const stripe = await loadStripe(process.env.MY_STRIPE_KEY);
      this.stripe = stripe;
      const elements = stripe.elements();

      const style = {
        base: {
          fontSize: '16px',
          color: '#32325d',
          fontFamily: '"Avenir", Helvetica, Arial, sans-serif',
          '::placeholder': {
            color: '#aab7c4',
          },
          
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a',
        },
      };

      this.cardNumber = elements.create('cardNumber', { style: style });
      this.cardNumber.mount(this.$refs.cardNumber);

      this.expiryDate = elements.create('cardExpiry', { style: style });
      this.expiryDate.mount(this.$refs.expiryDate);

      this.cvv = elements.create('cardCvc', { style: style });
      this.cvv.mount(this.$refs.cvv);
    },

    // Method to submit payment
    async submitPayment() {
      this.processing = true;
      this.errorMessage = null;

      try {
        const { paymentMethod, error } = await this.stripe.createPaymentMethod({
          type: 'card',
          card: this.cardNumber,
        });

        if (error) {
          throw new Error(error.message);
        }
        const response = await this.processPayment(paymentMethod.id);
        console.log(response);
        this.$emit('payment-successful', response);
      } catch (error) {
        console.error('Error processing payment:', error.message);
        this.errorMessage = 'An error occurred while processing payment. Please try again later.';
      } finally {
        this.processing = false;
      }
    },

    // Method to process payment on the server
    async processPayment(paymentMethodId) {
      try {
        const response = await fetch(`${this.$api_path}/charge`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentMethodId: paymentMethodId,
            amount: this.grandTotal.toFixed(2),
            firstName: this.firstName,
            lastName: this.lastName,
          }),
        });
        return await response.json();
      } catch (error) {
        console.error('Error processing payment:', error);
        throw new Error('An error occurred while processing payment.');
      }
    },
  },
};
</script>

<style scoped>
@import '@/style/containers.css';
@import '@/style/textStyle.css';
@import '@/style/buttons.css';
@import '@/style/inputField.css';
.date-cvv-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
#error-message {
  color: red;
  margin-top: 10px;
}
#cardNumber, #expiryDate, #cvv {
  background-color: white;
  color: black;
  font-weight: bold;
  font-size: 0.9rem;
  padding: 1vw;
  width: 100%;
  margin-bottom: 5%;
  cursor: pointer;
  border: 2px solid black;
  text-align: left;
}

.card-element-container input {
  width: 100%;
  margin-left: 0;
}
.date-container,
.cvv-container {
  min-width: 40%;
  max-width: 40%;
}
.checkout-secure-checkout-button.disabled {
  cursor: not-allowed;
  opacity: 0.3;
}
.card-element-container{
    font-weight: bold; 
    padding: 6%;
    align-items: center;
}
</style>
