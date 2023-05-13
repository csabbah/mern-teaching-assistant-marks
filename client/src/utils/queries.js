import { gql } from "@apollo/client";

export const GET_USER = gql`
  query user($id: ID!) {
    user(_id: $id) {
      _id
      email
    }
  }
`;

export const GET_DATA = gql`
  query fullData($id: ID!) {
    fullData(_id: $id) {
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
        finalMark
      }
    }
  }
`;

export const GET_STUDENTS = gql`
  query students($id: ID) {
    students(_id: $id) {
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
`;
