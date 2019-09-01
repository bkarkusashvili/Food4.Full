<template>
  <article class="recipe-page">
    <div class="container">
      <section class="recipe-header has-text-centered">
        <h1 class="title">{{recipe.title}}</h1>
        <h2 class="subtitle">{{recipe.subtitle}}</h2>

        <div class="recipe-info">
          <!--<span class="recipe-author" v-if="recipe.author">ავტორი: {{recipe.author.name}}</span>-->
          <span class="recipe-date">{{recipe.createdAt | date}}</span>
        </div>
      </section>

      <img class="recipe-picture" :src="recipe.picture" alt v-if="recipe.picture" />

      <div class="youtube-embed" v-if="recipe.video">
        <iframe
          :src="recipe.video"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>

      <section class="recipe-description" v-if="recipe.description">
        <div v-html="recipe.description"></div>
      </section>

      <section class="recipe-ingredients" v-if="recipe.ingredients && recipe.ingredients.length">
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
      <section class="recipe-preparation" v-if="recipe.content">
        <h2 class="section-header">მომზადება</h2>
        <div v-html="recipe.content"></div>
      </section>

      <section class="recipe-footer" v-if="recipe.tags && recipe.tags.length">
        <div class="recipe-tags has-text-centered">
          <nuxt-link
            :to="'/tags/' + tag.slug"
            v-for="tag in recipe.tags"
            class="tag is-medium"
            :key="tag._id"
          >{{tag.title}}</nuxt-link>
        </div>
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
  },
  head() {
    if (this.recipe)
      return {
        title: this.recipe.title + " - " + this.$store.state.settings.title
      };
  }
};
</script>

<style lang="scss">
.recipe-page {
  .container {
    background: white;
  }

  .recipe-header {
    padding-top: 4em;

    .title {
      color: black;
      font-size: 38px;
    }

    .recipe-info {
      color: #888;
      margin-bottom: 10px;
      font-size: 18px;
    }
  }

  .recipe-picture {
    display: block;
    margin: 0 auto;
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
