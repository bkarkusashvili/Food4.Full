<template>
  <div class="modal order-status-changer" :class="{ 'is-active': show }">
    <div class="modal-background" @click="close()"></div>
    <div class="modal-content">
      <div class="box">
        <div class="field">
          <label class="label">გადახდის ლოგი</label>
          <div class="control" v-if="order && order.paymentLog">
            <div class="message" v-for="log in order.paymentLog">
              <div class="message-header">
                <strong>{{log.operation}}</strong>
                {{log.date | dateTime}}
              </div>
              <div class="message-body">
                <pre>{{log.result | json}}</pre>
              </div>
            </div>
          </div>
          <div
            class="control notification is-info"
            v-if="!order || !order.paymentLog || !order.paymentLog.length"
          >გადახდის ლოგი ცარიელია</div>
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
    show: Boolean,
    order: Object
  },
  data() {
    return {};
  },
  mounted() {},
  computed: {},
  methods: {
    close() {
      this.$emit("hide");
    }
  }
};
</script>
<style>
</style>