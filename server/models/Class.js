const { Schema, model } = require("mongoose");

const classSchema = new Schema(
  {
    schoolYear: {
      type: String,
    },
    title: {
      type: String,
    },
    units: [
      {
        title: {
          type: String,
        },
        themeColor: {
          type: String,
        },
        projects: [
          {
            title: { type: String },
            criterias: [
              {
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
