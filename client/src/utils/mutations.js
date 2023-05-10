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
      classes {
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
  }
`;
// {
//   "classToSave": {
//     "title": "Biology",
//     "schoolYear": "03/21/2023",
//     "units": [{
//       "title": "Organisms",
//       "themeColor":"rgba(255,0,0,0.2)",
//       "projects": [{
//         "title": "Test 1",
//         "criterias":[{"label": "Application", "letter":"A", "weight": 20}]
//       }]
//     }]
//   }
// }

export const ADD_STUDENT = gql`
  mutation addStudent($studentToSave: studentInput) {
    addStudent(studentToSave: $studentToSave) {
      _id
      email
      classes {
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
        students {
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
        }
      }
    }
  }
`;
// {
//   "studentToSave": {
//     "name": "Jack",
//     "classId": 322332523,
//     "grades": [{
//       "classId": 322332523,
//       "criteria": "Application",
//       "letter": "A",
//       "mark": 32,
//       "project": "Test 1",
//       "unit": "Biology",
//       "weight": 20
//     }
//     ]
//   }
// }

export const DELETE_STUDENT = gql`
  mutation deleteStudent(
    $studentId: String
    $classId: String
    $userId: String
  ) {
    deleteStudent(studentId: $studentId, classId: $classId, userId: $userId) {
      _id
    }
  }
`;
