<script setup lang="ts">
import { ref, computed } from 'vue'

interface FormData {
  name: string
  email: string
  note: string
}

const formData = ref<FormData>({
  name: '',
  email: '',
  note: '',
})

const isSubmitting = ref(false)
const submitStatus = ref<'idle' | 'success' | 'error'>('idle')
const errorMessage = ref('')
const showEmailFallback = ref(false)

// Obscure email address to reduce scraping
// Split into parts and reconstruct in JavaScript
const getContactEmail = (): string => {
  const parts = ['ashmartin', '.practice', '@gmail', '.com']
  return parts.join('')
}

// Create mailto link with form data pre-filled
const mailtoLink = computed(() => {
  const email = getContactEmail()
  const subject = encodeURIComponent(`Contact Form: ${formData.value.name || 'Message'}`)
  const body = encodeURIComponent(
    `Name: ${formData.value.name}\nEmail: ${formData.value.email}\n\nNote:\n${formData.value.note}`
  )
  return `mailto:${email}?subject=${subject}&body=${body}`
})

const validateForm = (): boolean => {
  if (!formData.value.name.trim()) {
    errorMessage.value = 'Please enter your name'
    return false
  }
  if (!formData.value.email.trim()) {
    errorMessage.value = 'Please enter your email'
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.value.email)) {
    errorMessage.value = 'Please enter a valid email address'
    return false
  }
  if (!formData.value.note.trim()) {
    errorMessage.value = 'Please enter a note'
    return false
  }
  return true
}

const submitForm = async () => {
  // Reset status
  submitStatus.value = 'idle'
  errorMessage.value = ''
  showEmailFallback.value = false

  // Validate form
  if (!validateForm()) {
    submitStatus.value = 'error'
    return
  }

  isSubmitting.value = true

  try {
    // Determine the function URL based on environment
    // In development, use Netlify Dev server (port 8888)
    // If running just Vite (npm run dev), functions won't be available
    const functionUrl =
      import.meta.env.DEV
        ? 'http://localhost:8888/.netlify/functions/sendEmail'
        : '/.netlify/functions/sendEmail'

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData.value),
    })

    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      // If we get HTML back, it means the function isn't running
      if (contentType && contentType.includes('text/html')) {
        throw new Error(
          'Netlify Functions are not available. Please run "netlify dev" instead of "npm run dev" to test the form locally.'
        )
      }
      const text = await response.text()
      throw new Error(`Server returned an unexpected response: ${text.substring(0, 100)}`)
    }

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send message')
    }

    // Success
    submitStatus.value = 'success'
    formData.value = {
      name: '',
      email: '',
      note: '',
    }

    // Reset success message after 5 seconds
    setTimeout(() => {
      submitStatus.value = 'idle'
    }, 5000)
  } catch (error) {
    submitStatus.value = 'error'
    // Check if it's a network/fetch error
    let isNetworkError = false
    if (error instanceof TypeError) {
      isNetworkError = error.message.includes('fetch') || error.message.includes('Failed to fetch')
    } else if (error instanceof Error) {
      isNetworkError = error.message.includes('Failed to fetch') || error.message.includes('NetworkError')
    }
    
    if (isNetworkError) {
      // Show email fallback for network errors
      showEmailFallback.value = true
      errorMessage.value = 'Unable to send message through the form. Please use email instead:'
    } else {
      // For other errors, show the error message
      errorMessage.value =
        error instanceof Error
          ? error.message
          : 'Failed to send message. Please try again later.'
      showEmailFallback.value = false
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section id="contact" class="section">
    <div class="text-box text-box-left">
      <h3>Contact</h3>
      <form @submit.prevent="submitForm" class="contact-form">
    <div class="form-group">
      <label for="name">Your Name</label>
      <input
        id="name"
        v-model="formData.name"
        type="text"
        name="name"
        required
        :disabled="isSubmitting"
        class="form-input"
      />
    </div>

    <div class="form-group">
      <label for="email">Email</label>
      <input
        id="email"
        v-model="formData.email"
        type="email"
        name="email"
        required
        :disabled="isSubmitting"
        class="form-input"
      />
    </div>

    <div class="form-group">
      <label for="note">Note</label>
      <textarea
        id="note"
        v-model="formData.note"
        name="note"
        rows="6"
        required
        :disabled="isSubmitting"
        class="form-textarea"
      ></textarea>
    </div>

    <div v-if="submitStatus === 'error'" class="form-error">
      <div v-if="showEmailFallback">
        <p>{{ errorMessage }}</p>
        <a :href="mailtoLink" class="email-fallback-link">
          {{ getContactEmail() }}
        </a>
      </div>
      <div v-else>
        {{ errorMessage }}
      </div>
    </div>

    <div v-if="submitStatus === 'success'" class="form-success">
      Thank you! Your message has been sent successfully.
    </div>

    <button
      type="submit"
      :disabled="isSubmitting"
      class="form-submit button"
    >
      {{ isSubmitting ? 'Sending...' : 'Send Message' }}
    </button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.contact-form {
  margin-top: 3rem;
}

.form-group {
  margin-bottom: 2rem;
}

.form-group label {
  display: block;
  font-family: var(--font-body);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  font-family: var(--font-body);
  font-size: var(--font-size-body);
  color: var(--color-text-primary);
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: 0;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-heading);
}

.form-input:disabled,
.form-textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-error {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #fee;
  border: 1px solid #fcc;
  color: #c33;
  font-family: var(--font-body);
  font-size: 1rem;
}

.form-error p {
  margin: 0 0 0.5rem 0;
}

.email-fallback-link {
  display: inline-block;
  color: var(--color-text-primary);
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border-primary);
  padding: 0.5rem 1rem;
  text-decoration: none;
  font-family: var(--font-body);
  font-size: var(--font-size-body);
  margin-top: 0.5rem;
  transition: all 0.2s;
}

.email-fallback-link:hover {
  background-color: var(--color-border-divider);
  border-color: var(--color-heading);
}

.form-success {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #efe;
  border: 1px solid #cfc;
  color: #3c3;
  font-family: var(--font-body);
  font-size: 1rem;
}

.form-submit {
  margin-top: 1rem;
  width: 100%;
  padding: 0.75rem 1.5rem;
  font-size: var(--font-size-button);
}

.form-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

