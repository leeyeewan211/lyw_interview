<template>
  <v-app light>
    <v-main>
      The No.1 Blog Service
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {

}
</script>
