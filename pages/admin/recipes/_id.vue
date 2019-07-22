<template>
  <div>
    <form @submit.prevent="save()">
      <div class="field">
        <label class="label">სათაური</label>
        <div class="control">
          <input type="text" class="input is-large" v-model="post.title" />
        </div>
      </div>

      <div class="field">
        <label class="label">სათაური ლათინურად (slug)</label>
        <div class="control">
          <input type="text" class="input is-large" v-model="post.slug" />
        </div>
      </div>

      <div class="field">
        <label class="label">ტეგები</label>
        <div class="control">
          <span class="tag is-medium" v-for="(tag, index) in post.tags" :key="tag">
            {{tag}}
            <button type="button" class="delete" @click="removeTag(index)"></button>
          </span>

          <a class="tag is-primary is-medium" @click.prevent="addTag()">
            <span class="icon">
              <i class="mdi mdi-plus"></i>
            </span>
            <span>დამატება</span>
          </a>
        </div>
      </div>

      <div class="field">
        <label class="label">ინგრედიენტები</label>
        <div class="control">
          <table class="table is-fullwidth">
            <tbody>
              <tr v-for="(ingredient, index) in post.ingredients" :key="ingredient">
                <td style="width: 9.9em;">
                  <button class="button" type="button" @click="removeIngredient(index)">
                    <i class="mdi mdi-delete"></i>
                  </button>
                  <button
                    class="button"
                    type="button"
                    @click="moveUp(index)"
                    :disabled="!canMoveUp(index)"
                  >
                    <i class="mdi mdi-arrow-up"></i>
                  </button>
                  <button
                    class="button"
                    type="button"
                    @click="moveDown(index)"
                    :disabled="!canMoveDown(index)"
                  >
                    <i class="mdi mdi-arrow-down"></i>
                  </button>
                </td>
                <td>
                  <input class="input" type="text" v-model="post.ingredients[index]" />
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <button
                    type="button"
                    class="button is-primary"
                    @click="addIngredient()"
                    :disabled="!canAddIngredient"
                  >
                    <span class="icon">
                      <i class="mdi mdi-plus"></i>
                    </span>
                    <span>დამატება</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="field">
        <label class="label">სურათი</label>
        <div class="control">
          <div class="file is-fullwidth is-large is-primary has-name">
            <label class="file-label">
              <input class="file-input" type="file" name="resume" />
              <span class="file-cta">
                <span class="file-icon">
                  <i class="mdi mdi-upload"></i>
                </span>
                <span class="file-label">არჩევა</span>
              </span>
              <span class="file-name">Screen Shot 2017-07-29 at 15.54.25.png</span>
            </label>
          </div>
        </div>
      </div>

      <div class="field">
        <no-ssr>
          <vue-editor v-model="post.content" />
        </no-ssr>
      </div>

      <div class="field is-grouped is-grouped-centered">
        <div class="control">
          <button type="submit" class="button is-primary is-large">
            <span class="icon">
              <i class="mdi mdi-content-save"></i>
            </span>
            <span>შენახვა</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import VueEditor from "../../../components/VueEditor";
export default {
  components: { VueEditor },
  data() {
    return {
      post: {},
      new: false
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData: function() {
      if (this.$route.params.id === "new") {
        this.new = true;
        this.post = {
          content: "",
          title: "",
          tags: ["ტეგი"],
          ingredients: ["ინგრედიენტი"]
        };
        return;
      }
      this.new = false;
      this.$axios
        .get("/api/admin/posts/" + this.$route.params.id)
        .then(response => {
          this.post = response.data;
        })
        .catch(error => console.error(error));
    },
    addTag: function() {},
    removeTag: function(index) {
      this.post.tags.splice(index, 1);
    },
    addIngredient: function() {
      if (this.canAddIngredient) this.post.ingredients.push("");
    },
    removeIngredient: function(index) {
      this.post.ingredients.splice(index, 1);
    },
    moveUp: function(index) {
      if (!this.canMoveUp(index)) return;
      this.post.ingredients.splice(
        index - 1,
        0,
        this.post.ingredients.splice(index, 1)[0]
      );
    },
    moveDown: function(index) {
      if (!this.canMoveDown(index)) return;
      this.post.ingredients.splice(
        index + 1,
        0,
        this.post.ingredients.splice(index, 1)[0]
      );
    },

    canMoveUp: function(index) {
      return index > 0;
    },
    canMoveDown: function(index) {
      return index < this.post.ingredients.length - 1;
    },
    save: function() {
      this.$axios.post("/api/admin/posts", this.post);
    }
  },
  computed: {
    canAddIngredient: function() {
      return this.post.ingredients && this.post.ingredients.indexOf("") === -1;
    }
  },
  watch: {
    $route: "fetchData"
  }
};
</script>

<style>
</style>
