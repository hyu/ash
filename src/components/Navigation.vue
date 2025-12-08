<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Search from './Search.vue'

const isVisible = ref(false)
const hasAppeared = ref(false)
const activeSection = ref<string>('home')
const isMobileMenuOpen = ref(false)
const isSearchActive = ref(false)
let initialDelayTimeout: number | null = null

const sections = ['home', 'therapy', 'emdr', 'about', 'contact']

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) {
    isSearchActive.value = false
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const handleSearchToggle = () => {
  isSearchActive.value = !isSearchActive.value
  if (isSearchActive.value) {
    isMobileMenuOpen.value = false
  }
}

const scrollToSection = (sectionId: string) => {
  closeMobileMenu()
  
  if (sectionId === 'home') {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    return
  }

  const element = document.getElementById(sectionId)
  if (!element) return

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
  const threshold = 150

  for (let i = sections.length - 1; i >= 0; i--) {
    const sectionId = sections[i]
    if (!sectionId) continue
    
    const element = document.getElementById(sectionId)
    
    if (element) {
      const elementTop = element.getBoundingClientRect().top + scrollY
      
      if (sectionId === 'home') {
        if (scrollY < threshold) {
          activeSection.value = 'home'
          return
        }
      } else {
        if (scrollY + threshold >= elementTop) {
          activeSection.value = sectionId
          return
        }
      }
    }
  }
  
  if (scrollY < threshold) {
    activeSection.value = 'home'
  }
}

const handleScroll = () => {
  updateActiveSection()

  if (!hasAppeared.value) {
    hasAppeared.value = true
    initialDelayTimeout = window.setTimeout(() => {
      isVisible.value = true
    }, 1000)
  } else {
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
  // Clean up body overflow style
  document.body.style.overflow = ''
})
</script>

<template>
  <button 
    class="mobile-hamburger" 
    @click="toggleMobileMenu"
    :class="{ 'is-open': isMobileMenuOpen }"
    aria-label="Toggle menu"
  >
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
  </button>

  <!-- Outside nav to avoid transform containing block issues -->
  <button 
    class="mobile-search-toggle" 
    @click="handleSearchToggle"
    :class="{ 'is-active': isSearchActive }"
    aria-label="Toggle search"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
  </button>

  <nav class="navigation" :class="{ 'is-visible': isVisible }">

    <!-- Desktop Navigation -->
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

    <Search :is-visible="isVisible" class="desktop-search" />
  </nav>

  <!-- Outside nav to avoid transform containing block issues -->
  <div class="mobile-menu-overlay" :class="{ 'is-open': isMobileMenuOpen }">
    <div class="mobile-menu-content">
      <div class="mobile-nav-name">ASH MARTIN, LCSW</div>
      <div class="mobile-nav-links">
        <button 
          @click="scrollToSection('home')" 
          class="mobile-nav-link" 
          :class="{ 'is-active': activeSection === 'home' }"
        >
          Home
        </button>
        <button 
          @click="scrollToSection('therapy')" 
          class="mobile-nav-link" 
          :class="{ 'is-active': activeSection === 'therapy' }"
        >
          Therapy
        </button>
        <button 
          @click="scrollToSection('emdr')" 
          class="mobile-nav-link" 
          :class="{ 'is-active': activeSection === 'emdr' }"
        >
          EMDR & Adjunctive
        </button>
        <button 
          @click="scrollToSection('about')" 
          class="mobile-nav-link" 
          :class="{ 'is-active': activeSection === 'about' }"
        >
          About
        </button>
        <button 
          @click="scrollToSection('contact')" 
          class="mobile-nav-link mobile-nav-link-contact" 
          :class="{ 'is-active': activeSection === 'contact' }"
        >
          Contact
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Search Overlay (only search bar at bottom) -->
  <div class="mobile-search-overlay" :class="{ 'is-open': isSearchActive }">
    <Search :is-visible="isVisible" class="mobile-search" />
  </div>
</template>

<style scoped>
.navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: stretch; /* Allow children to stretch to full height */
  --nav-padding-right: 2rem;
  padding: 0 var(--nav-padding-right);
  height: var(--nav-height); /* Fixed height instead of min-height */
  background-color: var(--color-hero-box-bg);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  border-top: 1px solid var(--color-border-primary);
  z-index: var(--z-index-bottom-nav);
  transform: translateY(100%);
  transition: transform 0.5s ease-out;
  overflow: hidden; /* Clip search buttons by default */
}

.navigation.is-visible {
  transform: translateY(0);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 2rem;
  /* Stretches to full height via parent's align-items: stretch */
}

.nav-name {
  font-family: var(--font-body);
  font-weight: 900;
  font-size: 1rem;
  color: var(--color-text-primary);
  white-space: nowrap;
}

.nav-links {
  display: flex;
  align-items: stretch; /* Stretch links to full height */
  height: 100%; /* Full height of parent */
}

.nav-link {
  background: none;
  border: none;
  color: var(--color-text-primary);
  font-family: var(--font-monospace);
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  padding: 0 1.5rem; /* Removed vertical padding */
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%; /* Full height for bigger click area */
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

.mobile-hamburger,
.mobile-search-toggle {
  display: none;
  position: fixed;
  top: 1rem;
  z-index: var(--z-index-mobile-controls);
  background: transparent;
  border: none;
  width: 44px;
  height: 44px;
  padding: 0;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.mobile-hamburger {
  left: 1rem;
  flex-direction: column;
  gap: 6px;
}

.mobile-search-toggle {
  right: 1rem;
  color: var(--color-text-primary);
}

.hamburger-line {
  width: 24px;
  height: 2px;
  background-color: var(--color-text-primary);
  transition: all 0.3s ease;
  transform-origin: center;
}

.mobile-hamburger.is-open .hamburger-line:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.mobile-hamburger.is-open .hamburger-line:nth-child(2) {
  opacity: 0;
}

.mobile-hamburger.is-open .hamburger-line:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

.mobile-search-toggle.is-active {
  color: var(--color-border-primary);
}

.mobile-menu-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  min-height: 100vh;
  min-height: 100dvh;
  background-color: var(--color-bg-primary);
  z-index: var(--z-index-mobile-overlay);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  margin: 0;
  padding: 0;
}

.mobile-menu-overlay.is-open {
  display: block;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.mobile-menu-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 2rem;
  position: relative;
  z-index: var(--z-index-mobile-overlay);
}

.mobile-nav-name {
  font-family: var(--font-body);
  font-weight: 900;
  font-size: 1.25rem;
  color: var(--color-text-primary);
  margin-bottom: 3rem;
  text-align: center;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 300px;
}

.mobile-nav-link {
  background: none;
  border: 1px solid var(--color-border-primary);
  color: var(--color-text-primary);
  font-family: var(--font-monospace);
  font-weight: 500;
  font-size: 1.125rem;
  cursor: pointer;
  padding: 1.25rem 2rem;
  text-align: center;
  transition: all 0.2s ease;
}

.mobile-nav-link:hover,
.mobile-nav-link.is-active {
  background-color: var(--color-border-primary);
  color: var(--color-bg-primary);
}

.mobile-nav-link-contact {
  font-weight: 800;
  background-color: var(--color-border-primary);
  color: var(--color-bg-primary);
}

.mobile-nav-link-contact:hover {
  background-color: var(--color-text-primary);
}

/* Mobile Search Overlay */
.mobile-search-overlay {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: var(--z-index-mobile-overlay);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.mobile-search-overlay.is-open {
  opacity: 1;
  pointer-events: auto;
}

.mobile-search {
  display: none;
}

.desktop-search {
  display: flex;
}

@media (max-width: 768px) {
  .nav-left,
  .desktop-search {
    display: none;
  }

  .mobile-hamburger,
  .mobile-search-toggle {
    display: flex;
  }

  .mobile-menu-overlay {
    display: block;
  }

  .mobile-menu-overlay.is-open {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  .mobile-search-overlay {
    display: block;
  }

  .mobile-search {
    display: flex;
    background-color: var(--color-hero-box-bg);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    border-top: 1px solid var(--color-border-primary);
    padding: 1rem;
    justify-content: center;
  }

  .navigation {
    padding: 0;
    min-height: 0;
    background: transparent;
    border: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    overflow: visible;
  }
}
</style>
