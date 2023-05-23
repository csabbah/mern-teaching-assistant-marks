import React, { useState, useEffect, useRef } from "react";

import Auth from "../utils/auth";
import { useHistory } from "react-router-dom";

import { useMutation } from "@apollo/client";
import { LOGIN_USER, ADD_USER } from "../utils/mutations";

// TODO Need to make sure the errors show up (i.e. 'Incorrect credentials', 'Incorrect password')
const Home = () => {
  const [formState, setFormState] = useState({ email: "", password: "" });

  const [displayErr, setDisplayErr] = useState({ reveal: false, msg: "" });

  const [login] = useMutation(LOGIN_USER, {
    onError: (e) => {
      setDisplayErr({ reveal: true, msg: e.message });
    },
  });

  // submit form
  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await login({
        variables: { ...formState },
      });

      Auth.login(data.login.token);
    } catch (error) {}
  };

  const [addUser] = useMutation(ADD_USER);

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();

    if (formState.password.length < 6) {
      return setDisplayErr({
        reveal: true,
        msg: "Password must be longer than 5 letters",
      });
    }

    try {
      const { data } = await addUser({
        variables: { ...formState },
      });
      Auth.login(data.addUser.token);
    } catch (error) {
      setDisplayErr({ reveal: true, msg: "Email already exists" });
    }
  };

  // update state based on form input changes
  const handleChange = (event) => {
    setDisplayErr({ reveal: false, msg: "" });
    const { name, value } = event.target;
    if (value === "hbdsarsoor") {
      return setHappyBirthday(true);
    }

    setFormState({
      ...formState,
      [name]: value.trim(),
    });
  };

  const [showSignIn, setShowSignIn] = useState(false);

  const history = useHistory();

  // Check if user is logged in
  let loggedIn = Auth.loggedIn();

  const audioRef = useRef(null);

  const [happyBirthday, setHappyBirthday] = useState(false);

  const generateNumberArray = (start, end) => {
    const numberArray = [];
    for (let i = start; i <= end; i++) {
      numberArray.push(i);
    }
    return numberArray;
  };
  const [images, setImages] = useState(generateNumberArray(1, 39));
  const imageCaptions = [
    "That time I stole your glasses",
    "That day you met my Dad",
    "That time we went to the Strangers Things experience - The man got some GOOD pictures of us",
    "The day you were really tired and I, quote on quote 'Picked up your slack', got you girl ;)",
    "The day my sister met yours❤️ - Also, remember how long the food took to come???? No complaints though, we had good conversations with great people :)",
    "The day I stole your heart",
    "The FIRST picture I ever saw of you, look at you....",
    "The day we went to the Harry Potter play - Are you a Gryffindor? Because you've got my heart roaring like a lion ;)",
    "That time we used BeReal for one day LOL - PS, that was my thinking face",
    "The day you took me to my first pumpkin patch and we spoke about our faith",
    "Our first Christmas market❤️ - Also the day our patience was tested (with the crowd)",
    "The picture we took outside the Harry Potter play❤️",
    "The night we went to the CNE - I loved the conversations we had that night when we were sharing my first Churro",
    "Our second Raptors game, but this time closer :)",
    "That time we found a GOOD Italian restaurant called the La Vecchia, I remember we spoke about our experience in highschool that night",
    "That time we time traveled to the 80s, when you took me out for my first Birthday together",
    "That night we went to the Monster House together",
    "The day you showed me the 3rd best reason to visit Cambridge, Cambridge mill restaurant being 3rd, Tito being 2nd, you being 1st😘",
    "That time you stole my hat without conseeeeent",
    "Our first Picnic together, still thinking about it🥺🫶🏻",
    "Still shocked by how fast you finished the green olives LOL",
    "A cute bridge picture, a must add if I must say so myself",
    "The time we discovered mini Europe in Brant Street Pier",
    "That time we went to the CN Tower with Diana and Noura! Taking our love to new heights ;)",
    "That time I got you Krispy Kreme on my birthday, because a celebration for me is one for you too",
    "That night you took me to Bar Poet, please don't ever get rid of that shirt😍",
    "That day we went to your school and yes I'm still thinking about the brownie I had in the bullring",
    "I looked like an outsider here lol",
    "The day your basketball team won the tourneeeey, was I surprised? Nope. They had the best coach :)",
    "The day I met Diana for the first time in person, I had a good time!",
    "Our first picture by the falls together, you had me fallllling head over heels for you gurl ;)",
    "The tunnel we took at Casaloma, you look stunning in that jacket😍",
    "The picture we took from the outside, we took quite a bit of them, the wind kept messing up your hair here hehe",
    "Our FIRST Raptors game together❤️",
    "The picture we took after the Cambridge mill restaurant, you were cold here, that's why you had my jacket on, I got you :)",
    "The picture I took of you at the restaurant, I remember our conversations about our siblings and about what we love about them",
    "The day we went to the office, LITERALLY, SO cool and look at that picture comparison, IDENTICAL, except I like you better than Pam",
    "'Now, smooch'",
    "Are you a coffee bean? Because you've got me spilling the beans about how much I bean-crushing on you",
  ];
  const [progress, setProgress] = useState(0);
  const [playMusic, setPlayMusic] = useState(false);

  useEffect(() => {
    if (playMusic) {
      audioRef.current.currentTime = 2;
      audioRef.current.play();
    }
  }, [playMusic]);

  useEffect(() => {
    if (happyBirthday) {
      setPlayMusic(true);
      document.body.classList.add("active"); // Add the class to the body element
    } else {
      document.body.classList.remove("active"); // Add the class to the body element

      setPlayMusic(false);
      setProgress(0);
    }
  }, [happyBirthday, progress]);

  useEffect(() => {
    loggedIn && history.push("/your-classes");

    document.title = "Hershy - Home";
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <p style={{ position: "absolute", top: 20, left: 20 }}>Hershy's Book</p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          position: "absolute",
          cursor: "pointer",
          userSelect: "none",
          bottom: 20,
          left: 20,
          gap: 15,
        }}
      >
        <p style={{ margin: 0 }}>Privacy</p>
        <p style={{ margin: 0 }}>Help</p>
        <p style={{ margin: 0 }}>About us</p>
        <p style={{ margin: 0 }}>Our Socials</p>
      </div>
      {happyBirthday && (
        <div
          style={{
            position: "absolute",
            height: "100vh",
            width: "100vw",
            backgroundColor: "rgba(0,0,0,0.7)",
            zIndex: 50,
            backdropFilter: "blur(20px)",
          }}
        >
          <img
            onClick={() => {
              setHappyBirthday(false);
            }}
            alt="close button"
            style={{
              position: "fixed",
              top: 25,
              right: 25,
              width: 25,
              height: 25,
              opacity: 0.7,
              filter: "invert(100%)",
              cursor: "pointer",
              zIndex: 100,
            }}
            src="/close.png"
          ></img>
          <div class="singleRow"></div>

          <audio ref={audioRef}>
            <source src="/forSarah/golden.mp3" type="audio/mpeg" />
          </audio>
          <h1
            className="birthday-header"
            style={{ color: "white", position: "absolute", top: 25, left: 25 }}
          >
            Happy Birthday Sarsoor❤️
          </h1>
          <div
            style={{
              position: "absolute",
              top: 100,
              left: "50%",
              transform: "translateX(-50%)",
            }}
            class="grid-container"
          >
            {images.map((image, i) => {
              return (
                <div className="grid-item">
                  <img
                    class="grid-item-2"
                    src={`/forSarah/${image}.png`}
                    alt=""
                  />
                  <p>{imageCaptions[i]}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="px-3 w-100">
        <div
          style={{
            alignItems: "center",
          }}
        >
          <h5 style={{ fontWeight: 600 }}>Welcome!</h5>
          <p>Please login or sign up to get started!</p>
        </div>
        <h5 style={{ fontWeight: 600 }} className="mt-5 mb-3">
          {showSignIn ? "Sign in" : "Sign up"}
        </h5>
        {showSignIn ? (
          <form onSubmit={handleLoginSubmit} className="row">
            <div className="col-sm-12 col-lg-6 col-xl-5">
              <label htmlFor="inputEmail4" className="form-label">
                Email
              </label>
              <input
                onChange={(e) => {
                  handleChange(e);
                }}
                name="email"
                type="email"
                className="form-control"
                id="inputEmail4"
                value={formState.email}
              />
              {displayErr.reveal && (
                <p style={{ color: "red", fontSize: 15 }} className="mt-2 mb-0">
                  {displayErr.msg}
                </p>
              )}
            </div>
            <div className="col-sm-12 col-lg-6 col-xl-5 mt-sm-0 mt-3">
              <label htmlFor="inputPassword4" className="form-label">
                Password
              </label>
              <input
                onChange={(e) => {
                  handleChange(e);
                }}
                name="password"
                type="password"
                className="form-control"
                id="inputPassword4"
                value={formState.password}
              />
            </div>
            <div className="col-12 mt-3">
              <button
                style={{ width: 100 }}
                type="submit"
                className="btn btn-primary mb-2"
              >
                Sign in
              </button>
              <p style={{ userSelect: "none", marginTop: 15 }}>
                <span
                  onClick={() => {
                    setShowSignIn(false);
                    setDisplayErr({ reveal: false, msg: "" });
                  }}
                  style={{ color: "blue", cursor: "pointer" }}
                >
                  Go Back
                </span>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignUpSubmit} className="row">
            <div className="col-sm-12 col-lg-6 col-xl-5">
              <label htmlFor="inputEmail4" className="form-label">
                Email
              </label>
              <input
                onChange={(e) => {
                  handleChange(e);
                }}
                name="email"
                type="email"
                className="form-control"
                id="inputEmail4"
                value={formState.email}
              />
              {displayErr.reveal && (
                <p style={{ color: "red", fontSize: 15 }} className="mt-2 mb-0">
                  {displayErr.msg}
                </p>
              )}
            </div>
            <div className="col-sm-12 col-lg-6 col-xl-5 mt-sm-0 mt-3">
              <label htmlFor="inputPassword4" className="form-label">
                Password
              </label>
              <input
                onChange={(e) => {
                  handleChange(e);
                }}
                name="password"
                type="password"
                className="form-control"
                id="inputPassword4"
                value={formState.password}
              />
            </div>
            <div className="col-12 mt-3">
              <button
                style={{ width: 100 }}
                type="submit"
                className="btn btn-primary mb-2"
              >
                Sign up
              </button>
              <p style={{ userSelect: "none", marginTop: 15 }}>
                Already a member?{" "}
                <span
                  onClick={() => {
                    setShowSignIn(true);
                    setDisplayErr({ reveal: false, msg: "" });
                  }}
                  style={{
                    color: "blue",
                    cursor: "pointer",
                  }}
                >
                  Login
                </span>
              </p>
            </div>
          </form>
        )}
      </div>
      <div
        style={{
          backgroundColor: "#333",
          height: "100vh",
        }}
        className="w-50 d-none d-md-flex"
      ></div>
    </div>
  );
};

export default Home;
