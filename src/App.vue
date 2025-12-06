<script setup lang="ts">
import ParallaxBackground from './components/ParallaxBackground.vue'
import Hero from './components/Hero.vue'
import Home from './components/Home.vue'
import Therapy from './components/Therapy.vue'
import EMDR from './components/EMDR.vue'
import About from './components/About.vue'
</script>

<template>
  <ParallaxBackground />
  <div class="app">
    <Hero />
    <Home />
    <Therapy />
    <EMDR />
    <About />
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
