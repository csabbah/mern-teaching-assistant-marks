const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type classesQueryResult {
    classes: [Class]
    students: [Student]
  }

  type Query {
    user(_id: ID!): User
    fullData(_id: ID!): classesQueryResult
  }

  type User {
    _id: ID
    email: String
  }

  type Grades {
    _id: ID
    classId: String
    criteriaId: String
    criteria: String
    letter: String
    mark: Int
    weight: Int
    project: String
    unit: String
  }

  type Student {
    _id: ID
    userId: String
    classId: String
    name: String
    grades: [Grades]
  }

  type Criterias {
    _id: ID
    label: String
    letter: String
    weight: Int
  }

  type Projects {
    _id: ID
    title: String
    criterias: [Criterias]
  }

  type Unit {
    _id: ID
    title: String
    themeColor: String
    projects: [Projects]
  }

  type Class {
    _id: ID
    schoolYear: String
    title: String
    userId: String
    units: [Unit]
  }

  input criteriasInput {
    label: String
    letter: String
    weight: Int
  }

  input projectInput {
    title: String
    criterias: [criteriasInput]
  }

  input unitInput {
    title: String
    themeColor: String
    projects: [projectInput]
  }

  input classInput {
    schoolYear: String
    title: String
    userId: String
    units: [unitInput]
  }

  input gradesInput {
    classId: String
    criteriaId: String
    criteria: String
    letter: String
    mark: Int
    weight: Int
    project: String
    unit: String
  }
  input studentInput {
    userId: String
    classId: String
    name: String
    grades: [gradesInput]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(email: String!, password: String!): Auth
    addClass(classToSave: classInput): Class
    addStudent(studentToSave: studentInput): Student
    deleteStudent(studentId: String): Student
    updateStudentGrade(studentId: String, mark: Int, gradeId: String): Student
    updateStudentName(studentId: String, name: String): Student
  }

  type Auth {
    token: ID!
    user: User
  }
`;

module.exports = typeDefs;
