<template>
  <div>
    <h1>Create a Queue</h1>
    <form @submit.prevent="createQueue">
      <input v-model="businessName" placeholder="Business Name" required />
      <input v-model="businessType" placeholder="Business Type" required />
      <input v-model="location" placeholder="Location" required />
      <button type="submit">Create Queue</button>
    </form>
    <div v-if="qrCodeData">
      <h2>Scan this QR Code to Join the Queue</h2>
      <img :src="qrCodeData" alt="QR Code" />
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  data() {
    return {
      businessName: '',
      businessType: '',
      location: '',
      qrCodeData: null
    };
  },
  methods: {
    async createQueue() {
      try {
        const response = await api.post('/business', {
          businessName: this.businessName,
          businessType: this.businessType,
          location: this.location
        });
        this.qrCodeData = response.data.qrCodeData;
      } catch (error) {
        console.error('Error creating queue:', error);
      }
    }
  }
};
</script>
