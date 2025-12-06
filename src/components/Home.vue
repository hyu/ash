<script setup lang="ts">
import { ref } from 'vue'
import { useElementParallax } from '../composables/useElementParallax'

const leftBoxRef = ref<HTMLElement | null>(null)
const rightBoxRef = ref<HTMLElement | null>(null)

// Apply parallax with different multipliers for each box
useElementParallax(leftBoxRef, 0.1)
useElementParallax(rightBoxRef, 0.15)
</script>


<template>
  <section class="section">
    <div class="text-box">
      <p>Therapy is a space for restoring trust in our instincts.</p>
      <p>From there, we find our way to action, pleasure, creativity, and rest.</p>
      <p>More and more, we allow ourselves to exist, connect with others, and become alive.</p>
    </div>
    
    <div class="boxes-container">
      <div ref="leftBoxRef" class="text-box box-left">
        <h3>Therapy</h3>
        <p>Whether you're experienced in doing this work or if you're coming to therapy for the first time, together we'll find our way into a conversation. Through conversation, the therapy emerges. Learn more.</p>
      </div>
      
      <div ref="rightBoxRef" class="text-box box-right">
        <h3>EMDR & Adjunctive</h3>
        <p>EMDR (Eye Movement Desensitization and Reprocessing) therapy targets traumatic stress symptoms. Specifically flashbacks, avoidance of triggers, and intrusive thoughts.</p>
        <p>If you are already in an ongoing therapy and want to add EMDR to your process, I offer adjunctive EMDR. Learn more.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section {
  margin-bottom: 3rem;
}

.boxes-container {
  display: flex;
  gap: 0;
  justify-content: center;
  align-items: flex-start;
  margin: 40rem auto 4rem;
  max-width: 1200px;
  padding: 0 2rem;
}

.text-box {
  flex: 1;
  max-width: 580px;
  will-change: transform;
}

.box-left {
  margin-right: -1px;
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

