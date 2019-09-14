<template>
  <div class="modal picture-chooser" :class="{ 'is-active': show }">
    <div class="modal-background" @click="close()"></div>
    <div class="modal-content" style="width: 900px">
      <div class="box" v-if="!editMode">
        <div class="field">
          <label class="label">სურათები</label>

          <div class="field is-grouped">
            <div class="control">
              <div class="file is-primary" style="display: inline-block">
                <label class="file-label">
                  <input class="file-input" type="file" ref="file" @change="uploadPicture()" />
                  <span class="file-cta">
                    <span class="file-icon">
                      <i class="mdi mdi-upload"></i>
                    </span>
                    <span class="file-label">ატვირთვა</span>
                  </span>
                </label>
              </div>
            </div>

            <div class="control flex-grow-1" style="margin-bottom: 1em">
              <input type="text" class="input" placeholder="ძებნა" v-model="filterText" />
            </div>
          </div>

          <div class="control">
            <a
              class="picture"
              v-for="picture in pictures"
              :key="picture._id"
              @click="togglePicture(picture)"
            >
              <img :src="picture.url" :alt="picture.friendlyName || picture.name" />
              <span>{{picture.friendlyName || picture.name}}</span>
            </a>
          </div>
          <div class="control">
            <pagination :page="page" :per-page="perPage" :total="total" @goto="gotoPage" />
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
      <picture-editor
        v-else
        :show="editMode"
        :picture="newPicture"
        @hide="editMode = false"
        @saved="pictureSaved"
      />
    </div>
    <button type="button" class="modal-close is-large" aria-label="close" @click="close()"></button>
  </div>
</template>
<script>
import PictureEditor from "./PictureEditor";

export default {
  name: "picture-chooser",
  components: { PictureEditor },
  props: {
    single: Boolean,
    show: Boolean,
    exclude: Array
  },
  data() {
    return {
      pictures: [],
      selectedPictures: [],
      filterText: "",
      editMode: false,
      showDropzone: true,
      newPicture: {},
      page: 1,
      perPage: 20,
      total: 1
    };
  },
  mounted() {
    this.fetchPictures();
  },
  computed: {},
  methods: {
    enableDrop() {
      if (process.client) {
        window.addEventListener("dragenter", e => {
          this.showDropzone = true;
        });

        window.addEventListener("dragleave", e => {
          e.preventDefault();
          this.showDropzone = false;
        });

        window.addEventListener("dragover", e => {
          e.preventDefault();
          this.showDropzone = true;
        });

        window.addEventListener("drop", e => {
          e.preventDefault();

          this.showDropzone = false;

          let file = e.dataTransfer.files && e.dataTransfer.files[0];
          if (!file) return;

          this.uploadPicture(file);
        });
      }
    },
    disableDrop() {
      if (process.client) {
        window.removeEventListener("dragenter");

        window.addEventListener("dragleave");

        window.addEventListener("dragover");

        window.addEventListener("drop");
      }
    },
    gotoPage(page) {
      this.page = parseInt(page);
      this.fetchPictures();
    },
    queryParams() {
      return {
        q: this.filterText,
        offset: (this.page - 1) * this.perPage,
        limit: this.perPage,
        type: "image"
      };
    },
    uploadPicture(file) {
      if (!file) file = this.$refs.file.files[0];
      if (!file) return;

      if (!file.type.match(/image\//)) {
        this.$notifyError({
          title: "არასწორი ფაილი!",
          text: "გთხოვთ აირჩიოთ სურათი!"
        });
        return;
      }

      let formData = new FormData();
      formData.append("file", file);
      this.$axios
        .post("/api/admin/files", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(response => {
          this.pictureSaved(response.data);
        })
        .catch(err => {
          console.error(err);
          this.$notifyError({
            title: "მოხდა შეცდომა!",
            text: err.message
          });
        });
    },
    createPicture() {
      let newPicture = { new: true, priority: 0 };

      this.newPicture = newPicture;
      this.editMode = true;
    },
    pictureSaved(picture) {
      this.pictures.push(picture);
      this.selectPicture(picture);
    },
    canSave() {
      return this.selectedPictures.length > 0;
    },
    fetchPictures() {
      this.$axios
        .get("/api/admin/files", { params: this.queryParams() })
        .then(response => {
          this.pictures = response.data;
          let total = response.headers["x-total-count"];
          if (!isNaN(total)) this.total = parseInt(total);
        })
        .catch(error => console.error(error));
    },
    isSelected(picture) {
      return this.selectedPictures.indexOf(picture) !== -1;
    },
    togglePicture(picture) {
      this.isSelected(picture)
        ? this.deselectPicture(picture)
        : this.selectPicture(picture);
    },
    selectPicture(picture) {
      if (this.single) {
        this.selectedPictures = [picture];
        this.save();
      } else {
        this.selectedPictures.push(picture);
      }
    },
    deselectPicture(picture) {
      this.selectedPictures.splice(this.selectedPictures.indexOf(picture), 1);
    },
    close() {
      this.$emit("hide");
    },
    save() {
      console.log("Save", this.selectedPictures);
      this.$emit(
        "select",
        this.single ? this.selectedPictures[0] : this.selectedPictures
      );
      this.close();
    },
    clear() {
      this.filterText = "";
      this.selectedPictures = [];
    }
  },
  watch: {
    show: "clear",
    filterText: "fetchPictures"
  }
};
</script>
<style>
.picture-chooser .picture {
  display: inline-block;
  margin: 5px;
  vertical-align: middle;
  width: 200px;
}
.picture-chooser .picture img {
  max-width: 200px;
  margin: 0 auto;
  max-height: 200px;
  display: block;
}
.picture-chooser .picture span {
  text-align: center;
  display: block;
  max-width: 200px;
  text-overflow: ellipsis;
  overflow: hidden;
}

.picture-chooser .dropzone {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
}
</style>