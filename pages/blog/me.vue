<template>
  <div class="text-center">
    <v-card>
      <v-card-text>
        <p>Your e-mail is {{ authUser.email }}</p>
        <v-btn @click="logout">Logout</v-btn>
      </v-card-text>
    </v-card>
    <br /><br />
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
          Click Me
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
          <v-btn class="mr-4" type="submit" @click="addTodo">
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
      <span class="mr-5" @click="deleteBlog(blog.id)">&#10005;</span>
      <span>{{ blog.createdAt.toDate() }}</span>
      <p>{{ blog.title }}</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import firebase from "firebase";

export default {
  layout: "basic",
  middleware: "auth",
  components: {},
  computed: {
    ...mapState(["authUser"])
  },
  data() {
    return {
      dialog: false,
      blogs: [],
      blog: {
        title: ""
      }
    };
  },
  created() {
    this.getBlogs();
  },
  methods: {
    async logout() {
      await this.$fire.auth.signOut();
      this.$router.push("/login");
    },
    addTodo() {
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
    async getBlogs() {
      var blogsRef = await firebase
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
