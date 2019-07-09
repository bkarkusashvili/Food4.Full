<template>
  <div class="login-form">
    <form>
      <div class="field">
        <label class="label">ელ-ფოსტა</label>
        <div class="control">
          <input class="input" type="email" />
        </div>
      </div>
      <div class="field">
        <label class="label">პაროლი</label>
        <div class="control">
          <input class="input" type="password" />
        </div>
      </div>

      <div class="field">
        <div class="control">
          <label class="checkbox">
            <input type="checkbox" />
            დამიმახსოვრე
          </label>
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button class="button is-link">შესვლა</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>

<style>
</style>
