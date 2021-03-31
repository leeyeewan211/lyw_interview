import colors from "vuetify/es5/util/colors";

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s - lyw_interview",
    title: "lyw_interview",
    htmlAttrs: {
      lang: "en"
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
    "@nuxtjs/pwa"
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    [
      "@nuxtjs/firebase",
      {
        config: {
          apiKey: "AIzaSyB7t2pntHZAjHSk3T3ShltAmKQ8zD1BwB8",
          authDomain: "twoappstudio-interview.firebaseapp.com",
          projectId: "twoappstudio-interview",
          storageBucket: "twoappstudio-interview.appspot.com",
          messagingSenderId: "373839405305",
          appId: "1:373839405305:web:694ead60be0a33e3e2c228",
          measurementId: "G-KS8BHGQC29"
        },
        services: {
          auth: {
            initialize: {
              onAuthStateChangedAction: "onAuthStateChanged"
            },
            ssr: true
            // watchLoggedIn: false
          }
        }
      }
    ],
    ["vuetify-dialog/nuxt", { property: "$dialog" }]
  ],

  // not needed after all
  // router: {
  //   extendRoutes(routes, resolve) {
  //     routes.push({
  //       name: "blog-userId-blogId",
  //       path: "/blog/:userId/:blogId",
  //       component: resolve(__dirname, "pages/blog/_userId/_blogId.vue")
  //     });
  //   }
  // },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  pwa: {
    workbox: {
      importScripts: ["/firebase-auth-sw.js"],
      // by default the workbox module will not install the service worker in dev environment to avoid conflicts with HMR
      // only set this true for testing and remember to always clear your browser cache in development
      dev: process.env.NODE_ENV === "development"
    }
  }
};
