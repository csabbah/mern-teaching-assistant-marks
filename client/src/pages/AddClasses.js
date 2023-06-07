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

  const [fullClass, setFullClass] = useState({ title: "", schoolYear: "" });

  const [unitTitle, setUnitTitle] = useState("");

  let tableProperties = {
    colors: [
      "rgba(255, 255, 0, 0.475)", // Yellow
      "rgba(255, 165, 0, 0.475)", // Orange
      "rgba(210, 181, 25, 0.475)",
      "rgba(280, 214, 225, 0.475)",
      "rgba(255, 105, 180, 0.475)", // Pink
      "rgba(160, 10, 255, 0.475)",
      "rgba(190, 237, 255, 0.475)",
      "rgba(70, 190, 240, 0.475)", // Steel Blue
      "rgba(110, 180, 120, 0.475)",
      "rgba(0, 150, 140, 0.475)", // Teal
    ],
  };

  // Set the initial unitThemeColor to a default 'white' color
  const [unitThemeColor, setUnitThemeColor] = useState(
    tableProperties.colors[0]
  );

  const [units, setUnits] = useState([]);

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
    const updatedProjects = projects.filter((_, i) => i !== projectIndex);
    setProjects(updatedProjects);
  };

  const deleteUnit = (unitId) => {
    const updatedUnits = fullClass.units.filter(
      (unit) => unit.localId !== unitId
    );
    setUnits(updatedUnits);
    setFullClass({ ...fullClass, units: updatedUnits });
  };

  console.log(fullClass);

  const [singleProject, setSingleProject] = useState({
    title: "",
    criterias: [],
  });

  const [projects, setProjects] = useState([]);

  const [displayErr, setDisplayErr] = useState({ reveal: false, msg: "" });

  const [addProject, setAddProject] = useState(false);
  const [addSingleClass, setAddSingleClass] = useState(false);

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
        ...fullClass,
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 20,
            }}
          >
            <div>
              <h5 style={{ textAlign: "center" }}>Class Title</h5>
              <input
                onChange={(e) => {
                  setFullClass({ ...fullClass, title: e.target.value });
                }}
                value={fullClass.title}
                placeholder="Biology"
              ></input>
            </div>
            <div>
              <h5 style={{ textAlign: "center" }}>Year</h5>
              <input
                type="date"
                onChange={(e) => {
                  setFullClass({ ...fullClass, schoolYear: e.target.value });
                }}
              ></input>
            </div>
          </div>
        </section>
        {/* ------------ ----------- ---------- // ? ADDING UNIT TITLE */}
        {fullClass.title && fullClass.schoolYear && (
          <section className="add-unit-title">
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
                    width: "80%",
                  }}
                ></hr>
                <h5 style={{ textAlign: "center" }}>Add grade weight:</h5>
                <div
                  style={{
                    display: "flex",
                    gap: 15,
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <div
                    className="add-grade-weight-inner-container"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <label style={{ margin: 0 }} htmlFor="Label">
                      Label
                    </label>
                    <select
                      id="Label"
                      value={singleCriteria.label}
                      onChange={(e) => {
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
                        return (
                          <option key={criteria} value={criteria}>
                            {criteria}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ margin: 0 }} htmlFor="Weight">
                      Weight
                    </label>
                    <div>
                      <input
                        style={{ width: 60, height: 30 }}
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
                      const localId = Math.floor(Math.random() * 1e9);

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
                          localId: localId,
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
                    width: "80%",
                  }}
                ></hr>
                <h5 style={{ textAlign: "center" }}>
                  Weights for {singleProject.title}:
                </h5>
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
                          key={criteria.localId}
                          className="previewWeightsContainer"
                        >
                          <div style={{ marginRight: 20 }}>
                            <p
                              className="previewGradeLabel"
                              style={{ margin: 0 }}
                            >
                              {criteria.label}
                            </p>
                            <p
                              className="previewGradeWeight"
                              style={{ margin: 0 }}
                            >
                              {criteria.letter}
                            </p>
                          </div>
                          <div>
                            <input
                              style={{ width: 50 }}
                              defaultValue={criteria.weight}
                              onChange={(e) => {
                                const updated = allCriterias.map(
                                  (stateCriteria) => {
                                    if (
                                      stateCriteria.localId === criteria.localId
                                    ) {
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
                              X
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
                        const localId = Math.floor(Math.random() * 1e9);

                        if (allCriterias.length < 1 || !singleProject.title) {
                          setDisplayErr([true, "Missing Project title"]);
                          return;
                        }
                        setSingleProject((prevProject) => ({
                          localId: localId,
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
                      Add {singleProject.title} to {unitTitle}
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
            <h5 style={{ textAlign: "center" }}>Projects for {unitTitle}</h5>
            <span
              style={{
                fontSize: 12,
                marginBottom: 15,
                opacity: 0.5,
                marginTop: -5,
                textAlign: "center",
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
                width: 425,
              }}
            >
              {projects.map((project, i) => {
                return (
                  <div className="projects-container" key={project.localId}>
                    <div
                      style={{
                        padding: "0px 10px",
                        marginTop: 3,
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 15,
                      }}
                    >
                      <input
                        className="projects-container-input"
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
                      <button
                        style={{
                          height: 30,
                          fontSize: 14,
                        }}
                        onClick={() => {
                          deleteProject(i);
                        }}
                      >
                        Del Project
                      </button>
                    </div>
                    <div
                      style={{ padding: "0px 10px" }}
                      className="projects-inner-container"
                    >
                      {project.criterias.map((criteria, i) => {
                        return (
                          <div
                            key={criteria.localId}
                            className="projects-inner-item"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "5px 8px",
                              backgroundColor: "rgba(0,0,0,0.10)",
                            }}
                          >
                            <p
                              className="projects-inner-container-label"
                              style={{
                                margin: 0,
                                fontSize: 14,
                              }}
                            >
                              {criteria.label}
                            </p>
                            <p
                              className="projects-inner-container-letter"
                              style={{
                                margin: 0,
                                fontSize: 14,
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
                                      if (
                                        stateCriteria.localId ===
                                        criteria.localId
                                      ) {
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
                backgroundColor: "rgba(200, 255, 200, 0.8)",
                padding: "10px 13px",
              }}
            >
              <p style={{ marginBottom: 5, textAlign: "center" }}>
                Choose unit theme color
              </p>
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
                  const localId = Math.floor(Math.random() * 1e9);

                  setUnits((prevUnits) => [
                    ...prevUnits,
                    {
                      title: unitTitle,
                      themeColor: unitThemeColor,
                      projects: projects,
                      localId: localId,
                    },
                  ]);
                  setProjects([]);
                  setUnitTitle("");
                  setUnitThemeColor(tableProperties.colors[0]);
                }}
              >
                Add {unitTitle} to {fullClass.title}
              </button>
            )}
          </section>
        )}
        {/* ------------ ----------- ---------- // ? PREVIEW/EDITING UNITS */}
        {fullClass && fullClass.units && fullClass.units.length >= 1 && (
          <section style={{ marginBottom: 100 }} className="preview-units">
            <h5>{fullClass.title}</h5>
            <h5 style={{ fontSize: 15, marginTop: -5, opacity: 0.8 }}>
              {fullClass.schoolYear}
            </h5>
            <span
              style={{
                fontSize: 12,
                marginBottom: 15,
                opacity: 0.5,
                marginTop: -5,
                textAlign: "center",
              }}
            >
              To add more units, enter new unit title above
            </span>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 30,
              }}
            >
              {fullClass.units.length > 0 &&
                fullClass.units.map((singleUnit, i) => {
                  return (
                    <div
                      style={{ position: "relative" }}
                      key={singleUnit.localId}
                    >
                      <div
                        className="preview-project-inner-container"
                        style={{
                          backgroundColor: singleUnit.themeColor,
                          padding: "10px 10px",
                          boxShadow: "3px 3px 1px 0 rgba(0,0,0,0.1)",
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
                          <h5 style={{ margin: 0 }}>{singleUnit.title}</h5>
                          <button
                            onClick={() => {
                              deleteUnit(singleUnit.localId);
                            }}
                          >
                            Del Unit
                          </button>
                        </div>
                        {singleUnit.projects.map((project, i) => {
                          return (
                            <div
                              style={{
                                backgroundColor: "rgba(0,0,0,0.1)",
                                padding: "5px 10px",
                                marginTop: 10,
                              }}
                              key={project.localId}
                            >
                              <div
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <p
                                  className="preview-project"
                                  style={{ margin: 0, fontSize: 18 }}
                                >
                                  {project.title}
                                </p>
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
                                      key={criteria.localId}
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
                                          style={{ margin: 0, fontSize: 13 }}
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
