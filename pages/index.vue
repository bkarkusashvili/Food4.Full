<template>
  <div class="index-page">
    <section class="section">
      <div class="container">
        <div class="tile is-ancestor is-vertical">
          <div class="tile is-parent">
            <div class="tile is-child is-8">
              <div class="youtube-embed">
                <iframe
                  src="https://www.youtube.com/embed/-C4sZBA6Hgg"
                  frameborder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
            </div>

            <div class="tile is-4 is-parent is-vertical">
              <div class="tile is-child">
                <nuxt-link
                  to="recipes/1"
                  class="promo-box hero"
                  style="background-image: url('/img/pizza.jpg')"
                >
                  <div class="promo-box-content hero-body">
                    <h1 class="title">პიცა პეპერონით და ზეთისხილით</h1>
                    <h2 class="subtitle">პიცა პიცა პიცა</h2>
                  </div>
                </nuxt-link>
              </div>

              <div class="tile is-child">
                <a
                  class="promo-box hero"
                  style="background-image: url('/img/tomatoes.jpg')"
                  href="#"
                >
                  <div class="promo-box-content hero-body">
                    <h1 class="title">პომიდორი</h1>
                    <h2 class="subtitle">პიცა პიცა პიცა</h2>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div class="tile is-parent">
            <div class="tile is-child">
              <a class="promo-box hero" style="background-image: url('/img/berries.jpg')" href="#">
                <div class="promo-box-content hero-body">
                  <h1 class="title">ჟოლო და მოცვი</h1>
                  <h2 class="subtitle">პიცა პიცა პიცა</h2>
                </div>
              </a>
            </div>

            <div class="tile is-child">
              <a class="promo-box hero" style="background-image: url('/img/pancakes.jpg')" href="#">
                <div class="promo-box-content hero-body">
                  <h1 class="title">ბლინები</h1>
                  <h2 class="subtitle">პიცა პიცა პიცა</h2>
                </div>
              </a>
            </div>

            <div class="tile is-child">
              <a class="promo-box hero" style="background-image: url('/img/almonds.jpg')" href="#">
                <div class="promo-box-content hero-body">
                  <h1 class="title">ნუში</h1>
                  <h2 class="subtitle">პიცა პიცა პიცა</h2>
                </div>
              </a>
            </div>

            <div class="tile is-child">
              <a class="promo-box hero" style="background-image: url('/img/stuff.jpg')" href="#">
                <div class="promo-box-content hero-body">
                  <h1 class="title">რაღაცეები</h1>
                  <h2 class="subtitle">პიცა პიცა პიცა</h2>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="container">
      <page-section class="section" v-for="(section, index) in sections" :section="section" :key="index"></page-section>
    </div>
  </div>
</template>

<script>
import PageSection from "../components/PageSection";

export default {
  components: {},
  data() {
    return {
      sections: [
        {
          type: "tags",
          tags: ["5d36e717452aac0656d518ad", "5d373520478a544f3e7e5fb2"]
        }
      ]
    };
  }
};
</script>

<style>
</style>
