<template>
  <div class="page-edit-page">
    <form @submit.prevent="save()">
      <div class="field">
        <label class="label">სათაური</label>
        <div class="control">
          <input type="text" class="input is-large" v-model="page.title" />
        </div>
      </div>

      <div class="field">
        <label class="label">სათაური ლათინურად (slug)</label>
        <div class="control">
          <input type="text" class="input is-large" v-model="page.slug" />
        </div>
      </div>

      <div class="field">
        <label class="label">ქვესათაური</label>
        <div class="control">
          <input type="text" class="input is-large" v-model="page.subtitle" />
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
          <img :src="page.picture" v-if="page.picture != null" alt />
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
          subtitle: "",
        };
        return;
      }
      this.new = false;
      this.$axios
        .get("/api/admin/pages/" + this.$route.params.id)
        .then(response => {
          this.page = response.data;
        })
        .catch(error => console.error(error));
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
        .catch(error => {
          console.error(error);
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
          console.log(err);
        });
    },
    save: function() {
      if (this.new) {
        this.$axios.post("/api/admin/pages", this.page);
      } else {
        this.$axios.put("/api/admin/pages/" + this.page._id, this.page);
      }
    }
  },
  computed: {
  },
  watch: {
    $route: "fetchData"
  }
};
</script>

<style lang="scss">
.page-edit-page {
}
</style>
