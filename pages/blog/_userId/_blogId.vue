<template>
  <div class="text-center">
    <v-card v-if="blog == null">
      <p>Loading...</p>
    </v-card>
    <v-card v-if="blog != null">
      <v-card-text>
        <p>{{ blog.createdAt }}</p>
        <p>{{ blog.title }}</p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  layout: "basic",
  data() {
    return {
      userId: this.$route.params.userId,
      blogId: this.$route.params.blogId,
      blog: null,
      blogs: []
    };
  },
  async created() {
    await this.getUserBlog();
  },
  methods: {
    async getUserBlog() {
      var blogRef = firebase
        .firestore()
        .collection("users")
        .doc(this.userId)
        .collection("blogs")
        .doc(this.blogId);
      const doc = await blogRef.get();
      this.blog = doc.data();
    }
  }
};
</script>
