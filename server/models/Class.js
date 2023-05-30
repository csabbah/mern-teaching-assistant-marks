const { Schema, model } = require("mongoose");

const classSchema = new Schema(
  {
    schoolYear: {
      type: String,
    },
    title: {
      type: String,
    },
    userId: { type: String },
    units: [
      {
        title: {
          type: String,
        },
        themeColor: {
          type: String,
        },
        localId: { type: Number },
        projects: [
          {
            title: { type: String },
            // TODO updates from 'criterias' to 'weights' - Need to also update all around the application
            criterias: [
              {
                localId: { type: Number },
                label: { type: String },
                letter: { type: String },
                weight: { type: Number },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const Class = model("Class", classSchema);

module.exports = Class;
