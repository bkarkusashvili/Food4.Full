<template>
  <div class="settings-page">
    <h1 class="title">
      <span>პარამეტრები</span>
    </h1>
    <button type="submit" class="button is-success is-medium" @click="save()">
      <span class="icon">
        <i class="mdi mdi-floppy"></i>
      </span>
      <span>შენახვა</span>
    </button>

    <form class="form" @submit.prevent="save">
      <h2 class="subtitle">საიტის ინფორმაცია</h2>

      <div class="field">
        <label class="label">საიტის დასახელება</label>
        <div class="control">
          <input type="text" class="input" v-model="settings.title" />
        </div>
      </div>

      <div class="field">
        <label class="label">
          საიტის
          <strong>მოკლე</strong> აღწერა საძიებო სისტემებისთვის (არაუმეტეს 150 სიმბოლო)
        </label>
        <div class="control">
          <textarea rows="5" maxlength="150" class="textarea" v-model="settings.description"></textarea>
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

      <h2 class="subtitle">შეკვეთები</h2>
      <div class="field">
        <label class="label">ახალი შეკვეთების შესახებ შეტყობინებები გაეგზავნოს:</label>
        <div
          class="field has-addons"
          v-for="(email, index) in settings.orderNotifyEmails"
          :key="index"
        >
          <div class="control">
            <input
              type="email"
              class="input"
              v-model="settings.orderNotifyEmails[index]"
              placeholder="ელ-ფოსტის მისამართი"
            />
          </div>
          <div class="control">
            <button class="button" type="button" @click="removeNotifyEmail(index)" title="წაშლა">
              <span class="icon">
                <i class="mdi mdi-delete"></i>
              </span>
            </button>
          </div>
        </div>
        <div class="control">
          <button class="button" type="button" @click="addNotifyEmail()">
            <span class="icon">
              <i class="mdi mdi-plus"></i>
            </span>
            <span>დამატება</span>
          </button>
        </div>
      </div>

      <h2 class="subtitle">iPay გადახდები</h2>
      <div class="field">
        <label class="label">URL</label>
        <div class="control">
          <input type="text" class="input" v-model="settings.ipayEndpoint" />
        </div>
      </div>
      <div class="field">
        <label class="label">Client ID</label>
        <div class="control">
          <input type="text" class="input" v-model="settings.ipayId" />
        </div>
      </div>
      <div class="field">
        <label class="label">Secret Key</label>
        <div class="control">
          <input type="text" class="input" v-model="settings.ipaySecret" />
        </div>
      </div>

      <button type="submit" class="button is-success is-medium">
        <span class="icon">
          <i class="mdi mdi-floppy"></i>
        </span>
        <span>შენახვა</span>
      </button>
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
    addNotifyEmail() {
      if (!(this.settings.orderNotifyEmails instanceof Array))
        this.settings.orderNotifyEmails = [];
      this.settings.orderNotifyEmails.push("");
    },
    removeNotifyEmail(index) {
      this.settings.orderNotifyEmails.splice(index, 1);
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
.settings-page .subtitle {
  margin-top: 1.5em;
}
</style>