<template>
  <div>
    <h1 class="title">მაღაზია - კატეგორიები</h1>

    <form class="form">
      <div class="field is-grouped">
        <div class="control">
          <button type="button" class="button is-success" @click="addCategory()">
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
          <th style="width: 4em">პრი.</th>
          <th style="width: 11em">შექმნილია</th>
          <th style="width: 18em"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in categories" :key="category._id">
          <td>
            <span class="icon" v-if="category.invisible" title="მომხმარებლისგან დამალული">
              <i class="mdi mdi-eye-off"></i>
            </span>
            <span class="icon" v-if="category.featured" title="ჩანს მთავარ გვერდზე">
              <i class="mdi mdi-star"></i>
            </span>
            <a :href="'/shop/' + category.slug" target="_blank">{{category.title}}</a>
          </td>
          <td>{{category.slug}}</td>
          <td>{{category.priority}}</td>
          <td>{{category.createdAt | dateTime}}</td>

          <td style="width: 18em">
            <button type="button" class="button is-primary" @click="editCategory(category)">
              <span class="icon">
                <i class="mdi mdi-file-document-edit"></i>
              </span>
              <span>რედაქტირება</span>
            </button>
            <button type="button" class="button is-danger" @click="removeCategory(category)">
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

    <category-editor
      :show="showEditModal"
      @hide="showEditModal = false"
      :category="editingCategory"
      @saved="categorySaved"
    />
  </div>
</template>

<script>
import slugify from "slugify";
import CategoryEditor from "../../../components/CategoryEditor";

export default {
  components: { CategoryEditor },
  data() {
    return {
      categories: [],
      showEditModal: false,
      editingCategory: {},
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
        .get("/api/admin/shop/categories", { params: this.queryParams() })
        .then(response => {
          this.categories = response.data;
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
    removeCategory: function(category) {
      if (!confirm("ნამდვილად გსურთ კატეგორიის წაშლა?")) return;
      this.$axios
        .delete("/api/admin/shop/categories/" + category._id)
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
    editCategory: function(category) {
      this.editingCategory = Object.assign({}, category);
      if (this.editingCategory.slug != slugify(this.editingCategory.title || "")) {
        this.editingCategory.slugModified = true;
      }
      this.openEditModal();
    },
    addCategory: function() {
      this.editingCategory = { new: true, priority: 0 };
      this.openEditModal();
    },
    openEditModal: function() {
      this.showEditModal = true;
    },
    closeEditModal: function() {
      this.showEditModal = false;
    },
    categorySaved() {
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
