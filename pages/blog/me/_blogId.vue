<template>
  <div class="text-center">
    <v-card v-if="null == blog">
      <v-card-text>
        <p>Loading...</p>
      </v-card-text>
    </v-card>
    <v-card v-else>
      <v-card-text>
        <p>{{ blog.createdAt }}</p>
        <p>Your blog title is {{ blog.title }}</p>
        <v-btn @click="logout">Logout</v-btn>
      </v-card-text>
    </v-card>
    <br /><br />
  </div>
</template>

<script>
import { mapState } from "vuex";
import firebase from "firebase";

export default {
  layout: "basic",
  middleware: "auth",
  computed: {
    ...mapState(["authUser"])
  },
  data() {
    return {
      blogId: this.$route.params.blogId,
      blog: null
    };
  },
  created() {
    this.getUserBlog();
  },
  methods: {
    async logout() {
      await this.$fire.auth.signOut();
      this.$router.push("/");
    },
    async showDialog() {
      const res = await this.$dialog.confirm({
        text: "Do you want to delete this entry?",
        title: this.authUser.uid
      });
    },
    async getUserBlog() {
      var blogRef = firebase
        .firestore()
        .collection("users")
        .doc(this.authUser.uid)
        .collection("blogs")
        .doc(this.blogId);
      const doc = await blogRef.get();
      this.blog = doc.data();
    }
  }
};
</script>
