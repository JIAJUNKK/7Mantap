<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-column">
        <h3>Contact Us</h3>
        <a href ="mailto:kongjiajun040103@gmail.com"><i class="fas fa-envelope"></i> kongjiajun040103@gmail.com</a>

        <p><i class="fas fa-phone"></i> Phone: +601234567890</p>
      </div>

      <div class="footer-column">
        <h3>Follow Us</h3>
        <a href ="https://www.instagram.com/7mantap_" target="_blank"><i class="fab fa-facebook"></i> 7mantap</a>
        <a href ="https://www.instagram.com/7mantap_" target="_blank"><i class="fab fa-instagram"></i> @7mantap_</a>
      </div>

      <div class="footer-column">
        <h3>Useful Links</h3>
        <router-link to="/"> Home</router-link>
        <router-link to="/shoppingBag">Shopping Bag</router-link>
      </div>
    </div>
    <p>&copy; 2024 7Mantap. All rights reserved.</p>
  </footer>
</template>


<style scoped>
@import '@/style/mobileView.css';

.footer {
  width: 100%;
  background-color: #cccccc;
  padding: 10% 20% 20% 20%;
  margin-top: 10%;
  text-align: center;
}

.footer-content {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20%;
}

.footer-column {
  display: flex; flex-direction: column;
  flex: 1;
}

.footer p {
  margin: 10px 0;
}

.footer a {
  text-decoration: none;
  color: black;
  cursor: pointer;
}

.footer a:hover {
text-decoration: underline;
}
</style>
