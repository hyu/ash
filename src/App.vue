<script setup lang="ts">
import ParallaxBackground from './components/ParallaxBackground.vue'
import HeroSection from './components/HeroSection.vue'
import HomeSection from './components/HomeSection.vue'
import TherapySection from './components/TherapySection.vue'
import EMDRSection from './components/EMDRSection.vue'
import AboutSection from './components/AboutSection.vue'
</script>

<template>
  <ParallaxBackground />
  <div class="app">
    <HeroSection />
    <HomeSection />
    <TherapySection />
    <EMDRSection />
    <AboutSection />
  </div>
</template>

<style scoped>
.app {
  position: relative;
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
}
</style>
