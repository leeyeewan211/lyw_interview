<template>
  <v-app light>
    <v-app-bar app class="d-flex justify-end elevation-0">
      <v-btn
        v-if="null == authUser"
        @click="signInWithGoogle"
        class="ma-2"
        depressed
        >Login</v-btn
      >
      <nuxt-link v-else :to="{ name: 'blog-me' }" style="text-decoration: none">
        <v-btn class="ma-2 primary" depressed>View Profile</v-btn>
        <v-btn @click="logout">Logout</v-btn>
      </nuxt-link>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer></v-footer>
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
  methods: {
    async signInWithGoogle() {
      var provider = new this.$fireModule.auth.GoogleAuthProvider();
      let authData = await this.$fire.auth.signInWithPopup(provider);
      createProfile(authData);
      this.$router.push({ name: "blog-me" });
    },
    async logout() {
      await this.$fire.auth.signOut();
      this.$router.push("/");
    }
  }
};
</script>

<style>
.v-application a {
  text-decoration: none;
}

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
