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
  if (element) {
    const headerOffset = 100 // Offset for good reading position
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.scrollY - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

const updateActiveSection = () => {
  const scrollY = window.scrollY
  const threshold = 150 // Offset from top of viewport to consider section "scrolled past"

  // Check sections in reverse order to find the last one we've scrolled past
  for (let i = sections.length - 1; i >= 0; i--) {
    const sectionId = sections[i]
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

const performSearch = () => {
  // Initialize mark instance if not already created
  if (!markInstance) {
    const context = document.querySelector('.app')
    if (context) {
      markInstance = new Mark(context as HTMLElement)
    } else {
      return
    }
  }

  // Unmark previous highlights, then mark new search term
  markInstance.unmark({
    done: () => {
      markedElements = []
      currentMatchIndex.value = -1
      totalMatches.value = 0

      if (searchQuery.value.trim()) {
        markInstance!.mark(searchQuery.value.trim(), {
          element: 'mark',
          className: 'search-highlight',
          acrossElements: true,
          separateWordSearch: false,
          done: (count: number) => {
            // Collect all marked elements
            const context = document.querySelector('.app')
            if (context) {
              markedElements = Array.from(
                context.querySelectorAll('mark.search-highlight')
              ) as HTMLElement[]
              totalMatches.value = markedElements.length
              if (markedElements.length > 0) {
                currentMatchIndex.value = 0
                scrollToMatch(0)
              }
            }
          }
        })
      }
    }
  })
}

const scrollToMatch = (index: number) => {
  if (markedElements.length === 0 || index < 0 || index >= markedElements.length) {
    return
  }

  const element = markedElements[index]
  const headerOffset = 150 // Offset for good reading position
  const elementPosition = element.getBoundingClientRect().top
  const offsetPosition = elementPosition + window.scrollY - headerOffset

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  })

  // Highlight the current match
  markedElements.forEach((el, i) => {
    if (i === index) {
      el.classList.add('search-highlight-active')
    } else {
      el.classList.remove('search-highlight-active')
    }
  })
}

const navigateToNextMatch = () => {
  if (markedElements.length === 0) return
  currentMatchIndex.value = (currentMatchIndex.value + 1) % markedElements.length
  scrollToMatch(currentMatchIndex.value)
}

const navigateToPreviousMatch = () => {
  if (markedElements.length === 0) return
  currentMatchIndex.value = currentMatchIndex.value <= 0 
    ? markedElements.length - 1 
    : currentMatchIndex.value - 1
  scrollToMatch(currentMatchIndex.value)
}

const handleKeyDown = (event: KeyboardEvent) => {
  // Only handle arrow keys when search input is focused and there are matches
  if (totalMatches.value === 0) return

  const isSearchInputFocused = document.activeElement?.classList.contains('search-input')
  
  if (!isSearchInputFocused) return
  
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    navigateToNextMatch()
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    navigateToPreviousMatch()
  }
}

watch(searchQuery, () => {
  // Clear existing debounce timeout
  if (searchDebounceTimeout) {
    clearTimeout(searchDebounceTimeout)
  }

  // If search is empty, clear results immediately
  if (!searchQuery.value.trim()) {
    performSearch()
    return
  }

  // Debounce the search - wait 400ms after user stops typing
  searchDebounceTimeout = window.setTimeout(() => {
    performSearch()
  }, 400)
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', handleKeyDown)
  // Check initial scroll position and active section
  updateActiveSection()
  if (window.scrollY > 0) {
    handleScroll()
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeyDown)
  if (initialDelayTimeout) {
    clearTimeout(initialDelayTimeout)
  }
  if (searchDebounceTimeout) {
    clearTimeout(searchDebounceTimeout)
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
    <div class="search-container">
      <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="Search..."
        @keydown.enter.prevent="navigateToNextMatch"
      />
      <div v-if="totalMatches > 0" class="search-navigation">
        <button 
          @click="navigateToPreviousMatch" 
          class="nav-arrow-button"
          :disabled="totalMatches === 0"
          title="Previous match (↑)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m18 15-6-6-6 6"/>
          </svg>
        </button>
        <span class="match-count">{{ currentMatchIndex + 1 }}/{{ totalMatches }}</span>
        <button 
          @click="navigateToNextMatch" 
          class="nav-arrow-button"
          :disabled="totalMatches === 0"
          title="Next match (↓)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
      </div>
    </div>
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
  padding: 0 2rem;
  min-height: 60px;
  background-color: var(--color-hero-box-bg);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  border-top: 1px solid var(--color-border-primary);
  z-index: 1000;
  transform: translateY(100%);
  transition: transform 0.5s ease-out;
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
  gap: 2rem;
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

.search-container {
  display: flex;
  align-items: center;
  position: relative;
  gap: 0.5rem;
}

.search-navigation {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: 0.25rem;
}

.nav-arrow-button {
  background: transparent;
  border: 1px solid var(--color-border-primary);
  color: var(--color-text-primary);
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  border-radius: 2px;
}

.nav-arrow-button:hover:not(:disabled) {
  background-color: var(--color-border-primary);
  color: var(--color-bg-primary);
}

.nav-arrow-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.match-count {
  font-family: var(--font-monospace);
  font-size: 0.75rem;
  color: var(--color-text-primary);
  min-width: 2.5rem;
  text-align: center;
  font-weight: 500;
}

.search-icon {
  color: var(--color-text-primary);
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}

.search-input {
  background: transparent;
  border: 1px solid var(--color-border-primary);
  color: var(--color-text-primary);
  font-family: var(--font-monospace);
  font-weight: 500;
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  width: 150px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: var(--color-heading);
}

.search-input::placeholder {
  color: var(--color-text-primary);
  opacity: 0.5;
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

  .search-container {
    width: 100%;
    justify-content: flex-end;
    margin-top: 0.5rem;
  }

  .search-input {
    width: 120px;
    font-size: 0.75rem;
    padding: 0.4rem 0.6rem;
  }
}
</style>

