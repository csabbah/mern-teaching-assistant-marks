import { gql } from "@apollo/client";

export const GET_USER = gql`
  query user($id: ID!) {
    user(_id: $id) {
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
      }
    }
  }
`;
