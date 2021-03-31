<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-card-text>
          <v-btn @click="signInWithGoogle" color="primary" class="ma-2"
            >Sign in with Google</v-btn
          >
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import firebase from "firebase";

const createProfile = async (authUser, context) => {
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
  methods: {
    async signInWithGoogle() {
      var provider = new this.$fireModule.auth.GoogleAuthProvider();
      let authData = await this.$fire.auth.signInWithPopup(provider);
      createProfile(authData);
      this.$router.push({ name: "blog-me" });
    }
  }
};
</script>
