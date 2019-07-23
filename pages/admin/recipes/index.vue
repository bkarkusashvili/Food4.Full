<template>
  <div>
    <h1 class="title">
      რეცეპტები
      <nuxt-link to="/admin/recipes/new" class="button is-success">
        <span class="icon">
          <i class="mdi mdi-plus"></i>
        </span>
        <span>დამატება</span>
      </nuxt-link>
    </h1>

    <table class="table is-striped is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>სათაური</th>
          <th>თარიღი</th>
          <th>ტეგები</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in posts" :key="post._id">
          <td><a :href="'/recipes/' + post._id" target="_blank">{{post.title}}</a></td>
          <td>{{post.createdAt | dateTime}}</td>
          <td>
            <span v-for="tag in post.tags" class="tag" :key="tag">{{tag}}</span>
          </td>
          <td style="width: 18em">
            <nuxt-link :to="'/admin/recipes/' + post._id" class="button is-primary">
              <span class="icon"><i class="mdi mdi-file-document-edit"></i></span>
              <span>რედაქტირება</span>
            </nuxt-link>
            <button type="button" class="button is-danger">
              <span class="icon"><i class="mdi mdi-delete"></i></span>
              <span>წაშლა</span>
            </button>
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
