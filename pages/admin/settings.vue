<template>
  <div>
    <h1 class="title">პარამეტრები</h1>

    <form class="form" @submit.prevent="save">
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
        <div class="control" style="padding-top: 10px">
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