<template>
  <div class="recipe-edit-page">
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
        <label class="label">ქვესათაური</label>
        <div class="control">
          <input type="text" class="input is-large" v-model="post.subtitle" />
        </div>
      </div>

      <div class="field">
        <label class="label">სურათი</label>
        <div class="control">
          <div class="file is-medium is-primary">
            <label class="file-label">
              <input class="file-input" type="file" ref="file" @change="uploadPicture()" />
              <span class="file-cta">
                <span class="file-icon">
                  <i class="mdi mdi-upload"></i>
                </span>
                <span class="file-label">არჩევა</span>
              </span>
            </label>
          </div>
        </div>
        <div class="control" style="padding-top: 10px">
          <img :src="post.picture" v-if="post.picture != null" alt />
        </div>
      </div>

      <div class="field">
        <label class="label">ტეგები</label>
        <div class="control">
          <span class="tag is-medium" v-for="(tag, index) in post.tags" :key="tag._id">
            {{tag.title}}
            <button type="button" class="delete" @click="removeTag(index)"></button>
          </span>

          <a class="tag is-primary is-medium" @click.prevent="showTagDialog = true">
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
        <label class="label">აღწერა</label>
        <div class="control">
          <no-ssr>
            <vue-editor
              v-model="post.excerpt"
              id="editor-excerpt"
              useCustomImageHandler
              @imageAdded="handleImageAdded"
            />
          </no-ssr>
        </div>
      </div>

      <div class="field">
        <label class="label">მომზადება</label>
        <div class="control">
          <no-ssr>
            <vue-editor
              v-model="post.content"
              id="editor-content"
              useCustomImageHandler
              @imageAdded="handleImageAdded"
            />
          </no-ssr>
        </div>
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

    <tag-chooser
      :exclude="post.tags"
      :show="showTagDialog"
      @hide="showTagDialog = false"
      @select="addTags"
    />
  </div>
</template>

<script>
import VueEditor from "../../../components/VueEditor";
import TagChooser from "../../../components/TagChooser";

export default {
  components: { VueEditor, TagChooser },
  data() {
    return {
      post: {},
      new: false,
      saved: false,
      showTagDialog: false
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
          subtitle: "",
          excerpt: "",
          tags: [],
          ingredients: []
        };
        return;
      }
      this.new = false;
      this.$axios
        .get("/api/admin/posts/" + this.$route.params.id)
        .then(response => {
          this.post = response.data;
        })
        .catch(err => {
            console.error(err);
            this.$notifyError({
              title: "მოხდა შეცდომა!",
              text: err.message
            });
          });
    },
    addTag: function(tag) {
      if (this.hasTag(tag)) return;
      this.post.tags.push(tag);
    },
    addTags: function(tags) {
      if (!tags instanceof Array) return;
      tags.forEach(tag => {
        this.addTag(tag);
      });
    },
    removeTag: function(index) {
      this.post.tags.splice(index, 1);
    },
    hasTag: function(tag) {
      let found = false;
      this.post.tags.forEach(t => {
        if (t._id === tag._id) found = true;
      });
      return found;
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
    uploadPicture: function() {
      let file = this.$refs.file.files[0],
        formData = new FormData();
      if (!file) return;
      formData.append("file", file);
      this.$axios
        .post("/api/admin/files", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(response => {
          this.post.picture = response.data.url;
          this.$forceUpdate();
        })
        .catch(err => {
          console.error(err);
          this.$notifyError({
            title: "მოხდა შეცდომა!",
            text: err.message
          });
        });
    },
    handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {
      var formData = new FormData();
      formData.append("file", file);

      this.$axios
        .post("/api/admin/files", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(result => {
          let url = result.data.url; // Get url from response
          Editor.insertEmbed(cursorLocation, "image", url);
          resetUploader();
        })
        .catch(err => {
          console.error(err);
          this.$notifyError({
            title: "მოხდა შეცდომა!",
            text: err.message
          });
        });
    },
    save: function() {
      if (this.new) {
        this.$axios
          .post("/api/admin/posts", this.post)
          .then(response => {
            this.$notifySuccess({
              title: "შენახულია",
              text: "შენახვა წარმატებით დასრულდა!"
            });
          })
          .catch(err => {
            console.error(err);
            this.$notifyError({
              title: "მოხდა შეცდომა!",
              text: err.message
            });
          });
      } else {
        this.$axios
          .put("/api/admin/posts/" + this.post._id, this.post)
          .then(response => {
            this.$notifySuccess({
              title: "შენახულია",
              text: "შენახვა წარმატებით დასრულდა!"
            });
          })
          .catch(err => {
            console.error(err);
            this.$notifyError({
              title: "მოხდა შეცდომა!",
              text: err.message
            });
          });
      }
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

<style lang="scss">
.recipe-edit-page {
}
</style>
