<template>
  <div class="landing-page">
    <header>
      <img src="@/assets/logo.png" alt="YourTurnSoon Logo">
      <h1>YourTurnSoon</h1>
      <p>Queue management made simple and free!</p>
    </header>
    <main>
      <p>Manage your business queues effortlessly. Scan, join, and get notified. All for free!</p>
      <div class="features">
        <div class="feature">
          <i class="fas fa-plus-circle"></i>
          <p>Create Queue</p>
        </div>
        <div class="feature">
          <i class="fas fa-qrcode"></i>
          <p>Join Queue</p>
        </div>
        <div class="feature">
          <i class="fas fa-bell"></i>
          <p>Notifications</p>
        </div>
      </div>
      <button>Create Your Queue Now!</button>
    </main>
    <footer>
      <p>&copy; 2023 YourTurnSoon</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'LandingPage'
}
</script>

<style scoped>
/* Basic styling for the landing page. This can be enhanced later. */
</style>
