import React, { useEffect, useState } from "react";

import { useQuery } from "@apollo/client";
import { GET_DATA } from "../utils/queries";

import Auth from "../utils/auth";

import { useMutation } from "@apollo/client";
import { DELETE_CLASS } from "../utils/mutations";
import { useLocation } from "react-router-dom";

// TODO Allow users to update Classes here and also students? (Maybe that's not necessary?)
const Dashboard = () => {
  const location = useLocation();
  const receivedData = location.state;
  const [showSingleClass, setShowSingleClass] = useState(
    receivedData !== undefined
  );

  const [fullData, setFullData] = useState([]);
  const [userId, setUserId] = useState(Auth.getProfile().data._id);

  const { loading, data, refetch } = useQuery(GET_DATA, {
    variables: { id: userId },
  });

  const [deleteClass] = useMutation(DELETE_CLASS);
  const handleDeleteClass = async (classId) => {
    try {
      await deleteClass({
        variables: { classId },
      });

      const updatedClasses = fullData.classes.filter(
        (singleClass) => singleClass._id !== classId
      );

      setFullData({
        ...fullData,
        classes: updatedClasses,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const [editMode, setEditMode] = useState([false, 0]);

  useEffect(() => {
    refetch();

    if (data && data.fullData) {
      setFullData(data.fullData);
    }
  }, [data, refetch]);

  useEffect(() => {
    document.title = "Hershy - Dashboard";
  }, []);

  useEffect(() => {
    if (receivedData && receivedData.classId) {
      setEditMode([true, receivedData.classId]);
    }
  }, [receivedData]);

  const [viewing, setViewing] = useState("Classes");

  if (loading || !fullData || !fullData.students || !fullData.classes) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 75,
        }}
        className="container"
      >
        <p>Loading...</p>
      </div>
    );
  }

  const editClassClicked =
    receivedData &&
    fullData.classes.find(
      (classItem) => classItem._id === receivedData.classId
    );

  // TODO When editing data, add a confirm edit button at the bottom of the class card
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 75,
      }}
      className="container"
    >
      <div style={{ display: "flex", gap: 15 }}>
        {["Classes", "Students", "Reports"].map((item) => {
          return (
            <p
              key={item}
              onClick={(e) => {
                setViewing(e.target.textContent);
                setShowSingleClass(false);
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

      {viewing === "Classes" && !showSingleClass && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "100vw",
            justifyContent: "center",
            gap: 40,
          }}
        >
          {fullData.classes.map((singleClass, i) => {
            return (
              <div
                key={i}
                style={{
                  borderRadius: 10,
                  border: "2px solid rgba(0,0,0,0.2)",
                  boxShadow: "2px 2px 5px 0 rgba(0,0,0,0.3)",
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {editMode[0] && editMode[1] === singleClass._id ? (
                    <input defaultValue={singleClass.title}></input>
                  ) : (
                    <h5 style={{ margin: 0 }}>{singleClass.title}</h5>
                  )}
                  {editMode[0] && editMode[1] === singleClass._id ? (
                    <button
                      onClick={() => handleDeleteClass(singleClass._id)}
                      style={{ fontSize: 14 }}
                    >
                      Delete Class
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditMode([true, singleClass._id])}
                      style={{ fontSize: 14 }}
                    >
                      Edit Class
                    </button>
                  )}
                </div>
                {singleClass.units.map((unit, i) => {
                  return (
                    <div
                      style={{
                        position: "relative",
                        margin: "15px 0",
                        marginBottom:
                          i === singleClass.units.length - 1 ? 0 : 15,
                        backgroundColor: "rgba(255,255,255,0.5)",
                        boxShadow: "2px 2px 2px 0 rgba(0,0,0,0.3)",
                      }}
                      key={unit._id}
                    >
                      <div
                        className="preview-project-inner-container"
                        style={{
                          backgroundColor: unit.themeColor,
                          padding: "10px 10px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          {editMode[0] && editMode[1] === singleClass._id ? (
                            <>
                              <input defaultValue={unit.title}></input>
                              <button
                                style={{ fontSize: 14 }}
                                onClick={() => {}}
                              >
                                X
                              </button>
                            </>
                          ) : (
                            <p style={{ margin: 0 }}>{unit.title}</p>
                          )}
                        </div>
                        <div>
                          {unit.projects.map((project) => {
                            return (
                              <div
                                style={{
                                  backgroundColor: "rgba(0,0,0,0.1)",
                                  padding: "5px 10px",
                                  marginTop: 10,
                                }}
                                key={project._id}
                              >
                                <div
                                  style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  {editMode[0] &&
                                  editMode[1] === singleClass._id ? (
                                    <input defaultValue={project.title}></input>
                                  ) : (
                                    <p
                                      className="preview-project"
                                      style={{ margin: 0, fontSize: 18 }}
                                    >
                                      {project.title}
                                    </p>
                                  )}
                                </div>
                                <hr style={{ margin: "5px 0" }}></hr>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                  }}
                                >
                                  {project.criterias.map((criteria, i) => {
                                    return (
                                      <div
                                        key={criteria._id}
                                        className="review-classes-project-inner-container"
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                          }}
                                        >
                                          <p
                                            className="review-class-project-label"
                                            style={{
                                              margin: 0,
                                              fontSize: 13,
                                            }}
                                          >
                                            {criteria.label}
                                          </p>

                                          <p
                                            className="review-class-project-letter"
                                            style={{ margin: 0, fontSize: 13 }}
                                          >
                                            {criteria.letter}
                                          </p>
                                        </div>
                                        <p style={{ margin: 0, fontSize: 13 }}>
                                          {criteria.weight}%
                                        </p>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {editMode[0] && editMode[1] === singleClass._id && (
                  <button
                    onClick={() => {
                      setEditMode([false, 0]);
                    }}
                    style={{ alignSelf: "center", marginTop: 15 }}
                  >
                    Confirm Changes
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
      {showSingleClass && (
        <>
          <button
            style={{ marginBottom: 15 }}
            onClick={() => {
              setShowSingleClass(false);
              setEditMode([false, 0]);
            }}
          >
            Show all other classes
          </button>
          <div
            style={{
              borderRadius: 10,
              border: "2px solid rgba(0,0,0,0.2)",
              boxShadow: "2px 2px 5px 0 rgba(0,0,0,0.3)",
              padding: 20,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {editMode[0] && editMode[1] === editClassClicked._id ? (
                <input defaultValue={editClassClicked.title}></input>
              ) : (
                <h5 style={{ margin: 0 }}>{editClassClicked.title}</h5>
              )}
              {editMode[0] && editMode[1] === editClassClicked._id ? (
                <button
                  onClick={() => handleDeleteClass(editClassClicked._id)}
                  style={{ fontSize: 14 }}
                >
                  Delete Class
                </button>
              ) : (
                <button
                  onClick={() => setEditMode([true, editClassClicked._id])}
                  style={{ fontSize: 14 }}
                >
                  Edit Class
                </button>
              )}
            </div>
            {editClassClicked.units.map((unit, i) => {
              return (
                <div
                  style={{
                    position: "relative",
                    margin: "15px 0",
                    marginBottom:
                      i === editClassClicked.units.length - 1 ? 0 : 15,
                    backgroundColor: "rgba(255,255,255,0.5)",
                    boxShadow: "2px 2px 2px 0 rgba(0,0,0,0.3)",
                  }}
                  key={unit._id}
                >
                  <div
                    className="preview-project-inner-container"
                    style={{
                      backgroundColor: unit.themeColor,
                      padding: "10px 10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      {editMode[0] && editMode[1] === editClassClicked._id ? (
                        <>
                          <input defaultValue={unit.title}></input>
                          <button style={{ fontSize: 14 }} onClick={() => {}}>
                            X
                          </button>
                        </>
                      ) : (
                        <p style={{ margin: 0 }}>{unit.title}</p>
                      )}
                    </div>
                    <div>
                      {unit.projects.map((project) => {
                        return (
                          <div
                            style={{
                              backgroundColor: "rgba(0,0,0,0.1)",
                              padding: "5px 10px",
                              marginTop: 10,
                            }}
                            key={project._id}
                          >
                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              {editMode[0] &&
                              editMode[1] === editClassClicked._id ? (
                                <input defaultValue={project.title}></input>
                              ) : (
                                <p
                                  className="preview-project"
                                  style={{ margin: 0, fontSize: 18 }}
                                >
                                  {project.title}
                                </p>
                              )}
                            </div>
                            <hr style={{ margin: "5px 0" }}></hr>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                              }}
                            >
                              {project.criterias.map((criteria, i) => {
                                return (
                                  <div
                                    key={criteria._id}
                                    className="review-classes-project-inner-container"
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                      }}
                                    >
                                      <p
                                        className="review-class-project-label"
                                        style={{
                                          margin: 0,
                                          fontSize: 13,
                                        }}
                                      >
                                        {criteria.label}
                                      </p>

                                      <p
                                        className="review-class-project-letter"
                                        style={{ margin: 0, fontSize: 13 }}
                                      >
                                        {criteria.letter}
                                      </p>
                                    </div>
                                    <p style={{ margin: 0, fontSize: 13 }}>
                                      {criteria.weight}%
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
            {editMode[0] && editMode[1] === editClassClicked._id && (
              <button
                onClick={() => {
                  setEditMode([false, 0]);
                }}
                style={{ alignSelf: "center", marginTop: 15 }}
              >
                Confirm Changes
              </button>
            )}
          </div>
        </>
      )}
      {viewing === "Students" && (
        <div style={{ display: "flex", gap: 10 }}>
          {fullData.students.map((student, i) => {
            return <p key={i}>{student.name}</p>;
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
