/**
 * JSON-based storage for location data, supporting CRUD operations.
 * Locations are uniquely identified using UUIDs. Integrates with gameJsonStore for related game data.
 *
 * @module locationJsonStore
 * @author Peter Fortune
 * @date 04/03/2024
 */

import { v4 } from "uuid";
import { db } from "./store-utils.js";
import { gameJsonStore } from "./game-json-store.js";

export const locationJsonStore = {
  async getAllLocations() {
    await db.read();
    return db.data.locations;
  },

  async addLocation(location) {
    await db.read();
    location._id = v4();
    db.data.locations.push(location);
    await db.write();
    return location;
  },

  async getLocationById(id) {
    await db.read();
    let list = db.data.locations.find((location) => location._id === id);
    if (list) {
      list.games = await gameJsonStore.getGamesByLocationId(list._id);
    } else {
      list = null;
    }
    return list;
  },

  async getLocations(userid) {
    await db.read();
    return db.data.locations.filter((location) => location.userid === userid);
  },

  async deleteLocationById(id) {
    await db.read();
    const index = db.data.locations.findIndex((location) => location._id === id);
    if (index !== -1) db.data.locations.splice(index, 1);
    await db.write();
  },

  async deleteAllLocations() {
    db.data.locations = [];
    await db.write();
  },
};