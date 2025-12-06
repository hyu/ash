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
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.5);
  padding: 6rem 7rem;
  text-align: center;
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

.hero-name {
  font-family: 'Karla', sans-serif;
  font-weight: 800;
  font-size: 70px;
  line-height: 1.2;
  margin: 0;
  color: #0C343D;
  text-transform: uppercase;
}

.hero-line {
  font-family: 'Figtree', sans-serif;
  font-weight: 500;
  font-size: 40px;
  line-height: 1;
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
    line-height: 44.8px; /* 70/50 * 32 = 1.4 multiplier */
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
    line-height: 33.6px; /* 70/50 * 24 = 1.4 multiplier */
  }
}
</style>

