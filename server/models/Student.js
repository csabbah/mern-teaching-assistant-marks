const { Schema, model } = require("mongoose");

const studentSchema = new Schema(
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
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const Student = model("Student", studentSchema);

module.exports = Student;
