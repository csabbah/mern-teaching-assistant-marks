import React, { useState, useEffect } from "react";

import { useQuery } from "@apollo/client";
import { GET_USER } from "../utils/queries";

import Auth from "../utils/auth";

// TODO Clean up ui, center everything
// TODO Allow the user to view both reports, students and classes at a glance (no details)?
const Profile = () => {
  let userData = Auth.getProfile();
  // Execute useQuery method to return full user data (Using the extracted user _id above)
  const { loading, data } = useQuery(GET_USER, {
    variables: { id: userData.data._id },
  });

  useEffect(() => {
    document.title = "Hersh - Profile";
  }, []);

  // Execute this upon first page load return user information
  useEffect(() => {
    // Check if user is logged in
    let loggedIn = Auth.loggedIn();
  }, []);

  // Wait until data fully loads up
  if (!loading) {
    // Main User Data (Full Data)
    console.log(data);
  }

  return <div style={{ paddingLeft: "15px" }}>Profile Page</div>;
};

export default Profile;
