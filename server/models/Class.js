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
            // TODO updates from 'criterias' to 'weights' - Need to also update all around the application
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
    students: [
      {
        classId: { type: String },
        name: { type: String },
        grades: [
          {
            classId: { type: String },
            criteriaId: { type: String },
            // TODO Update from 'criteria' to 'weightLabel' - Need to also update all around the application
            criteria: { type: String },
            letter: { type: String },
            mark: { type: Number },
            project: { type: String },
            unit: { type: String },
            weight: { type: Number },
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
