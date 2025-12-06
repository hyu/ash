import { onMounted, onUnmounted, ref, type Ref } from 'vue'

// Constants
const PARALLAX_MULTIPLIER = 0.08
const EASING_FACTOR = 0.08
const SNAP_THRESHOLD = 0.01

export function useParallax(backgroundRef: Ref<HTMLElement | null>, imagePath: string) {
  // State
  const maxParallaxOffset = ref(0)
  let imageNaturalWidth = 0
  let imageNaturalHeight = 0
  let currentParallaxOffset = 0
  let targetParallaxOffset = 0
  let isAnimating = false
  let rafId: number | null = null

  // Handlers
  let scrollHandler: (() => void) | null = null
  let resizeHandler: (() => void) | null = null

  const calculateScaledImageHeight = (): number => {
    const { innerHeight: viewportHeight, innerWidth: viewportWidth } = window
    const imageAspectRatio = imageNaturalWidth / imageNaturalHeight
    const viewportAspectRatio = viewportWidth / viewportHeight
    
    // When using cover: if image is wider, height determines scale; otherwise width does
    return imageAspectRatio > viewportAspectRatio
      ? viewportHeight
      : viewportWidth / imageAspectRatio
  }

  const updateBackgroundHeight = (): void => {
    if (!backgroundRef.value) return
    
    const viewportHeight = window.innerHeight
    // Make background tall enough to cover viewport + parallax movement
    const extraHeight = maxParallaxOffset.value || 0
    backgroundRef.value.style.height = `${viewportHeight + extraHeight}px`
  }

  const calculateMaxParallax = (): void => {
    if (imageNaturalWidth === 0 || imageNaturalHeight === 0) return
    
    const viewportHeight = window.innerHeight
    const scaledImageHeight = calculateScaledImageHeight()
    
    // Max parallax offset is the difference between scaled image height and viewport
    maxParallaxOffset.value = Math.max(0, scaledImageHeight - viewportHeight)
    updateBackgroundHeight()
  }

  const updateParallaxPosition = (): void => {
    if (!backgroundRef.value) {
      rafId = null
      isAnimating = false
      return
    }
    
    const difference = targetParallaxOffset - currentParallaxOffset
    
    if (Math.abs(difference) < SNAP_THRESHOLD) {
      currentParallaxOffset = targetParallaxOffset
      isAnimating = false
      rafId = null
    } else {
      currentParallaxOffset += difference * EASING_FACTOR
      rafId = requestAnimationFrame(updateParallaxPosition)
    }
    
    // Use transform instead of backgroundPositionY for GPU acceleration
    backgroundRef.value.style.transform = `translate3d(0, ${-currentParallaxOffset}px, 0)`
  }

  const startAnimation = (): void => {
    if (!isAnimating && rafId === null) {
      isAnimating = true
      rafId = requestAnimationFrame(updateParallaxPosition)
    }
  }

  const handleScroll = (): void => {
    const scrolled = window.pageYOffset || window.scrollY
    targetParallaxOffset = Math.min(scrolled * PARALLAX_MULTIPLIER, maxParallaxOffset.value)
    startAnimation()
  }

  const handleResize = (): void => {
    calculateMaxParallax()
    handleScroll()
  }

  const cleanup = (): void => {
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler)
    }
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler)
    }
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    isAnimating = false
  }

  onMounted(() => {
    const img = new Image()
    img.src = imagePath
    
    img.onload = () => {
      if (!backgroundRef.value) return
      
      imageNaturalWidth = img.naturalWidth
      imageNaturalHeight = img.naturalHeight
      
      calculateMaxParallax()
      updateBackgroundHeight()
      
      // Set up handlers
      scrollHandler = handleScroll
      resizeHandler = handleResize
      
      // Attach event listeners
      window.addEventListener('scroll', scrollHandler, { passive: true })
      window.addEventListener('resize', resizeHandler, { passive: true })
      
      // Initial update
      handleScroll()
    }
    
    img.onerror = () => {
      console.error('Failed to load background image')
    }
  })

  onUnmounted(cleanup)

  return {
    maxParallaxOffset
  }
}

