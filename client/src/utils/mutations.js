import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        email
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($email: String!, $password: String!) {
    addUser(email: $email, password: $password) {
      token
      user {
        _id
        email
      }
    }
  }
`;

export const ADD_CLASS = gql`
  mutation addClass($classToSave: classInput) {
    addClass(classToSave: $classToSave) {
      _id
      schoolYear
      title
      units {
        _id
        themeColor
        title
        projects {
          _id
          title
          criterias {
            _id
            label
            letter
            weight
          }
        }
      }
    }
  }
`;

export const DELETE_CLASS = gql`
  mutation deleteClass($classId: String) {
    deleteClass(classId: $classId) {
      _id
    }
  }
`;

export const DELETE_UNIT = gql`
  mutation deleteUnit(
    $classId: String!
    $unitIds: [String]
    $studentIds: [String]
    $allUnits: [String]
  ) {
    deleteUnit(
      classId: $classId
      unitIds: $unitIds
      studentIds: $studentIds
      allUnits: $allUnits
    ) {
      _id
    }
  }
`;

export const ADD_STUDENT = gql`
  mutation addStudent($studentToSave: studentInput) {
    addStudent(studentToSave: $studentToSave) {
      _id
      name
      classId
      grades {
        _id
        classId
        criteria
        criteriaId
        letter
        mark
        project
        unit
        weight
      }
      finalMark
    }
  }
`;

export const DELETE_STUDENT = gql`
  mutation deleteStudent($studentId: String, $classId: String) {
    deleteStudent(studentId: $studentId, classId: $classId) {
      _id
    }
  }
`;

export const UPDATE_STUDENT_GRADE = gql`
  mutation updateStudentGrade(
    $studentId: String
    $gradeId: String
    $mark: Int
    $finalMark: Int
  ) {
    updateStudentGrade(
      studentId: $studentId
      gradeId: $gradeId
      mark: $mark
      finalMark: $finalMark
    ) {
      _id
    }
  }
`;

export const UPDATE_STUDENT_NAME = gql`
  mutation updateStudentName($studentId: String, $name: String) {
    updateStudentName(studentId: $studentId, name: $name) {
      _id
    }
  }
`;
