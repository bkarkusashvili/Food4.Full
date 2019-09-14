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
        <div class="control">
          <input type="text" class="input" v-model="filter.q" placeholder="სათაური" />
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
            <a :href="'/pages/' + page.slug" target="_blank">{{page.title || page.slug}}</a>
          </td>
          <td style="width: 18em">
            <nuxt-link :to="'/admin/pages/' + page._id" class="button">
              <span class="icon">
                <i class="mdi mdi-file-document-edit"></i>
              </span>
              <span>რედაქტირება</span>
            </nuxt-link>
            <a class="button is-danger" @click="removePage(page)">
              <span class="icon">
                <i class="mdi mdi-delete"></i>
              </span>
              <span>წაშლა</span>
            </a>
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
      pages: [],
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
    removePage: function(page) {
      if (!confirm("ნამდვილად გსურთ გვერდის წაშლა?")) return;
      this.$axios
        .delete("/api/admin/pages/" + page._id)
        .then(response => {
          this.$notifySuccess({
            title: "გვერდი წაშლილია",
            text: "გვერდი წარმატებით წაიშალა!"
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
        .get("/api/admin/pages", { params: this.queryParams() })
        .then(response => {
          this.pages = response.data;
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
    "filter.q": "fetchData"
  }
};
</script>

<style>
</style>
