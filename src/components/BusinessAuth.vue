<template>
  <div class="form-container">
    <Transition name="fade">
      <div key="form-content" v-if="formState">
        <!-- Initial Email Verification Form -->
        <FormKit v-if="formState === 'initial'" key="initial-form" class="formulate-form" @submit.prevent="verifyEmail"
          schema="initialFormSchema">
        </FormKit>

        <!-- Registration Form -->
        <FormKit v-if="formState === 'register'" key="register-form" class="formulate-form" @submit.prevent="register"
          schema="registerFormSchema">
        </FormKit>

        <!-- Sign-in Form -->
        <FormKit v-if="formState === 'signin'" key="signin-form" class="formulate-form" @submit.prevent="signIn"
          schema="signInFormSchema">
        </FormKit>
      </div>
    </Transition>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, faBuilding, faCheck, faArrowRight, faKey, faSignInAlt, faPhone, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { checkEmailExists, registerBusiness, signInBusiness } from '../api'; // Adjust the path accordingly
import { defineComponent } from 'vue';
import { FormKit } from '@formkit/vue';

// Add icons to the library
library.add(faEnvelope, faBuilding, faCheck, faArrowRight, faKey, faSignInAlt, faPhone, faGlobe);

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
  computed: {
    initialFormSchema() {
      return [
        {
          $el: 'input',
          type: 'email',
          name: 'email',
          validation: 'required|email',
          placeholder: 'Email Address',
          'v-model': 'email',
          before: '<font-awesome-icon icon="envelope" />'
        },
        {
          $el: 'button',
          type: 'submit',
          class: 'submit-button',
          children: '<font-awesome-icon icon="arrow-right" /> Next'
        }
      ];
    },
    registerFormSchema() {
      return [
        {
          $el: 'input',
          type: 'text',
          name: 'businessName',
          validation: 'required',
          placeholder: 'Business Name',
          'v-model': 'businessName',
          before: '<font-awesome-icon icon="building" />'
        },
        {
          $el: 'input',
          type: 'text',
          name: 'phoneNumber',
          placeholder: 'Phone Number',
          'v-model': 'phoneNumber',
          before: '<font-awesome-icon icon="phone" />'
        },
        {
          $el: 'input',
          type: 'url',
          name: 'websiteUrl',
          validation: 'required|url',
          placeholder: 'Website URL',
          'v-model': 'websiteUrl',
          before: '<font-awesome-icon icon="globe" />'
        },
        {
          $el: 'button',
          type: 'submit',
          class: 'submit-button',
          children: '<font-awesome-icon icon="check" /> Register Business'
        }
      ];
    },
    signInFormSchema() {
      return [
        {
          $el: 'input',
          type: 'password',
          name: 'password',
          validation: 'required',
          placeholder: 'Password',
          'v-model': 'password',
          before: '<font-awesome-icon icon="key" />'
        },
        {
          $el: 'button',
          type: 'submit',
          class: 'submit-button',
          children: '<font-awesome-icon icon="sign-in-alt" /> Sign In'
        }
      ];
    }
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f4f9;
  /* Pastel background */
}

.formulate-form {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background: #ffffff;
  /* White background for the form */
}

.form-field {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.form-field .formulate-input {
  flex-grow: 1;
  margin-left: 0.5rem;
}

.submit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #a0aec0;
  /* Pastel button color */
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #718096;
  /* Darker shade on hover */
}

/* Add other styles as needed */
</style>
