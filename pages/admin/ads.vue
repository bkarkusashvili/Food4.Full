<template>
  <div class>
    <h1 class="title">რეკლამები</h1>

    <button type="submit" class="button is-success is-medium" @click="save()">
      <span class="icon">
        <i class="mdi mdi-floppy"></i>
      </span>
      <span>შენახვა</span>
    </button>

    <div style="margin-top: 1em">
    </div>

    <picture-chooser :show="showPictureChooser" @hide="showPictureChooser = false" @select="pictureSelected" />
  </div>
</template>

<script>
import PictureChooser from "../../components/PictureChooser";

export default {
  components: { PictureChooser },
  data() {
    return {
      settings: {},
      showPictureChooser: false,
      selectionTarget: null
    };
  },
  methods: {
    pictureSelected(post) {
      if (!this.selectionTarget) return;
      this.selectionTarget.post = post;
      this.$forceUpdate();
    },
    selectPicture(item) {
      this.selectionTarget = item;
      this.showPictureChooser = true;
    },
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
  },
  asyncData({ $axios, error }) {
    return $axios
      .get("/api/admin/settings")
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