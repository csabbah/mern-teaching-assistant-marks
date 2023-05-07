const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    me: User
  }

  type User {
    _id: ID
    email: String
    classes: [Class]
    students: [Student]
  }

  type Grades {
    _id: ID
    classId: Int
    criteria: String
    letter: String
    mark: Int
    weight: Int
    project: String
    unit: String
  }

  type Student {
    _id: ID
    classId: Int
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
    units: [Unit]
  }

  input criteriasInput {
    _id: ID
    label: String
    letter: String
    weight: Int
  }

  input projectInput {
    _id: ID
    title: String
    criterias: [criteriasInput]
  }

  input unitInput {
    _id: ID
    title: String
    themeColor: String
    projects: [projectInput]
  }

  input classInput {
    _id: ID
    schoolYear: String
    title: String
    units: [unitInput]
  }

  input gradesInput {
    _id: ID
    classId: Int
    criteria: String
    letter: String
    mark: Int
    weight: Int
    project: String
    unit: String
  }
  input studentInput {
    _id: ID
    classId: Int
    name: String
    grades: [gradesInput]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(email: String!, password: String!): Auth
    addClass(classToSave: classInput): Class
    addStudent(studentToSave: studentInput): Student
  }

  type Auth {
    token: ID!
    user: User
  }
`;

module.exports = typeDefs;
