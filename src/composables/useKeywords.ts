import { ref } from 'vue'

// Shared state for keyword visibility
export const activeKeyword = ref<string | null>(null)
export const keywordJustRevealed = ref(false)
export const isScrollingToKeyword = ref(false)

export function setActiveKeyword(keyword: string | null) {
  activeKeyword.value = keyword
  if (keyword) {
    keywordJustRevealed.value = true
    isScrollingToKeyword.value = true
    // Reset the flags after a delay to allow scrolling to happen
    setTimeout(() => {
      keywordJustRevealed.value = false
      isScrollingToKeyword.value = false
    }, 3000) // 3 seconds grace period for scrolling
  } else {
    keywordJustRevealed.value = false
    isScrollingToKeyword.value = false
  }
}

