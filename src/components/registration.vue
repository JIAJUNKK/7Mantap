<template>
  <div class="registration-form-container">

    <h2 v-if="!showSignUp" class="big-title">Login</h2>
    <h2 v-else class="big-title">Sign Up</h2>
    <form v-if="!showSignUp" @submit.prevent="login">
      <div>
        <label for="email" class="form-label">Email<span class="required">*</span></label>
        <input type="email" id="email" v-model="email" class="big-input-field" required>
      </div>
      <div>
        <label for="password" class="form-label">Password<span class="required">*</span></label>

        <div class="input-field-with-text-container">
          <input v-model="password" :type="passwordFieldType" class="big-input-field" required>
          <span class="inline-text" @click="togglePasswordVisibility">{{ passwordToggleText }}</span>
        </div>

      </div>
      <button type="submit" class="big-submit-button">Login</button>
      <p v-show="showErrorLogIn" class="error-message"> {{LogInErrorMessage}}</p>
      <p class="form-switch-text">Don't have an account? <a href="#" @click.prevent="toggleSignUp" class="edit-text-toggle">Sign Up</a></p>
    </form>

    <form v-if="showSignUp" @submit.prevent="signUp">
      <div>
        <label for="email" class="form-label">Email<span class="required">*</span></label>
        <input type="email" v-model="email" class="big-input-field" required>
      </div>
      <div>
        <label for="username" class="form-label">Username<span class="required">*</span></label>
        <input type="text" v-model="username" class="big-input-field" required>
      </div>
      <div>
        <label for="password" class="form-label">Password<span class="required">*</span></label>
        <div class="input-field-with-text-container">
          <input v-model="password" :type="passwordFieldType" class="big-input-field" required>
          <span class="inline-text" @click="togglePasswordVisibility">{{ passwordToggleText }}</span>
        </div>
        <div :class="['password-strength-text', passwordStrength.toLowerCase()]">{{ passwordStrength }}</div>
      </div>

      <div class="password-strength-recommendation-container">
        <p>For a strong password, you need to have at least:</p>
        <li>8 or more characters</li>
        <li>At least one lowercase letter</li>
        <li>At least one uppercase letter</li>
        <li>At least one number</li>
        <li>At least one symbol</li>

        <p>For a medium-strength password, you need to have at least:</p>
        <li>6 or more characters</li>
        <li>At least one lowercase letter</li>
        <li>At least one uppercase letter</li>
        <li>At least one number</li>
      </div>
      
      <button type="submit" class="big-submit-button" :disabled="passwordStrength === 'Weak' || passwordStrength === ''">Sign Up</button>
      <p v-show="showErrorSignUp" class="error-message"> {{SignUpErrorMessage}}</p>
      <p class="form-switch-text">Already have an account? <a href="#" @click.prevent="toggleSignUp" class="edit-text-toggle">Log In</a></p>
    </form>
  </div>
</template>


<script>
import { retrieveCartFromLocalStorage } from '@/script/shoppingCart.js';
export default {
  name: 'UserRegistration',
  data() {
    return {
      email: '',
      username: '',
      password: '',
      showSignUp: false,
      passwordFieldType: 'password',
      passwordToggleText: 'SHOW',
      passwordStrength: '',
      showErrorSignUp: false,
      showErrorLogIn: false, 
      SignUpErrorMessage: '',
      LogInErrorMessage: '',
    };
  },

  methods: {
    login() {
      console.log('Logging in with email:', this.email, 'and password:', this.password);
      this.$axios.post(`${this.$api_path}/login`, {
        email: this.email,
        password: this.password
      })
      .then(response => {
        localStorage.setItem('token', response.data.token);
        console.log("log in token: ", response.data.token);
        this.$emit('userLoggedIn', response.data.username);
        this.$emit('authenticationCheck');
        this.$router.push('/UserProfile');
      })
      .catch(error => {
        this.showErrorLogIn = true;
        this.LogInErrorMessage = error.response.data.error;
      });
    },

    signUp() {
      if (this.passwordStrength === 'Weak') {
        alert('Password is too weak. Please choose a stronger password.');
        return;
      }
      const cart = retrieveCartFromLocalStorage();
      this.$axios.post(`${this.$api_path}/signup`, {
        email: this.email,
        username: this.username,
        password: this.password,
        cart: cart, 
        point: 0,
      })
      .then(response => {
        localStorage.setItem('token', response.data.token);
        console.log("signed up");
        this.$emit('userLoggedIn', this.username);
        this.$emit('authenticationCheck');
        this.$router.push('/UserProfile');
        this.resetFields();
      })
      .catch(error => {
        this.showErrorSignUp = true;
        this.SignUpErrorMessage = error.response.data.error;
      });
    },

    toggleSignUp() {
      this.showSignUp = !this.showSignUp;
    },

    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
      this.passwordToggleText = this.passwordToggleText === 'SHOW' ? 'HIDE' : 'SHOW';
    },

    resetFields() {
      this.email = '';
      this.username = '';
      this.password = '';
    },
    getPasswordStrength(password) {
      const regexMedium = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/; 
      const regexStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/; // Include symbol requirement
      if (regexStrong.test(password)) {
        this.passwordStrength = 'Strong';
      } else if (regexMedium.test(password) && !regexStrong.test(password)) {
        this.passwordStrength = 'Medium';
      } else {
        this.passwordStrength = 'Weak';
      }
    }
  },
  watch: {
    password(newValue) {
      this.getPasswordStrength(newValue);
    }
  }
};
</script>

<style>
@import '@/style/containers.css';
@import '@/style/buttons.css';
@import '@/style/textStyle.css';
@import '@/style/mobileView.css';

.registration-form-container{
    margin: 0 auto; padding: 2%;
    border-radius: 5px; border: 2px solid black;
}
.password-strength-recommendation-container{
  margin-left: 20px;
}
.password-strength-text{
    margin-top: -5%;
    margin-left: 20px
}
.big-submit-button[disabled] {
  cursor: not-allowed;
  opacity: 0.3;
}
.edit-text-toggle{
  text-decoration: underline;
}.edit-text-toggle:hover{
  font-weight: bold;
}
.form-switch-text {
  margin-top: 20px;
  text-align: center;
}

.strong {
  color: green;
}

.medium {
  color: orange;
}

.weak {
  color: red;
}

</style>
