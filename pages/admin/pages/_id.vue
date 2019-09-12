<template>
  <div class="page-edit-page">
    <form @submit.prevent="save()">
      <div class="field">
        <label class="label">სათაური</label>
        <div class="control">
          <input type="text" class="input is-medium" v-model="page.title" @keyup="titleModified" />
        </div>
      </div>

      <div class="field">
        <label class="label">სათაური ლათინურად (slug)</label>
        <div class="control">
          <input type="text" class="input" v-model="page.slug" @keyup="slugModified" />
        </div>
      </div>

      <div class="field">
        <label class="label">ქვესათაური</label>
        <div class="control">
          <input type="text" class="input" v-model="page.subtitle" />
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
        <div class="control box" style="margin-top: 10px">
          <img :src="page.picture" class="page-picture" v-if="page.picture" alt />
        </div>
      </div>


      <div class="field">
        <label class="label">YouTube ვიდეო</label>
        <div class="control">
          <input type="url" class="input" v-model="page.video" />
        </div>
        <div
          class="control"
          v-if="page.video"
          style="padding: 2em; max-width: 800px; margin: 0 auto"
        >
          <div class="youtube-embed">
            <iframe
              :src="page.video | youtubeEmbed"
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label">შიგთავსი</label>
        <div class="control">
          <no-ssr>
            <vue-editor
              v-model="page.content"
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
  </div>
</template>

<script>
import VueEditor from "../../../components/VueEditor";
import slugify from "slugify";

export default {
  components: { VueEditor },
  data() {
    return {
      page: {},
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
        this.page = {
          content: "",
          title: "",
          subtitle: ""
        };
        return;
      }

      this.new = false;
      this.$axios
        .get("/api/admin/pages/" + this.$route.params.id)
        .then(response => {
          this.page = response.data;
          if (this.page.slug != slugify(this.page.title || "")) {
            this.page.slugModified = true;
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
          this.page.picture = response.data.url;
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
          .post("/api/admin/pages", this.page)
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
          .put("/api/admin/pages/" + this.page._id, this.page)
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
    titleModified: function() {
      if (!this.page.title || this.page.slugModified) return;
      this.page.slug = slugify(this.page.title);
      this.$forceUpdate();
    },
    slugModified: function() {
      this.page.slugModified = this.page.slug != "";
    }
  },
  computed: {},
  watch: {
    $route: "fetchData"
  }
};
</script>

<style lang="scss">
.page-edit-page {
  .page-picture {
    display: block;
    margin: 0 auto;
    max-height: 400px;
  }
}
</style>
