const { User, Class, Student } = require("../models");

const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    user: async (parent, { _id }) => {
      if (_id) {
        const userData = await User.findOne({ _id: _id }).populate("classes");
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

      // TODO Add the function to push to the users classes array
      return updatedUser;
    },
    addStudent: async (parent, { studentToSave }) => {
      const singleStudent = await Student.create(studentToSave);

      // TODO Add the function to push to the users students array
      // TODO Add the function to push to the associated class
      return singleStudent;
    },
  },
};

module.exports = resolvers;
