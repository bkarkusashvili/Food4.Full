<template>
  <div class="modal" :class="{ 'is-active': show }">
    <div class="modal-background" @click="close()"></div>
    <div class="modal-content">
      <div class="box">
        <div class="field">
          <label class="label">ტეგები</label>
          <div class="control">
            <a class="tag is-medium" v-for="tag in tags" :key="tag._id" @click="toggleTag(tag)">
              <span class="icon">
                <i class="mdi mdi-check" v-show="isSelected(tag)"></i>
              </span>

              <span>{{tag.title}}</span>
            </a>
          </div>
        </div>
        <div class="field is-grouped is-grouped-centered">
          <div class="control">
            <button
              type="button"
              class="button is-success"
              @click="save()"
              :disabled="!canSave()"
              v-show="!single"
            >არჩევა</button>
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
    single: Boolean,
    show: Boolean,
    exclude: Array
  },
  data() {
    return {
      tags: [],
      selectedTags: []
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    canSave() {
      return this.selectedTags.length > 0;
    },
    fetchData() {
      this.$axios
        .get("/api/admin/tags")
        .then(response => {
          this.tags = response.data;
          this.filterExcluded();
        })
        .catch(error => console.error(error));
    },
    filterExcluded() {
      if (this.exclude && this.exclude.length) {
        let excludedIds = this.exclude.map(item => item._id);
        this.tags = this.tags.filter(tag => {
          return excludedIds.indexOf(tag._id) === -1;
        });
      }
    },
    isSelected(tag) {
      return this.selectedTags.indexOf(tag) !== -1;
    },
    toggleTag(tag) {
      this.isSelected(tag) ? this.deselectTag(tag) : this.selectTag(tag);
    },
    selectTag(tag) {
      this.selectedTags.push(tag);
      if (this.single) {
        this.save();
      }
    },
    deselectTag(tag) {
      this.selectedTags.splice(this.selectedTags.indexOf(tag), 1);
    },
    close() {
      this.$emit("hide");
    },
    save() {
      this.$emit(
        "select",
        this.single ? this.selectedTags[0] : this.selectedTags
      );
      this.close();
    },
    clear() {
      this.selectedTags = [];
      this.filterExcluded();
    }
  },
  watch: {
    show: "clear",
    excluded: "filterExcluded"
  }
};
</script>
