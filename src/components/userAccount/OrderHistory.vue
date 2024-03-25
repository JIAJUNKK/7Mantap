<template>
  <div class="big-information-container">
    <div class="order-history-router-link-container">
        <router-link
            to="/UserProfile/Order-History/order-history-view"
            class="order-link"
            active-class="active-link"
        >
        View Order History
        </router-link>
        <router-link
            to="/UserProfile/Order-History/order-history-search"
            class="order-link"
            active-class="active-link"
        >
        Search Order History
        </router-link>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'OrderHistory',
};
</script>

<style scoped>
@import '@/style/containers.css';
@import '@/style/buttons.css';
.big-information-container{
    margin-right: 10%; 
    text-align: center;
}

.order-history-router-link-container{
    display: flex; flex-direction: row; justify-content: space-evenly;
    margin: 5% 0 10% 0;
}

.order-link {
  text-decoration: none;
  color: #333;
  padding: 10px;
  margin: 0 10px 0 0 ;
  border: 2px solid black;
  border-radius: 5px;
}

.order-link:hover {
  background-color: #f0f0f0;
}

.active-link {
  background-color: black;
  color: #fff;
}

.active-link:hover {
  background-color: #333;
}
</style>
