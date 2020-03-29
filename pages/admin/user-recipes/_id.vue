<template>
  <div class="recipe-edit-page">
    <form @submit.prevent="save()">
      <div class="field">
        <label class="label">სათაური</label>
        <div class="control">
          <input type="text" class="input" v-model="post.title" />
        </div>
      </div>

      <div class="field">
        <label class="label">სახელი და გვარი</label>
        <div class="control">
          <input type="text" class="input" v-model="post.submitterName" />
        </div>
      </div>

      <div class="field">
        <label class="label">საკონტაქტო ელ-ფოსტა</label>
        <div class="control">
          <input type="text" class="input" v-model="post.submitterEmail" />
        </div>
      </div>

      <div class="field">
        <label class="label">მომზადება</label>
        <div class="control">
          <client-only>
            <vue-editor v-model="post.content" id="editor-content" />
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
  </div>
</template>

<script>
import VueEditor from "../../../components/VueEditor";

export default {
  components: { VueEditor },
  data() {
    return {
      post: {},
      saved: false,
      loading: true
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      return this.$axios
        .get("/api/admin/user-recipes/" + this.$route.params.id)
        .then(response => {
          this.loading = false;
          this.post = response.data;
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
    saveAndPublish() {
      this.save().then(this.publish);
    },
    publish() {
      this.loading = true;
      return this.$axios
        .post("/api/admin/user-recipes/" + this.post._id + "/publish")
        .then(response => {
          this.loading = false;
          this.$notifySuccess({
            title: "გამოქვეყნებულია",
            text: "<a href='/admin/recipes/" + response.data._id + "'>რეცეპტზე გადასვლა</a>"
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
    },
    save() {
      this.loading = true;

      return this.$axios
        .put("/api/admin/user-recipes/" + this.post._id, this.post)
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
