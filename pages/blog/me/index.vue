<template>
  <v-container>
    <div class="d-flex justify-end my-5">
      <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="blue" dark depressed v-bind="attrs" v-on="on">
            Write post
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <template>
              <v-toolbar class="elevation-0 mb-5"
                ><h2 class="pt-3">New blog entry</h2></v-toolbar
              >
              <v-text-field
                v-model="blog.title"
                class="px-4"
                required
              ></v-text-field>
            </template>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="py-3">
            <v-spacer></v-spacer>
            <v-btn
              class="mr-4 blue"
              dark
              depressed
              type="submit"
              @click="createBlog"
            >
              Post
            </v-btn>
            <v-btn @click="dialog = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <br />
    <v-list v-for="blog in blogs" :key="blog.id">
      <div class="d-flex">
        <div class="mr-auto">
          <nuxt-link
            :to="{ name: 'blog-me-blogId', params: { blogId: blog.id } }"
          >
            <h3>{{ blog.createdAt.toDate() | formatDate }}</h3>
            <h4>{{ blog.title }}</h4>
            <br />
          </nuxt-link>
        </div>
        <div>
          <span
            class="mr-5 red--text font-weight-bold"
            @click="showDialog(blog.id)"
            style="cursor: pointer"
            >&#10005;</span
          >
        </div>
      </div>
    </v-list>
  </v-container>
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
      dialog: false,
      user: {},
      blogs: [],
      blog: {
        title: ""
      }
    };
  },
  created() {
    this.getUser();
    this.getUserBlogs();
  },
  methods: {
    async logout() {
      await this.$fire.auth.signOut();
      this.$router.push("/");
    },
    async getUser() {
      const userRef = firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid);
      const doc = await userRef.get();
      this.user = doc.data();
    },
    async showDialog(id) {
      const res = await this.$dialog.confirm({
        text: "Do you want to delete this entry?",
        title: "Delete entry"
      });
      if (true == res) this.deleteBlog(id);
    },
    createBlog() {
      firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("blogs")
        .add({
          createdAt: new Date(),
          title: this.blog.title
        });
      this.dialog = false;
      this.blog.title = "";
    },
    async getUserBlogs() {
      var blogsRef = firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("blogs")
        .orderBy("createdAt", "desc");
      blogsRef.onSnapshot(snap => {
        this.blogs = [];
        snap.forEach(doc => {
          var blog = doc.data();
          blog.id = doc.id;
          this.blogs.push(blog);
        });
      });
    },
    deleteBlog(docId) {
      firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("blogs")
        .doc(docId)
        .delete();
    }
  }
};
</script>
