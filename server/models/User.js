const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Must use a valid email address"],
    },
    password: {
      type: String,
      required: true,
    },
    classes: [
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
    // TODO Add a new students array so that in the future, you can access all the students easier
  },
  // set this to use virtual below
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// hash user password
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

module.exports = User;
