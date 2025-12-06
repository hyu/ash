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
    <section class="section">
      <div class="text-box text-box-left">
        <h3>In-Person</h3>
        <p>My practice is fully in-person. Office is on the Greenpoint / Williamsburg border in Brooklyn</p>
        <p>5-minute walk from the Nassau Avenue G Train, and a 20-minute walk from the Bedford Avenue L Train</p>
        <p>Virtual sessions are available when illness, travel, or emergencies prevent us from being in-person.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.app {
  position: relative;
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
}

.section {
  margin-bottom: 3rem;
}
</style>
