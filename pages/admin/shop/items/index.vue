<template>
  <div>
    <h1 class="title">მაღაზია - ნივთები</h1>

    <form class="form">
      <div class="field is-grouped">
        <div class="control">
          <nuxt-link to="/admin/shop/items/new" class="button is-success">
            <span class="icon">
              <i class="mdi mdi-plus"></i>
            </span>
            <span>ახლის დამატება</span>
          </nuxt-link>
        </div>
        <div class="control">
          <div class="select">
            <select v-model="filter.status">
              <option value>ყველა</option>
              <option value="published">გამოქვეყნებული</option>
              <option value="draft">გამოუქვეყნებელი</option>
              <option value="archived">დაარქივებული</option>
            </select>
          </div>
        </div>
        <div class="control">
          <input type="text" class="input" v-model="filter.q" placeholder="სათაური" />
        </div>
      </div>
    </form>

    <table class="table is-striped is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>სათაური</th>
          <th style="width: 10em">კატეგორია</th>
          <th style="width: 5em">ფასი</th>
          <th style="width: 7em">მარაგშია</th>
          <th style="width: 11em">თარიღი</th>
          <th style="width: 1em"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item._id">
          <td>
            <a :href="'/shop/items/' + item.slug" target="_blank">{{item.title || item.slug}}</a>
          </td>
          <td>
            <span class="tag is-medium">{{item.categoryName}}</span>
          </td>
          <td>{{item.price | price}}</td>
          <td>{{item.stock}}</td>
          <td>{{item.createdAt | dateTime}}</td>
          <td>
            <div class="dropdown is-hoverable is-right">
              <div class="dropdown-trigger">
                <button
                  class="button is-primary"
                  aria-haspopup="true"
                  aria-controls="dropdown-menu"
                >
                  <span>მოქმედება</span>
                  <span class="icon">
                    <i class="mdi mdi-chevron-down" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
              <div class="dropdown-menu" id="dropdown-menu" role="menu">
                <div class="dropdown-content">
                  <nuxt-link :to="'/admin/shop/items/' + item._id" class="dropdown-item">
                    <span class="icon">
                      <i class="mdi mdi-file-document-edit"></i>
                    </span>
                    <span>რედაქტირება</span>
                  </nuxt-link>
                  <a
                    class="dropdown-item has-text-success"
                    @click="publishItem(item)"
                    v-if="item.status !== 'published'"
                  >
                    <span class="icon">
                      <i class="mdi mdi-publish"></i>
                    </span>
                    <span>გამოქვეყნება</span>
                  </a>
                  <a
                    class="dropdown-item has-text-warning"
                    @click="unpublishItem(item)"
                    v-if="item.status === 'published'"
                  >
                    <span class="icon">
                      <i class="mdi mdi-minus-circle"></i>
                    </span>
                    <span>გამოქვეყნების გაუქმება</span>
                  </a>
                  <a
                    class="dropdown-item has-text-danger"
                    @click="archiveItem(item)"
                    v-if="item.status !== 'archived'"
                  >
                    <span class="icon">
                      <i class="mdi mdi-package-down"></i>
                    </span>
                    <span>დაარქივება</span>
                  </a>
                  <a
                    class="dropdown-item has-text-danger"
                    @click="removeItem(item)"
                    v-if="item.status === 'archived'"
                  >
                    <span class="icon">
                      <i class="mdi mdi-delete"></i>
                    </span>
                    <span>წაშლა</span>
                  </a>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <pagination :page="page" :per-page="perPage" :total="total" @goto="gotoPage" />
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      items: [],
      filter: {
        type: "news",
        status: "",
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
    archiveItem: function(item) {
      if (!confirm("ნამდვილად გსურთ ნივთის დაარქივება?")) return;
      this.$axios
        .put("/api/admin/shop/items/" + item._id, {
          status: "archived"
        })
        .then(response => {
          this.$notifySuccess({
            title: "ნივთი დაარქივებულია",
            text: "ნივთი წარმატებით დაარქივდა!"
          });
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
    publishItem: function(item) {
      if (!confirm("ნამდვილად გსურთ ნივთის გამოქვეყნება?")) return;
      this.$axios
        .put("/api/admin/shop/items/" + item._id, {
          status: "published",
          publishedAt: item.publishedAt || new Date()
        })
        .then(response => {
          this.$notifySuccess({
            title: "ნივთი გამოქვეყნებულია",
            text: "ნივთი წარმატებით გამოქვეყნდა!"
          });
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
    unpublishItem: function(item) {
      if (!confirm("ნამდვილად გსურთ ნივთის გამოქვეყნების გაუქმება?")) return;
      this.$axios
        .put("/api/admin/shop/items/" + item._id, {
          status: "draft"
        })
        .then(response => {
          this.$notifySuccess({
            title: "ნივთი გამოქვეყნებიდან მოხსნილია",
            text: "ნივთი წარმატებით მოიხსნა გამოქვეყნებულებიდან!"
          });
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
    removeItem: function(item) {
      if (!confirm("ნამდვილად გსურთ ნივთის წაშლა?")) return;
      this.$axios
        .delete("/api/admin/shop/items/" + item._id)
        .then(response => {
          this.$notifySuccess({
            title: "ნივთი წაშლილია",
            text: "ნივთი წარმატებით წაიშალა!"
          });
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
    fetchData: function() {
      this.$axios
        .get("/api/admin/shop/items", { params: this.queryParams() })
        .then(response => {
          this.items = response.data;
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
    queryParams() {
      return Object.assign({}, this.filter, {
        offset: (this.page - 1) * this.perPage,
        limit: this.perPage
      });
    }
  },
  watch: {
    $route: "fetchData",
    "filter.status": "fetchData",
    "filter.q": "fetchData"
  }
};
</script>

<style>
</style>
