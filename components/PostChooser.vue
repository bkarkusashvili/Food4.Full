<template>
  <div class="modal" :class="{ 'is-active': show }">
    <div class="modal-background" @click="close()"></div>
    <div class="modal-content">
      <div class="box">
        <div class="field">
          <label class="label">რეცეპტები</label>

          <div class="control" style="margin-bottom: 1em">
            <input type="text" class="input" placeholder="ძებნა" v-model="filterText" />
          </div>

          <div class="control">
            <a
              class="tag is-medium"
              v-for="post in posts"
              :key="post._id"
              @click="selectPost(post)"
            >
              <span>{{post.title}}</span>
            </a>
          </div>
        </div>
        <div class="field is-grouped is-grouped-centered">
          <div class="control">
            <button type="button" class="button is-danger" @click="close()">დახურვა</button>
          </div>
        </div>
      </div>
    </div>
    <button type="button" class="modal-close is-large" aria-label="close" @click="close()"></button>
  </div>
</template>
<script>
export default {
  props: {
    show: Boolean
  },
  data() {
    return {
      posts: [],
      filterText: ""
    };
  },
  mounted() {
    this.fetchPosts();
  },
  computed: {},
  methods: {
    fetchPosts() {
      let params = {
        limit: 20
      };
      if (this.filterText) params.q = this.filterText;

      this.$axios
        .get("/api/admin/posts", { params })
        .then(response => {
          this.posts = response.data;
        })
        .catch(error => console.error(error));
    },
    close() {
      this.filterText = "";
      this.$emit("hide");
    },
    selectPost(post) {
      this.$emit("select", post);
      this.close();
    }
  },
  watch: {
    filterText: "fetchPosts"
  }
};
</script>
