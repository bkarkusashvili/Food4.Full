<template>
  <div class="user-profile-edit">
    <form @submit.prevent="save()" @reset.prevent="reset()" class="form">
      <div class="field">
        <label class="label">სახელი</label>
        <div class="control">
          <input
            type="text"
            class="input"
            v-model="name"
            :class="{'is-danger': !nameValid}"
            autocomplete="name"
          />
        </div>
        <p v-show="!nameValid" class="help is-danger">გთხოვთ შეიყვანოთ სახელი</p>
      </div>

      <div class="field">
        <label class="label">ელ-ფოსტა</label>
        <div class="control">
          <input type="text" class="input" readonly :value="$auth.user.email" autocomplete="off" />
        </div>
      </div>
      <div class="field">
        <label class="label">პაროლი</label>
        <div class="control">
          <input
            type="password"
            class="input"
            v-model="password"
            :class="{'is-danger': !passwordValid}"
            placeholder="(დარჩეს იგივე)"
            autocomplete="new-password"
          />
        </div>
        <p v-show="!passwordValid" class="help is-danger">პაროლი უნდა შეიცავდეს 8-ზე მეტ სიმბოლოს</p>
      </div>
      <div class="field">
        <label class="label">პაროლი (ხელახლა)</label>
        <div class="control">
          <input
            type="password"
            class="input"
            v-model="passwordConfirm"
            :class="{'is-danger': !passwordMatch}"
            placeholder="(დარჩეს იგივე)"
            autocomplete="new-password"
          />
        </div>
        <p v-show="!passwordMatch" class="help is-danger">პაროლები არ ემთხვევა</p>
      </div>

      <div class="field is-grouped is-grouped-centered">
        <div class="control">
          <button class="button is-medium" type="reset">გასუფთავება</button>
        </div>
        <div class="control">
          <button class="button is-medium is-success" type="submit" :disabled="loading">შენახვა</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      password: "",
      passwordConfirm: "",
      loading: false,
      nameValid: true,
      passwordValid: true,
      passwordMatch: true
    };
  },
  mounted() {
    this.reset();
  },
  methods: {
    save() {
      if (!this.validate()) return;
      let data = {
        name: this.name
      };
      if (this.password != "") data.password = this.password;
      this.loading = true;
      this.$axios
        .put("/api/user/users/me", data)
        .then(response => {
          this.loading = false;
          this.$store.commit("auth/SET", { key: "user", value: response.data });
        })
        .catch(error => {
          this.loading = false;
        });
    },
    reset() {
      this.name = this.$auth.user.name;
      this.password = "";
      this.passwordConfirm = "";
      this.passwordValid = true;
      this.passwordMatch = true;
      this.nameValid = true;
    },
    validate() {
      this.passwordValid = this.password == "" || this.password.length >= 8;
      this.passwordMatch = this.password === this.passwordConfirm;
      this.nameValid = this.name.length;
      return this.passwordValid && this.passwordMatch && this.nameValid;
    }
  }
};
</script>

<style>
.user-profile-edit {
  padding: 10px;
}
</style>