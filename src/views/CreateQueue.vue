<template>
  <div class="create-queue">
    <h2>Create a New Queue</h2>
    <form @submit.prevent="createQueue">
      <input
        type="text"
        v-model="queueName"
        placeholder="Queue Name"
        required
      />
      <button type="submit">Generate QR Code</button>
    </form>
    <!-- Display QR Code here once generated -->
    <div v-if="qrCode">
      <img :src="qrCode" alt="Generated QR Code" />
    </div>
    <!-- Display error message if any -->
    <div v-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>
  </div>
</template>
<script>
import api from "../api";

export default {
  data() {
    return {
      queueName: "",
      qrCode: null,
      errorMessage: null,
    };
  },
  methods: {
    async createQueue() {
      try {
        const response = await api.post("/createQueue", {
          queueName: this.queueName,
        });
        if (response.data.success) {
          // Handle success - e.g., generate QR code
          this.qrCode = response.data.qrCode; // Assuming the API returns a QR code
          this.errorMessage = null; // Clear any previous error messages
        } else {
          // Handle error from the API response
          this.errorMessage = response.data.message || "Error creating queue.";
        }
      } catch (error) {
        // Handle network or other errors
        this.errorMessage = "Error creating queue. Please try again later.";
        console.error("Error creating queue:", error);
      }
    },
  },
};
</script>
<style scoped>
/* Basic styling for the create queue page. This can be enhanced later. */
.create-queue {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.error {
  color: red;
  margin-top: 20px;
}
</style>
