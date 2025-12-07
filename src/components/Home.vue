<script setup lang="ts">
import { ref } from 'vue'
import { useElementParallax } from '../composables/useElementParallax'

const leftBoxRef = ref<HTMLElement | null>(null)
const rightBoxRef = ref<HTMLElement | null>(null)

// Apply parallax with different multipliers for each box
useElementParallax(leftBoxRef, 0.1)
useElementParallax(rightBoxRef, 0.15)

const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId)
  if (section) {
    // Find the text-box inside the section - this accounts for parallax transforms
    const textBox = section.querySelector('.text-box') as HTMLElement
    
    if (textBox) {
      // Get the current visual position of the text-box (accounting for parallax)
      const textBoxRect = textBox.getBoundingClientRect()
      const textBoxTop = textBoxRect.top + window.scrollY
      
      // Account for header offset and ensure good reading position
      const headerOffset = 100
      const targetScrollY = textBoxTop - headerOffset

      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth'
      })
    } else {
      // Fallback to section if text-box not found
      const headerOffset = 100
      const elementPosition = section.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }
}
</script>


<template>
  <section id="home" class="section section-full-height">
    <div class="text-box">
      <p>Therapy is a space for restoring trust in our instincts.</p>
      <p>From there, we find our way to action, pleasure, creativity, and rest.</p>
      <p>More and more, we allow ourselves to exist, connect with others, and become alive.</p>
    </div>
  </section>
    
  <section class="section section-full-height">
    <div class="boxes-container">
      <div ref="leftBoxRef" class="text-box box-left clickable-box" @click="scrollToSection('therapy')">
        <h3>Therapy</h3>
        <p>Whether you're experienced in doing this work or if you're coming to therapy for the first time, together we'll find our way into a conversation. Through conversation, the therapy emerges.</p>
        <div class="arrow-container">
          <svg width="98" height="98" viewBox="0 0 98 98" fill="none" xmlns="http://www.w3.org/2000/svg" class="arrow-icon">
            <path d="M49.0002 20.4167L49.0002 77.5834M49.0002 77.5834L77.5835 49M49.0002 77.5834L20.4168 49" stroke="#EECDBE" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      
      <div ref="rightBoxRef" class="text-box box-right clickable-box" @click="scrollToSection('emdr')">
        <h3>EMDR & Adjunctive</h3>
        <p>EMDR (Eye Movement Desensitization and Reprocessing) therapy targets traumatic stress symptoms. Specifically flashbacks, avoidance of triggers, and intrusive thoughts.</p>
        <p>If you are already in an ongoing therapy and want to add EMDR to your process, I offer adjunctive EMDR.</p>
        <div class="arrow-container">
          <svg width="98" height="98" viewBox="0 0 98 98" fill="none" xmlns="http://www.w3.org/2000/svg" class="arrow-icon">
            <path d="M49.0002 20.4167L49.0002 77.5834M49.0002 77.5834L77.5835 49M49.0002 77.5834L20.4168 49" stroke="#EECDBE" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section {
  margin-top: 0;
}

.section-full-height {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0;
}

.boxes-container {
  display: flex;
  gap: 0;
  justify-content: center;
  align-items: flex-start;
  margin: 0 auto;
  max-width: 1200px;
  padding: 0 2rem;
}

.text-box {
  flex: 1;
  max-width: 580px;
  will-change: transform;
  position: relative;
}

.clickable-box {
  cursor: pointer;
}

.box-left {
  margin-right: -1px;
}

.arrow-container {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 98px;
  height: 98px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  pointer-events: none;
}

.arrow-icon {
  width: 98px;
  height: 98px;
  transition: stroke 0.2s ease;
}

.clickable-box:hover .arrow-icon path {
  stroke: var(--color-black);
}

@media (max-width: 768px) {
  .boxes-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .text-box {
    max-width: 100%;
  }
}
</style>

