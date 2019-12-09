<template>
  <div class="order-page">
    <div class="container">
      <ul class="steps is-narrow is-medium is-centered has-content-centered">
        <li class="steps-segment" :class="{'is-active': step === 'cart'}">
          <span class="steps-marker">
            <span class="icon">
              <i class="mdi mdi-cart"></i>
            </span>
          </span>
          <div class="steps-content">
            <p class="heading">კალათა</p>
          </div>
        </li>
        <li class="steps-segment" :class="{'is-active': step === 'address'}">
          <span class="steps-marker">
            <span class="icon">
              <i class="mdi mdi-truck"></i>
            </span>
          </span>
          <div class="steps-content">
            <p class="heading">მისამართი</p>
          </div>
        </li>
        <li class="steps-segment" :class="{'is-active': step === 'confirmation'}">
          <span class="steps-marker">
            <span class="icon">
              <i class="mdi mdi-check"></i>
            </span>
          </span>
          <div class="steps-content">
            <p class="heading">დადასტურება</p>
          </div>
        </li>
        <li class="steps-segment" :class="{'is-active': step === 'payment'}">
          <span class="steps-marker">
            <span class="icon">₾</span>
          </span>
          <div class="steps-content">
            <p class="heading">გადახდა</p>
          </div>
        </li>
      </ul>

      <div v-if="step === 'cart'">
        <full-cart />
      </div>
      <div v-if="step === 'address'">
      </div>
      <div v-if="step === 'confirmation'">
      </div>
      <div v-if="step === 'payment'">
      </div>
    </div>
  </div>
</template>

<script>
import FullCart from "../../components/FullCart";

export default {
  components: { FullCart },
  data() {
    return {
      order: {},
      step: "cart"
    };
  },
  methods: {}
};
</script>

<style>
</style>