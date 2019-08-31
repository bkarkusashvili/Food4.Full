<template>
  <div>
    <h1 class="title">
      <span>პარამეტრები</span>
    </h1>
    <button type="submit" class="button is-success is-medium" @click="save()">
      <span class="icon">
        <i class="mdi mdi-floppy"></i>
      </span>
      <span>შენახვა</span>
    </button>

    <div class="field field-grouped field-grouped-centered">
      <div class="control"></div>
    </div>

    <form class="form" @submit.prevent="save">
      <h2 class="subtitle">საიტის ინფორმაცია</h2>

      <div class="field">
        <label class="label">საიტის დასახელება</label>
        <div class="control">
          <input type="text" class="input" v-model="settings.title" />
        </div>
      </div>

      <div class="field">
        <label class="label">საიტის მოკლე აღწერა</label>
        <div class="control">
          <textarea rows="5" class="textarea" v-model="settings.description"></textarea>
        </div>
      </div>

      <div class="field">
        <label class="checkbox">
          <input type="checkbox" v-model="settings.noIndex" />
          საძიებო სისტემებისგან დამალვა
        </label>
      </div>

      <div class="field">
        <label class="label">ლოგო</label>
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
        <div class="control box" style="margin-top: 10px; background-color: #eeeeee">
          <img :src="settings.logo" v-if="settings.logo != null" alt />
        </div>
      </div>
    </form>
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