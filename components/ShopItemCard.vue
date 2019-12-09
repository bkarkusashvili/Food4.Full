<template>
  <div class="shop-item-card"></div>
</template>

<script>
export default {
    data() {
        return {
            item: {}
        }
    },
    methods: {
        fetchItem() {

        }
    },
    mounted() {
        if(typeof this.itemProp === 'object') {
            this.item = this.itemProp;
        } else {
            this.fetchItem();
        }
    },
    props: {
        itemProp: Object,
        id: String
    }
}
</script>

<style>

</style>