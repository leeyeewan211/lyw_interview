<template>
  <v-app>
    <v-main>
      <v-container>
        <v-card class="elevation-0">
          <v-list v-for="user in users" :key="user.id">
            <div class="d-flex">
              <div class="mr-auto">
                <h3>{{ user.name }}</h3>
              </div>
              <div class="mb-5">
                <nuxt-link
                  :to="{ name: 'blog-userId', params: { userId: user.id } }"
                >
                  <v-btn class="blue" dark depressed>View Blogs</v-btn>
                  <br />
                </nuxt-link>
              </div>
            </div>
          </v-list>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import firebase from "firebase";

const createProfile = async authUser => {
  try {
    return firebase
      .firestore()
      .collection("users")
      .doc(authUser.user.uid)
      .set({
        name: authUser.user.displayName,
        email: authUser.user.email
      });
  } catch (message) {
    return console.error(message);
  }
};

export default {
  computed: {
    ...mapState(["authUser"])
  },
  data() {
    return {
      users: [],
      user: {}
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    async signInWithGoogle() {
      var provider = new this.$fireModule.auth.GoogleAuthProvider();
      let authData = await this.$fire.auth.signInWithPopup(provider);
      createProfile(authData);
      this.$router.push({ name: "blog-me" });
    },
    async getUsers() {
      var usersRef = firebase.firestore().collection("users");
      usersRef.onSnapshot(snap => {
        this.users = [];
        snap.forEach(doc => {
          var user = doc.data();
          user.id = doc.id;
          this.users.push(user);
        });
      });
    }
  }
};
</script>

<style>
.v-application a {
  text-decoration: none;
}

h3 {
  color: black;
  font-weight: 500;
  margin-bottom: 5px;
}
</style>
