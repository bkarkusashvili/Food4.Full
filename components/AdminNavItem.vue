<template>
  <li>
    <div class="field is-grouped">
      <div class="control">
        <button class="button is-danger" type="button" @click="removeItem()">
          <i class="mdi mdi-delete"></i>
        </button>
        <button class="button handle" type="button" style="cursor: grab">
          <i class="mdi mdi-arrow-all"></i>
        </button>
        <button
          class="button"
          type="button"
          title="დამატება"
          :disabled="item.type !== 'parent' && !isEmpty(item)"
          v-if="!child"
          @click="addChild()"
        >
          <i class="mdi mdi-plus"></i>
        </button>
      </div>

      <div class="control is-required">
        <input type="text" class="input" v-model="item.title" required />
      </div>

      <div class="field has-addons" style="margin-right: 10px; margin-bottom: 0">
        <div class="control">
          <label class="button" :style="'background-color:' + item.color">
            <input
              type="color"
              v-model="item.color"
              style="width: 0; height: 0; position: absolute; opacity: 0"
            />
            ფერი
          </label>
        </div>
        <div class="control" v-if="item.color">
          <button type="button" class="button" @click="item.color = null">
            <i class="mdi mdi-delete"></i>
          </button>
        </div>
      </div>

      <div class="control select">
        <select v-model="item.type" required>
          <option value="parent" v-if="!child">მშობელი</option>
          <option value="tag">ტეგი</option>
          <option value="page">გვერდი</option>
          <option value="post">რეცეპტი</option>
          <option value="link">ლინკი</option>
        </select>
      </div>

      <div class="control" v-show="item.type === 'link'">
        <input type="text" class="input" placeholder="http://" v-model="item.link" />
      </div>

      <div class="control" v-show="item.type === 'link'">
        <label class="checkbox">
          <input type="checkbox" v-model="item.external" />
          გარე
        </label>
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

    <ul class="navigation-children">
      <draggable v-model="item.children" handle=".handle">
        <transition-group>
          <admin-nav-item
            v-for="(child, childIndex) in item.children"
            :key="child.id"
            :item="child"
            @remove="removeChild(childIndex)"
            @selectTag="childSelectTag"
            @selectPage="childSelectPage"
            @selectPost="childSelectPost"
            child
          />
        </transition-group>
      </draggable>
    </ul>
  </li>
</template>

<script>
import Vue from "vue";
export default Vue.component("admin-nav-item", {
  name: "admin-nav-item",
  props: {
    item: Object,
    child: Boolean
  },
  computed: {},
  methods: {
    removeItem() {
      this.$emit("remove");
    },
    removeChild(index) {
      if (
        !this.isEmpty(this.item.children[index]) &&
        !confirm("ნამდვილად გსურთ წაშლა?")
      )
        return;
      this.item.children.splice(index, 1);
    },
    addChild() {
      if (!this.item.children || !(this.item.children instanceof Array))
        this.item.children = [];
      this.item.type = "parent";
      this.item.children.push({
        type: "tag",
        id: this.item.children.length
      });
    },
    isEmpty(item) {
      return (
        !item || (!item.title && (!item.children || !item.children.length))
      );
    },

    childSelectTag(item) {
      this.$emit("selectTag", item);
    },
    childSelectPage(item) {
      this.$emit("selectPage", item);
    },
    childSelectPost(item) {
      this.$emit("selectPost", item);
    },
    selectTag(item) {
      this.$emit("selectTag", { item, target: this });
    },
    selectPage(item) {
      this.$emit("selectPage", { item, target: this });
    },
    selectPost(item) {
      this.$emit("selectPost", { item, target: this });
    }
  }
});
</script>

<style>
</style>