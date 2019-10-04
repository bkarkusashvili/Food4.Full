<template>
  <div class="recipe-edit-page">
    <form @submit.prevent="save()">
      <div class="field">
        <label class="label">სათაური</label>
        <div class="control">
          <input type="text" class="input is-medium" v-model="post.title" @keyup="titleModified" />
        </div>
      </div>

      <div class="field">
        <label class="label">სათაური ლათინურად (slug)</label>
        <div class="control">
          <input type="text" class="input" v-model="post.slug" @keyup="slugModified" required />
        </div>
      </div>

      <div class="field">
        <label class="label">ქვესათაური</label>
        <div class="control">
          <input type="text" class="input" v-model="post.subtitle" />
        </div>
      </div>

      <div class="field">
        <label class="label">გამოქვეყნების თარიღი</label>
        <div class="control">
          <datetime type="datetime" input-class="input" v-model="post.publishedAt" />
        </div>
      </div>

      <div class="field">
        <div class="control">
          <label class="checkbox">
            <input type="checkbox" v-model="post.featured" />
            რჩეული რეცეპტი
          </label>
        </div>
      </div>

      <div class="field">
        <label class="label">სურათი</label>
        <div class="control">
          <button
            type="button"
            class="button is-medium is-success"
            @click="showPictureDialog = true"
          >სურათის არჩევა</button>
          <button
            type="button"
            class="button is-medium is-danger"
            v-show="post.picture"
            @click="removePicture()"
          >
            <span class="icon">
              <i class="mdi mdi-delete"></i>
            </span>
            <span>წაშლა</span>
          </button>
        </div>

        <div class="control box" style="margin-top: 10px" v-if="post.picture">
          <img :src="post.picture" alt class="post-picture" />
        </div>
      </div>

      <div class="field">
        <label class="label">YouTube ვიდეო</label>
        <div class="control">
          <input type="url" class="input" v-model="post.video" />
        </div>
        <div
          class="control"
          v-if="post.video"
          style="padding: 2em; max-width: 800px; margin: 0 auto"
        >
          <div class="youtube-embed">
            <iframe
              :src="post.video | youtubeEmbed"
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>

      <label class="label">ტეგები</label>
      <div class="field" style="line-height: 2.5">
        <div class="control">
          <draggable v-model="post.tags">
            <span
              class="tag is-medium cursor-draggable"
              v-for="(tag, index) in post.tags"
              :key="tag._id"
            >
              {{tag.title}}
              <button type="button" class="delete" @click="removeTag(index)"></button>
            </span>
          </draggable>
        </div>
        <div class="control">
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
        <draggable
          class="control columns flex-wrap"
          v-model="post.ingredients"
          group="ingredientSections"
          handle=".group-handle"
        >
          <div class="column is-4" v-for="(group, index) in post.ingredients" :key="group.id">
            <div style="border: 1px solid #555; border-radius: 5px; padding: 5px;">
              <div class="field is-grouped">
                <div class="control">
                  <button
                    class="button is-danger"
                    type="button"
                    @click="removeIngredientSection(index)"
                  >
                    <i class="mdi mdi-delete"></i>
                  </button>
                  <button class="button group-handle cursor-draggable" type="button">
                    <i class="mdi mdi-arrow-all"></i>
                  </button>
                </div>
                <div class="control flex-grow-1">
                  <input
                    class="input"
                    type="text"
                    v-model="group.name"
                    placeholder="სექციის სახელი"
                  />
                </div>
              </div>

              <hr />

              <draggable
                v-model="group.children"
                handle=".handle"
                group="ingredients"
                style="margin-bottom: 10px;"
              >
                <div
                  class="field is-grouped"
                  v-for="(child, childIndex) in group.children"
                  :key="child.id"
                >
                  <div class="control">
                    <button
                      class="button"
                      type="button"
                      @click="removeIngredient(childIndex, group)"
                    >
                      <i class="mdi mdi-delete"></i>
                    </button>
                    <button class="button handle cursor-draggable" type="button">
                      <i class="mdi mdi-arrow-all"></i>
                    </button>
                  </div>
                  <div class="control flex-grow-1">
                    <input class="input" type="text" v-model="child.name" />
                  </div>
                </div>
              </draggable>

              <div class="control">
                <button type="button" class="button is-primary" @click="addIngredient(group)">
                  <span class="icon">
                    <i class="mdi mdi-plus"></i>
                  </span>
                  <span>ინგრედიენტის დამატება</span>
                </button>
              </div>
            </div>
          </div>
        </draggable>

        <div class="control">
          <button type="button" class="button" @click="addIngredientSection()">
            <span class="icon">
              <i class="mdi mdi-plus"></i>
            </span>
            <span>სექციის დამატება</span>
          </button>
        </div>
      </div>

      <div class="field">
        <label class="label">აღწერა</label>
        <div class="control">
          <client-only>
            <vue-editor
              v-model="post.description"
              id="editor-description"
              ref="description"
              useCustomImageHandler
              @imageAdded="handleImageAdded"
            />
          </client-only>
        </div>
      </div>

      <div class="field">
        <label class="label">მომზადება</label>
        <div class="control">
          <client-only>
            <vue-editor
              v-model="post.content"
              id="editor-content"
              useCustomImageHandler
              @imageAdded="handleImageAdded"
            />
          </client-only>
        </div>
      </div>

      <div class="field is-grouped is-grouped-centered">
        <div class="control">
          <button type="submit" class="button is-primary is-large" :disabled="loading">
            <span class="icon">
              <i class="mdi mdi-content-save" v-show="!loading"></i>
              <i class="mdi mdi-refresh mdi-spin" v-show="loading"></i>
            </span>
            <span>შენახვა</span>
          </button>
        </div>
        <div class="control">
          <button
            type="button"
            @click="saveAndPublish"
            class="button is-success is-large"
            :disabled="loading"
            v-show="post.status !== 'published'"
          >
            <span class="icon">
              <i class="mdi mdi-content-save" v-show="!loading"></i>
              <i class="mdi mdi-refresh mdi-spin" v-show="loading"></i>
            </span>
            <span>შენახვა და გამოქვეყნება</span>
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
    <picture-chooser
      single
      :show="showPictureDialog"
      @hide="showPictureDialog = false"
      @select="pictureSelected"
    />
  </div>
</template>

<script>
import VueEditor from "../../../components/VueEditor";
import TagChooser from "../../../components/TagChooser";
import PictureChooser from "../../../components/PictureChooser";
import slugify from "slugify";

export default {
  components: { VueEditor, TagChooser, PictureChooser },
  data() {
    return {
      post: {},
      saved: false,
      showTagDialog: false,
      showPictureDialog: false,
      loading: true
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      if (this.$route.params.id === "new") {
        this.loading = false;
        this.post = {
          content: "",
          title: "",
          subtitle: "",
          excerpt: "",
          status: "unpublished",
          tags: [],
          ingredients: [],
          featured: false,
          type: "recipe"
        };
        return;
      }

      this.$axios
        .get("/api/admin/posts/" + this.$route.params.id)
        .then(response => {
          this.loading = false;
          this.post = response.data;

          if (this.post.slug != slugify(this.post.title || "")) {
            this.post.slugModified = true;
          }
        })
        .catch(err => {
          this.loading = false;
          console.error(err);
          this.$notifyError({
            title: "მოხდა შეცდომა!",
            text: err.message
          });
        });
    },
    isEmpty(ingredient) {
      return !ingredient.name;
    },
    isEmptySection(group) {
      return !group.name && (!group.children || !group.children.length);
    },
    titleModified() {
      if (!this.post.title || this.post.slugModified) return;
      this.post.slug = slugify(this.post.title);
      this.$forceUpdate();
    },
    slugModified() {
      this.post.slugModified = this.post.slug != "";
    },
    addTag(tag) {
      if (this.hasTag(tag)) return;
      this.post.tags.push(tag);
    },
    addTags(tags) {
      if (!tags instanceof Array) return;
      tags.forEach(tag => {
        this.addTag(tag);
      });
    },
    removeTag(index) {
      this.post.tags.splice(index, 1);
    },
    hasTag(tag) {
      let found = false;
      this.post.tags.forEach(t => {
        if (t._id === tag._id) found = true;
      });
      return found;
    },
    addIngredient(parent) {
      if (!parent.children) parent.children = [];

      let id = [parent.id + parent.children.length].join("-");

      parent.children.push({
        name: "",
        id: id
      });
    },
    addIngredientSection() {
      this.post.ingredients.push({
        name: "",
        section: true,
        children: [],
        id: "" + this.post.ingredients.length
      });
    },
    removeIngredient(index, parent) {
      if (
        !this.isEmpty(parent.children[index]) &&
        !confirm("ნამდვილად გსურთ ინგრედიენტის წაშლა?")
      )
        return;
      parent.children.splice(index, 1);
    },
    removeIngredientSection(index) {
      if (
        !this.isEmptySection(this.post.ingredients[index]) &&
        !confirm("ნამდვილად გსურთ სექციის წაშლა?")
      )
        return;
      this.post.ingredients.splice(index, 1);
    },
    removePicture() {
      this.post.picture = null;
    },
    pictureSelected(picture) {
      if (!picture) return;
      this.post.picture = picture.url;
      if (picture.variants && picture.variants.thumb) {
        this.post.thumb = picture.variants.thumb.url;
      }
    },
    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
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
    saveAndPublish() {
      this.post.status = "published";
      if (!this.post.publishedAt) this.post.publishedAt = new Date();
      this.save();
    },
    save() {
      this.post.excerpt = this.$refs.description && this.$refs.description.$el.innerText;
      if(this.post.excerpt)
        this.post.excerpt = this.post.excerpt.substr(0, 160);

      this.loading = true;
      if (!this.post._id) {
        this.$axios
          .post("/api/admin/posts", this.post)
          .then(response => {
            this.loading = false;
            this.post = response.data;
            this.$notifySuccess({
              title: "შენახულია",
              text: "შენახვა წარმატებით დასრულდა!"
            });
          })
          .catch(err => {
            this.loading = false;
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
            this.loading = false;
            this.$notifySuccess({
              title: "შენახულია",
              text: "შენახვა წარმატებით დასრულდა!"
            });
          })
          .catch(err => {
            this.loading = false;
            console.error(err);
            this.$notifyError({
              title: "მოხდა შეცდომა!",
              text: err.message
            });
          });
      }
    }
  },
  computed: {},
  watch: {
    $route: "fetchData"
  }
};
</script>

<style lang="scss">
.recipe-edit-page {
  .post-picture {
    display: block;
    margin: 0 auto;
    max-height: 400px;
  }
}
</style>
