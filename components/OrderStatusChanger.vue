<template>
  <div class="modal order-status-changer" :class="{ 'is-active': show }">
    <div class="modal-background" @click="close()"></div>
    <div class="modal-content">
      <div class="box">
        <div class="field">
          <label class="label">სტატუსის შეცვლა</label>
          <div class="control">
            <div class="select is-fullwidth">
              <select v-model="selectedStatus">
                <option v-for="(status, key) in statuses" :value="key">{{status}}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="field is-grouped is-grouped-centered">
          <div class="control">
            <button type="button" class="button is-success" @click="save()">შეცვლა</button>
          </div>
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
    show: Boolean,
    order: Object
  },
  data() {
    return {
      selectedStatus: null,
      statuses: {
        CREATED: "შექმნილია",
        PAYMENT_PENDING: "გადასახდელია",
        PAID: "გადახდილია",
        SHIPPED: "გაგზავნილია",
        FINISHED: "დასრულებულია",
        CANCELLED: "გაუქმებულია"
      }
    };
  },
  mounted() {},
  computed: {},
  methods: {
    close() {
      this.$emit("hide");
    },
    save() {
      if (!confirm("დარწმუნებული ხართ რომ გსურთ სტატუსის შეცვლა?")) return;
      this.$emit("select", this.selectedStatus);
      this.close();
    },
    clear() {
      if (this.order && this.order.status) {
        this.selectedStatus = this.order.status;
      } else {
        this.selectedStatus = null;
      }
    }
  },
  watch: {
    show: "clear"
  }
};
</script>
<style>
</style>