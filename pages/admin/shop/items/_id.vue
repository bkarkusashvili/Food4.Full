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

        <div class="tabs is-boxed" style="margin-bottom: 5px">
          <draggable
            tag="ul"
            v-model="item.pictures"
            group="pictures"
            draggable=".item"
            @end="dragEnd"
          >
            <li
              class="item"
              :class="{'is-active': currentPicture === index}"
              v-for="(picture, index) in item.pictures"
              :key="index"
            >
              <a @click="currentPicture = index">
                <span>{{index + 1}}</span>
              </a>
            </li>
            <li slot="footer">
              <a @click="addPicture()">
                <span class="icon is-small">
                  <i class="mdi mdi-plus" aria-hidden="true"></i>
                </span>
                <span>დამატება</span>
              </a>
            </li>
          </draggable>
        </div>

        <div
          v-for="(picture, index) in item.pictures"
          :key="index"
          v-show="currentPicture === index"
        >
          <div class="control">
            <button
              type="button"
              class="button is-medium is-success"
              @click="showPictureDialog = true"
            >სურათის არჩევა</button>
            <button
              type="button"
              class="button is-medium is-danger"
              v-show="picture"
              @click="removePicture()"
            >
              <span class="icon">
                <i class="mdi mdi-delete"></i>
              </span>
              <span>წაშლა</span>
            </button>
          </div>
          <div class="control box" style="margin-top: 10px">
            <img
              :src="item.pictures[index].url"
              class="item-picture"
              v-if="item.pictures[index].url"
              alt
            />
          </div>
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
              v-model="item.description"
              id="editor-description"
              ref="description"
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
    <picture-chooser
      single
      :show="showPictureDialog"
      @hide="showPictureDialog = false"
      @select="pictureSelected"
    />
  </div>
</template>

<script>
import VueEditor from "../../../../components/VueEditor";
import CategoryChooser from "../../../../components/CategoryChooser";
import PictureChooser from "../../../../components/PictureChooser";
import slugify from "slugify";

export default {
  components: { VueEditor, CategoryChooser, PictureChooser },
  data() {
    return {
      item: {},
      new: false,
      saved: false,
      showTagDialog: false,
      showCategoryDialog: false,
      showPictureDialog: false,
      currentPicture: 0
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
          description: "",
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
    addPicture() {
      if (!(this.item.pictures instanceof Array)) this.item.pictures = [];
      this.item.pictures.push({});
      this.currentPicture = this.item.pictures.length - 1;
      this.showPictureDialog = true;
    },
    removePicture() {
      this.item.pictures.splice(this.currentPicture, 1);
      if (this.currentPicture > this.item.pictures.length - 1)
        this.currentPicture = this.item.pictures.length - 1;
    },
    dragEnd(event) {
      this.currentPicture = event.newIndex;
    },
    pictureSelected(picture) {
      if (!picture) return;
      this.item.pictures[this.currentPicture] = picture;
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
        this.$refs.description && this.$refs.description.$el.innerText;
      if (this.item.excerpt)
        this.item.excerpt = this.item.excerpt.substr(0, 160);

      if (
        this.item.pictures[0] &&
        this.item.pictures[0].variants &&
        this.item.pictures[0].variants.thumb
      ) {
        this.item.thumb = this.item.pictures[0].variants.thumb.url;
      } else if (this.item.pictures[0]) {
        this.item.thumb = this.item.pictures[0].url;
      }

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