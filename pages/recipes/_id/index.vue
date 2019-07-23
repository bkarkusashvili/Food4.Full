<template>
  <article class="recipe-page">
    <div class="container">
      <div class="promo-box hero" :style="{'background-image': 'url(' + recipe.picture + ')'}">
        <div class="promo-box-content hero-body">
          <h1 class="title">{{recipe.title}}</h1>
          <!-- <h2 class="subtitle">პიცა პიცა პიცა</h2> -->
        </div>
      </div>

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
        <p v-html="recipe.content"></p>
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
  created() {
    this.fetchRecipe();
  },
  methods: {
    fetchRecipe() {
      this.$axios
        .get("/api/posts/" + this.$route.params.id)
        .then(response => {
          this.recipe = response.data;
        })
        .catch(error => console.error(error));
    }
  },
  watch: {
    $route: "fetchRecipe"
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
