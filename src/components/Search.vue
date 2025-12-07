<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Mark from 'mark.js'

const searchQuery = ref('')
const currentMatchIndex = ref(-1)
const totalMatches = ref(0)
let searchDebounceTimeout: number | null = null
let markInstance: Mark | null = null
let markedElements: HTMLElement[] = []

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
</template>

<style scoped>
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

