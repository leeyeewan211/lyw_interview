export default {
  async nuxtServerInit({ dispatch }, ctx) {
    if (this.$fire.auth === null) {
      throw "this.$fire.auth cannot be accessed.";
    }
    if (ctx.$fire.auth === null) {
      throw "ctx.$fire.auth cannot be accessed.";
    }
    if (ctx.app.$fire.auth === null) {
      throw "ctx.$fire.auth cannot be accessed.";
    }

    // Get the verified authUser from the server
    if (ctx.res && ctx.res.locals && ctx.res.locals.user) {
      const { allClaims: claims, ...authUser } = ctx.res.locals.user;

      console.info(
        "Auth User verified on server-side. User: ",
        authUser,
        "Claims:",
        claims
      );

      await dispatch("onAuthStateChanged", {
        authUser,
        claims
      });
    }
  },

  onAuthStateChanged({ commit }, { authUser, claims }) {
    if (!authUser) {
      commit("RESET_STORE");
      return;
    }
    commit("SET_AUTH_USER", authUser);
  }
};
