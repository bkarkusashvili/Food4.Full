<template>
  <div class="modal" :class="{ 'is-active': show }">
    <div class="modal-background" @click="close()"></div>
    <div class="modal-content">
      <div class="box">
        <div class="field">
          <label class="label">მომხმარებლები</label>

          <div class="control" style="margin-bottom: 1em">
            <input type="text" class="input" placeholder="სახელი ან ელ-ფოსტა" v-model="filterText" />
          </div>

          <div class="control" v-for="user in users" style="margin-bottom: 10px">
            <a @click="selectUser(user)" class="box is-small">
              <strong>{{user.name}}</strong><br>
              {{user.email}}
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
      users: [],
      filterText: ""
    };
  },
  mounted() {
    this.fetchUsers();
  },
  computed: {},
  methods: {
    fetchUsers() {
      let params = {
        limit: 20
      };
      if (this.filterText) params.q = this.filterText;

      this.$axios
        .get("/api/admin/users", { params })
        .then(response => {
          this.users = response.data;
        })
        .catch(error => console.error(error));
    },
    close() {
      this.filterText = "";
      this.$emit("hide");
    },
    selectUser(user) {
      this.$emit("select", user);
      this.close();
    }
  },
  watch: {
    filterText: "fetchUsers"
  }
};
</script>
