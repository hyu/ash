import { onMounted, onUnmounted, type Ref } from 'vue'

export function useElementParallax(elementRef: Ref<HTMLElement | null>, multiplier: number = 0.1) {
  let scrollHandler: (() => void) | null = null
  let rafId: number | null = null

  const updateParallax = () => {
    if (!elementRef.value) {
      rafId = null
      return
    }

    const scrollY = window.pageYOffset || window.scrollY
    const windowHeight = window.innerHeight
    
    const elementRect = elementRef.value.getBoundingClientRect()
    const elementTop = elementRect.top + scrollY
    const elementCenter = elementTop + elementRect.height / 2
    const viewportCenter = scrollY + windowHeight / 2
    
    // Calculate distance from viewport center
    const distanceFromCenter = elementCenter - viewportCenter
    
    // Apply parallax multiplier
    const parallaxOffset = distanceFromCenter * multiplier
    
    elementRef.value.style.transform = `translate3d(0, ${parallaxOffset}px, 0)`
    
    rafId = requestAnimationFrame(updateParallax)
  }

  const handleScroll = () => {
    if (rafId === null) {
      rafId = requestAnimationFrame(updateParallax)
    }
  }

  const cleanup = () => {
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler)
    }
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  onMounted(() => {
    scrollHandler = handleScroll
    window.addEventListener('scroll', scrollHandler, { passive: true })
    updateParallax()
  })

  onUnmounted(cleanup)
}

