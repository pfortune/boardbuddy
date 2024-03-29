import { UserSpec, UserCredentialsSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const accountsController = {
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Welcome to Board Buddy" });
    },
  },
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup-view", { title: "Sign up for Board Buddy" });
    },
  },
  signup: {
    auth: false,
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("signup-view", { title: "Sign up error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const user = request.payload;
      user.permission = "USER";
      await db.userStore.addUser(user);
      return h.redirect("/");
    },
  },
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login-view", { title: "Log into Board Buddy" });
    },
  },
  login: {
    auth: false,
    validate: {
      payload: UserCredentialsSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("login-view", { title: "Log in error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const { email, password } = request.payload;
      const user = await db.userStore.getUserByEmail(email);
      if (!user || user.password !== password) {
        return h.redirect("/");
      }
      request.cookieAuth.set({ id: user._id });

      return h.redirect("/admin");
    },
  },
  logout: {
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },
  profile: {
    handler: async function (request, h) {
      const userId = request.auth.credentials._id; 
      const user = await db.userStore.getUserById(userId); 

      if (!user) {
        return h.redirect("/");
      }

      return h.view("profile-view", {
        title: "Your Profile",
        user: user
      });
    },
  },

  updateUser: {
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("profile-view", { title: "Update error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const updatedUser = request.payload;
      const userId = request.auth.credentials._id; 
      await db.userStore.updateUser(userId, updatedUser); 
      return h.redirect("/profile");
    },
  },

  async validate(request, session) {
    const user = await db.userStore.getUserById(session.id);
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true, credentials: user };
  },
};
