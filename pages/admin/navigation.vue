<template>
  <div>
    <h1 class="title">ნავიგაცია</h1>

    
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
        .get("/api/admin/")
        .then(response => {
          this.files = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    removeFile: function(file) {
        if(!confirm("დარწმუნებული ხართ რომ გსურთ ფაილის წაშლა?"))
            return;
        this.$axios.delete('/api/admin/files/' + file._id).then(()=> {
            this.fetchData();
        }).catch((error) => console.error(error));
    }
  }
};
</script>

<style>
</style>
