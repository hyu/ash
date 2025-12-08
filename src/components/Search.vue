<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import Mark from 'mark.js'
import { setActiveKeyword, activeKeyword } from '../composables/useKeywords'
import { keywords } from '../data/keywords'

const props = defineProps<{
  isVisible: boolean
}>()

const searchQuery = ref('')
const currentMatchIndex = ref(-1)
const totalMatches = ref(0)
const isLoadingKeyword = ref(false)
let searchDebounceTimeout: number | null = null
let markInstance: Mark | null = null
let markedElements: HTMLElement[] = []

// Check if search query matches a keyword (case-insensitive)
const matchedKeyword = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return keywords[query] ? query : null
})

// Check if we should show "not found" button (keyword matched)
const shouldShowNotFound = computed(() => {
  return matchedKeyword.value !== null
})

// Check if the matched keyword is currently active (text-box is visible)
const isKeywordActive = computed(() => {
  return matchedKeyword.value !== null && activeKeyword.value === matchedKeyword.value
})

// Check if we have a match and should show navigation or not-found button
const matchFound = computed(() => {
  return (totalMatches.value > 0 && !shouldShowNotFound.value) || shouldShowNotFound.value
})

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
              // Only auto-scroll if there are matches AND it's not a keyword match
              if (markedElements.length > 0 && !matchedKeyword.value) {
                currentMatchIndex.value = 0
                scrollToMatch(0)
              } else if (matchedKeyword.value) {
                // If it's a keyword match, don't scroll automatically
                // User must click "not found" to reveal and scroll to the section
                currentMatchIndex.value = -1
              }
            }
          }
        })
      }
    }
  })
}

const handleNotFoundClick = async () => {
  console.log('handleNotFoundClick called', { 
    matchedKeyword: matchedKeyword.value, 
    isLoading: isLoadingKeyword.value,
    searchQuery: searchQuery.value 
  })
  
  if (!matchedKeyword.value) {
    console.warn('No keyword matched, cannot proceed')
    return
  }
  
  if (isLoadingKeyword.value) {
    console.log('Already loading keyword, ignoring click')
    return
  }
  
  const keyword = matchedKeyword.value
  console.log('Activating keyword:', keyword)
  isLoadingKeyword.value = true
  setActiveKeyword(keyword)
  
  // Wait for Vue to update the DOM
  await nextTick()
  console.log('DOM updated, waiting for section to become visible...')
  
  // Wait for the section to be fully visible and expanded
  // Check repeatedly until the section is actually visible with proper height
  const waitForVisibility = async () => {
    const keywordSection = document.getElementById(`keyword-${keyword}`)
    if (keywordSection) {
      const rect = keywordSection.getBoundingClientRect()
      const computedStyle = window.getComputedStyle(keywordSection)
      
      // Check if section is fully expanded (has height, opacity is 1, and visibility is visible)
      if (rect.height > 200 && computedStyle.opacity === '1' && computedStyle.visibility === 'visible') {
        console.log('Section is visible!', { height: rect.height, opacity: computedStyle.opacity })
        return keywordSection
      }
    }
    return null
  }
  
  // Poll until section is visible, with timeout
  let attempts = 0
  let keywordSection = null
  while (!keywordSection && attempts < 50) {
    await new Promise(resolve => setTimeout(resolve, 50))
    keywordSection = await waitForVisibility()
    attempts++
    if (attempts % 10 === 0) {
      console.log(`Waiting for section visibility... attempt ${attempts}/50`)
    }
  }
  
  // Additional wait to ensure smooth transition completion
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // If we still don't have the section, try to find it anyway (it might exist but not be fully expanded)
  if (!keywordSection) {
    console.warn('Section not fully visible after waiting, trying to find it anyway...')
    keywordSection = document.getElementById(`keyword-${keyword}`)
    if (keywordSection) {
      console.log('Found section, but it may not be fully expanded yet')
    }
  }
  
  if (keywordSection) {
      // Calculate the correct scroll position to center the text box
      const textBox = keywordSection.querySelector('.keyword-text-box')
      if (textBox) {
        const textBoxRect = textBox.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        const currentScrollY = window.scrollY
        
        // Center the text box vertically in the viewport
        const textBoxTop = textBoxRect.top + currentScrollY
        const textBoxHeight = textBoxRect.height
        const targetScrollY = textBoxTop - (viewportHeight / 2) + (textBoxHeight / 2)
        
        // Use custom smooth scroll with easing
        const startScrollY = window.scrollY
        const distance = targetScrollY - startScrollY
        const duration = 1200 // 1.2 seconds for smooth scroll
        const startTime = performance.now()
        
        const animateScroll = (currentTime: number) => {
          const elapsed = currentTime - startTime
          const progress = Math.min(elapsed / duration, 1)
          
          // Ease in-out cubic for smooth acceleration and deceleration
          const easeInOutCubic = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2
          
          const currentScroll = startScrollY + (distance * easeInOutCubic)
          
          window.scrollTo(0, currentScroll)
          
          if (progress < 1) {
            requestAnimationFrame(animateScroll)
          } else {
            isLoadingKeyword.value = false
          }
        }
        
        requestAnimationFrame(animateScroll)
      } else {
        // Fallback: scroll to the section itself if text box not found
        const sectionRect = keywordSection.getBoundingClientRect()
        const targetScrollY = sectionRect.top + window.scrollY - (window.innerHeight / 2) + (sectionRect.height / 2)
        
        window.scrollTo({
          top: targetScrollY,
          behavior: 'smooth'
        })
        
        setTimeout(() => {
          isLoadingKeyword.value = false
        }, 1200)
      }
    } else {
      console.error(`Keyword section not found: keyword-${keyword}`)
      isLoadingKeyword.value = false
    }
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

  // Reset loading state when search changes
  isLoadingKeyword.value = false

  // If search is empty, clear results immediately
  if (!searchQuery.value.trim()) {
    performSearch()
    setActiveKeyword(null)
    return
  }

  // Debounce the search - wait 400ms after user stops typing
  searchDebounceTimeout = window.setTimeout(() => {
    performSearch()
  }, 400)
})

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  if (searchDebounceTimeout) {
    clearTimeout(searchDebounceTimeout)
  }
})
</script>

<template>
  <div class="search-container" :class="{ 
    'match-found': matchFound
  }">
      <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="Search..."
        @keydown.enter.prevent="shouldShowNotFound ? handleNotFoundClick() : navigateToNextMatch()"
      />
      <!-- Fixed-width container for button swapping -->
      <div class="search-buttons-container">
        <!-- Navigation buttons - shown by default, hidden when keyword matches -->
        <div 
          class="search-navigation"
          :class="{ 'is-active': !shouldShowNotFound }"
        >
          <button 
            @click="navigateToPreviousMatch" 
            class="button button--nav button--arrow"
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
            class="button button--nav button--arrow"
            :disabled="totalMatches === 0"
            title="Next match (↓)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
        </div>
        <!-- Not found button - shown when keyword matches -->
        <button 
          class="button button--nav button--not-found not-found-button"
          :class="{ 'is-active': shouldShowNotFound }"
          @click="handleNotFoundClick"
          :disabled="isLoadingKeyword"
        >
        <span class="not-found-text">
          <span class="not-text" :class="{ 'strikethrough': isKeywordActive && !isLoadingKeyword }">
            <span>n</span>
            <span v-if="isLoadingKeyword" class="spinner-wrapper">
              <svg 
                class="spinner-icon" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
            </span>
            <span v-else>o</span>
            <span>t</span>
          </span>
          <span class="found-text">found</span>
        </span>
      </button>
      </div>
  </div>
</template>

<style scoped>
.search-container {
  overflow: visible;
  position: relative;
  display: flex;
  align-items: stretch; /* Stretch children to full height */
  gap: 0.5rem;
  width: fit-content;
  margin-left: auto; /* Right-align in flex container */
  padding: var(--search-container-padding-vertical, 1rem) 0; /* Vertical padding from CSS variable */
  /* CSS variables for button container width and parent padding */
  --buttons-width: 120px; /* Width of buttons container (matches not-found-button width) */
  /* Default: buttons hidden off-screen to the right (accounting for parent padding) */
  transform: translate3d(calc(var(--buttons-width) + var(--nav-padding-right, 2rem)), 0, 0);
  /* Smooth transition for slide animation */
  transition: transform 0.5s cubic-bezier(0.65, 0, 0.35, 1);
  /* GPU acceleration hints */
  will-change: transform;
  backface-visibility: hidden;
  perspective: 1000px;
}

/* Match found - slide left to reveal buttons */
.search-container.match-found {
  transform: translate3d(0, 0, 0);
}

/* Fixed-width container for button swapping */
.search-buttons-container {
  width: var(--buttons-width);
  position: relative;
  margin-left: 0.25rem;
  display: flex;
  align-items: stretch; /* Stretch to match input height */
  height: 100%; /* Match search container height */
}

.search-navigation {
  display: flex;
  align-items: center; /* Center buttons vertically */
  gap: 0.25rem;
}

.search-navigation:not(.is-active) {
  display: none;
}

.match-count {
  font-family: var(--font-monospace);
  font-size: 0.75rem;
  color: var(--color-text-primary);
  min-width: 2.5rem;
  text-align: center;
  font-weight: 500;
  display: flex;
  align-items: center; /* Vertically center text */
  justify-content: center;
}

.search-icon {
  color: var(--color-text-primary);
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  align-self: center; /* Vertically center icon (don't stretch SVG) */
}

.search-input {
  background: transparent;
  border: 1px solid var(--color-border-primary);
  color: var(--color-text-primary);
  font-family: var(--font-monospace);
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.2; /* Tighter line-height for better vertical centering */
  padding: 0.5rem 0.75rem;
  width: 150px;
  height: 100%; /* Stretch to full height of container */
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box; /* Include border in height calculation */
}

.search-input:focus {
  border-color: var(--color-heading);
}

.search-input::placeholder {
  color: var(--color-text-primary);
  opacity: 0.5;
}

/* Component-specific positioning styles */
.not-found-button {
  display: none;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%; /* Match parent container height */
}

.not-found-button.is-active {
  display: flex;
}

.not-found-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  width: 100%; /* Ensure full width for centering */
}

.not-text {
  display: inline-flex;
  align-items: center;
  margin-right: 0.25rem;
}

.spinner-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1ch;
  height: 1em;
  vertical-align: baseline;
}

.spinner-icon {
  width: 0.875em;
  height: 0.875em;
}

.not-text.strikethrough {
  text-decoration: line-through;
}

.spinner-icon {
  animation: spin 1s linear infinite;
  color: var(--color-white);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .search-container {
    width: 100%;
    justify-content: center;
    transform: translate3d(0, 0, 0);
  }

  .search-input {
    width: 150px;
  }
}
</style>

