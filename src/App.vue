<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import ParallaxBackground from './components/ParallaxBackground.vue'
import Hero from './components/Hero.vue'
import Home from './components/Home.vue'
import Navigation from './components/Navigation.vue'
import KeywordSections from './components/KeywordSections.vue'

// Lazy load components that are below the fold
const Therapy = defineAsyncComponent(() => import('./components/Therapy.vue'))
const EMDR = defineAsyncComponent(() => import('./components/EMDR.vue'))
const About = defineAsyncComponent(() => import('./components/About.vue'))
const Location = defineAsyncComponent(() => import('./components/Location.vue'))
const Contact = defineAsyncComponent(() => import('./components/ContactForm.vue'))
</script>

<template>
  <ParallaxBackground />
  <div class="app">
    <Hero />
    <Home />
    <Therapy />
    <EMDR />
    <About />
    <Location />
    <Contact />
    <KeywordSections />
  </div>
  <Navigation />
</template>

<style scoped>
.app {
  position: relative;
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
}

</style>
