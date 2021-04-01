<template>
  <v-app>
    <v-main>
      <v-container>
        <v-card v-if="blog == null" class="elevation-0">
            <v-list class="text-left">
              <h4>Loading...</h4>
            </v-list>
        </v-card>
        <div v-if="blog != null">
          <v-card class="elevation-0">
            <v-list class="text-left">
              <h3>{{ blog.createdAt.toDate() | formatDate }}</h3>
              <h4>{{ blog.title }}</h4>
              <br />
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
    return moment(String(value)).format("DD MMMM YYYY, hh:mm a");
  }
});

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
