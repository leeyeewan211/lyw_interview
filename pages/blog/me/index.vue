<template>
  <div class="text-center">
    <v-card>
      <v-card-text>
        <p>{{ user.name }}</p>
        <v-btn @click="logout">Logout</v-btn>
      </v-card-text>
    </v-card>
    <br /><br />
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
          Write post
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <template>
            <v-text-field
              v-model="blog.title"
              color="success"
              required
            ></v-text-field>
          </template>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-4" type="submit" @click="createBlog">
            Post
          </v-btn>
          <v-btn color="primary" text @click="dialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <br /><br />
    <div v-for="blog in blogs" :key="blog.id">
      <span class="mr-5" @click="showDialog(blog.id)">&#10005;</span>
      <nuxt-link :to="{ name: 'blog-me-blogId', params: { blogId: blog.id } }">
        <span>{{ blog.createdAt.toDate() }}</span>
        <p>{{ blog.title }}</p>
      </nuxt-link>
    </div>
  </div>
  <!-- <button :class="[$style.button, $style.buttonClose]">X</button> example -->
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
        title: "Warning"
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
        .collection("blogs");
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
