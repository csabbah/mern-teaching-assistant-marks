import React, { useState, useEffect, useRef } from "react";

import { useMutation } from "@apollo/client";
import { ADD_CLASS } from "../utils/mutations";

import { useHistory } from "react-router-dom";

import Auth from "../utils/auth";

// TODO IMPORTANT - MAKE THIS ENTIRE PAGE A MODAL
// TODO THAT WAY WHEN YOU HIT ADD CLASS IN YOUR CLASSES IT'S A SMOOTHER EXPERIENCE)
const Marks = () => {
  const history = useHistory();

  // ----------------------------- AUTH / QUERY USER - Extract Logged in User's ID
  let userData = Auth.getProfile();
  const [userId, setUserId] = useState(userData.data._id);

  const [addClass] = useMutation(ADD_CLASS);

  const handleAddClass = async (singleClass) => {
    try {
      await addClass({
        variables: { classToSave: singleClass },
      });
      history.push("/your-classes");
    } catch (e) {
      console.log(e);
    }
  };

  // TODO Create the function to allow users to send progress reports emails to students

  // TODO Instead of rendering using multiple single useState variables, make it one object completely

  // TODO - IMPORTANT - Instead of rendering multiple nested for loops across multiple functions...
  // TODO Take the one with ALL the data and simply render the rows in each nested loop

  // TODO Add the edit function for units
  // TODO You should be able to add a new project to a unit after the unit has been added

  // Update these to be one object containing all the information in one
  const [classTitle, setClassTitle] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [unitTitle, setUnitTitle] = useState("");

  let tableProperties = {
    border: "1px solid #333",
    final: {
      top: "rgba(255, 255, 0, 0.3)",
      passing: "rgba(255, 255, 255, 0.3)",
      failing: "rgba(255, 0, 0, 0.3)",
    },
    brightnessRange: "100",
    colors: [
      "rgba(280,280,280,0.5)", // white
      "rgba(190,237,255,0.5)", // Light Blue
      "rgba(280,214,225,0.5)", // Light Pink
      "rgba(280,237,25,0.5)", // Gold
      "rgba(280,181,25,0.5)", // Orange
      "rgba(159,262,159,0.5)", // Light Green
    ],
  };

  // Set the initial unitThemeColor to a default 'white' color
  const [unitThemeColor, setUnitThemeColor] = useState(
    tableProperties.colors[0]
  );

  const [units, setUnits] = useState([]);

  const [studentData, setStudentData] = useState({});

  const [singleCriteria, setSingleCriteria] = useState({
    label: "",
    letter: "",
    weight: 0,
  });

  const [criteriaOptions, setCriteriaOptions] = useState([
    "Knowledge and Understanding",
    "Communication",
    "Application",
    "Thinking and Inquiry",
  ]);

  const deleteCriteria = (criteriaIndex, criteriaLabel) => {
    const updatedCriterias = allCriterias.filter((_, i) => i !== criteriaIndex);
    setAllCriterias(updatedCriterias);
    setCriteriaOptions([...criteriaOptions, criteriaLabel]);
  };

  const [allCriterias, setAllCriterias] = useState([]);

  const deleteProject = (projectIndex) => {
    const updateProjects = projects.filter((_, i) => i !== projectIndex);
    setProjects(updateProjects);
  };

  const inputRef = useRef(null);

  const [singleProject, setSingleProject] = useState({
    title: "",
    criterias: [],
  });

  const [projects, setProjects] = useState([]);

  const [displayErr, setDisplayErr] = useState({ reveal: false, msg: "" });

  const [addProject, setAddProject] = useState(false);
  const [addSingleClass, setAddSingleClass] = useState(false);

  const [fullClass, setFullClass] = useState({});

  const [revealUnitBtn, setRevealUnitBtn] = useState(false);

  useEffect(() => {
    const hasEmptyTitle = projects.some((project) => project.title === "");

    const allProjectsHaveValidCriterias = projects.every((project) =>
      project.criterias.every(
        (criteria) =>
          criteria.weight > 0 &&
          !isNaN(criteria.weight) &&
          criteria.label !== ""
      )
    );
    console.log(projects);

    setRevealUnitBtn(!hasEmptyTitle && allProjectsHaveValidCriterias);
  }, [projects]);
  useEffect(() => {
    document.title = "Hershy - Add class";
  }, []);

  // Add project to projects and reset singleProject data
  useEffect(() => {
    if (singleProject.criterias.length > 0 && addProject) {
      setProjects((prevProjects) => [...prevProjects, singleProject]);
      setSingleProject({ title: "", criterias: [] });
      setAddProject(false);
    }
    if (addSingleClass) {
      // Push table to DB
      handleAddClass(fullClass);
    }
    if (units.length > 0) {
      setFullClass({
        title: classTitle,
        schoolYear,
        userId,
        units,
      });
    }
  }, [singleProject, units, addSingleClass]);

  // TODO Add htmlFor functionality
  return (
    <div style={{ marginTop: 75, marginRight: 20, marginLeft: 20, padding: 0 }}>
      <form
        style={{ display: "flex", flexDirection: "column", gap: 20 }}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {/* ------------ ----------- ---------- // ? ADDING CLASS AND SCHOOL YEAH */}{" "}
        <section className="add-class-title">
          <h5
            style={{
              position: "absolute",
              fontSize: 70,
              opacity: 0.07,
              zIndex: 0,
              left: -2,
              top: -17,
            }}
          >
            CLASS
          </h5>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div>
              <h5 style={{ textAlign: "center" }}>Class Title</h5>
              <input
                onChange={(e) => {
                  setClassTitle(e.target.value);
                }}
                value={classTitle}
                placeholder="Biology"
              ></input>
            </div>
            <div>
              <h5 style={{ textAlign: "center" }}>Year</h5>
              <input
                type="date"
                onChange={(e) => {
                  setSchoolYear(e.target.value);
                }}
              ></input>
            </div>
          </div>
        </section>
        {/* ------------ ----------- ---------- // ? ADDING UNIT TITLE */}
        {classTitle && schoolYear && (
          <section className="add-unit-title">
            <h5
              style={{
                position: "absolute",
                fontSize: 70,
                opacity: 0.07,
                zIndex: 0,
                left: -4,
                top: -17,
              }}
            >
              UNIT TITLE
            </h5>
            <h5>Unit title</h5>
            <input
              onChange={(e) => {
                setUnitTitle(e.target.value);
              }}
              value={unitTitle}
              placeholder="Organisms"
            ></input>
          </section>
        )}
        {/* ------------ ----------- ---------- // ? ADDING PROJECTS */}
        {unitTitle && (
          <section
            className="edit-project"
            style={{
              marginBottom:
                projects.length >= 1 ||
                (fullClass.units && fullClass.units.length >= 1)
                  ? 0
                  : 100,
            }}
          >
            <h5
              style={{
                position: "absolute",
                fontSize: 70,
                opacity: 0.07,
                zIndex: 0,
                left: 0,
                top: -17,
              }}
            >
              ADD PROJECT
            </h5>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h5>Project title</h5>
              <input
                value={singleProject.title}
                onChange={(e) => {
                  setDisplayErr([false, ""]);
                  setSingleProject({ ...singleProject, title: e.target.value });
                }}
                placeholder="Biology Test 1"
              ></input>
            </div>
            {singleProject.title && (
              <>
                <hr
                  style={{
                    margin: "25px 0",
                    width: "50%",
                  }}
                ></hr>
                <h5>Add grade weight:</h5>
                <div style={{ display: "flex", gap: 15, alignItems: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ margin: 0 }} htmlFor="Label">
                      Label
                    </label>
                    <select
                      id="Label"
                      value={singleCriteria.label}
                      onChange={(e) => {
                        const uniqueId = Math.floor(Math.random() * 9e9) + 1e9;
                        setSingleCriteria({
                          ...singleCriteria,
                          label: e.target.value,
                          letter:
                            e.target.value == "Knowledge and Understanding"
                              ? "K/U"
                              : e.target.value == "Thinking and Inquiry"
                              ? "T/I"
                              : e.target.value[0],
                        });
                      }}
                      style={{ height: 30 }}
                    >
                      <option value="">Select weight</option>
                      {criteriaOptions.map((criteria) => {
                        return <option value={criteria}>{criteria}</option>;
                      })}
                    </select>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ margin: 0 }} htmlFor="Weight">
                      Weight
                    </label>
                    <div>
                      <input
                        style={{ width: 50, height: 30 }}
                        id="Weight"
                        onChange={(e) => {
                          setSingleCriteria({
                            ...singleCriteria,
                            weight: parseInt(e.target.value.trim()),
                          });
                        }}
                        placeholder="20"
                        type="number"
                        value={singleCriteria.weight}
                      ></input>
                      <span style={{ marginLeft: "5px" }}>%</span>
                    </div>
                  </div>
                </div>
                {singleCriteria.weight > 0 && singleCriteria.label && (
                  <button
                    style={{ marginTop: 20 }}
                    onClick={() => {
                      const uniqueId = Math.floor(Math.random() * 9e9) + 1e9;

                      if (
                        !singleCriteria.label ||
                        !singleCriteria.letter ||
                        !singleCriteria.weight
                      ) {
                        return setDisplayErr({
                          reveal: true,
                          label: `Please fill all fields`,
                        });
                      }
                      setCriteriaOptions(
                        criteriaOptions.filter(
                          (criteria) => criteria !== singleCriteria.label
                        )
                      );
                      setAllCriterias([
                        ...allCriterias,
                        {
                          id: uniqueId,
                          label: singleCriteria.label,
                          letter: singleCriteria.letter,
                          weight: singleCriteria.weight,
                        },
                      ]); // Pushing new criteria to the array
                      setSingleCriteria({ label: "", letter: "", weight: 0 });
                    }}
                  >
                    Add Weight
                  </button>
                )}
              </>
            )}
            {criteriaOptions.length !== 4 && singleProject.title && (
              <>
                <hr
                  style={{
                    margin: "25px 0",
                    width: "50%",
                  }}
                ></hr>
                <h5>Grade weights for {singleProject.title}</h5>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {allCriterias.length > 0 &&
                    allCriterias.map((criteria, i) => {
                      return (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            margin: "5px 0",
                            backgroundColor: "rgba(0,0,0,0.1)",
                            padding: "5px 10px",
                            width: 450,
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{ marginRight: 20 }}>
                            <p style={{ margin: 0 }}>{criteria.label}</p>
                          </div>
                          <div>
                            <input
                              style={{ width: 50 }}
                              defaultValue={criteria.weight}
                              onChange={(e) => {
                                const updated = allCriterias.map(
                                  (stateCriteria) => {
                                    if (stateCriteria.id === criteria.id) {
                                      return {
                                        ...stateCriteria,
                                        weight: parseInt(e.target.value),
                                      };
                                    }
                                    return stateCriteria;
                                  }
                                );
                                setAllCriterias(updated);
                              }}
                            ></input>
                            <span style={{ marginLeft: 5 }}>%</span>
                            <button
                              style={{
                                marginLeft: 20,
                                padding: "6px 12px",
                              }}
                              onClick={() => {
                                deleteCriteria(i, criteria.label);
                              }}
                            >
                              <img
                                style={{
                                  width: 12,
                                  height: 12,
                                  filter: "invert(100%)",
                                  objectFit: "contain",
                                }}
                                src="/close.png"
                                alt="close button"
                              ></img>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
                {!allCriterias.some((criteria) => criteria.weight <= 0) &&
                  !allCriterias.some((criteria) => isNaN(criteria.weight)) && (
                    <button
                      style={{ marginTop: 20 }}
                      onClick={() => {
                        if (allCriterias.length < 1 || !singleProject.title) {
                          setDisplayErr([true, "Missing Project title"]);
                          return;
                        }
                        setSingleProject((prevProject) => ({
                          ...prevProject,
                          criterias: allCriterias,
                        }));
                        setAllCriterias([]);
                        setAddProject(true);
                        setCriteriaOptions([
                          "Knowledge and Understanding",
                          "Communication",
                          "Application",
                          "Thinking and Inquiry",
                        ]);
                      }}
                    >
                      Add project to {unitTitle}
                    </button>
                  )}
              </>
            )}

            {displayErr[0] && (
              <p style={{ margin: 0, marginTop: 10 }}>{displayErr[1]}</p>
            )}
          </section>
        )}
        {/* ------------ ----------- ---------- // ? PREVIEWING/EDITING PROJECTS - ADDING THE UNIT */}
        {unitTitle && projects.length >= 1 && (
          <section
            className="preview-projects"
            style={{
              marginBottom:
                fullClass.units && fullClass.units.length >= 1 ? 0 : 100,
            }}
          >
            <h5
              style={{
                position: "absolute",
                fontSize: 70,
                opacity: 0.07,
                zIndex: 0,
                left: -4,
                top: -17,
              }}
            >
              REVIEW UNIT
            </h5>
            <h5>Projects for {unitTitle}</h5>
            <span
              style={{
                fontSize: 12,
                marginBottom: 15,
                opacity: 0.5,
                marginTop: -5,
              }}
            >
              To add more projects, enter new project title above
            </span>
            <div
              style={{
                display: "flex",
                gap: 25,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {projects.map((project, i) => {
                return (
                  <div
                    key={i}
                    style={{
                      position: "relative",
                      backgroundColor: "rgba(0,0,0,0.10)",
                      padding: "10px 0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "0 16px",
                        marginBottom: 15,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 15,
                        }}
                        onClick={() => {
                          deleteProject(i);
                        }}
                      >
                        Project #{i + 1}
                      </div>
                      <button
                        style={{
                          fontSize: 12,
                        }}
                        onClick={() => {
                          deleteProject(i);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <input
                        defaultValue={project.title}
                        onChange={(e) => {
                          const updatedProject = {
                            ...project,
                            title: e.target.value.trim(),
                          };
                          const updatedProjects = [...projects];
                          updatedProjects[i] = updatedProject;
                          setProjects(updatedProjects);
                        }}
                      ></input>
                    </div>
                    <div
                      style={{
                        marginTop: 15,
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        width: 250,
                        gap: 15,
                      }}
                    >
                      {project.criterias.map((criteria, i) => {
                        return (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              width: 100,
                            }}
                          >
                            <p
                              key={i}
                              style={{
                                margin: 0,
                                fontSize: 16,
                              }}
                            >
                              {criteria.letter}
                            </p>
                            <div>
                              <input
                                style={{
                                  width: 50,
                                  textAlign: "center",
                                }}
                                defaultValue={criteria.weight}
                                onChange={(e) => {
                                  const updatedCriterias =
                                    project.criterias.map((stateCriteria) => {
                                      if (stateCriteria.id === criteria.id) {
                                        return {
                                          ...stateCriteria,
                                          weight: parseInt(e.target.value),
                                        };
                                      }
                                      return stateCriteria;
                                    });

                                  const updatedProject = {
                                    ...project,
                                    criterias: updatedCriterias,
                                  };

                                  const updatedProjects = projects.map((p) =>
                                    p === project ? updatedProject : p
                                  );

                                  setProjects(updatedProjects);
                                }}
                              ></input>
                              <span style={{ marginLeft: 3 }}>%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <hr
              style={{
                margin: "25px 0",
                width: "50%",
              }}
            ></hr>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 20,
                backgroundColor: "rgba(200, 255, 200, 0.75)",
                padding: "10px 20px",
              }}
            >
              <p style={{ marginBottom: 5 }}>Choose unit theme color</p>
              <div className="color-btns-wrapper">
                {tableProperties.colors.map((color, i) => {
                  return (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setUnitThemeColor(color);
                      }}
                      key={i}
                      style={{ backgroundColor: color }}
                      className={`${color} ${
                        unitThemeColor == color ? "active" : ""
                      }`}
                    ></button>
                  );
                })}
              </div>
            </div>
            {revealUnitBtn && (
              <button
                onClick={() => {
                  if (projects.length < 1 || !unitTitle) {
                    // TODO UPDATE DISPLAY ERR HERE
                    return;
                  }

                  setUnits((prevUnits) => [
                    ...prevUnits,
                    {
                      title: unitTitle,
                      themeColor: unitThemeColor,
                      projects: projects,
                    },
                  ]);
                  setProjects([]);
                  setUnitTitle("");
                  setUnitThemeColor(tableProperties.colors[0]);
                }}
              >
                Add Unit
              </button>
            )}
          </section>
        )}
        {/* ------------ ----------- ---------- // ? PREVIEW/EDITING UNITS */}
        {fullClass && fullClass.units && fullClass.units.length >= 1 && (
          <section className="preview-units">
            <h5
              style={{
                position: "absolute",
                fontSize: 70,
                opacity: 0.07,
                zIndex: 0,
                left: -4,
                top: -17,
              }}
            >
              REVIEW CLASS
            </h5>
            <h2>{fullClass.title}</h2>
            <h5>{fullClass.schoolYear}</h5>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {fullClass.units.length > 0 &&
                fullClass.units.map((singleUnit, i) => {
                  return (
                    <div key={i}>
                      <div style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
                        <h5>{singleUnit.title}</h5>
                        {singleUnit.projects.map((project, i) => {
                          return (
                            <div key={i}>
                              <p style={{ margin: 0, fontSize: 18 }}>
                                {project.title}
                              </p>
                              {project.criterias.map((criteria, i) => {
                                return (
                                  <p
                                    key={i}
                                    style={{ margin: 0, fontSize: 14 }}
                                  >
                                    Weights #{i + 1}: {criteria.label}(
                                    {criteria.letter}) {criteria.weight}%
                                  </p>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
            <button
              style={{ marginTop: 20 }}
              onClick={() => {
                setAddSingleClass(true);
              }}
            >
              Create Class
            </button>
          </section>
        )}
      </form>
    </div>
  );
};

export default Marks;
