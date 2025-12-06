<script setup lang="ts">
import { ref } from 'vue'
import { useParallax } from '../composables/useParallax'

const BACKGROUND_IMAGE_PATH = '/bg.jpg'

const backgroundRef = ref<HTMLElement | null>(null)
useParallax(backgroundRef, BACKGROUND_IMAGE_PATH)
</script>

<template>
  <div ref="backgroundRef" class="background"></div>
</template>

<style scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  background-image: url('/bg.jpg');
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  background-attachment: scroll;
  z-index: -1;
  /* GPU acceleration optimizations */
  will-change: transform;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
  /* Ensure background extends beyond viewport to prevent white showing */
  min-width: 100%;
  /* Ensure it covers the full viewport at all times */
  background-color: transparent;
  /* Height will be dynamically updated via JS to accommodate parallax */
}
</style>

