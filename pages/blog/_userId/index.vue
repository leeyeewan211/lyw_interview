<template>
  <div class="text-center">
    <v-card v-if="user == null">
      <p>Loading...</p>
    </v-card>
    <v-card v-if="user != null">
      <v-card-text>
        <h3 v-if="blogCount > 1" class="mb-2">
          {{ user.name }} has {{ blogCount }} blogs
        </h3>
        <h3 v-else class="mb-2">{{ user.name }} has {{ blogCount }} blog</h3>
        <div v-for="blog in blogs" :key="blog.id">
          <nuxt-link
            :to="{
              path: `/blog/${$route.params.userId}/${blog.id}`,
              params: { userId: user.id, blogId: blog.id }
            }"
            >{{ blog.title }}</nuxt-link
          >
        </div>
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
      user: null,
      blogCount: 0,
      blogs: []
    };
  },
  async created() {
    await this.getUser();
    await this.getUserBlogs();
  },
  methods: {
    async logout() {
      await this.$fire.auth.signOut();
      this.$router.push("/");
    },
    // get user details
    async getUser() {
      const userRef = firebase
        .firestore()
        .collection("users")
        .doc(this.userId);
      const doc = await userRef.get();
      this.user = doc.data();
    },
    // get user's blogs
    async getUserBlogs() {
      var blogsRef = firebase
        .firestore()
        .collection("users")
        .doc(this.userId)
        .collection("blogs");
      blogsRef.onSnapshot(snap => {
        snap.forEach(doc => {
          var blog = doc.data();
          blog.id = doc.id;
          this.blogCount += 1;
          this.blogs.push(blog);
        });
      });
    }
  }
};
</script>
