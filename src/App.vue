<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

// Constants
const PARALLAX_MULTIPLIER = 0.08
const EASING_FACTOR = 0.08
const SNAP_THRESHOLD = 0.01
const BACKGROUND_IMAGE_PATH = '/bg.jpg'

// Template refs
const backgroundRef = ref<HTMLElement | null>(null)

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
  img.src = BACKGROUND_IMAGE_PATH
  
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
</script>

<template>
  <div ref="backgroundRef" class="background"></div>
  <div class="app">
    <!-- Hero Section with Styled Box -->
    <section class="hero-section">
      <div class="hero-box">
        <h1 class="hero-name">Ash Martin, LCSW</h1>
        <p class="hero-line">In-person Therapy & EMDR</p>
        <p class="hero-line">Greenpoint / Williamsburg, NYC</p>
      </div>
    </section>

    <!-- Home Section -->
    <section class="section">
      <h2>Home</h2>
      
      <p><strong>ASH MARTIN, LCSW</strong></p>
      <p><strong>IN-PERSON THERAPY & EMDR</strong></p>
      <p><strong>GREENPOINT / WILLIAMSBURG, NYC</strong></p>
      
      <p>Therapy is a space for restoring trust in our instincts.</p>
      
      <p>From there, we find our way to action, pleasure, creativity, and rest.</p>
      
      <p>More and more, we allow ourselves to exist, connect with others, and become alive.</p>
      
      <h3>Offering - Therapy</h3>
      
      <p>Whether you're experienced in doing this work or if you're coming to therapy for the first time, together we'll find our way into a conversation. Through conversation, the therapy emerges. Learn more.</p>
      
      <h3>Offering - EMDR</h3>
      
      <p>EMDR (Eye Movement Desensitization and Reprocessing) therapy targets traumatic stress symptoms. Specifically flashbacks, avoidance of triggers, and intrusive thoughts.</p>
      
      <p>If you are already in an ongoing therapy and want to add EMDR to your process, I offer adjunctive EMDR. Learn more.</p>
    </section>

    <!-- Therapy Section -->
    <section class="section">
      <h2>Therapy</h2>
      
      <p><strong>INDIVIDUAL THERAPY</strong></p>
      <p>Whether you're experienced doing this work or if you're trying therapy for the first time, together we'll find our way into a conversation. Through conversation, the therapy emerges.</p>
      
      <p>In individual therapy we meet one or more times weekly. I work with adults age 18 and up. Reach out to schedule a consultation.</p>
      
      <p><strong>STYLE</strong></p>
      <p>In our conversation, I tend to be an active participant while making a lot of space for you to explore.</p>
      
      <p>I weave together the two therapeutic styles that I actively train in:</p>
      
      <p>The first is psychodynamic, with the focus on your history, relationships, personality, style of conversing, dreams, and fantasies.</p>
      
      <p>The second is a more directed, body-oriented approach, sometimes referred to as "experiential therapy" or "trauma therapy."</p>
      
      <p>I am queer- and trans-affirming, and experienced working with people in non-monogamous relationship structures.</p>
      
      <p>I also offer EMDR (Eye Movement Desensitization and Reprocessing), learn more.</p>
      
      <p><strong>IN-PERSON</strong></p>
      <p>My practice is fully in-person. Office is on the Greenpoint / Williamsburg border in Brooklyn</p>
      
      <p>5-minute walk from the Nassau Avenue G Train, and a 20-minute walk from the Bedford Avenue L Train</p>
      
      <p>Virtual sessions are available when illness, travel, or emergencies prevent us from being in-person.</p>
    </section>

    <!-- EMDR & Adjunctive Treatment Section -->
    <section class="section">
      <h3>EMDR & ADJUNCTIVE TREATMENT</h3>
      
      <p><strong>WHAT IS EMDR?</strong></p>
      <p>EMDR (Eye Movement Desensitization and Reprocessing) therapy was developed to address traumatic stress symptoms, specifically flashbacks, avoidance of triggers, and intrusive thoughts. These days, EMDR is used to target many types of symptoms.</p>
      
      <p>EMDR differs from talk therapy in that it is more directive, and in fact, often the less you talk during reprocessing, the more effective EMDR tends to be. Learn more below and reach out to schedule a consultation.</p>
      
      <p><strong>ADJUNCTIVE EMDR THERAPY</strong></p>
      <p>If you are already in an ongoing therapy and want to do EMDR, I offer adjunctive therapy. You continue to work with your primary therapist and add-on EMDR. The adjunctive therapy is supportive of the primary therapy and we all work together toward a common purpose.</p>
      
      <p>Time: For adjunctive EMDR, we meet anywhere from one session, up to a full year of sessions. We meet every week because continuity is essential to progress in EMDR. We work together for a year maximum because doing trauma work is exhausting. Rest is essential for transformation and after a year we definitely need to rest.</p>
      
      <p>Collaboration: During adjunctive treatment, the primary therapy continues without interruption. An important aspect of adjunctive work is collaboration between the two therapists.</p>
      
      <p><strong>WHAT HAPPENS IN EMDR?</strong></p>
      <p>Resources and History: We first identify your resources and strengths, your hopes for treatment, and go over your history. You do not have to discuss details of traumatic episodes.</p>
      
      <p>Preparation: We work together to help you to feel more solid and grounded in your day to day. Sometimes an EMDR treatment is entirely focused on preparation, and people find this very useful. This might look like working on decreasing dissociation, or tracking exactly what happens in the body when you're triggered so that you can begin to interrupt the cycles.</p>
      
      <p>Reprocessing: If we continue on to reprocessing the memories, together we choose "targets" to work with. Often this is a past memory, but EMDR can also work with present-day symptoms and future fears. We work with one target at a time and use "bilateral stimulation" (e.g. eye movements or tapping) to reduce the distress. Then we work on transforming the way that the memory is held in the body.</p>
      
      <p>We go at a pace that works for you; slow is smooth, smooth is fast.</p>
      
      <p><strong>WHO BENEFITS FROM EMDR?</strong></p>
      <p>EMDR can be useful when any of the following arise:</p>
      
      <p>You're having flashbacks to distressing memories or avoiding people/places/things/emotions that remind you of the memories</p>
      
      <p>You want to work on trauma memories, but you don't want to talk about them, or even think much about them (there are techniques in EMDR where memories are barely talked/thought about)</p>
      
      <p>You're persistently triggered, flashing back, or severely dissociated in your primary therapy; you're unable to make use of primary therapy because you are too overwhelmed</p>
      
      <p>You're experiencing overwhelming "somatic flashbacks" where it feels as though you're no longer in the present</p>
      
      <p>You're afraid of your emotions and want to practice getting more comfortable with them</p>
      
      <p>You're dissociating excessively in your day to day life (dissociation is a normal and essential part of being alive, but sometimes we overcompensate with dissociation and miss out on other ways of participating in life)</p>
      
      <p>You want the experience of having two clinicians working together to support your process</p>
      
      <p>You're worried that seeking additional support isn't warranted because your history is "not traumatic enough"</p>
      
      <p>You've heard about EMDR and are curious about it</p>
      
      <p><strong>USING YOUR OUT OF NETWORK BENEFITS</strong></p>
      <p>Typically, if your insurance reimburses your primary therapy, it is likely to reimburse adjunctive EMDR, too. I recommend that you reach out to the insurance company to confirm.</p>
      
      <p>Be sure to schedule your primary therapy and your EMDR session on different days, as insurance will only cover one mental health service per calendar day. This counts for psychiatry appointments too.</p>
      
      <p><strong>MY EXPERIENCE PROVIDING EMDR</strong></p>
      <p>After completing the required training to practice EMDR, I trained and worked at an EMDR clinic, the Trauma Treatment Center at the National Institute for the Psychotherapies (NIP) in Manhattan. The focus at NIP is to provide attuned, attachment-oriented care to people with both complex and single-incident traumas.</p>
      
      <p><strong>A WORD ABOUT EMDR...</strong></p>
      <p>I find that some people really like reprocessing, and other people prefer a different approach to working on these symptoms. All bodies truly are different. In treatment, we can work toward your goals with a range of techniques, including "parts" work and somatic exercises. We take the time to learn how EMDR feels for you, and pivot creatively as we go.</p>
      
      <p><strong>IN-PERSON</strong></p>
      <p>My practice is fully in-person. Office is on the Greenpoint / Williamsburg border in Brooklyn</p>
      
      <p>5-minute walk from the Nassau Avenue G Train, and a 20-minute walk from the Bedford Avenue L Train</p>
      
      <p>Virtual sessions are available when illness, travel, or emergencies prevent us from being in-person.</p>
    </section>

    <!-- About Section -->
    <section class="section">
      <h2>About</h2>
      
      <p><strong>ABOUT</strong></p>
      <p>I'm a licensed clinical social worker (LCSW). Much of my training is psychoanalytically oriented, and I trained and worked at the EMDR Trauma Treatment Center at the National Institute for the Psychotherapies.</p>
      
      <p>I offer supervision to early career therapists and social work graduate students, and am SIFI certified. I also enjoy teaching clinicians. Recently I've taught seminars on conducting trauma-informed intakes, and on the value of patients' right to refuse aspects of EMDR therapy.</p>
      
      <p>Reach out to schedule a consultation.</p>
      
      <p><strong>INSURANCE</strong></p>
      <p>I will work with you to use your out-of-network benefits. I provide you with a superbill to submit to your insurance to be reimbursed either all or a portion of the fee.</p>
      
      <p><strong>IN PERSON</strong></p>
      <p>My practice is fully in-person. Office is on the Greenpoint / Williamsburg border in Brooklyn</p>
      
      <p>5-minute walk from the Nassau Avenue G Train, and a 20-minute walk from the Bedford Avenue L Train</p>
      
      <p>Virtual sessions are available when illness, travel, or emergencies prevent us from being in-person.</p>
    </section>
  </div>
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

.app {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.hero-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  margin-bottom: 3rem;
}

.hero-box {
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 4rem 3rem;
  text-align: center;
  width: 100%;
  max-width: 90%;
}

.hero-name {
  font-family: 'Karla', sans-serif;
  font-weight: 800;
  font-size: 80px;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: #0c343d;
}

.hero-line {
  font-family: 'Figtree', sans-serif;
  font-weight: 500;
  font-size: 50px;
  line-height: 1.4;
  margin-bottom: 0.5rem;
  color: #0c343d;
}

.hero-line:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .hero-box {
    padding: 3rem 2rem;
    max-width: 95%;
  }

  .hero-name {
    font-size: 50px;
  }

  .hero-line {
    font-size: 32px;
  }
}

@media (max-width: 480px) {
  .hero-box {
    padding: 2rem 1.5rem;
  }

  .hero-name {
    font-size: 36px;
  }

  .hero-line {
    font-size: 24px;
  }
}

.section {
  margin-bottom: 3rem;
}

.section h2 {
  font-size: 2em;
  margin-bottom: 1rem;
}

.section h3 {
  font-size: 1.5em;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.section p {
  margin-bottom: 1rem;
  line-height: 1.6;
}
</style>
