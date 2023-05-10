const { User, Class, Student } = require("../models");

const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    user: async (parent, { _id }) => {
      if (_id) {
        const userData = await User.findOne({ _id: _id });

        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },

    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    addClass: async (parent, { classToSave }) => {
      const singleClass = await Class.create(classToSave);

      const updatedUser = await User.findByIdAndUpdate(
        { _id: classToSave.userId },
        { $addToSet: { classes: singleClass } },
        { new: true }
      );

      return updatedUser;
    },
    addStudent: async (parent, { studentToSave }) => {
      const singleStudent = await Student.create(studentToSave);

      // TODO When you add the student to the class and that class object is inside the user model...
      // TODO Shouldn't the new student be visible within the users classes array? - Maybe there's an issue with the mutation in the frontend?
      // TODO Or Maybe we are not referencing (i.e. 'type: Ref') the class model in the user model? (I don't think this is the case)
      // ? Push student to the corresponding class
      await Class.findByIdAndUpdate(
        { _id: studentToSave.classId },
        { $addToSet: { students: singleStudent } },
        { new: true }
      );

      // ? Push student to the corresponding class INSIDE the users classes array
      const updatedUser = await User.findOneAndUpdate(
        { "classes._id": studentToSave.classId },
        { $push: { "classes.$.students": singleStudent } },
        { new: true }
      );

      await User.findByIdAndUpdate(
        { _id: studentToSave.userId },
        { $addToSet: { students: singleStudent } },
        { new: true }
      );

      return updatedUser;
    },

    // TODO When you delete a student, update query so it returns the userData object
    // TODO that way we can update the userData object
    deleteStudent: async (parent, { studentId, classId, userId }) => {
      const deletedStudent = await Student.findByIdAndDelete(studentId);

      if (!deletedStudent) {
        throw new Error("Student not found");
      }

      await Class.findByIdAndUpdate(
        { _id: classId },
        { $pull: { students: { _id: studentId } } },
        { new: true }
      );

      await User.findOneAndUpdate(
        { _id: userId },
        {
          $pull: {
            students: { _id: studentId },
            "classes.$[].students": { _id: studentId },
          },
        }
      );

      return deletedStudent;
    },
  },
};

module.exports = resolvers;
