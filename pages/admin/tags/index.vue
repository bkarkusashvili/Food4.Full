<template>
  <div>
    <h1 class="title">ტეგები</h1>

    <form class="form">
      <div class="field is-grouped">
        <div class="control">
          <button type="button" class="button is-success" @click="addTag()">
            <span class="icon">
              <i class="mdi mdi-plus"></i>
            </span>
            <span>ახლის დამატება</span>
          </button>
        </div>
        <div class="control">
          <input type="text" class="input" v-model="filter.q" placeholder="სახელი" />
        </div>
      </div>
    </form>

    <table class="table is-striped is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>სახელი</th>
          <th>slug</th>
          <th>პრიორიტეტი</th>
          <th>შექმნილია</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tag in tags" :key="tag._id">
          <td>
            <span class="icon" v-if="tag.invisible" title="მომხმარებლისგან დამალული">
              <i class="mdi mdi-eye-off"></i>
            </span>
            <span class="icon" v-if="tag.featured" title="ჩანს მთავარ გვერდზე">
              <i class="mdi mdi-star"></i>
            </span>
            <span>{{tag.title}}</span>
          </td>
          <td>{{tag.slug}}</td>
          <td>{{tag.priority}}</td>
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

    <pagination :page="page" :per-page="perPage" :total="total" @goto="gotoPage" />

    <tag-editor
      :show="showEditModal"
      @hide="showEditModal = false"
      :tag="editingTag"
      @saved="tagSaved"
    />
  </div>
</template>

<script>
import slugify from "slugify";
import TagEditor from "../../../components/TagEditor";

export default {
  components: { TagEditor },
  data() {
    return {
      tags: [],
      showEditModal: false,
      editingTag: {},
      filter: {
        q: ""
      },
      page: 1,
      perPage: 25,
      total: 1
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    gotoPage(page) {
      this.page = parseInt(page);
      this.fetchData();
    },
    fetchData: function() {
      this.$axios
        .get("/api/admin/tags", { params: this.queryParams() })
        .then(response => {
          this.tags = response.data;
          let total = response.headers["x-total-count"];
          if (!isNaN(total)) this.total = parseInt(total);
        })
        .catch(err => {
          console.error(err);
          this.$notifyError({
            title: "მოხდა შეცდომა!",
            text: err.message
          });
        });
    },
    removeTag: function(tag) {
      if (!confirm("ნამდვილად გსურთ ტეგის წაშლა?")) return;
      this.$axios
        .delete("/api/admin/tags/" + tag._id)
        .then(response => {
          this.fetchData();
        })
        .catch(err => {
          console.error(err);
          this.$notifyError({
            title: "მოხდა შეცდომა!",
            text: err.message
          });
        });
    },
    editTag: function(tag) {
      this.editingTag = Object.assign({}, tag);
      if (this.editingTag.slug != slugify(this.editingTag.title || "")) {
        this.editingTag.slugModified = true;
      }
      this.openEditModal();
    },
    addTag: function() {
      this.editingTag = { new: true, priority: 0 };
      this.openEditModal();
    },
    openEditModal: function() {
      this.showEditModal = true;
    },
    closeEditModal: function() {
      this.showEditModal = false;
    },
    tagSaved() {
      this.fetchData();
    },
    queryParams() {
      return Object.assign({}, this.filter, {
        offset: (this.page - 1) * this.perPage,
        limit: this.perPage
      });
    }
  },
  watch: {
    $route: "fetchData",
    "filter.q": "fetchData"
  }
};
</script>

<style>
</style>
