const { Schema, model } = require("mongoose");

const studentSchema = new Schema(
  {
    classId: { type: Number },
    name: { type: String },
    grades: [
      {
        // TODO Instead of doing classId like this, add the actual mongoose class id when creating a student
        classId: { type: Number },
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
