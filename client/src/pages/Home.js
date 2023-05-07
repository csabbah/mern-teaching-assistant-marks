import React from "react";

import Auth from "../utils/auth";
import { Link } from "react-router-dom";

const Home = () => {
  // Check if user is logged in
  let loggedIn = Auth.loggedIn();

  // // If user is logged in, return their auth data (Their username, email and ID)
  // let userData = Auth.getProfile();
  // console.log("User data:", userData);

  return (
    <div className="container mt-2">
      <section>
        <p>Welcome hero!</p>
        <p>
          Please login or sign up to securely save your data. <br></br>
          Otherwise, it will only be stored locally on the current device,
          unless you clear your browser cache.
        </p>
        <Link as={Link} to="/add-classes">
          Setup your marks here
        </Link>
      </section>
    </div>
  );
};

export default Home;
