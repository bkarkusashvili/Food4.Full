<template>
  <div class="modal" :class="{ 'is-active': show }">
    <div class="modal-background" @click="close()"></div>
    <div class="modal-content">
      <div class="box">
        <form @submit.prevent="save()" class="form">
          <div class="field">
            <label class="label">სახელი</label>
            <div class="control">
              <input type="text" class="input" v-model="category.title" @keyup="titleModified" />
            </div>
          </div>
          <div class="field">
            <label class="label">სახელი ლათინურად (slug)</label>
            <div class="control">
              <input type="text" class="input" v-model="category.slug" @keyup="slugModified" />
            </div>
          </div>
          <div class="field">
            <label class="label">პრიორიტეტი დალაგებაში</label>
            <div class="control">
              <input type="number" class="input" v-model="category.priority" />
            </div>
          </div>
          <div class="field is-grouped is-grouped-centered">
            <div class="control">
              <button type="submit" class="button is-success">შენახვა</button>
            </div>
            <div class="control">
              <button type="button" class="button is-danger" @click="close()">გაუქმება</button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="close()"></button>
  </div>
</template>

<script>
import slugify from "slugify";

export default {
  props: {
    show: Boolean,
    category: Object
  },
  methods: {
    close() {
      this.$emit("hide");
    },
    save() {
      if (this.category.new) {
        this.$axios
          .post("/api/admin/shop/categories", this.category)
          .then(response => {
              this.$emit('saved', response.data);
              this.close();
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
          .put("/api/admin/shop/categories/" + this.category._id, this.category)
          .then(response => {
              this.$emit('saved', response.data);
              this.close();
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
    titleModified: function() {
      if (
        !this.category ||
        !this.category.title ||
        this.category.slugModified
      )
        return;
      this.category.slug = slugify(this.category.title);
      this.$forceUpdate();
    },
    slugModified: function() {
      if (!this.category) return;
      this.category.slugModified = this.category.slug != "";
    },
  }
};
</script>

<style>
</style>