<template>
  <div>
    <h1 class="title">
      რეცეპტები
      <router-link to="/admin/recipes/new" class="button is-success">
        <span class="icon">
          <i class="mdi mdi-plus"></i>
        </span>
        <span>დამატება</span>
      </router-link>
    </h1>

    <table class="table is-striped is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>სახელი</th>
          <th>ტეგები</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in posts" :key="post._id">
          <td>{{post.title}}</td>
          <td>
            <span v-for="tag in post.tags" class="tag" :key="tag">{{tag}}</span>
          </td>
          <td>
            <nuxt-link :to="'/admin/recipes/' + post._id" class="button is-primary">
              <span class="icon"><i class="mdi mdi-file-document-edit"></i></span>
              <span>რედაქტირება</span>
            </nuxt-link>
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
      posts: []
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData: function() {
      this.$axios.get("/api/admin/posts").then(response => {
        this.posts = response.data;
      }).catch((error) => console.error(error));
    }
  },
  watch: {
      '$route': 'fetchData'
  }
};
</script>

<style>
</style>
