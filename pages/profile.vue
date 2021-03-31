<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-card-text>
          <p>Your e-mail is {{ authUser.email }}</p>
          <v-btn @click="logout">Logout</v-btn>
          <button v-on:click="say('hi')">Say hi</button>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="auto">
      <v-dialog
        transition="dialog-top-transition"
        max-width="600"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            v-bind="attrs"
            v-on="on"
          >From the top</v-btn>
        </template>
        <template v-slot:default="dialog">
          <v-card>
            <v-toolbar
              color="primary"
              dark
            >Opening from the top</v-toolbar>
            <v-card-text>
              <v-form
              ref="form"
              v-model="valid"
              lazy-validation
            >
              <v-text-field
                v-model="name"
              :counter="10"
              :rules="nameRules"
              label="Name"
              required
              ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="validate"
              >
                POST
              </v-btn>

              <v-btn
                text
                @click="dialog.value = false"
              >Close</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-col>
  </v-row>
</template>


<script>
import { mapState, mapGetters } from "vuex"

export default {
  layout: 'basic',
  middleware: 'auth',
  components: {
  },
  computed: {
    ...mapState(['authUser'])
  },
  data: () => ({
      valid: true,
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ]
    }),
  methods: {
    async logout() {
      await this.$fire.auth.signOut()
      this.$router.push('/login')
    },
    say: function (message) {
      alert(message)
    },
    validate () {
      this.$refs.form.validate()
    },
    addTodo() {
        firebase
            .firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .collection("todos")
            .add({
                title: this.todo.title,
                createdAt: new Date(),
                isCompleted: false,
            })
    }
  }
}
</script>

