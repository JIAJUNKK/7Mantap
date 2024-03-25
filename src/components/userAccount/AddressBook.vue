<template>
  <div class="big-information-container">
      <div class="inner-information-container">
        <BillingAddressBook/>
      </div>

      <div class="inner-information-container">
        <DeliveryAddressBook/>
      </div>

      <div>
        <AddDeliveryAddressBook/>
        <button @click="goBack" class="big-cancel-button">Back</button><br>
      </div>
  </div>
</template>

<script>
import BillingAddressBook from '@/components/addressBook/billingAddress.vue';
import DeliveryAddressBook from '@/components/addressBook/deliveryAddress.vue';
import AddDeliveryAddressBook from '@/components/addressBook/addDeliveryAddress.vue';

export default {
  name: 'AddressBook',
  components:{
    BillingAddressBook,
    DeliveryAddressBook,
    AddDeliveryAddressBook,
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$emit('logoutUser');
      this.$router.push('/registration');
      localStorage.clear();
      setTimeout(() => {
        window.location.reload();
      }, 0);
    },
    goBack(){
      this.$emit('editingFinished'); // Emit event to notify the parent component
    }
  }
};
</script>

<style scoped>
@import '@/style/containers.css';
@import '@/style/buttons.css';

</style>
