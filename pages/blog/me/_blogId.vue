<template>
  <v-app>
    <v-main>
      <v-container>
        <v-card v-if="null == blog" class="elevation-0">
          <v-list>
            <p>Loading...</p>
          </v-list>
        </v-card>
        <v-card v-else class="elevation-0">
          <v-list>
            <h3>{{ blog.createdAt.toDate() | formatDate }}</h3>
            <h4>{{ blog.title }}</h4>
            <br />
          </v-list>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
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
