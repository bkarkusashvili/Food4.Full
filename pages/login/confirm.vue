<template>
  <div class="confirmation-page">
    <div class="container page-container has-text-centered">
      <div v-show="loading">
        <h1 class="title">მიმდინარეობს ელ-ფოსტის დადასტურება</h1>
        <i class="mdi mdi-spin mdi-loading has-text-primary" style="font-size: 70px;"></i>
      </div>
      <div v-show="error">
        <h1 class="title has-text-danger">მოხდა შეცდომა!</h1>
        <h2 class="subtitle has-text-danger" v-show="error === 'code_wrong'">
          <i class="mdi mdi-close"></i> კოდი არასწორია!
        </h2>
        <nuxt-link
          to="/login/newcode"
          class="button is-large is-primary"
          v-show="error === 'code_wrong'"
        >ახალი კოდის მოთხოვნა</nuxt-link>
        <button
          class="button is-large is-primary"
          v-show="error !== 'code_wrong'"
          @click="confirmCode()"
        >სცადეთ თავიდან</button>
      </div>
      <div v-show="success">
        <h1 class="title has-text-success">გილოცავთ!</h1>
        <h2 class="subtitle has-text-success">
          თქვენი ელ-ფოსტა დადასტურებულია! მიმდინარეობს გადამისამართება
          <nuxt-link to="/login">შესვლის გვერდზე</nuxt-link>.
        </h2>
        <i class="mdi mdi-spin mdi-loading has-text-primary" style="font-size: 70px;"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      loading: true,
      error: false,
      success: false
    };
  },
  created() {
    this.confirmCode();
  },
  methods: {
    confirmCode() {
      this.loading = true;
      this.error = false;
      this.$axios
        .post("/api/users/confirm", { code: this.$route.query.code })
        .then(() => {
          this.success = true;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          if (err.code === 404) {
            this.error = "code_wrong";
          } else {
            this.error = err.message;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style>
.confirmation-page {
  padding-top: 2em;
  padding-bottom: 2em;
}
</style>
