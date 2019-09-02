<template>
  <div class="index-page">
    <div class="container">
      <page-section
        class="section"
        v-for="(section, index) in sections"
        :section="section"
        :key="index"
      ></page-section>
    </div>
  </div>
</template>

<script>
import PageSection from "../components/PageSection";

export default {
  components: {},
  data() {
    return {
      sections: [
        {
          type: "tiles",
          tiles: [
            {
              ancestor: true,
              vertical: true,
              tiles: [
                {
                  parent: true,
                  tiles: [
                    {
                      size: 8,
                      video: "https://www.youtube.com/embed/-C4sZBA6Hgg"
                    },
                    {
                      size: 4,
                      parent: true,
                      vertical: true,
                      tiles: [
                        {
                          post: { featured: true, offset: 0, limit: 1 }
                        },
                        {
                          post: { featured: true, offset: 1, limit: 1 }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: "row",
          columns: [
            {
              size: 3,
              section: {
                type: "featured",
                title: "რჩეული რეცეპტები",
                vertical: true,
                compact: true
              }
            },
            {
              section: {
                type: "video",
                title: "შოკოლადის ტარტი ჟოლოთი",
                description: "წარმოგიდგენთ უკონკურენტო დესერტს, რომელსაც უმარტივესად და ძალიან ცოტა ინგრედიენტით მოამზადებთ სახლში.",
                videoUrl: "https://www.youtube.com/watch?v=Bidv64QmWAw"
              }
            },
            {
              size: 3,
              section: {
                type: "latest",
                title: "ბოლოს დამატებული",
                vertical: true,
                compact: true
              }
            }
          ]
        },
        {
          type: "latest",
          compact: true
        },
        {
          type: "tags",
          compact: true
          //tags: ["5d36e717452aac0656d518ad", "5d373520478a544f3e7e5fb2"]
        }
      ]
    };
  }
};
</script>

<style>
</style>
