<template>
  <div class="order-page">
    <div class="container">
      <h1 class="title has-text-centered">თქვენი შეკვეთა</h1>

      <ul
        class="steps is-narrow is-medium is-centered has-content-centered"
        v-if="order.status === 'CANCELLED'"
      >
        <li class="steps-segment is-active">
          <span class="steps-marker is-danger">
            <span class="icon">
              <i class="mdi mdi-cancel"></i>
            </span>
          </span>
          <div class="steps-content">
            <p class="heading">გაუქმებულია</p>
          </div>
        </li>
      </ul>

      <ul class="steps is-narrow is-medium is-centered has-content-centered" v-else>
        <li class="steps-segment" :class="{'is-active': order.status === 'PAID' }">
          <span class="steps-marker">
            <span class="icon">₾</span>
          </span>
          <div class="steps-content">
            <p class="heading">გადახდილია</p>
          </div>
        </li>
        <li class="steps-segment" :class="{'is-active': order.status === 'SHIPPED' }">
          <span class="steps-marker">
            <span class="icon">
              <i class="mdi mdi-truck"></i>
            </span>
          </span>
          <div class="steps-content">
            <p class="heading">გამოგზავნილია</p>
          </div>
        </li>
        <li class="steps-segment" :class="{'is-active': order.status === 'FINISHED' }">
          <span class="steps-marker">
            <span class="icon">
              <i class="mdi mdi-check"></i>
            </span>
          </span>
          <div class="steps-content">
            <p class="heading">ჩაბარებულია</p>
          </div>
        </li>
      </ul>

      <div class="columns">
        <div class="column">
          <div class="box">
            <h2 class="subtitle">ჩამონათვალი</h2>
            <table class="table is-fullwidth">
              <tr v-for="(item, index) in order.items" :key="index">
                <td>
                  <a :href="'/shop/items/' + item.slug" target="_blank">{{item.title}}</a>
                </td>
                <td class="has-text-right">{{item.price | price}} ₾</td>
                <td class="has-text-right">{{item.quantity}} ცალი</td>
              </tr>
              <tr>
                <th>სულ</th>
                <th class="has-text-right">{{order.amount | price}} ₾</th>
                <th class="has-text-right">{{order.itemCount}} ცალი</th>
              </tr>
            </table>
          </div>
        </div>
        <div class="column">
          <div class="box">
            <h2 class="subtitle">მისამართი</h2>
            <div>
              <i class="mdi mdi-account"></i>
              {{order.address.name}} {{order.address.surname}}</div>
            <div>
              <i class="mdi mdi-phone"></i>
              {{order.address.phone}}
              <i class="mdi mdi-city"></i>
              {{order.address.city}}
            </div>
            <div>
              <i class="mdi mdi-home"></i>
              {{order.address.address}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      order: {}
    };
  },
  asyncData({ params, error, $axios }) {
    return $axios
      .get("/api/user/orders/" + params.id)
      .then(response => {
        return { order: response.data };
      })
      .catch(err => {
        error({ statusCode: 404, message: "გვერდი ვერ მოიძებნა" });
      });
  },
  computed: {
  },
  head() {
    return {
      meta: [{ name: "robots", content: "noindex,nofollow" }]
    };
  }
};
</script>

<style>
.order-page {
  padding-bottom: 1em;
}
</style>