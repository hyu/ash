<script setup lang="ts">

const scrollToContact = () => {
  const element = document.getElementById('contact')
  if (!element) return
  
  const headerOffset = 100
  const elementPosition = element.getBoundingClientRect().top
  const offsetPosition = elementPosition + window.scrollY - headerOffset
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  })
}
</script>

<template>
  <section id="therapy" class="section">
    <div class="text-box text-box-left text-box--therapy">
      <h3>Individual Therapy</h3>
      <p>Whether you're experienced doing this work or if you're trying therapy for the first time, together we'll find our way into a conversation. Through conversation, the therapy emerges.</p>      
      <p>In individual therapy we meet one or more times weekly. I work with adults age 18 and up. <a href="#" @click.prevent="scrollToContact" class="cta-link">Reach out</a> to schedule a consultation.</p>
      
      <h3>Style</h3>
      <p>In our conversation, I tend to be an active participant while making a lot of space for you to explore.</p>      
      <p>I weave together the two therapeutic styles that I actively train in:</p>      
      <p>The first is psychodynamic, with the focus on your history, relationships, personality, style of conversing, dreams, and fantasies.</p>
      <p>The second is a more directed, body-oriented approach, sometimes referred to as "experiential therapy" or "trauma therapy."</p>      
      <p>I am queer- and trans-affirming, and experienced working with people in non-monogamous relationship structures.</p> 
      <p>I also offer EMDR (Eye Movement Desensitization and Reprocessing), learn more.</p>
    </div>
  </section>
</template>


