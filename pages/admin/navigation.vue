<template>
  <div>
    <h1 class="title">ნავიგაცია</h1>

    <form class="form" @submit.prevent="save">
      <button type="button" class="button is-medium" @click="addItem()">
        <span class="icon">
          <i class="mdi mdi-plus"></i>
        </span>
        <span>დამატება</span>
      </button>

      <button class="button is-medium is-success">
        <span class="icon">
          <i class="mdi mdi-floppy"></i>
        </span>
        <span>შენახვა</span>
      </button>

      <ul class="navigation-items">
        <draggable v-model="items" handle=".handle">
          <transition-group>
            <admin-nav-item
              v-for="(item, index) in items"
              :key="item.id"
              :item="item"
              @remove="removeItem(index)"
              @selectTag="selectTag"
              @selectPage="selectPage"
              @selectPost="selectPost"
            />
          </transition-group>
        </draggable>
      </ul>
    </form>

    <tag-chooser
      single
      :show="showTagChooser"
      @hide="showTagChooser = false"
      @select="tagSelected"
    />
    <page-chooser :show="showPageChooser" @hide="showPageChooser = false" @select="pageSelected" />
    <post-chooser :show="showPostChooser" @hide="showPostChooser = false" @select="postSelected" />
  </div>
</template>

<script>
import TagChooser from "../../components/TagChooser";
import PageChooser from "../../components/PageChooser";
import PostChooser from "../../components/PostChooser";
import AdminNavItem from "../../components/AdminNavItem";

export default {
  components: { TagChooser, PageChooser, PostChooser },
  data() {
    return {
      items: [],
      showTagChooser: false,
      showPageChooser: false,
      showPostChooser: false,
      selectionTarget: null
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    save() {
      this.$axios
        .put("/api/admin/settings", {
          navigation: this.items
        })
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
    fetchData() {
      this.$axios
        .get("/api/admin/settings")
        .then(response => {
          this.items = response.data.navigation || [];
        })
        .catch(err => {
          console.error(err);
          this.$notifyError({
            title: "მოხდა შეცდომა!",
            text: err.message
          });
        });
    },
    tagSelected(tag) {
      console.log(this.selectionTarget)
      if (!this.selectionTarget) return;
      this.selectionTarget.item.tag = tag;
      if (!this.selectionTarget.item.title) this.selectionTarget.item.title = tag.title;
      if(this.selectionTarget.target)
        this.selectionTarget.target.$forceUpdate();
    },
    pageSelected(page) {
      if (!this.selectionTarget) return;
      this.selectionTarget.item.page = page;
      if (!this.selectionTarget.item.title) this.selectionTarget.item.title = page.title;
      if(this.selectionTarget.target)
        this.selectionTarget.target.$forceUpdate();
    },
    postSelected(post) {
      if (!this.selectionTarget) return;
      this.selectionTarget.item.post = post;
      if (!this.selectionTarget.item.title) this.selectionTarget.item.title = post.title;
      if(this.selectionTarget.target)
        this.selectionTarget.target.$forceUpdate();
    },
    removeItem(index) {
      if (
        !this.isEmpty(this.items[index]) &&
        !confirm("ნამდვილად გსურთ წაშლა?")
      )
        return;
      this.items.splice(index, 1);
    },
    addItem() {
      this.items.push({
        type: "tag",
        children: [],
        id: this.items.length
      });
    },
    selectTag(item) {
      this.selectionTarget = item;
      this.showTagChooser = true;
    },
    selectPage(item) {
      this.selectionTarget = item;
      this.showPageChooser = true;
    },
    selectPost(item) {
      this.selectionTarget = item;
      this.showPostChooser = true;
    },
    isEmpty(item) {
      return (
        !item || (!item.title && (!item.children || !item.children.length))
      );
    }
  }
};
</script>

<style>
.navigation-items {
  padding-top: 1em;
}

.navigation-items li > div {
  margin-bottom: 0.5em;
}

.navigation-children {
  padding-left: 2.8em;
}
</style>
