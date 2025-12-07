<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Search from './Search.vue'

const isVisible = ref(false)
const hasAppeared = ref(false)
const activeSection = ref<string>('home')
let initialDelayTimeout: number | null = null

const sections = ['home', 'therapy', 'emdr', 'about', 'contact']

const scrollToSection = (sectionId: string) => {
  if (sectionId === 'home') {
    // Home scrolls to the very top of the site
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    return
  }

  const element = document.getElementById(sectionId)
  if (!element) return

  // Standard scroll calculation for all sections
  const headerOffset = 100
  const elementPosition = element.getBoundingClientRect().top
  const offsetPosition = elementPosition + window.scrollY - headerOffset

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  })
}

const updateActiveSection = () => {
  const scrollY = window.scrollY
  const threshold = 150 // Offset from top of viewport to consider section "scrolled past"

  // Check sections in reverse order to find the last one we've scrolled past
  for (let i = sections.length - 1; i >= 0; i--) {
    const sectionId = sections[i]
    if (!sectionId) continue
    
    const element = document.getElementById(sectionId)
    
    if (element) {
      const elementTop = element.getBoundingClientRect().top + scrollY
      
      if (sectionId === 'home') {
        // Home is active if we're near the top
        if (scrollY < threshold) {
          activeSection.value = 'home'
          return
        }
      } else {
        // For other sections, check if we've scrolled past their top (with threshold)
        if (scrollY + threshold >= elementTop) {
          activeSection.value = sectionId
          return
        }
      }
    }
  }
  
  // Default to home if at top
  if (scrollY < threshold) {
    activeSection.value = 'home'
  }
}

const handleScroll = () => {
  // Update active section
  updateActiveSection()

  // If we haven't appeared yet, wait 1s after first scroll
  if (!hasAppeared.value) {
    hasAppeared.value = true
    initialDelayTimeout = window.setTimeout(() => {
      isVisible.value = true
    }, 1000)
  } else {
    // After first appearance, show immediately on scroll
    isVisible.value = true
  }
}


onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  // Check initial scroll position and active section
  updateActiveSection()
  if (window.scrollY > 0) {
    handleScroll()
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (initialDelayTimeout) {
    clearTimeout(initialDelayTimeout)
  }
})
</script>

<template>
  <nav class="bottom-nav" :class="{ 'is-visible': isVisible }">
    <div class="nav-left">
      <div class="nav-name">ASH MARTIN, LCSW</div>
      <div class="nav-links">
        <button 
          @click="scrollToSection('home')" 
          class="nav-link" 
          :class="{ 'is-active': activeSection === 'home' }"
        >
          <span>Home</span>
        </button>
        <button 
          @click="scrollToSection('therapy')" 
          class="nav-link" 
          :class="{ 'is-active': activeSection === 'therapy' }"
        >
          <span>Therapy</span>
        </button>
        <button 
          @click="scrollToSection('emdr')" 
          class="nav-link" 
          :class="{ 'is-active': activeSection === 'emdr' }"
        >
          <span>EMDR & Adjunctive</span>
        </button>
        <button 
          @click="scrollToSection('about')" 
          class="nav-link" 
          :class="{ 'is-active': activeSection === 'about' }"
        >
          <span>About</span>
        </button>
        <button 
          @click="scrollToSection('contact')" 
          class="nav-link nav-link-contact" 
          :class="{ 'is-active': activeSection === 'contact' }"
        >
          <span>Contact</span>
        </button>
      </div>
    </div>
    <Search :is-visible="isVisible" />
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  --nav-padding-right: 2rem;
  padding: 0 var(--nav-padding-right);
  min-height: 60px;
  background-color: var(--color-hero-box-bg);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  border-top: 1px solid var(--color-border-primary);
  z-index: 1000;
  transform: translateY(100%);
  transition: transform 0.5s ease-out;
  overflow: hidden; /* Clip search buttons by default */
}

.bottom-nav.is-visible {
  transform: translateY(0);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-name {
  font-family: var(--font-body);
  font-weight: 900;
  font-size: 1rem; /* 16px */
  color: var(--color-text-primary);
  white-space: nowrap;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  background: none;
  border: none;
  color: var(--color-text-primary);
  font-family: var(--font-monospace);
  font-weight: 500;
  font-size: 1rem; /* 16px */
  cursor: pointer;
  padding: 1rem 1.5rem;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-link span {
  position: relative;
  display: inline-block;
}

.nav-link:hover span::after,
.nav-link.is-active span::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--color-heading);
}

.nav-link-contact {
  font-weight: 800;
}

@media (max-width: 768px) {
  .bottom-nav {
    flex-wrap: wrap;
    gap: 1rem;
    padding: 0 1rem;
  }

  .nav-left {
    width: 100%;
    flex-direction: column;
    gap: 0.5rem;
  }

  .nav-name {
    width: 100%;
    text-align: center;
  }

  .nav-links {
    width: 100%;
    justify-content: center;
    gap: 1rem;
  }

  .nav-link {
    font-size: 0.875rem;
    padding: 1rem 1rem;
  }
}
</style>

