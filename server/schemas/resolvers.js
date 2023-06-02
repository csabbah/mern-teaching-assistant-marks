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
    fullData: async (parent, { _id }) => {
      if (_id) {
        const studentData = await Student.find({ userId: _id });
        const classData = await Class.find({ userId: _id });
        return { classes: classData, students: studentData };
      }

      throw new AuthenticationError("Not logged in");
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Email does not exist");
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

      return singleClass;
    },
    deleteClass: async (parent, { classId }) => {
      const deleteClass = await Class.findByIdAndDelete(classId);

      if (!deleteClass) {
        throw new Error("Class not found");
      }

      return deleteClass;
    },
    deleteUnit: async (parent, { classId, unitIds }) => {
      const updateResult = await Class.updateOne(
        { _id: classId },
        { $pull: { units: { _id: { $in: unitIds } } } }
      );

      if (updateResult.nModified === 0) {
        throw new Error("Class or units not found");
      }

      // Check if the class has any remaining units
      const classWithUnits = await Class.findById(classId);
      if (classWithUnits.units.length === 0) {
        // Remove the class if no units remaining
        await Class.findByIdAndDelete(classId);
        return "Units and class deleted successfully";
      }

      return "Units deleted successfully";
    },
    addStudent: async (parent, { studentToSave }) => {
      const singleStudent = await Student.create(studentToSave);

      return singleStudent;
    },

    deleteStudent: async (parent, { studentId }) => {
      const deletedStudent = await Student.findByIdAndDelete(studentId);

      if (!deletedStudent) {
        throw new Error("Student not found");
      }

      return deletedStudent;
    },

    updateStudentName: async (parent, { studentId, name }) => {
      // Update the student model itself
      const updatedStudent = await Student.findOneAndUpdate(
        { _id: studentId },
        { $set: { name } },
        { new: true }
      );

      if (!updatedStudent) {
        throw new Error("Student or grade not found");
      }

      return updatedStudent;
    },

    updateStudentGrade: async (
      parent,
      { studentId, gradeId, mark, finalMark }
    ) => {
      // Update the student model itself
      const updatedStudent = await Student.findOneAndUpdate(
        { _id: studentId, "grades._id": gradeId },
        { $set: { "grades.$.mark": mark }, finalMark: finalMark },
        { new: true }
      );

      if (!updatedStudent) {
        throw new Error("Student or grade not found");
      }

      return updatedStudent;
    },
  },
};

module.exports = resolvers;
