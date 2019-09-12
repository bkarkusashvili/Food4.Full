<template>
  <div class>
    <h1 class="title">მთავარი გვერდი</h1>

    <button type="submit" class="button is-success is-medium" @click="save()">
      <span class="icon">
        <i class="mdi mdi-floppy"></i>
      </span>
      <span>შენახვა</span>
    </button>

    <div style="margin-top: 1em">
      <h2 class="subtitle">კარუსელი</h2>

      <button
        type="button"
        class="button is-success"
        style="margin-bottom: 1em;"
        @click="addCarouselItem()"
      >
        <span class="icon">
          <i class="mdi mdi-plus"></i>
        </span>
        <span>დამატება</span>
      </button>

      <draggable v-model="settings.carousel" handle=".handle">
        <transition-group>
          <div class="field is-grouped" v-for="(item, index) in settings.carousel" :key="item.id">
            <div class="control">
              <button class="button is-danger" type="button" @click="removeCarouselItem(index)">
                <i class="mdi mdi-delete"></i>
              </button>
              <button class="button handle" type="button" style="cursor: grab">
                <i class="mdi mdi-arrow-all"></i>
              </button>
            </div>

            <div class="control select">
              <select v-model="item.type" required>
                <option value="post">რეცეპტი</option>
                <option value="page">გვერდი</option>
                <!-- <option value="link">ლინკი</option> -->
              </select>
            </div>
            <!-- <div class="control" v-show="item.type === 'link'">
              <input type="text" class="input" placeholder="http://" v-model="item.link" />
            </div>

            <div class="control" v-show="item.type === 'link'">
              <label class="checkbox">
                <input type="checkbox" v-model="item.external" />
                გარე
              </label>
            </div>-->

            <div class="control" v-show="item.type === 'page'">
              <a class="tag is-medium" @click="selectPage(item)">
                <span class="icon">
                  <i class="mdi mdi-pencil"></i>
                </span>
                <span v-if="item.page">{{item.page.title}}</span>
                <span v-else>გვერდის არჩევა</span>
              </a>
            </div>

            <div class="control" v-show="item.type === 'post'">
              <a class="tag is-medium" @click="selectPost(item)">
                <span class="icon">
                  <i class="mdi mdi-pencil"></i>
                </span>
                <span v-if="item.post">{{item.post.title}}</span>
                <span v-else>რეცეპტის არჩევა</span>
              </a>
            </div>
          </div>
        </transition-group>
      </draggable>
    </div>

    <page-chooser :show="showPageChooser" @hide="showPageChooser = false" @select="pageSelected" />
    <post-chooser :show="showPostChooser" @hide="showPostChooser = false" @select="postSelected" />
  </div>
</template>

<script>
import PageChooser from "../../components/PageChooser";
import PostChooser from "../../components/PostChooser";

export default {
  components: { PageChooser, PostChooser },
  data() {
    return {
      settings: {},
      showPageChooser: false,
      showPostChooser: false,
      selectionTarget: null
    };
  },
  methods: {
    pageSelected(page) {
      if (!this.selectionTarget) return;
      this.selectionTarget.page = page;
      this.$forceUpdate();
    },
    postSelected(post) {
      if (!this.selectionTarget) return;
      this.selectionTarget.post = post;
      this.$forceUpdate();
    },
    selectPage(item) {
      this.selectionTarget = item;
      this.showPageChooser = true;
    },
    selectPost(item) {
      this.selectionTarget = item;
      this.showPostChooser = true;
    },
    addCarouselItem() {
      if (!this.settings.carousel) this.settings.carousel = [];
      this.settings.carousel.push({
        type: "post",
        id: this.settings.carousel.length
      });
    },
    removeCarouselItem(index) {
      this.settings.carousel.splice(index, 1);
    },
    save() {
      this.$axios
        .put("/api/admin/settings", this.settings)
        .then(response => {
          this.$notifySuccess({
            title: "შენახულია",
            text: "შენახვა წარმატებით დასრულდა!"
          });
        })
        .catch(err => {
          console.error(err);
          this.$notifyError({
            title: "მოხდა შეცდომა!",
            text: err.message
          });
        });
    },
    uploadPicture: function() {
      let file = this.$refs.file.files[0],
        formData = new FormData();
      if (!file) return;
      formData.append("file", file);
      this.$axios
        .post("/api/admin/files", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(response => {
          this.settings.logo = response.data.url;
          this.$forceUpdate();
        })
        .catch(err => {
          console.error(err);
          this.$notifyError({
            title: "მოხდა შეცდომა!",
            text: err.message
          });
        });
    }
  },
  asyncData({ $axios, error }) {
    return $axios
      .get("/api/admin/settings")
      .then(response => {
        return { settings: response.data };
      })
      .catch(err => {
        error({ statusCode: 500, message: "მოხდა შეცდომა" });
      });
  }
};
</script>

<style>
</style>