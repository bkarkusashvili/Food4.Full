<template>
  <article class="recipe-page">
    <div class="container">
      <section class="recipe-header has-text-centered">
        <h1 class="title">{{recipe.title}}</h1>
        <h2 class="subtitle" v-if="recipe.subtitle">{{recipe.subtitle}}</h2>

        <div class="recipe-info">
          <!--<span class="recipe-author" v-if="recipe.author">ავტორი: {{recipe.author.name}}</span>-->
          <span class="recipe-date">{{recipe.createdAt | date}}</span>
          <span class="separator">|</span>
          <button
            type="button"
            class="button is-outline is-rounded"
            :class="{ 'is-primary': favorite }"
            v-if="$auth.user"
            @click="toggleFavorite()"
          >
            <i class="mdi mdi-heart-outline"></i>
          </button>
          <button type="button" class="button is-outline is-rounded" @click="print()">
            <span class="icon">
              <i class="mdi mdi-printer"></i>
            </span>
            <span>ბეჭდვა</span>
          </button>
        </div>
      </section>

      <img class="recipe-picture" :src="recipe.picture" alt v-if="recipe.picture && !recipe.video" />

      <div class="youtube-embed" v-if="recipe.video">
        <iframe
          :src="recipe.video | youtubeEmbed"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>

      <section class="recipe-description" v-if="recipe.description">
        <div v-html="recipe.description"></div>
      </section>

      <section class="recipe-ingredients" v-if="recipe.ingredients && recipe.ingredients.length">
        <h2 class="section-header has-text-centered">ინგრედიენტები</h2>
        <div class="columns flex-wrap flex-justify-content-center">
          <div
            class=""
            :class="{'is-6': recipe.ingredients.length > 2}"
            v-for="group in recipe.ingredients"
            :key="group.id"
          >
            <h3 v-if="group.name">{{group.name}}</h3>
            <ul>
              <li v-for="ingredient in group.children" :key="ingredient.id">
                <label>
                  <input type="checkbox" />
                  <span>{{ingredient.name}}</span>
                </label>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section class="recipe-preparation" v-if="recipe.content">
        <h2 class="section-header has-text-centered">მომზადება</h2>
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
      recipe: {},
      favorite: false
    };
  },
  created() {
    this.checkFavorite();
  },
  methods: {
    print() {
      window.print();
    },
    toggleFavorite() {
      if (!this.favorite) {
        this.$axios
          .post("/api/user/favorites/" + this.recipe._id)
          .then(response => {
            this.favorite = true;
          })
          .catch(err => {
            console.error(err);
          });
      } else {
        this.$axios
          .delete("/api/user/favorites/" + this.recipe._id)
          .then(response => {
            this.favorite = false;
          })
          .catch(err => {
            console.error(err);
          });
      }
    },
    checkFavorite() {
      this.$axios
        .get("/api/user/favorites/" + this.recipe._id)
        .then(response => {
          this.favorite = true;
        })
        .catch((err, response) => {
          if (err.response && err.response.status === 404) {
            this.favorite = false;
          } else {
            console.error(err);
          }
        });
    }
  },
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
    padding-top: 2em;

    .title {
      color: black;
      font-size: 30px;
    }

    .recipe-info {
      color: #888;
      margin-bottom: 10px;
      font-size: 18px;
    }
  }

  .recipe-info > * {
    vertical-align: middle;
  }

  .recipe-info {
    .separator {
      margin: 0 5px;
      color: #aaa;
    }
  }

  .recipe-picture {
    display: block;
    margin: 0 auto;
    max-height: 400px;
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
    }
    h3 {
      font-size: 20px;
      margin-bottom: 7px;
    }
  }

  .section-header {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 0.1em;
  }
}

@media print {
  .recipe-page {
    padding: 0;

    .recipe-header {
      padding: 0;
    }

    .recipe-footer,
    .recipe-picture,
    .recipe-info,
    .youtube-embed {
      display: none;
    }
  }
}
</style>
