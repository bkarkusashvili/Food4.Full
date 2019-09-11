<template>
  <div class="modal" :class="{ 'is-active': show }">
    <div class="modal-background" @click="close()"></div>
    <div class="modal-content">
      <div class="box">
        <form @submit.prevent="save()" class="form">
          <div class="field">
            <label class="label">სახელი</label>
            <div class="control">
              <input type="text" class="input" v-model="tag.title" @keyup="titleModified" />
            </div>
          </div>
          <div class="field">
            <label class="label">სახელი ლათინურად (slug)</label>
            <div class="control">
              <input type="text" class="input" v-model="tag.slug" @keyup="slugModified" />
            </div>
          </div>
          <div class="field">
            <label class="checkbox">
              <input type="checkbox" v-model="tag.invisible" />
              მომხმარებლისგან დამალული
            </label>
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
    tag: Object
  },
  methods: {
    close() {
      this.$emit("hide");
    },
    save() {
      if (this.tag.new) {
        this.$axios
          .post("/api/admin/tags", this.tag)
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
          .put("/api/admin/tags/" + this.tag._id, this.tag)
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
        !this.tag ||
        !this.tag.title ||
        this.tag.slugModified
      )
        return;
      this.tag.slug = slugify(this.tag.title);
      this.$forceUpdate();
    },
    slugModified: function() {
      if (!this.tag) return;
      this.tag.slugModified = this.tag.slug != "";
    },
  }
};
</script>

<style>
</style>