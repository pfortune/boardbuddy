import { db } from "../models/db.js";
import { LocationSpec } from "../models/joi-schema.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const location = await db.locationStore.getUserLocation(loggedInUser._id);
      const viewData = {
        title: "Board Buddy Dashboard",
        user: loggedInUser,
        locations,
      };
      return h.view("dashboard-view", viewData);
    },
  },

  addLocation: {
    validate: {
      payload: LocationSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h
          .view("dashboard-view", {
            title: "Add Location error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      }
    },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const newLocation = {
        userid: loggedInUser._id,
        title: request.payload.title,
      };
      await db.locationStore.addLocation(newLocation);
      return h.redirect("/dashboard");
    },
  },

  deleteLocation: {
    handler: async function (request, h) {
      const location = await db.locationStore.getLocationById(request.params.id);
      await db.locationStore.deleteLocationById(location._id);
      return h.redirect("/dashboard");
    },
  },
};