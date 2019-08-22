<template>
  <div class="user-edit-page">
    <h1 class="title">მომხმარებლის რედაქტირება</h1>
    <form @submit.prevent="save()">
      <div class="field">
        <label class="label">სახელი</label>
        <div class="control">
          <input type="text" class="input is-large" v-model="user.name" />
        </div>
      </div>
      <div class="field">
        <label class="label">ელ-ფოსტა</label>
        <div class="control">
          <input type="text" class="input is-large" v-model="user.email" />
        </div>
      </div>
      <div class="field">
        <label class="label">ელ-ფოსტა (დასადასტურებელი)</label>
        <div class="control">
          <input type="text" class="input is-large" v-model="user.unconfirmedEmail" />
        </div>
      </div>
      <div class="field">
        <label class="label">პაროლი</label>
        <div class="control">
          <input type="text" class="input is-large" v-model="user.password" placeholder="(უცვლელი)" />
        </div>
      </div>
      <div class="field">
        <label class="label">როლი</label>
        <div class="control">
          <div class="select">
            <select v-model="user.role" :disabled="user._id === $auth.user._id">
              <option value="admin">ადმინისტრატორი</option>
              <option value="user">მომხმარებელი</option>
            </select>
          </div>
        </div>
      </div>
      <div class="field is-grouped is-grouped-centered">
        <div class="control">
          <button type="submit" class="button is-success is-large">შენახვა</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {},
      new: false
    };
  },
  created() {
    this.fetchData();
  },
  watch: {
    $route: "fetchData"
  },
  methods: {
    fetchData: function() {
      if (this.$route.params.id === "new") {
        this.new = true;
        this.user = {};
        return;
      }
      this.new = false;
      this.$axios
        .get("/api/admin/users/" + this.$route.params.id)
        .then(response => {
          this.user = response.data;
          this.user.password = "";
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
          .post("/api/admin/users", this.user)
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
      } else {
        this.$axios
          .put("/api/admin/users/" + this.user._id, this.user)
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
    }
  }
};
</script>

<style>
</style>