<template>
  <div>
    <h1 class="title">
      <span style="vertical-align: middle">მთავარი გვერდი</span>
      <button
        type="submit"
        style="vertical-align: middle"
        class="button is-success is-large"
        @click="save()"
      >
        <span class="icon">
          <i class="mdi mdi-floppy"></i>
        </span>
        <span>შენახვა</span>
      </button>
    </h1>

  </div>
</template>

<script>
export default {
  data() {
    return {
      settings: {}
    };
  },
  methods: {
    save() {
      this.$axios
        .put("/api/admin/settings", this.settings)
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
          this.settings.logo = response.data.url;
          this.$forceUpdate();
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
  asyncData({ $axios, error }) {
    return $axios
      .get("/settings.json")
      .then(response => {
        return { settings: response.data };
      })
      .catch(err => {
        error({ statusCode: 500, message: "მოხდა შეცდომა" });
      });
  }
};
</script>

<style>
</style>