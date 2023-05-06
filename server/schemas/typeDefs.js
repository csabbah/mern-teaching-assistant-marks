const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    me: User
  }

  type User {
    _id: ID
    email: String
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
    labal: String
    letter: String
    weight: Int
  }

  type Projects {
    _id: ID
    title: String
    criterias: [Criterias]
  }

  type Units {
    _id: ID
    title: String
    themeColor: String
    projects: [Projects]
  }

  type Class {
    _id: ID
    schoolYear: String
    title: String
    units: [Units]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(email: String!, password: String!): Auth
  }

  type Auth {
    token: ID!
    user: User
  }
`;

module.exports = typeDefs;
