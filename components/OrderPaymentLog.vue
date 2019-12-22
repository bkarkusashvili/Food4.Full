<template>
  <div class="modal order-status-changer" :class="{ 'is-active': show }">
    <div class="modal-background" @click="close()"></div>
    <div class="modal-content">
      <div class="box">
        <div class="field">
          <label class="label">გადახდის ლოგი</label>
          <div class="control" v-if="order && order.paymentLog">
            <div class="message" v-for="(log, index) in order.paymentLog">
              <a class="message-header" @click="expandLog(index)">
                <strong style="color: white">
                  <i class="mdi mdi-chevron-down" v-if="expandedLog !== index"></i>
                  <i class="mdi mdi-chevron-up" v-else></i>
                  {{log.operation}}
                </strong>
                <span style="color:white">{{log.date | dateTime}}</span>
              </a>
              <div class="message-body is-paddingless" v-show="expandedLog === index">
                <pre style="background-color: #2d2d2d;color: white;"><code>{{log.result}}</code></pre>
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
    return {
      expandedLog: 0
    };
  },
  mounted() {
    this.expandedLog = 0;
  },
  computed: {},
  methods: {
    close() {
      this.$emit("hide");
      this.expandedLog = 0;
    },
    expandLog(index) {
      if (this.expandedLog === index) this.expandedLog = -1;
      else this.expandedLog = index;
    }
  }
};
</script>
<style>
</style>