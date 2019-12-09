<template>
  <div class="item-edit-page">
    <form @submit.prevent="save()">
      <div class="field">
        <label class="label">სახელი</label>
        <div class="control">
          <input type="text" class="input is-medium" v-model="item.title" @keyup="titleModified" />
        </div>
      </div>

      <div class="field">
        <label class="label">სახელი ლათინურად (slug)</label>
        <div class="control">
          <input type="text" class="input" v-model="item.slug" @keyup="slugModified" />
        </div>
      </div>

      <label class="label">კატეგორია</label>
      <div class="field" style="line-height: 2.5">
        <div class="control" v-if="item.category">
          <a
            class="tag is-medium"
            @click.prevent="showCategoryDialog = true"
            title="დააკლიკეთ ასარჩევად"
          >{{item.categoryName}}</a>
        </div>
        <div class="control" v-else>
          <a class="tag is-primary is-medium" @click.prevent="showCategoryDialog = true">
            <span class="icon">
              <i class="mdi mdi-plus"></i>
            </span>
            <span>არჩევა</span>
          </a>
        </div>
      </div>

      <div class="field">
        <label class="label">ფასი (თეთრებში)</label>
        <div class="control">
          <input type="number" class="input" v-model="item.price" />
        </div>
      </div>

      <div class="field">
        <label class="label">რაოდენობა მარაგში</label>
        <div class="control">
          <input type="number" class="input" v-model="item.stock" />
        </div>
      </div>

      <div class="field">
        <label class="label">სურათები</label>
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
        <div class="control box" style="margin-top: 10px">
          <img :src="item.picture" class="item-picture" v-if="item.picture" alt />
        </div>
      </div>

      <div class="field">
        <label class="label">YouTube ვიდეო</label>
        <div class="control">
          <input type="url" class="input" v-model="item.video" />
        </div>
        <div
          class="control"
          v-if="item.video"
          style="padding: 2em; max-width: 800px; margin: 0 auto"
        >
          <div class="youtube-embed">
            <iframe
              :src="item.video | youtubeEmbed"
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label">აღწერა</label>
        <div class="control">
          <client-only>
            <vue-editor
              v-model="item.content"
              id="editor-content"
              ref="content"
              useCustomImageHandler
              @imageAdded="handleImageAdded"
            />
          </client-only>
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

    <category-chooser
      :show="showCategoryDialog"
      @hide="showCategoryDialog = false"
      @select="categorySelected"
    />
  </div>
</template>

<script>
import VueEditor from "../../../../components/VueEditor";
import CategoryChooser from "../../../../components/CategoryChooser";
import slugify from "slugify";

export default {
  components: { VueEditor, CategoryChooser },
  data() {
    return {
      item: {},
      new: false,
      saved: false,
      showTagDialog: false,
      showCategoryDialog: false
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData: function() {
      if (this.$route.params.id === "new") {
        this.new = true;
        this.item = {
          content: "",
          title: "",
          stock: 0
        };
        return;
      }

      this.new = false;
      this.$axios
        .get("/api/admin/shop/items/" + this.$route.params.id)
        .then(response => {
          this.item = response.data;
          if (this.item.slug != slugify(this.item.title || "")) {
            this.item.slugModified = true;
          }
        })
        .catch(err => {
          console.error(err);
          this.$notifyError({
            title: "მოხდა შეცდომა!",
            text: err.message
          });
        });
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
          this.item.picture = response.data.url;
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
      this.item.excerpt =
        this.$refs.content && this.$refs.content.$el.innerText;
      if (this.item.excerpt)
        this.item.excerpt = this.item.excerpt.substr(0, 160);

      if (this.new) {
        this.$axios
          .post("/api/admin/shop/items", this.item)
          .then(response => {
            this.new = false;
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
          .put("/api/admin/shop/items/" + this.item._id, this.item)
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
    },
    categorySelected(category) {
      this.item.category = category;
      this.item.categoryName = category.title;
    },
    titleModified: function() {
      if (!this.item.title || this.item.slugModified) return;
      this.item.slug = slugify(this.item.title);
      this.$forceUpdate();
    },
    slugModified: function() {
      this.item.slugModified = this.item.slug != "";
    }
  },
  computed: {},
  watch: {
    $route: "fetchData"
  }
};
</script>

<style lang="scss">
.item-edit-page {
  .item-picture {
    display: block;
    margin: 0 auto;
    max-height: 400px;
  }
}
</style>