<template>
  <div>
    <h1 class="title">გვერდები</h1>

    <form class="form">
      <div class="field is-grouped">
        <div class="control">
          <nuxt-link to="/admin/pages/new" class="button is-success">
            <span class="icon">
              <i class="mdi mdi-plus"></i>
            </span>
            <span>ახლის დამატება</span>
          </nuxt-link>
        </div>
      </div>
    </form>

    <table class="table is-striped is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>სათაური</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="page in pages" :key="page._id">
          <td>
            <a :href="'/pages/' + page.slug" target="_blank">{{page.title}}</a>
          </td>
          <td>
            <span v-for="tag in page.tags" class="tag is-medium" :key="tag._id">{{tag.title}}</span>
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
                  <nuxt-link :to="'/admin/pages/' + page._id" class="dropdown-item">
                    <span class="icon">
                      <i class="mdi mdi-file-document-edit"></i>
                    </span>
                    <span>რედაქტირება</span>
                  </nuxt-link>
                  <a class="dropdown-item has-text-danger" @click="removepage(page)" v-if="page.status === 'archived'">
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
      pages: [],
      filter: {
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    removepage: function(page) {
      if (!confirm("ნამდვილად გსურთ რეცეპტის წაშლა?")) return;
      this.$axios
        .delete("/api/admin/pages/" + page._id)
        .then(response => {
          this.fetchData();
        })
        .catch(error => console.error(error));
    },
    fetchData: function() {
      this.$axios
        .get("/api/admin/pages", { params: this.filter })
        .then(response => {
          this.pages = response.data;
        })
        .catch(error => console.error(error));
    }
  },
  watch: {
    $route: "fetchData"
  }
};
</script>

<style>
</style>
