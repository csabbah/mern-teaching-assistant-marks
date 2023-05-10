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

  const [classes, setClasses] = useState([]);
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

  const [viewingTable, setViewingTable] = useState(0);

  const [decimal, setDecimal] = useState(false);
  const [missingData, setMissingData] = useState({});

  const [allStudents, setAllStudents] = useState([]);

  function calculateAverage(grades, singleClass) {
    let KU = [];
    let A = [];
    let TI = [];
    let C = [];

    grades.map((grade) => {
      // Only push grades that are in specific classes
      if (grade.letter == "K/U" && grade.classId === singleClass.id) {
        KU.push({
          weight: grade.weight / 100,
          mark: parseInt(grade.mark) * (grade.weight / 100),
        });
      }
      if (grade.letter == "T/I" && grade.classId === singleClass.id) {
        TI.push({
          weight: grade.weight / 100,
          mark: parseInt(grade.mark) * (grade.weight / 100),
        });
      }
      if (grade.letter == "A" && grade.classId === singleClass.id) {
        A.push({
          weight: grade.weight / 100,
          mark: parseInt(grade.mark) * (grade.weight / 100),
        });
      }
      if (grade.letter == "C" && grade.classId === singleClass.id) {
        C.push({
          weight: grade.weight / 100,
          mark: parseInt(grade.mark) * (grade.weight / 100),
        });
      }
    });

    let sumOfKU = KU.reduce((total, grade) => total + grade.mark, 0);
    let sumOfA = A.reduce((total, grade) => total + grade.mark, 0);
    let sumOfTI = TI.reduce((total, grade) => total + grade.mark, 0);
    let sumOfC = C.reduce((total, grade) => total + grade.mark, 0);

    const average =
      (sumOfKU ? sumOfKU : 0) +
      (sumOfA ? sumOfA : 0) +
      (sumOfTI ? sumOfTI : 0) +
      (sumOfC ? sumOfC : 0);

    return average.toFixed(decimal ? 2 : 0);
  }

  const [addProject, setAddProject] = useState(false);
  const [addSingleClass, setAddSingleClass] = useState(false);

  // Add project to projects and reset singleProject data
  useEffect(() => {
    if (singleProject.criterias.length > 0 && addProject) {
      setProjects((prevProjects) => [...prevProjects, singleProject]);
      setSingleProject({ title: "", criterias: [] });
      setAddProject(false);
    }
    if (units.length > 0 && addSingleClass) {
      const uniqueId = Math.floor(Math.random() * 9e9) + 1e9;
      let singleClass = {
        title: classTitle,
        units,
        schoolYear,
        userId,
      };
      console.log(singleClass);
      handleAddClass(singleClass);

      setClasses([...classes, singleClass]);

      setClassTitle("");
      setUnits([]);
      setAddSingleClass(false);
    }
  }, [singleProject, units]);

  return (
    <div className="container mt-2">
      <form
        style={{ display: "flex", flexDirection: "column", gap: 20 }}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {/* ------------ ----------- ---------- // ? ADDING UNIT TITLE */}{" "}
        <section className="add-class-title">
          <h5>Class title</h5>
          <input
            onChange={(e) => {
              setClassTitle(e.target.value);
            }}
            value={classTitle}
            placeholder="Biology"
          ></input>
          <h5>School Year</h5>
          <input
            type="date"
            onChange={(e) => {
              setSchoolYear(e.target.value);
            }}
          ></input>
        </section>
        {/* ------------ ----------- ---------- // ? ADDING UNIT TITLE */}{" "}
        {classTitle && schoolYear && (
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
        {/* ------------ ----------- ---------- // ? ADDING PROJECT TITLE */}
        {unitTitle && (
          <section className="add-project-title">
            <h5>Project title</h5>
            <input
              value={singleProject.title}
              onChange={(e) => {
                setSingleProject({ ...singleProject, title: e.target.value });
              }}
              placeholder="Biology Test 1"
            ></input>
          </section>
        )}
        {/* ------------ ----------- ---------- // ? ADDING CRITERIA'S */}
        {/* // TODO RENAME ALL CRITERIA'S TO 'weight' */}
        {unitTitle && singleProject.title && (
          <section className="add-criteria">
            <h5>Add the criteria's for {singleProject.title}</h5>
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
                  <option value="">Select criteria</option>
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
            <button
              style={{ marginTop: 10 }}
              onClick={() => {
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
                setAllCriterias([...allCriterias, singleCriteria]); // Pushing new criteria to the array
                setSingleCriteria({ label: "", letter: "", weight: 0 });
              }}
            >
              Add Criteria
            </button>
          </section>
        )}
        {/* ------------ ----------- ---------- // ? PREVIEWING/EDITING CRITERIA'S - ADDING PROJECT TO UNIT */}
        {unitTitle && singleProject.title && allCriterias.length >= 1 && (
          <section className="preview-criteria">
            <h5>The criteria's for {singleProject.title}</h5>
            {allCriterias.length > 0 &&
              allCriterias.map((criteria, i) => {
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <p style={{ margin: 0 }}>{criteria.label}</p>
                    <p style={{ margin: 0 }}>({criteria.letter})</p>
                    <input
                      style={{ width: 50 }}
                      defaultValue={criteria.weight}
                      onChange={(e) => {
                        const updated = allCriterias.map((stateCriteria) => {
                          if (stateCriteria.id === criteria.id) {
                            return {
                              ...stateCriteria,
                              weight: parseInt(e.target.value),
                            };
                          }
                          return stateCriteria;
                        });
                        setAllCriterias(updated);
                      }}
                    ></input>
                    %
                    <button
                      onClick={() => {
                        deleteCriteria(i, criteria.label);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            <h5 style={{ marginTop: 30 }}>
              Add {singleProject.title} to {unitTitle}
            </h5>
            <button
              onClick={() => {
                if (allCriterias.length < 1 || !singleProject.title) {
                  // TODO UPDATE DISPLAY ERR HERE
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
              Add Project
            </button>
          </section>
        )}
        {/* ------------ ----------- ---------- // ? PREVIEWING/EDITING PROJECTS - ADDING THE UNIT */}
        {unitTitle && projects.length >= 1 && (
          <section className="preview-projects">
            <h5>Preview/Edit/Delete Projects</h5>
            <p>Projects for {unitTitle}:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 25 }}>
              {projects.map((project, i) => {
                return (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "rgba(0,0,0,0.10)",
                    }}
                  >
                    <button
                      onClick={() => {
                        deleteProject(i);
                      }}
                    >
                      Delete
                    </button>
                    <div style={{ display: "flex" }}>
                      <p>Project Title:</p>
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
                    <p style={{ margin: 0 }}>Criterias:</p>
                    {project.criterias.map((criteria, i) => {
                      return (
                        <>
                          <p key={i} style={{ margin: 0, fontSize: 14 }}>
                            {criteria.label}({criteria.letter})
                          </p>
                          <input
                            style={{ width: 50 }}
                            defaultValue={criteria.weight}
                            onChange={(e) => {
                              const updated = project.criterias.map(
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

                              project.criterias = updated;
                            }}
                          ></input>
                          %
                        </>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <p style={{ marginBottom: 5, marginTop: 25 }}>
                Choose your theme color
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
                setAddSingleClass(true);
                setProjects([]);
                setUnitTitle("");
                setUnitThemeColor(tableProperties.colors[0]);
              }}
            >
              Add Class
            </button>
          </section>
        )}
        {/* ------------ ----------- ---------- // ? PREVIEW/EDITING UNITS */}
        {classes.length >= 1 && (
          <section className="preview-units">
            <h5>Your Classes</h5>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {classes.length > 0 &&
                classes.map((singleClass, i) => {
                  return singleClass.units.map((unit, i) => {
                    return (
                      <div key={i}>
                        <div>
                          <h5>{singleClass.title}</h5>
                          School year: <h5>{singleClass.schoolYear}</h5>
                          <h5 style={{ color: unit.themeColor }}>
                            Your theme color
                          </h5>
                        </div>
                        {unit.projects.map((project, i) => {
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
                                    Criteria #{i + 1}: {criteria.label}(
                                    {criteria.letter}) {criteria.weight}%
                                  </p>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    );
                  });
                })}
            </div>
          </section>
        )}
      </form>
    </div>
  );
};

export default Marks;
