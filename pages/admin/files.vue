<template>
  <div>
    <h1 class="title">ფაილები</h1>

    <table class="table is-striped is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>სახელი</th>
          <th>ტიპი</th>
          <th>ზომა</th>
          <th>თარიღი</th>
          <th></th>
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
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      files: []
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData: function() {
      this.$axios
        .get("/api/admin/files")
        .then(response => {
          this.files = response.data;
        })
        .catch(err => {
          console.error(err);
          this.$notifyError({
            title: "მოხდა შეცდომა!",
            text: err.message
          });
        });
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
    }
  }
};
</script>

<style>
</style>
