<template>
  <div class="submit-recipe">
    <div class="container page-container">
      <h1 class="title">გამოგვიგზავნეთ რეცეპტი</h1>

      <form @submit.prevent="submitRecipe" v-show="!success">
        <div class="field">
          <label class="label">სათაური</label>
          <div class="control">
            <input required type="text" class="input" v-model="recipe.title" @change="storeRecipe" />
          </div>
        </div>
        <div class="field">
          <label class="label">თქვენი სახელი და გვარი</label>
          <div class="control">
            <input required type="text" class="input" v-model="recipe.submitterName" @change="storeRecipe" />
          </div>
        </div>
        <div class="field">
          <label class="label">თქვენი საკონტაქტო ელ-ფოსტა</label>
          <div class="control">
            <input required type="text" class="input" v-model="recipe.submitterEmail" @change="storeRecipe" />
          </div>
        </div>
        <div class="field">
          <label class="label">რეცეპტი</label>
          <div class="control">
            <textarea required class="textarea" rows="10" v-model="recipe.content" @change="storeRecipe"></textarea>
          </div>
        </div>

        <div class="notification is-danger" v-show="error">
          <button class="delete" type="button" @click="error = false"></button>
          {{error}}
        </div>

        <div class="field is-grouped is-grouped-centered">
          <div class="control">
            <button
              type="reset"
              class="button is-danger is-large"
              :disabled="loading"
              @click="resetRecipe"
            >
              <span class="icon">
                <i class="mdi mdi-cancel"></i>
              </span>
              <span>გაუქმება</span>
            </button>
          </div>

          <div class="control">
            <button type="submit" class="button is-primary is-large" :disabled="loading">
              <span class="icon">
                <i class="mdi mdi-content-save" v-show="!loading"></i>
                <i class="mdi mdi-refresh mdi-spin" v-show="loading"></i>
              </span>
              <span>გაგზავნა</span>
            </button>
          </div>
        </div>
      </form>
      <div v-show="success"></div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      recipe: {},
      loading: false,
      success: false,
      error: null
    };
  },
  mounted() {
    this.restoreRecipe();
  },
  methods: {
    restoreRecipe() {
      let storedRecipe = JSON.parse(localStorage.getItem("storedRecipe"));
      if (storedRecipe != null) {
        this.recipe = storedRecipe;
      } else {
        this.recipe = {
          title: "",
          content: ""
        };
      }
    },
    storeRecipe() {
      localStorage.setItem("storedRecipe", JSON.stringify(this.recipe));
    },
    resetRecipe() {
      this.recipe = {
        title: "",
        content: ""
      };
      localStorage.removeItem("storedRecipe");
    },
    validate() {},
    submitRecipe() {
      this.storeRecipe();
      this.loading = true;
      this.$axios
        .post("/api/user-recipes", this.recipe)
        .then(response => {
          this.loading = false;
          this.success = true;
        })
        .catch(err => {
          this.loading = false;
          let message = err.response && err.response.data && err.response.data.message;
          this.error = message || "დაფიქსირდა შეცდომა!";
          console.error(err);
        });
    }
  }
};
</script>

<style>
.submit-recipe .container {
  padding-bottom: 2em;
}
</style>