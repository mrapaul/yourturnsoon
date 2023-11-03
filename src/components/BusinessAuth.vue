<template>
  <div>
    <div v-if="!emailEntered">
      <input v-model="email" placeholder="Business Email" required />
      <button @click="checkEmail">Next</button>
    </div>
    <div v-else-if="isNewBusiness">
      <form @submit.prevent="registerBusiness">
        <input v-model="email" placeholder="Business Email" required disabled />
        <input v-model="businessName" placeholder="Business Name" required />
        <input v-model="address" placeholder="Address" required />
        <input v-model="phoneNumber" placeholder="Phone Number" required />
        <input v-model="websiteUrl" placeholder="Website URL (optional)" />
        <button type="submit">Register</button>
      </form>
    </div>
    <div v-else>
      <p>This email is already registered. Please use a different email or contact support if you believe this is an error.</p>
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  data() {
    return {
      email: '',
      businessName: '',
      address: '',
      phoneNumber: '',
      websiteUrl: '',
      emailEntered: false,
      isNewBusiness: false
    };
  },
  methods: {
    async checkEmail() {
      try {
        const response = await api.get('/businesses', { params: { email: this.email } });
        if (response.data && response.data.length > 0) {
          this.isNewBusiness = false;
        } else {
          this.isNewBusiness = true;
        }
        this.emailEntered = true;
      } catch (error) {
        console.error('Error checking email:', error);
        alert('Error checking email. Please try again.');
      }
    },
    async registerBusiness() {
      try {
        const businessData = {
          email: this.email,
          businessName: this.businessName,
          address: this.address,
          phoneNumber: this.phoneNumber,
          websiteUrl: this.websiteUrl
        };
        const response = await api.post('/businesses', businessData);
        if (response.data && response.data.message) {
          alert(`Business registered successfully! Your password is: ${response.data.password}. Please note it down.`);
        } else {
          alert('Business registration failed. Please try again.');
        }
      } catch (error) {
        console.error('Error registering business:', error);
        alert('Error registering business. Please try again.');
      }
    }
  }
};
</script>
