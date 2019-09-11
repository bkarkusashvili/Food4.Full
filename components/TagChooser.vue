<template>
  <div class="modal tag-chooser" :class="{ 'is-active': show }" v-if="!editMode">
    <div class="modal-background" @click="close()"></div>
    <div class="modal-content">
      <div class="box">
        <div class="field">
          <label class="label">ტეგები</label>

          <div class="control" style="margin-bottom: 1em">
            <input type="text" class="input" placeholder="ძებნა" v-model="filterText" />
          </div>

          <div class="control">
            <a class="tag is-medium" v-for="tag in tags" :key="tag._id" @click="toggleTag(tag)">
              <span class="icon" v-show="!single">
                <i class="mdi mdi-check" v-show="isSelected(tag)"></i>
              </span>

              <span>{{tag.title}}</span>
            </a>

            <a class="tag is-medium" @click="createTag()">
              <span class="icon">
                <i class="mdi mdi-plus"></i>
              </span>

              <span v-show="filterText && !haveExactMatch">ახლის შექმნა: {{filterText}}</span>
              <span v-show="!filterText || haveExactMatch">ახლის შექმნა</span>
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
  <tag-editor v-else :show="editMode" :tag="newTag" @hide="editMode = false" @saved="tagSaved" />
</template>
<script>
import slugify from "slugify";
import TagEditor from "./TagEditor";

export default {
  components: { TagEditor },
  props: {
    single: Boolean,
    show: Boolean,
    exclude: Array
  },
  data() {
    return {
      tags: [],
      selectedTags: [],
      filterText: "",
      editMode: false,
      newTag: {}
    };
  },
  mounted() {
    this.fetchTags();
  },
  computed: {
    haveExactMatch() {
      if (!this.filterText) return false;
      return Boolean(this.tags.find(tag => tag.title === this.filterText));
    }
  },
  methods: {
    createTag() {
      let newTag = { new: true };
      if (this.filterText && !this.haveExactMatch) {
        newTag.title = this.filterText;
        newTag.tag = slugify(this.filterText);
      }
      this.newTag = newTag;
      this.editMode = true;
    },
    tagSaved(tag) {
      this.tags.push(tag);
      this.selectTag(tag);
    },
    canSave() {
      return this.selectedTags.length > 0;
    },
    fetchTags() {
      let params = {
        limit: 20
      };
      if (this.filterText) params.q = this.filterText;

      this.$axios
        .get("/api/admin/tags", { params })
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
      this.filterText = "";
      this.selectedTags = [];
      this.filterExcluded();
    }
  },
  watch: {
    show: "clear",
    excluded: "filterExcluded",
    filterText: "fetchTags"
  }
};
</script>
<style>
.tag-chooser .tag {
  vertical-align: middle;
}
</style>