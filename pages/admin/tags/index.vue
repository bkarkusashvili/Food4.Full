<template>
  <div>
    <h1 class="title">ტეგები</h1>

    <form class="form">
      <button type="button" class="button is-success" @click="addTag()">
        <span class="icon">
          <i class="mdi mdi-plus"></i>
        </span>
        <span>დამატება</span>
      </button>
    </form>

    <table class="table is-striped is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>სახელი</th>
          <th>slug</th>
          <th>შექმნილია</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tag in tags" :key="tag._id">
          <td>{{tag.title}}</td>
          <td>{{tag.slug}}</td>
          <td>{{tag.createdAt | dateTime}}</td>

          <td style="width: 18em">
            <button type="button" class="button is-primary" @click="editTag(tag)">
              <span class="icon">
                <i class="mdi mdi-file-document-edit"></i>
              </span>
              <span>რედაქტირება</span>
            </button>
            <button type="button" class="button is-danger" @click="removeTag(tag)">
              <span class="icon">
                <i class="mdi mdi-delete"></i>
              </span>
              <span>წაშლა</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="modal" :class="{ 'is-active': showEditModal }">
      <div class="modal-background" @click="closeEditModal()"></div>
      <div class="modal-content">
        <div class="box">
          <form @submit.prevent="saveTag()" class="form">
            <div class="field">
              <label class="label">სახელი</label>
              <div class="control">
                <input type="text" class="input" v-model="editingTag.title" />
              </div>
            </div>
            <div class="field">
              <label class="label">სახელი ლათინურად (slug)</label>
              <div class="control">
                <input type="text" class="input" v-model="editingTag.slug" />
              </div>
            </div>
            <div class="field is-grouped is-grouped-centered">
              <div class="control">
                <button type="submit" class="button is-success">შენახვა</button>
              </div>
              <div class="control">
                <button type="button" class="button is-danger" @click="closeEditModal()">გაუქმება</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="closeEditModal()"></button>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      tags: [],
      showEditModal: false,
      editingTag: {}
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData: function() {
      this.$axios
        .get("/api/admin/tags")
        .then(response => {
          this.tags = response.data;
        })
        .catch(error => console.error(error));
    },
    saveTag: function() {
      if (this.editingTag.new) {
        this.$axios
          .post("/api/admin/tags", this.editingTag)
          .then(response => {
            this.fetchData();
            this.closeEditModal();
          })
          .catch(error => console.error(error));
      } else {
        this.$axios
          .put("/api/admin/tags/" + this.editingTag._id, this.editingTag)
          .then(response => {
            this.fetchData();
            this.closeEditModal();
          })
          .catch(error => console.error(error));
      }
    },
    removeTag: function(tag) {
      if (!confirm("ნამდვილად გსურთ ტეგის წაშლა?")) return;
      this.$axios
        .delete("/api/admin/tags/" + tag._id)
        .then(response => {
          this.fetchData();
        })
        .catch(error => console.error(error));
    },
    editTag: function(tag) {
      this.editingTag = tag;
      this.openEditModal();
    },
    addTag: function() {
      this.editingTag = { new: true };
      this.openEditModal();
    },
    openEditModal: function() {
      this.showEditModal = true;
    },
    closeEditModal: function() {
      this.showEditModal = false;
    }
  },
  watch: {
    $route: "fetchData"
  }
};
</script>

<style>
</style>
