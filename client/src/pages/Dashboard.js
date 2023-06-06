import React, { useEffect, useState } from "react";

import { useQuery } from "@apollo/client";
import { GET_DATA } from "../utils/queries";

import Auth from "../utils/auth";

import { useMutation } from "@apollo/client";
import { DELETE_CLASS, DELETE_UNIT } from "../utils/mutations";
import { useLocation } from "react-router-dom";

import { useHistory } from "react-router-dom";
const Dashboard = () => {
  const history = useHistory();

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

  const [unitIds, setUnitIds] = useState([]);
  const [deleteUnit] = useMutation(DELETE_UNIT);

  // TODO THIS IS GOOD THE WAY IT IS
  const handlePreUnitDelete = async (classId, unitId) => {
    try {
      unitIds.push(unitId);

      const updatedClasses = fullData.classes.map((singleClass) => {
        if (singleClass._id === classId) {
          const updatedUnits = singleClass.units.filter(
            (unit) => unit._id !== unitId
          );
          return { ...singleClass, units: updatedUnits };
        }
        return singleClass;
      });

      setFullData({
        ...fullData,
        classes: updatedClasses,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // TODO When adding new student, if you press enter, it should add the user (similar function from the student name block)
  // TODO         Make sure the missing name is still executing if they you try to press enter on a row with an empty name

  // TODO THIS NEEDS TO BE UNIVERSAL BECAUSE, WHEN CONFIRMING, USERS MIGHT ALSO UPDATE CLASS TITLE, PROJECT ETC.
  // TODO Rename to 'handleConfirm', the resolver should be 'updateClass'
  const handleDeleteUnit = async (classId, allUnits, studentIds) => {
    // reset unit ids
    setUnitIds([]);

    const allOtherUnitIds = allUnits.map((unit) => {
      return unit._id;
    });

    try {
      await deleteUnit({
        variables: { classId, unitIds, allUnits: allOtherUnitIds, studentIds },
      });

      // ? Since we are using the filter method...
      const updatedClasses = fullData.classes.filter((singleClass) => {
        if (singleClass._id === classId) {
          // ? If the result returns false, it removes it from the array
          return singleClass.units.length > 0;
        }
        // ? Otherwise, if true, it keeps that class
        return true; // Keep other classes
      });

      setFullData({
        ...fullData,
        classes: updatedClasses,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const [editMode, setEditMode] = useState([false, 0]);

  const [cancelledChanges, setCancelledChanges] = useState(false);
  useEffect(() => {
    refetch();
    setCancelledChanges(false);

    if (data && data.fullData) {
      setFullData(data.fullData);
    }
  }, [data, refetch, cancelledChanges]);

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
      {viewing === "Classes" && (
        <button
          onClick={() => {
            history.push("/add-classes");
          }}
          style={{ marginBottom: 15 }}
        >
          Add class +
        </button>
      )}
      {viewing === "Classes" && !showSingleClass && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "100vw",
            justifyContent: "center",
            gap: 30,
            marginBottom: 100,
          }}
        >
          {fullData.classes.map((singleClass, i) => {
            return (
              <div
                className={`classWrapper ${
                  editMode[0] && editMode[1] === singleClass._id
                    ? "active"
                    : !editMode[0]
                    ? ""
                    : "inactive"
                }`}
                key={i}
                style={{
                  borderRadius: 5,
                  boxShadow: "2px 2px 2px 0 rgba(0,0,0,0.1)",
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
                    marginBottom: "15px",
                  }}
                >
                  {editMode[0] && editMode[1] === singleClass._id ? (
                    <input
                      style={{ width: "100%" }}
                      defaultValue={singleClass.title}
                    ></input>
                  ) : (
                    <h5 style={{ margin: 0 }}>{singleClass.title}</h5>
                  )}
                  {!editMode[0] && (
                    <button
                      onClick={() => setEditMode([true, singleClass._id])}
                      style={{ fontSize: 14 }}
                    >
                      Edit
                    </button>
                  )}
                </div>
                {singleClass.units.map((unit, i) => {
                  return (
                    <div
                      style={{
                        position: "relative",
                        margin: "0",
                        marginBottom:
                          i === singleClass.units.length - 1 ? 0 : 15,
                        backgroundColor: "rgba(255,255,255,0.5)",
                        boxShadow: "2px 2px 2px 0 rgba(0,0,0,0.)",
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
                            justifyContent: "space-between",
                          }}
                        >
                          {editMode[0] && editMode[1] === singleClass._id ? (
                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 10,
                              }}
                            >
                              <input
                                style={{ width: "100%" }}
                                defaultValue={unit.title}
                              ></input>
                              <button
                                style={{ fontSize: 14 }}
                                onClick={() => {
                                  handlePreUnitDelete(
                                    singleClass._id,
                                    unit._id
                                  );
                                }}
                              >
                                X
                              </button>
                            </div>
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
                                    marginTop: 3,
                                    marginBottom: 9,
                                  }}
                                >
                                  {editMode[0] &&
                                  editMode[1] === singleClass._id ? (
                                    <div
                                      style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: 10,
                                      }}
                                    >
                                      <input
                                        style={{ width: "100%" }}
                                        defaultValue={project.title}
                                      ></input>
                                      <button
                                        style={{ fontSize: 14 }}
                                        onClick={() => {}}
                                      >
                                        X
                                      </button>
                                    </div>
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: 15,
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <button
                      onClick={() => {
                        handleDeleteUnit(
                          singleClass._id,
                          singleClass.units,
                          singleClass.studentIds
                        );
                        setEditMode([false, 0]);
                      }}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => {
                        setCancelledChanges(true);
                        setEditMode([false, 0]);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="redVariant"
                      onClick={() => {
                        handleDeleteClass(singleClass._id);
                        setEditMode([false, 0]);
                      }}
                    >
                      Delete Class
                    </button>
                  </div>
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
            className={`classWrapper ${
              editMode[0] && editMode[1] === editClassClicked._id
                ? "active"
                : !editMode[0]
                ? ""
                : "inactive"
            }`}
            style={{
              borderRadius: 5,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              boxShadow: "2px 2px 2px 0 rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "15px",
              }}
            >
              {editMode[0] && editMode[1] === editClassClicked._id ? (
                <input
                  style={{ width: "100%" }}
                  defaultValue={editClassClicked.title}
                ></input>
              ) : (
                <h5 style={{ margin: 0 }}>{editClassClicked.title}</h5>
              )}
              {!editMode[0] && (
                <button
                  onClick={() => setEditMode([true, editClassClicked._id])}
                  style={{ fontSize: 14 }}
                >
                  Edit
                </button>
              )}
            </div>
            {editClassClicked.units.map((unit, i) => {
              return (
                <div
                  style={{
                    position: "relative",
                    margin: "0",
                    marginBottom:
                      i === editClassClicked.units.length - 1 ? 0 : 15,
                    backgroundColor: "rgba(255,255,255,0.5)",
                  }}
                  key={unit._id}
                >
                  <div
                    className="preview-project-inner-container"
                    style={{
                      width:
                        editMode[0] && editMode[1] === editClassClicked._id
                          ? "100%"
                          : "",
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
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 10,
                          }}
                        >
                          <input
                            style={{ width: "100%" }}
                            defaultValue={unit.title}
                          ></input>
                          <button
                            style={{ fontSize: 14 }}
                            onClick={() => {
                              handlePreUnitDelete(
                                editClassClicked._id,
                                unit._id
                              );
                            }}
                          >
                            X
                          </button>
                        </div>
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
                                marginTop: 3,
                                marginBottom: 9,
                              }}
                            >
                              {editMode[0] &&
                              editMode[1] === editClassClicked._id ? (
                                <div
                                  style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: 10,
                                  }}
                                >
                                  <input
                                    style={{ width: "100%" }}
                                    defaultValue={project.title}
                                  ></input>
                                  <button
                                    style={{ fontSize: 14 }}
                                    onClick={() => {}}
                                  >
                                    X
                                  </button>
                                </div>
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: 15,
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <button
                  onClick={() => {
                    handleDeleteUnit(editClassClicked._id);
                    setEditMode([false, 0]);
                  }}
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    setCancelledChanges(true);
                    setEditMode([false, 0]);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="redVariant"
                  onClick={() => handleDeleteClass(editClassClicked._id)}
                >
                  Delete Class
                </button>
              </div>
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
