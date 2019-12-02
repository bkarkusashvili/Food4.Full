<template>
  <div>
    <h1 class="title">ფაილები</h1>

    <table class="table is-striped is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>სახელი</th>
          <th style="width: 8em">ტიპი</th>
          <th style="width: 6em">ზომა</th>
          <th style="width: 11em">თარიღი</th>
          <th style="width: 5em"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="file in files" :key="file._id">
          <td>
            <a :href="file.url" target="_blank">{{file.friendlyName}}</a>
          </td>
          <td>{{file.mimetype}}</td>
          <td>{{file.size | prettyBytes}}</td>
          <td>{{file.createdAt | dateTime}}</td>
          <td>
            <button type="button" class="button is-danger" @click="removeFile(file)">
              <span class="icon">
                <i class="mdi mdi-delete"></i>
              </span>
              <span>წაშლა</span>
            </button>
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
      files: [],
      page: 1,
      perPage: 25,
      total: 1
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData: function() {
      this.$axios
        .get("/api/admin/files", { params: this.queryParams() })
        .then(response => {
          this.files = response.data;
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
    gotoPage(page) {
      this.page = parseInt(page);
      this.fetchData();
    },
    removeFile: function(file) {
      if (!confirm("დარწმუნებული ხართ რომ გსურთ ფაილის წაშლა?")) return;
      this.$axios
        .delete("/api/admin/files/" + file._id)
        .then(() => {
          this.$notifySuccess({
            title: "ფაილი წაშლილია",
            text: "ფაილი წარმატებით წაიშალა!"
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
    queryParams() {
      return {
        offset: (this.page - 1) * this.perPage,
        limit: this.perPage
      };
    }
  }
};
</script>

<style>
</style>
