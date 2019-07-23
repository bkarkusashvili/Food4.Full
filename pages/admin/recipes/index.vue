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
      </div>
    </form>

    <table class="table is-striped is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>სათაური</th>
          <th>სტატუსი</th>
          <th>თარიღი</th>
          <th>ტეგები</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in posts" :key="post._id">
          <td>
            <a :href="'/recipes/' + post._id" target="_blank">{{post.title}}</a>
          </td>
          <td>
            <span class="tag is-success" v-if="post.status === 'published'">გამოქვეყნებული</span>
            <span class="tag" v-if="post.status === 'draft'">გამოუქვეყნებელი</span>
            <span class="tag is-warning" v-if="post.status === 'archived'">დაარქივებული</span>
          </td>
          <td>{{post.publishedAt | dateTime}}</td>
          <td>
            <span v-for="tag in post.tags" class="tag is-medium" :key="tag._id">{{tag.title}}</span>
          </td>
          <td style="width: 1em">
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
                  <a class="dropdown-item has-text-success" @click="publishPost(post)" v-if="post.status !== 'published'">
                    <span class="icon">
                      <i class="mdi mdi-publish"></i>
                    </span>
                    <span>გამოქვეყნება</span>
                  </a>
                  <a class="dropdown-item has-text-warning" @click="unpublishPost(post)" v-if="post.status === 'published'">
                    <span class="icon">
                      <i class="mdi mdi-minus-circle"></i>
                    </span>
                    <span>გამოქვეყნების გაუქმება</span>
                  </a>
                  <a class="dropdown-item has-text-danger" @click="archivePost(post)" v-if="post.status !== 'archived'">
                    <span class="icon">
                      <i class="mdi mdi-package-down"></i>
                    </span>
                    <span>დაარქივება</span>
                  </a>
                  <a class="dropdown-item has-text-danger" @click="removePost(post)" v-if="post.status === 'archived'">
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
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      posts: [],
      filter: {
        status: ""
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    archivePost: function(post) {
      if (!confirm("ნამდვილად გსურთ რეცეპტის დაარქივება?")) return;
      this.$axios
        .put("/api/admin/posts/" + post._id, {
          status: "archived"
        })
        .then(response => {
          this.fetchData();
        })
        .catch(error => console.error(error));
    },
    publishPost: function(post) {
      if (!confirm("ნამდვილად გსურთ რეცეპტის გამოქვეყნება?")) return;
      this.$axios
        .put("/api/admin/posts/" + post._id, {
          status: "published",
          publishedAt: post.publishedAt || new Date()
        })
        .then(response => {
          this.fetchData();
        })
        .catch(error => console.error(error));
    },
    unpublishPost: function(post) {
      if (!confirm("ნამდვილად გსურთ რეცეპტის გამოქვეყნების გაუქმება?")) return;
      this.$axios
        .put("/api/admin/posts/" + post._id, {
          status: "draft"
        })
        .then(response => {
          this.fetchData();
        })
        .catch(error => console.error(error));
    },
    removePost: function(post) {
      if (!confirm("ნამდვილად გსურთ რეცეპტის წაშლა?")) return;
      this.$axios
        .delete("/api/admin/posts/" + post._id)
        .then(response => {
          this.fetchData();
        })
        .catch(error => console.error(error));
    },
    fetchData: function() {
      this.$axios
        .get("/api/admin/posts", { params: this.filter })
        .then(response => {
          this.posts = response.data;
        })
        .catch(error => console.error(error));
    }
  },
  watch: {
    $route: "fetchData",
    'filter.status': "fetchData"
  }
};
</script>

<style>
</style>
