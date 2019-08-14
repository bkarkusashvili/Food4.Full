<template>
  <article class="recipe-page">
    <div class="container">
      <div class="promo-box hero" :style="{'background-image': 'url(' + recipe.picture + ')'}">
        <div class="promo-box-content hero-body">
          <h1 class="title">{{recipe.title}}</h1>
          <h2 class="subtitle">{{recipe.subtitle}}</h2>
        </div>
      </div>

      <section class="recipe-description">
        <div v-html="recipe.description"></div>
      </section>

      <section class="recipe-ingredients">
        <h2 class="section-header">ინგრედიენტები</h2>
        <ul>
          <li v-for="ingredient in recipe.ingredients" :key="ingredient">
            <label>
              <input type="checkbox" />
              <span>{{ingredient}}</span>
            </label>
          </li>
        </ul>
      </section>
      <section class="recipe-preparation">
        <h2 class="section-header">მომზადება</h2>
        <div v-html="recipe.content"></div>
      </section>
    </div>
  </article>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      recipe: {}
    };
  },
  created() {},
  methods: {},
  watch: {},
  asyncData({ params, error, $axios }) {
    return $axios
      .get("/api/posts/" + params.id)
      .then(response => {
        return { recipe: response.data };
      })
      .catch(err => {
        error({ statusCode: 404, message: "რეცეპტი ვერ მოიძებნა" });
      });
  }
};
</script>

<style lang="scss">
.recipe-page {
  .container {
    background: white;
  }

  .hero {
    min-height: 300px;
  }

  section {
    padding: 20px;
  }

  .promo-box {
    height: auto;
    cursor: auto;
  }

  .promo-box-content:hover {
    background: linear-gradient(rgba(34, 34, 34, 0), rgba(34, 34, 34, 0.9));
  }

  .recipe-ingredients {
    input:checked + span {
      text-decoration: line-through;
    }
    ul {
      columns: 2;
    }
  }

  .section-header {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 0.5em;
  }
}
</style>
