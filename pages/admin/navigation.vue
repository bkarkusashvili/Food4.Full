<template>
  <div>
    <h1 class="title">ნავიგაცია</h1>

    <form class="form" @submit.prevent="save">
      <button type="button" class="button" @click="addItem()">
        <span class="icon">
          <i class="mdi mdi-plus"></i>
        </span>
        <span>დამატება</span>
      </button>

      <button class="button is-success">
        <span class="icon">
          <i class="mdi mdi-floppy"></i>
        </span>
        <span>შენახვა</span>
      </button>

      <ul class="navigation-items">
        <li v-for="(item, index) in items">
          <div class="field is-grouped">
            <label class="label"></label>
            <div class="control">
              <button class="button is-danger" type="button" @click="removeItem(index)">
                <i class="mdi mdi-delete"></i>
              </button>
              <button
                class="button"
                type="button"
                :disabled="!canMoveUp(index)"
                @click="moveUp(index)"
              >
                <i class="mdi mdi-arrow-up"></i>
              </button>
              <button
                class="button"
                type="button"
                :disabled="!canMoveDown(index)"
                @click="moveDown(index)"
              >
                <i class="mdi mdi-arrow-down"></i>
              </button>
              <button class="button" type="button" title="დამატება" @click="addChild(item)">
                <i class="mdi mdi-plus"></i>
              </button>
            </div>

            <div class="control is-required">
              <input type="text" class="input" v-model="item.title" required />
            </div>

            <div class="control select">
              <select v-model="item.type" required>
                <option value="parent">მშობელი</option>
                <option value="tag">ტეგი</option>
                <option value="link">ლინკი</option>
                <option value="page">გვერდი</option>
              </select>
            </div>

            <div class="control" v-show="item.type === 'link'">
              <input type="text" class="input" placeholder="http://" v-model="item.link" />
            </div>

            <div class="control" v-show="item.type === 'tag'">
              <a class="tag is-medium" @click="selectTag(item)">
                <span class="icon">
                  <i class="mdi mdi-pencil"></i>
                </span>
                <span v-if="item.tag">{{item.tag.title}}</span>
                <span v-else>ტეგის არჩევა</span>
              </a>
            </div>

            <div class="control" v-show="item.type === 'page'">
              <a class="tag is-medium" @click="selectPage(item)">
                <span class="icon">
                  <i class="mdi mdi-pencil"></i>
                </span>
                <span v-if="item.page">{{item.page.title}}</span>
                <span v-else>გვერდის არჩევა</span>
              </a>
            </div>
          </div>

          <ul class="navigation-children">
            <li v-for="(child, childIndex) in item.children">
              <div class="field is-grouped">
                <label class="label"></label>
                <div class="control">
                  <button
                    class="button is-danger"
                    type="button"
                    @click="removeItem(childIndex, item.children)"
                  >
                    <i class="mdi mdi-delete"></i>
                  </button>
                  <button
                    class="button"
                    type="button"
                    :disabled="!canMoveUp(childIndex, item.children)"
                    @click="moveUp(childIndex, item.children)"
                  >
                    <i class="mdi mdi-arrow-up"></i>
                  </button>
                  <button
                    class="button"
                    type="button"
                    :disabled="!canMoveDown(childIndex, item.children)"
                    @click="moveDown(childIndex, item.children)"
                  >
                    <i class="mdi mdi-arrow-down"></i>
                  </button>
                </div>

                <div class="control is-required">
                  <input type="text" class="input" v-model="child.title" required />
                </div>

                <div class="control select">
                  <select v-model="child.type" required>
                    <option value="tag">ტეგი</option>
                    <option value="link">ლინკი</option>
                    <option value="page">გვერდი</option>
                  </select>
                </div>

                <div class="control" v-show="child.type === 'link'">
                  <input type="text" class="input" placeholder="http://" v-model="child.link" />
                </div>

                <div class="control" v-show="child.type === 'tag'">
                  <a class="tag is-medium" @click="selectTag(child)">
                    <span class="icon">
                      <i class="mdi mdi-pencil"></i>
                    </span>
                    <span v-if="child.tag">{{child.tag.title}}</span>
                    <span v-else>ტეგის არჩევა</span>
                  </a>
                </div>

                <div class="control" v-show="child.type === 'page'">
                  <a class="tag is-medium" @click="selectPage(child)">
                    <span class="icon">
                      <i class="mdi mdi-pencil"></i>
                    </span>
                    <span v-if="child.page">{{child.page.title}}</span>
                    <span v-else>გვერდის არჩევა</span>
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </form>

    <tag-chooser single :show="showTagChooser" @hide="showTagChooser = false" @select="tagSelected" />
    <page-chooser :show="showPageChooser" @hide="showPageChooser = false" @select="pageSelected" />
  </div>
</template>

<script>
import TagChooser from "../../components/TagChooser";
import PageChooser from "../../components/PageChooser";

export default {
  components: { TagChooser, PageChooser },
  data() {
    return {
      items: [],
      showTagChooser: false,
      showPageChooser: false,
      itemForTag: null
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
        .get("/settings.json")
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
      if (!this.itemForTag) return;
      this.itemForTag.tag = tag;
      if (!this.itemForTag.title) this.itemForTag.title = tag.title;
    },
    pageSelected(page) {
      if (!this.itemForTag) return;
      this.itemForTag.page = page;
      if (!this.itemForTag.title) this.itemForTag.title = page.title;
    },
    removeItem(index, array) {
      if (!array) array = this.items;
      if (!this.isEmpty(array[index]) && !confirm("ნამდვილად გსურთ წაშლა?"))
        return;
      array.splice(index, 1);
    },
    addItem() {
      this.items.push({
        type: "tag",
        children: []
      });
    },
    addChild(item) {
      if (!item.children || !(item.children instanceof Array))
        item.children = [];
      item.type = "parent";
      item.children.push({
        type: "tag"
      });
    },
    moveUp(index, array) {
      if (!array) array = this.items;
      if (!this.canMoveUp(index, array)) return;
      array.splice(index - 1, 0, array.splice(index, 1)[0]);
    },
    canMoveUp(index, array) {
      return index > 0;
    },
    moveDown(index, array) {
      if (!array) array = this.items;
      if (!this.canMoveDown(index, array)) return;
      array.splice(index + 1, 0, array.splice(index, 1)[0]);
    },
    canMoveDown(index, array) {
      if (!array) array = this.items;
      return index < array.length - 1;
    },
    isEmpty(item) {
      return !item.title && (!item.children || !item.children.length);
    },
    selectTag(item) {
      this.itemForTag = item;
      this.showTagChooser = true;
    },
    selectPage(item) {
      this.itemForTag = item;
      this.showPageChooser = true;
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
