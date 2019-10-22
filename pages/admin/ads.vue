<template>
  <div class="ads-page">
    <h1 class="title">რეკლამები</h1>

    <button type="submit" class="button is-success is-medium" @click="save()">
      <span class="icon">
        <i class="mdi mdi-floppy"></i>
      </span>
      <span>შენახვა</span>
    </button>

    <div style="margin-top: 1em">
      <div class="tabs is-fullwidth is-primary">
        <ul>
          <li
            v-for="(page, index) in adPages"
            :class="{'is-active': activePage == index}"
            @click="activePage = index"
            :key="index"
          >
            <a>{{index}}</a>
          </li>
        </ul>
      </div>
      <div v-for="(page, index) in adPages" v-show="activePage == index" :key="index">
        <div v-for="(title, ad) in page" :key="ad">
          <h2 class="subtitle">{{title}}</h2>
          <div class="field">
            <label class="label">ლინკი</label>
            <div class="control">
              <input type="url" class="input" v-model="settings.ads[ad].link" />
            </div>
          </div>
          <div class="field">
            <label class="label">ტექსტი</label>
            <div class="control">
              <input type="text" class="input" v-model="settings.ads[ad].text" />
            </div>
          </div>
          <div class="field">
            <div class="control">
              <label class="checkbox">
                <input type="checkbox" v-model="settings.ads[ad].mobile" />
                მობილურზე გამოჩენა
              </label>
            </div>
          </div>
          <div class="field">
            <label class="label">სურათი</label>
            <div class="control">
              <button
                type="button"
                class="button is-success"
                @click="selectPicture(settings.ads[ad])"
              >სურათის არჩევა</button>
              <button
                type="button"
                class="button is-danger"
                v-show="settings.ads[ad].picture"
                @click="removePicture(settings.ads[ad])"
              >
                <span class="icon">
                  <i class="mdi mdi-delete"></i>
                </span>
                <span>წაშლა</span>
              </button>
            </div>

            <div class="control box" style="margin-top: 10px" v-if="settings.ads[ad].picture">
              <img :src="settings.ads[ad].picture" alt class="ad-picture" />
            </div>
          </div>

          <div class="field" v-if="settings.ads[ad].mobile">
            <label class="label">სურათი მობილურისთვის</label>
            <div class="control">
              <button
                type="button"
                class="button is-success"
                @click="selectMobilePicture(settings.ads[ad])"
              >სურათის არჩევა</button>
              <button
                type="button"
                class="button is-danger"
                v-show="settings.ads[ad].mobilePicture"
                @click="removeMobilePicture(settings.ads[ad])"
              >
                <span class="icon">
                  <i class="mdi mdi-delete"></i>
                </span>
                <span>წაშლა</span>
              </button>
            </div>

            <div class="control box" style="margin-top: 10px" v-if="settings.ads[ad].mobilePicture">
              <img :src="settings.ads[ad].mobilePicture" alt class="ad-picture" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <picture-chooser
      single
      :show="showPictureChooser"
      @hide="showPictureChooser = false"
      @select="pictureSelected"
    />
  </div>
</template>

<script>
import PictureChooser from "../../components/PictureChooser";

const adPages = {
  "მთავარი გვერდი": {
    main_page_top_left: "კარუსელის მარცხნივ",
    main_page_top_right: "კარუსელის მარჯვნივ"
  }
};

export default {
  components: { PictureChooser },
  data() {
    return {
      adPages: adPages,
      activePage: "მთავარი გვერდი",
      settings: {
        ads: {}
      },
      showPictureChooser: false,
      selectionTarget: null,
      selectionProperty: null
    };
  },
  methods: {
    pictureSelected(picture) {
      if (!this.selectionTarget) return;
      this.selectionTarget[this.selectionProperty || "picture"] = picture.url;
      this.$forceUpdate();
    },
    selectPicture(item) {
      this.selectionTarget = item;
      this.selectionProperty = "picture";
      this.showPictureChooser = true;
    },
    removePicture(item) {
      item.picture = null;
    },
    selectMobilePicture(item) {
      this.selectionTarget = item;
      this.selectionProperty = "mobilePicture";
      this.showPictureChooser = true;
    },
    removeMobilePicture(item) {
      item.mobilePicture = null;
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
    }
  },
  asyncData({ $axios, error }) {
    return $axios
      .get("/api/admin/settings")
      .then(response => {
        return { settings: ensureAds(response.data) };
      })
      .catch(err => {
        error({ statusCode: 500, message: "მოხდა შეცდომა" });
      });
  }
};

function ensureAds(settings) {
  if (typeof settings.ads !== "object") settings.ads = {};
  for (let i in adPages) {
    for (let k in adPages[i]) {
      if (typeof settings.ads[k] !== "object") settings.ads[k] = {};
    }
  }
  return settings;
}
</script>

<style lang="scss">
.ads-page {
  .subtitle {
    margin-top: 1em;
  }
}
</style>