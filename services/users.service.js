"use strict";

const DbMixin = require("../mixins/db.mixin");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
module.exports = {
  name: "users",
  // version: 1

  /**
   * Mixins
   */
  mixins: [DbMixin("users"), CacheCleanerMixin(["cache.clean.users"])],

  /**
   * Settings
   */
  settings: {
    // Available fields in the responses
    fields: [
      "_id",
      "email",
      "password",
      "first_name",
      "last_name",
      "middle_names",
      "birthdate",
      "birthplace",
      "image",
    ],

    // Validator for the `create` & `insert` actions.
    /** Validator schema for entity */
    entityValidator: {
      email: { type: "email" },
      password: { type: "string", min: 6 },
      first_name: { type: "string", min: 1 },
      last_name: { type: "string", min: 1 },
      middle_names: { type: "string", min: 1, optional: true },
      birthdate: { type: "string", min: 10 },
      birthcountry: { type: "string", min: 2 },
      birthplace: { type: "string", min: 2 },
      image: { type: "string", optional: true },
    },
  },

  /**
   * Action Hooks
   */
  hooks: {
    before: {
      /**
       * Register a before hook for the `create` action.
       * It sets a default value for the quantity field.
       *
       * @param {Context} ctx
       */
    },
  },

  /**
   * Actions
   */
  actions: {
    /**
     * Register a new user
     *
     * @actions
     * @param {Object} user - User entity
     *
     * @returns {Object} Created entity & token
     */

    craete: {
      rest: "POST /users",
      params: {
        user: { type: "object" },
      },
      async handler(ctx) {
        let entity = ctx.params.user;
        await this.validateEntity(entity);

        if (entity.email) {
          const found = await this.adapter.findOne({ email: entity.email });
          console.log({ found });
          if (found) {
            throw new MoleculerClientError("Email is exist!", 422, "", [
              { field: "email", message: "is exist" },
            ]);
          }
        }

        entity.password = bcrypt.hashSync(entity.password, 10);
        entity.middle_names = entity.middle_names || "";
        entity.image = entity.image || null;
        entity.createdAt = new Date();

        const doc = await this.adapter.insert(entity);
        const user = await this.transformDocuments(ctx, {}, doc);
        const json = await this.transformEntity(user, true, ctx.meta.token);
        await this.entityChanged("created", json, ctx);

        return json;
      },
    },

    /**
     * The "moleculer-db" mixin registers the following actions:
     *  - list
     *  - find
     *  - count
     *  - create
     *  - insert
     *  - update
     *  - remove
     */
    // --- ADDITIONAL ACTIONS ---
    /**
     * Increase the quantity of the product item.
     */
  },

  /**
   * Methods
   */
  methods: {
    /**
     * Loading sample data to the collection.
     * It is called in the DB.mixin after the database
     * connection establishing & the collection is empty.
     */
    async seedDB() {
      await this.adapter.insertMany([
        {
          name: "Large free range egg",
          protein: 6.3,
          carbs: 0.6,
          fat: 5.3,
          price: 0.25,
        },
      ]);
    },
  },

  /**
   * Fired after database connection establishing.
   */
  async afterConnected() {
    // await this.adapter.collection.createIndex({ name: 1 });
  },
};
