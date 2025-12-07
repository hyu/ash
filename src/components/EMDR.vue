<script setup lang="ts">
import { ref } from 'vue'
import { useElementParallax } from '../composables/useElementParallax'

// Parallax multiplier - adjust this to increase/decrease parallax effect
// Positive values move with scroll direction
const EMDR_PARALLAX_MULTIPLIER = 0.2

const emdrBoxRef = ref<HTMLElement | null>(null)

useElementParallax(emdrBoxRef, EMDR_PARALLAX_MULTIPLIER)
</script>

<template>
  <section id="emdr" class="section">
    <div ref="emdrBoxRef" class="text-box text-box-left text-box--emdr">
      <h3>What Is EMDR?</h3>
      <p>EMDR (Eye Movement Desensitization and Reprocessing) therapy was developed to address traumatic stress symptoms, specifically flashbacks, avoidance of triggers, and intrusive thoughts. These days, EMDR is used to target many types of symptoms.</p>
      <p>EMDR differs from talk therapy in that it is more directive, and in fact, often the less you talk during reprocessing, the more effective EMDR tends to be. Learn more below and reach out to schedule a consultation.</p>
      
      <h3>Adjunctive EMDR Therapy</h3>
      <p>If you are already in an ongoing therapy and want to do EMDR, I offer adjunctive therapy. You continue to work with your primary therapist and add-on EMDR. The adjunctive therapy is supportive of the primary therapy and we all work together toward a common purpose.</p>      
      <p>Time: For adjunctive EMDR, we meet anywhere from one session, up to a full year of sessions. We meet every week because continuity is essential to progress in EMDR. We work together for a year maximum because doing trauma work is exhausting. Rest is essential for transformation and after a year we definitely need to rest.</p>
      <p>Collaboration: During adjunctive treatment, the primary therapy continues without interruption. An important aspect of adjunctive work is collaboration between the two therapists.</p>
      
      <h3>What Happens in EMDR?</h3>
      <p>Resources and History: We first identify your resources and strengths, your hopes for treatment, and go over your history. You do not have to discuss details of traumatic episodes.</p>      
      <p>Preparation: We work together to help you to feel more solid and grounded in your day to day. Sometimes an EMDR treatment is entirely focused on preparation, and people find this very useful. This might look like working on decreasing dissociation, or tracking exactly what happens in the body when you're triggered so that you can begin to interrupt the cycles.</p>
      <p>Reprocessing: If we continue on to reprocessing the memories, together we choose "targets" to work with. Often this is a past memory, but EMDR can also work with present-day symptoms and future fears. We work with one target at a time and use "bilateral stimulation" (e.g. eye movements or tapping) to reduce the distress. Then we work on transforming the way that the memory is held in the body.</p>
      <p>We go at a pace that works for you; slow is smooth, smooth is fast.</p>
      
      <h3>Who Benefits from EMDR?</h3>
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
      
      <h3>Using Your Out of Network Benefits</h3>
      <p>Typically, if your insurance reimburses your primary therapy, it is likely to reimburse adjunctive EMDR, too. I recommend that you reach out to the insurance company to confirm.</p>
      <p>Be sure to schedule your primary therapy and your EMDR session on different days, as insurance will only cover one mental health service per calendar day. This counts for psychiatry appointments too.</p>
      
      <h3>My Experience Providing EMDR</h3>
      <p>After completing the required training to practice EMDR, I trained and worked at an EMDR clinic, the Trauma Treatment Center at the National Institute for the Psychotherapies (NIP) in Manhattan. The focus at NIP is to provide attuned, attachment-oriented care to people with both complex and single-incident traumas.</p>
      
      <h3>A Word About EMDR...</h3>
      <p>I find that some people really like reprocessing, and other people prefer a different approach to working on these symptoms. All bodies truly are different. In treatment, we can work toward your goals with a range of techniques, including "parts" work and somatic exercises. We take the time to learn how EMDR feels for you, and pivot creatively as we go.</p>
    </div>
  </section>
</template>

