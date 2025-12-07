<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { activeKeyword, setActiveKeyword, keywordJustRevealed, isScrollingToKeyword } from '../composables/useKeywords'
import { keywords, keywordKeys } from '../data/keywords'

let lastScrollY = window.scrollY

// Get all keyword section positions
const getKeywordSectionPositions = () => {
  const positions: Array<{ id: string; top: number; bottom: number }> = []
  keywordKeys.forEach(keyword => {
    const element = document.getElementById(`keyword-${keyword}`)
    if (element) {
      const rect = element.getBoundingClientRect()
      positions.push({
        id: keyword,
        top: rect.top + window.scrollY,
        bottom: rect.bottom + window.scrollY
      })
    }
  })
  return positions
}

const handleScroll = (e?: Event) => {
  const currentScrollY = window.scrollY
  const scrollDelta = Math.abs(currentScrollY - lastScrollY)
  
  // If we're programmatically scrolling to a keyword, allow it
  if (isScrollingToKeyword.value) {
    lastScrollY = currentScrollY
    return
  }
  
  // Prevent scrolling into keyword sections if they're not active
  if (!activeKeyword.value) {
    const positions = getKeywordSectionPositions()
    
    for (const pos of positions) {
      // If trying to scroll into a keyword section area
      if (currentScrollY >= pos.top - 100 && currentScrollY <= pos.bottom + 100) {
        // Prevent scrolling - snap back to before the section
        e?.preventDefault()
        window.scrollTo({
          top: pos.top - 100,
          behavior: 'auto'
        })
        lastScrollY = pos.top - 100
        return
      }
    }
  }
  
  lastScrollY = currentScrollY
  
  // Don't hide if keyword was just revealed (give it time to scroll into view)
  // Also ignore tiny scroll movements that might happen during animations
  if (keywordJustRevealed.value || scrollDelta < 10) {
    return
  }
  
  // Only check if there's an active keyword
  if (activeKeyword.value) {
    const sectionId = `keyword-${activeKeyword.value}`
    const element = document.getElementById(sectionId)
    
    if (element) {
      const rect = element.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      
      // If section is completely out of viewport (above or below)
      // Hide it when scrolled away (but only if it wasn't just revealed)
      // Add some buffer to prevent hiding during smooth scrolling
      const buffer = 100
      if (rect.bottom < -buffer || rect.top > viewportHeight + buffer) {
        setActiveKeyword(null)
      }
    }
  }
}

// Prevent wheel scrolling into keyword sections
const handleWheel = (e: WheelEvent) => {
  if (!activeKeyword.value) {
    const positions = getKeywordSectionPositions()
    const currentScrollY = window.scrollY
    const deltaY = e.deltaY
    
    for (const pos of positions) {
      const willScrollInto = (currentScrollY + deltaY >= pos.top - 100 && 
                              currentScrollY + deltaY <= pos.bottom + 100)
      
      if (willScrollInto) {
        e.preventDefault()
        // Allow scrolling up past the section, but not down into it
        if (deltaY > 0 && currentScrollY < pos.top - 100) {
          window.scrollTo({
            top: pos.top - 100,
            behavior: 'smooth'
          })
        }
        return false
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: false })
  window.addEventListener('wheel', handleWheel, { passive: false })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('wheel', handleWheel)
})

// Watch for when keyword becomes active to allow scrolling
watch(activeKeyword, (newKeyword) => {
  if (newKeyword) {
    isScrollingToKeyword.value = true
    // Reset flag after scrolling completes
    setTimeout(() => {
      isScrollingToKeyword.value = false
    }, 2000)
  }
})
</script>

<template>
  <template v-for="keyword in keywordKeys" :key="keyword">
    <section 
      :id="`keyword-${keyword}`" 
      class="section keyword-section"
      :class="{ 'is-visible': activeKeyword === keyword }"
    >
      <div class="keyword-section-background">
        <div class="text-box keyword-text-box">
          <div class="keyword-content" v-html="keywords[keyword]"></div>
        </div>
      </div>
    </section>
  </template>
</template>

<style scoped>
.keyword-section {
  max-height: 0;
  opacity: 0;
  visibility: hidden;
  overflow: hidden;
  margin-top: 0;
  margin-bottom: 0;
  transition: max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.5s ease-out 0.15s,
              visibility 0s linear 0.6s,
              margin 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.keyword-section.is-visible {
  max-height: 200vh; /* Large enough to fit content */
  opacity: 1;
  visibility: visible;
  margin-top: var(--layout-section-gap);
  margin-bottom: 3rem;
  transition: max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.5s ease-out 0.1s,
              visibility 0s linear 0s,
              margin 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.keyword-section-background {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.keyword-text-box {
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border-primary);
  padding: 4rem 5rem;
  margin: 0 auto;
  max-width: 36.25rem;
  width: 100%;
}

.keyword-content {
  font-family: var(--font-body);
  font-weight: var(--font-weight-normal);
  font-size: var(--font-size-body);
  line-height: var(--line-height-body);
  color: var(--color-text-primary);
}

.keyword-content p {
  margin: 0 0 1em 0;
}

.keyword-content p:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .keyword-text-box {
    padding: 2rem 2rem;
  }
  
  .keyword-content {
    font-size: 1.25rem;
  }
}
</style>

