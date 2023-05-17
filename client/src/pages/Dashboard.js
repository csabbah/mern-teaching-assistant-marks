import React, { useEffect, useState } from "react";

import { useQuery } from "@apollo/client";
import { GET_DATA } from "../utils/queries";

import Auth from "../utils/auth";

// TODO Allow users to update Classes here and also students? (Maybe that's not necessary?)
const Dashboard = () => {
  const [fullData, setFullData] = useState([]);
  const [userId, setUserId] = useState(Auth.getProfile().data._id);

  const { loading, data, refetch } = useQuery(GET_DATA, {
    variables: { id: userId },
  });

  useEffect(() => {
    refetch();

    setFullData(data?.fullData);
  }, [loading, fullData, refetch]);

  useEffect(() => {
    document.title = "Hershy - Dashboard";
  }, []);

  const [viewing, setViewing] = useState("Classes");

  if (loading || !fullData || !fullData.students || !fullData.classes) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
        className="container mt-5"
      >
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="container mt-5"
    >
      <div style={{ display: "flex", gap: 15 }}>
        {["Classes", "Students", "Reports"].map((item) => {
          return (
            <p
              key={item}
              onClick={(e) => {
                setViewing(e.target.textContent);
              }}
              style={{
                fontSize: 18,
                cursor: "pointer",
                userSelect: "none",

                borderBottom:
                  viewing === item
                    ? "2px solid rgba(1,75,255,0.5)"
                    : "2px solid transparent",
                color: viewing === item ? "rgba(1,75,255,0.8)" : "#333",
              }}
            >
              {item}
            </p>
          );
        })}
      </div>
      {viewing === "Classes" && (
        <div style={{ display: "flex", gap: 10 }}>
          {fullData.classes.map((singleClass) => {
            return <p>{singleClass.title}</p>;
          })}
        </div>
      )}
      {viewing === "Students" && (
        <div style={{ display: "flex", gap: 10 }}>
          {fullData.students.map((student) => {
            return <p>{student.name}</p>;
          })}
        </div>
      )}
      {viewing === "Reports" && (
        <div style={{ display: "flex", gap: 10 }}>
          <p>Your reports:</p>
        </div>
      )}
      <div style={{ display: "flex", gap: 10 }}></div>
    </div>
  );
};

export default Dashboard;
