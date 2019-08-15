<template>
  <div class="modal" :class="{ 'is-active': show }">
    <div class="modal-background" @click="close()"></div>
    <div class="modal-content">
      <div class="box">
        <div class="field">
          <label class="label">გვერდები</label>
          <div class="control">
            <a
              class="tag is-medium"
              v-for="page in pages"
              :key="page._id"
              @click="selectPage(page)"
            >
              <span>{{page.title}}</span>
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
      pages: []
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.$axios
        .get("/api/admin/pages")
        .then(response => {
          this.pages = response.data;
        })
        .catch(error => console.error(error));
    },
    close() {
      this.$emit("hide");
    },
    selectPage(page) {
      this.$emit("select", page);
      this.close();
    },
  },
  watch: {
  }
};
</script>
