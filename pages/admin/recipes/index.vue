<template>
  <div>
    <h1 class="title">რეცეპტები</h1>

    <form class="form">
      <div class="field is-grouped">
        <div class="control">
          <nuxt-link to="/admin/recipes/new" class="button is-success">
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
          <th style="width: 30%">სათაური</th>
          <th style="width: 9em">სტატუსი</th>
          <th style="width: 10em">თარიღი</th>
          <th>ტეგები</th>
          <th style="width: 1em"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in posts" :key="post._id">
          <td>
            <a :href="'/recipes/' + post.slug" target="_blank">{{post.title || post.slug}}</a>
          </td>
          <td>
            <span class="tag is-warning" v-if="post.featured">რჩეული</span>
            <span class="tag is-success" v-if="post.status === 'published'">გამოქვეყნებული</span>
            <span class="tag" v-if="post.status === 'draft'">გამოუქვეყნებელი</span>
            <span class="tag is-warning" v-if="post.status === 'archived'">დაარქივებული</span>
          </td>
          <td>{{post.publishedAt | dateTime}}</td>
          <td>
            <span v-for="tag in post.tags" class="tag is-medium" :key="tag._id">{{tag.title}}</span>
          </td>
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
                  <nuxt-link :to="'/admin/recipes/' + post._id" class="dropdown-item">
                    <span class="icon">
                      <i class="mdi mdi-file-document-edit"></i>
                    </span>
                    <span>რედაქტირება</span>
                  </nuxt-link>
                  <a
                    class="dropdown-item has-text-success"
                    @click="publishPost(post)"
                    v-if="post.status !== 'published'"
                  >
                    <span class="icon">
                      <i class="mdi mdi-publish"></i>
                    </span>
                    <span>გამოქვეყნება</span>
                  </a>
                  <a
                    class="dropdown-item has-text-warning"
                    @click="unpublishPost(post)"
                    v-if="post.status === 'published'"
                  >
                    <span class="icon">
                      <i class="mdi mdi-minus-circle"></i>
                    </span>
                    <span>გამოქვეყნების გაუქმება</span>
                  </a>
                  <a
                    class="dropdown-item has-text-danger"
                    @click="archivePost(post)"
                    v-if="post.status !== 'archived'"
                  >
                    <span class="icon">
                      <i class="mdi mdi-package-down"></i>
                    </span>
                    <span>დაარქივება</span>
                  </a>
                  <a
                    class="dropdown-item has-text-danger"
                    @click="removePost(post)"
                    v-if="post.status === 'archived'"
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
      posts: [],
      filter: {
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
    archivePost: function(post) {
      if (!confirm("ნამდვილად გსურთ რეცეპტის დაარქივება?")) return;
      this.$axios
        .put("/api/admin/posts/" + post._id, {
          status: "archived"
        })
        .then(response => {
          this.$notifySuccess({
            title: "რეცეპტი დაარქივებულია",
            text: "რეცეპტი წარმატებით დაარქივდა!"
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
    publishPost: function(post) {
      if (!confirm("ნამდვილად გსურთ რეცეპტის გამოქვეყნება?")) return;
      this.$axios
        .put("/api/admin/posts/" + post._id, {
          status: "published",
          publishedAt: post.publishedAt || new Date()
        })
        .then(response => {
          this.$notifySuccess({
            title: "რეცეპტი გამოქვეყნებულია",
            text: "რეცეპტი წარმატებით გამოქვეყნდა!"
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
    unpublishPost: function(post) {
      if (!confirm("ნამდვილად გსურთ რეცეპტის გამოქვეყნების გაუქმება?")) return;
      this.$axios
        .put("/api/admin/posts/" + post._id, {
          status: "draft"
        })
        .then(response => {
          this.$notifySuccess({
            title: "რეცეპტი გამოქვეყნებიდან მოხსნილია",
            text: "რეცეპტი წარმატებით მოიხსნა გამოქვეყნებულებიდან!"
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
    removePost: function(post) {
      if (!confirm("ნამდვილად გსურთ რეცეპტის წაშლა?")) return;
      this.$axios
        .delete("/api/admin/posts/" + post._id)
        .then(response => {
          this.$notifySuccess({
            title: "რეცეპტი წაშლილია",
            text: "რეცეპტი წარმატებით წაიშალა!"
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
        .get("/api/admin/posts", { params: this.queryParams() })
        .then(response => {
          this.posts = response.data;
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
