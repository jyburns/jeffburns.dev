<template>
    <div class="hero">
        <h1 class="hero__title" v-html="theme.hero_title" />
        <div class="hero__image-container">
          <g-image class="hero__image" src="../../uploads/lily_pads.jpeg" alt="hero image"/>
        </div>
        <h2 class="hero__subtitle" v-html="theme.hero_subtitle" />
    </div>
</template>

<static-query>
query {
  theme(id: "primaryTheme") {
    hero_title
    hero_subtitle
    hero_image
  }
}

</static-query>

<script>
export default {
  data() {
    return {
      theme: require("../../data/theme.json")
    }
  }
}
</script>

<style>
.hero {
  text-align: center;
  width: 480px;
  max-width: 100%;
  margin: 0 auto;
}

.hero__title {
  font-size: 3rem;
  font-weight: 700;
  padding: 0;
  margin: 0 0 2rem 0;
}

.hero__image-container {
  display: flex;
  justify-content: center;
}

.hero__image {
  height: 14em;
  width: 14em;
  border: solid;
  border-radius: 50%;
  border-width: 0.25em;
  border-color: lightgray;
  overflow: hidden;
}

.hero__title p,
.hero__subtitle p {
  margin: 0;
  padding: 0;
}

.hero__subtitle {
  font-size: 1.15em;
  font-weight: 400;
  line-height: 1.68;
  padding: 2em 0 0 0;
  margin: 0;
  opacity: 0.6;
}

@media (min-width: 860px) {
  .hero__image {
    height: 18em;
    width: 18em;
  }
}
</style>
