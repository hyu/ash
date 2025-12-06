<template>
  <section class="hero-section">
    <div class="hero-box">
      <h1 class="hero-name">Ash Martin, LCSW</h1>
      <p class="hero-line">In-person Therapy & EMDR</p>
      <p class="hero-line">Greenpoint / Williamsburg, NYC</p>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 0;
  margin-bottom: 3rem;
}

.hero-box {
  background-color: var(--color-hero-box-bg);
  border: 1px solid var(--color-hero-box-border);
  padding: 6rem 7rem;
  text-align: center;
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

.hero-name {
  font-family: var(--font-heading);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-hero-name);
  line-height: var(--line-height-heading);
  margin: 0;
  color: var(--color-hero-text);
  text-transform: uppercase;
}

.hero-line {
  font-family: var(--font-body);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-hero-line);
  line-height: var(--line-height-hero);
  color: var(--color-hero-text);
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
    font-size: var(--font-size-hero-name-tablet);
  }

  .hero-line {
    font-size: var(--font-size-hero-line-tablet);
    line-height: 44.8px; /* 70/50 * 32 = 1.4 multiplier */
  }
}

@media (max-width: 480px) {
  .hero-box {
    padding: 2rem 1.5rem;
  }

  .hero-name {
    font-size: var(--font-size-hero-name-mobile);
  }

  .hero-line {
    font-size: var(--font-size-hero-line-mobile);
    line-height: 33.6px; /* 70/50 * 24 = 1.4 multiplier */
  }
}
</style>

