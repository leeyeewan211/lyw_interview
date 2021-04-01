<template>
  <v-app>
    <v-main>
      <v-container>
        <v-card v-if="user == null" class="elevation-0">
          <v-list class="text-left">
            <h4>Loading...</h4>
          </v-list>
        </v-card>
        <div v-if="user != null">
          <h2 v-if="blogCount > 1" class="mb-5 text-center">{{ user.name }}</h2>
          <h2 v-else class="mb-5 text-center">{{ user.name }}</h2>
          <v-card class="elevation-0">
            <v-list v-for="blog in blogs" :key="blog.id">
              <nuxt-link
                :to="{
                  path: `/blog/${$route.params.userId}/${blog.id}`,
                  params: { userId: user.id, blogId: blog.id }
                }"
              >
                <h3>{{ blog.createdAt.toDate() | formatDate }}</h3>
                <h4>{{ blog.title }}</h4>
                <br />
              </nuxt-link>
            </v-list>
          </v-card>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import firebase from "firebase";
import moment from "moment";
import Vue from "vue";

Vue.filter("formatDate", function(value) {
  if (value) {
    return moment(String(value)).format("DD MMMM YYYY, hh:mma");
  }
});

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
        .collection("blogs")
        .orderBy("createdAt", "desc");
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

<style>
h2 {
  font-weight: 500;
}

h3 {
  color: black;
  font-weight: 500;
  margin-bottom: 5px;
}

h4 {
  color: grey;
  font-weight: 400;
}
</style>
