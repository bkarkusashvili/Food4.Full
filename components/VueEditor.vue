<template>
  <div class="quillWrapper">
    <div ref="quillContainer" :id="id"></div>
    <input
      v-if="useCustomImageHandler"
      id="file-upload"
      ref="fileInput"
      type="file"
      accept="image/*"
      style="display:none;"
      @change="emitImageInfo($event)"
    />
  </div>
</template>
<script>
var defaultToolbar = [
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block", "image", "link"],

  [{ list: "ordered" }, { list: "bullet" }],

  [{ indent: "-1" }, { indent: "+1" }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],

  ["clean"]
];

export default {
  name: "vue-editor",
  props: {
    value: String,
    id: {
      type: String,
      default: "quill-container"
    },
    placeholder: String,
    disabled: Boolean,
    editorToolbar: Array,
    useCustomImageHandler: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      quill: null,
      editor: null,
      toolbar: this.editorToolbar ? this.editorToolbar : defaultToolbar
    };
  },

  mounted() {
    if (!process.browser) return;
    this.initializeVue2Editor();
    this.handleUpdatedEditor();
  },

  watch: {
    value(val) {
      if (val != this.editor.innerHTML && !this.quill.hasFocus()) {
        this.editor.innerHTML = val;
      }
    },
    disabled(status) {
      this.quill.enable(!status);
    }
  },

  methods: {
    initializeVue2Editor() {
      this.setQuillElement();
      this.setEditorElement();
      this.checkForCustomImageHandler();
      this.checkForInitialContent();
    },

    setQuillElement() {
      const Quill = require("quill");
      this.quill = new Quill(this.$refs.quillContainer, {
        modules: {
          toolbar: this.toolbar
        },
        placeholder: this.placeholder ? this.placeholder : "",
        theme: "snow",
        readOnly: this.disabled ? this.disabled : false
      });
    },

    checkForCustomImageHandler() {
      this.useCustomImageHandler === true ? this.setupCustomImageHandler() : "";
    },
    setupCustomImageHandler() {
      let toolbar = this.quill.getModule("toolbar");
      toolbar.addHandler("image", this.customImageHandler);
    },
    customImageHandler(image, callback) {
      this.$refs.fileInput.click();
    },
    emitImageInfo($event) {
      const resetUploader = function() {
        var uploader = document.getElementById("file-upload");
        uploader.value = "";
      };
      let file = $event.target.files[0];
      let Editor = this.quill;
      let range = Editor.getSelection();
      let cursorLocation = range.index;
      this.$emit("imageAdded", file, Editor, cursorLocation, resetUploader);
    },

    setEditorElement() {
      this.editor = document.querySelector(`#${this.id} .ql-editor`);
    },

    checkForInitialContent() {
      this.editor.innerHTML = this.value || "";
    },

    handleUpdatedEditor() {
      this.quill.on("text-change", () => {
        this.$emit("input", this.editor.innerHTML);
      });
    }
  }
};
</script>

<style>
#quill-container {
  height: 400px;
}
</style>