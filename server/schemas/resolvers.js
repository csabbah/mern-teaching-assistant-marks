const { User, Class, Student } = require("../models");

const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("notes");

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

      // TODO Add the function to push to the users classes array
      return singleClass;
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
