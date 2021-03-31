<template>
  <v-row class="justify-content-end">
    <v-col>
      <v-btn
        v-if="null == authUser"
        @click="signInWithGoogle"
        color="primary"
        class="ma-2"
        >Login</v-btn
      >
      <nuxt-link v-else :to="{ name: 'blog-me' }">
        <v-btn>View Profile</v-btn>
      </nuxt-link>
      <br /><br />
      <div v-for="user in users" :key="user.id">
        <nuxt-link :to="{ name: 'blog-userId', params: { userId: user.id } }">{{
          user.name
        }}</nuxt-link>
      </div>
    </v-col>
    <div></div>
  </v-row>
</template>

<script>
import firebase from "firebase";
import { mapState } from "vuex";

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
