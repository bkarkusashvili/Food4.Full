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
                <option disabled value>ტიპი</option>
                <option value="tag">ტეგი</option>
                <option value="link">ლინკი</option>
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
                    <option disabled value>ტიპი</option>
                    <option value="tag">ტეგი</option>
                    <option value="link">ლინკი</option>
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
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </form>

    <tag-chooser single :show="showTagDialog" @hide="showTagDialog = false" @select="tagSelected" />
  </div>
</template>

<script>
import TagChooser from '../../components/TagChooser'

export default {
  components: { TagChooser },
  data() {
    return {
      items: [],
      showTagDialog: false,
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
        .then(response => {})
        .catch(error => {
          console.error(error);
        });
    },
    fetchData() {
      this.$axios
        .get("/api/admin/settings")
        .then(response => {
          this.items = response.data.navigation || [];
        })
        .catch(error => {
          console.error(error);
        });
    },
    tagSelected(tag) {
      console.log(tag)
      if (this.itemForTag) this.itemForTag.tag = tag;
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
      this.showTagDialog = true;
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
