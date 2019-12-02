<template>
  <div class="modal" :class="{ 'is-active': show }">
    <div class="modal-background" @click="close()"></div>
    <div class="modal-content">
      <div class="box">
        <div class="field">
          <label class="label">კატეგორიები</label>

          <div class="control" style="margin-bottom: 1em">
            <input type="text" class="input" placeholder="ძებნა" v-model="filterText" />
          </div>

          <div class="control">
            <a
              class="tag is-medium"
              v-for="category in categories"
              :key="category._id"
              @click="selectCategory(category)"
            >
              <span>{{category.title}}</span>
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
      categories: [],
      filterText: ""
    };
  },
  mounted() {
    this.fetchCategories();
  },
  computed: {},
  methods: {
    fetchCategories() {
      let params = {
        limit: 20
      };
      if (this.filterText) params.q = this.filterText;

      this.$axios
        .get("/api/admin/shop/categories", { params })
        .then(response => {
          this.categories = response.data;
        })
        .catch(error => console.error(error));
    },
    close() {
      this.filterText = "";
      this.$emit("hide");
    },
    selectCategory(category) {
      this.$emit("select", category);
      this.close();
    }
  },
  watch: {
    filterText: "fetchCategories"
  }
};
</script>
