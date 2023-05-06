const { Schema, model } = require("mongoose");

const studentSchema = new Schema(
  {
    classId: { type: Number },
    name: { type: String },
    grades: [
      {
        classId: { type: Number },
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
