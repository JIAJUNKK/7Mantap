<template>
  <div>
    <div class="shirts-container">

      <br>
      <div class="filterContainer">
        <label>View As</label>
        <select class="filter" id="sortSelect" @change="handleSortChange">
          <option value="default">Default</option>
          <option value="l2h">Price from Low to High</option>
          <option value="h2l">Price from High to Low</option>
        </select>
      </div>
      <br><br>
      <section class="shirts-grid" id="shirtsGrid">
      </section>
    </div>

    <div id="shirtModal" class="modal">
        <div class="modal-content">
        </div>
    </div>
    
  </div>
</template>

<script>
import { renderShirts } from '@/script/homePage';

export default {
  name: 'HomePage',  

  mounted() {
    renderShirts();
  },

  methods: {
    handleSortChange(event) {
      const sortDirection = event.target.value;
      renderShirts(sortDirection);
    },
  }
}
</script>

<style scoped>
@import '@/style/homePage.css';
@import '@/style/mobileView.css';

</style>
