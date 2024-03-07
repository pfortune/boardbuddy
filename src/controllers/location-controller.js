import { db } from "../models/db.js";
import { GameSpec } from "../models/joi-schemas.js";

export const locationController = {
  index: {
    handler: async function (request, h) {
      const location = await db.locationStore.getLocationById(request.params.id);
      const viewData = {
        title: "Location",
        location: location,
      };
      return h.view("location-view", viewData);
    },
  },

  addGame: {
    validate: {
      payload: GameSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h
        .view("location-view", { 
          title: "Add game error", 
          errors: error.details 
        }).takeover()
        .code(400);
      },
    },
    handler: async function (request, h) {
      const location = await db.locationStore.getLocationById(request.params.id);
      const newGame = {
        title: request.payload.title,
        age: Number(request.payload.age),
        minPlayers: Number(request.payload.minPlayers),
        maxPlayers: Number(request.payload.maxPlayers),
        duration: Number(request.payload.duration),
        description: request.payload.description,
      };
      await db.gameStore.addGame(location._id, newGame);
      return h.redirect(`/location/${location._id}`);
    },
  },

  deleteGame: {
    handler: async function (request, h) {
      const location = await db.locationStore.getLocationById(request.params.id);
      await db.gameStore.deleteGame(request.params.gameid);
      return h.redirect(`/location/${location._id}`);
    },
  },
};
