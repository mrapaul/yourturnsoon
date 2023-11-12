<template>
  <div class="form-container">
    <div key="form-content" v-if="formState">
      <!-- Initial Email Verification Form -->
      <FormKit v-if="formState === 'initial'" key="initial-form" class="formulate-form" @submit.prevent="verifyEmail">
        <FormKit type="email" name="email" validation="required|email" placeholder="myname@website.com" v-model="email" />
        <button type="submit" class="submit-button">
          Next
        </button>
      </FormKit>

      <!-- Registration Form -->
      <FormKit v-if="formState === 'register'" key="register-form" class="formulate-form" @submit.prevent="register">
        <FormKit type="text" name="businessName" validation="required" placeholder="Business Name" v-model="businessName"
          prefix-icon="building" />
        <FormKit type="tel" name="phoneNumber" placeholder="Phone Number" v-model="phoneNumber" prefix-icon="phone" />
        <FormKit type="url" name="websiteUrl" validation="required|url" placeholder="Website URL" v-model="websiteUrl"
          prefix-icon="globe" />
        <button type="submit" class="submit-button">
          Register Business
        </button>
      </FormKit>

      <!-- Sign-in Form -->
      <FormKit v-if="formState === 'signin'" key="signin-form" class="formulate-form" @submit.prevent="signIn">
        <FormKit type="password" name="password" validation="required" placeholder="Password" v-model="password"
          prefix-icon="key" />
        <button type="submit" class="submit-button">
          Sign In
        </button>
      </FormKit>
    </div>
  </div>
</template>



<script>
import { defineComponent } from 'vue';
import { FormKit } from '@formkit/vue';
import { checkEmailExists, registerBusiness, signInBusiness } from '../api'; // Adjust the path accordingly

// Add icons to the library
export default defineComponent({
  components: {
    FormKit
  },
  data() {
    return {
      email: '',
      password: '',
      businessName: '',
      address: '',
      phoneNumber: '',
      websiteUrl: '',
      formState: 'initial', // 'initial', 'register', 'signin'
    };
  },
  methods: {
    async verifyEmail() {
      try {
        const { exists } = await checkEmailExists(this.email);
        this.formState = exists ? 'signin' : 'register';
      } catch (error) {
        console.error('There was an error verifying the email:', error);
        // Handle the error appropriately in your UI
      }
    },
    async register() {
      try {
        const businessDetails = {
          email: this.email,
          businessName: this.businessName,
          address: this.address,
          phoneNumber: this.phoneNumber,
          websiteUrl: this.websiteUrl
        };
        const response = await registerBusiness(businessDetails);
        // Handle the response, such as showing the generated password
        alert(`Your password is: ${response.password}`);
        // Transition to sign-in after registration
        this.formState = 'signin';
      } catch (error) {
        console.error('There was an error registering the business:', error);
        // Handle the error appropriately in your UI
      }
    },
    async signIn() {
      try {
        const credentials = {
          email: this.email,
          password: this.password
        };
        await signInBusiness(credentials);
        // Handle the sign-in, such as redirecting to the dashboard
      } catch (error) {
        console.error('There was an error signing in:', error);
        // Handle the error appropriately in your UI
      }
    }
  }
});
</script>

<style>
</style>
