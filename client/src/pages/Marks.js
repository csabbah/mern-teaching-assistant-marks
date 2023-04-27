import React, { useState, useEffect } from "react";

const Marks = () => {
  // TODO Add the edit function for criterias, projects and units (use contentEditable)
  // TODO Revamp CSS (use bootstrap?)
  // ?------?------?------?------?------?------?------?------?------?------?------?------?------
  // TODO Update Model
  // TODO Add the ability to post to DB
  // TODO Add the ability to edit/delete the data after it's been posted to DB

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

  const [unitThemeColor, setUnitThemeColor] = useState(
    tableProperties.colors[0]
  );
  const [units, setUnits] = useState([]);

  const [studentData, setStudentData] = useState({
    unit: "",
    project: "",
    criteria: "",
    name: "",
    grades: [],
  });

  const [singleCriteria, setSingleCriteria] = useState({
    label: "",
    letter: "",
    percentage: 0,
  });

  const [allCriterias, setAllCriterias] = useState([]);

  const deleteCriteria = (criteriaIndex) => {
    const updatedCriterias = allCriterias.filter((_, i) => i !== criteriaIndex);
    setAllCriterias(updatedCriterias);
  };
  const deleteProject = (projectIndex) => {
    const updateProjects = projects.filter((_, i) => i !== projectIndex);
    setProjects(updateProjects);
  };

  const [singleProject, setSingleProject] = useState({
    title: "",
    criterias: [],
  });

  const [projects, setProjects] = useState([]);

  const [displayErr, setDisplayErr] = useState({ reveal: false, msg: "" });

  const renderStudentData = () => {
    const criteriaLabels = [];

    // iterate over all units
    for (let i = 0; i < units.length; i++) {
      const singleUnit = units[i];

      // iterate over all the projects in the units
      for (let j = 0; j < singleUnit.projects.length; j++) {
        const project = singleUnit.projects[j];

        // iterate over all the criterias in the project
        for (let k = 0; k < project.criterias.length; k++) {
          const criteria = project.criterias[k];

          criteriaLabels.push(
            <td
              className={`${criteria.percentage}-${criteria.label}-${criteria.letter}`}
              style={{
                backgroundColor: singleUnit.themeColor,
                border: tableProperties.border,
                borderLeftWidth: "1px",
                borderLeftColor: "rgba(0,0,0,1)",
                borderRightColor: "rgba(0,0,0,1)",
              }}
              contentEditable
              onInput={(e) => {
                // console.log(studentData)
              }}
              // TODO - Here's how we can extract the data per cell
              // TODO - ALL THE CELLS GENERATED HERE COVER THE GRADES
              onBlur={(e) => {
                console.log(project.title, criteria, e.target.textContent);
              }}
            ></td>
          );
        }
      }
    }

    return criteriaLabels;
  };

  const renderCriteriaLabels = () => {
    const criteriaLabels = [];

    // iterate over all units
    for (let i = 0; i < units.length; i++) {
      const singleUnit = units[i];

      // iterate over all the projects in the units
      for (let j = 0; j < singleUnit.projects.length; j++) {
        const project = singleUnit.projects[j];

        // iterate over all the criterias in the project
        for (let k = 0; k < project.criterias.length; k++) {
          const criteria = project.criterias[k];

          criteriaLabels.push(
            <th
              style={{
                backgroundColor: singleUnit.themeColor,
                border: tableProperties.border,
              }}
            >
              ({criteria.letter})
            </th>
          );
        }
      }
    }

    return criteriaLabels;
  };

  const renderProjects = () => {
    const projects = [];
    for (let i = 0; i < units.length; i++) {
      for (let j = 0; j < units[i].projects.length; j++) {
        const criterias = units[i].projects[j];
        projects.push(
          <th
            colSpan={criterias.criterias.length}
            style={{
              backgroundColor: units[i].themeColor,
              border: tableProperties.border,
            }}
          >
            {criterias.title}
          </th>
        );
      }
    }
    return projects;
  };

  const renderUnits = () => {
    const allUnits = [];

    for (let i = 0; i < units.length; i++) {
      let lengthOfCriterias = 0;
      for (let j = 0; j < units[i].projects.length; j++) {
        lengthOfCriterias += units[i].projects[j].criterias.length;
      }
      allUnits.push(
        <th
          key={units[i].title}
          className="table-unit-title-th"
          colSpan={lengthOfCriterias}
          style={{
            border: tableProperties.border,
          }}
        >
          <p className="table-unit-title">{units[i].title}</p>
        </th>
      );
    }

    return allUnits;
  };

  const renderData = () => {
    return (
      <tr style={{ margin: 0, textAlign: "center" }}>
        <td
          className="firstName"
          onBlur={(e) => {
            // TODO - Here's how we can extract the data per cell
            // TODO - THIS CELL EXTRACTS THE STUDENTS NAME
            setStudentData({
              ...studentData,
              name: e.target.textContent,
            });
            // console.log(e.target.textContent);
            // console.log(e.target.className);
          }}
          style={{
            // backgroundColor: tableProperties.final.failing,
            border: tableProperties.border,
          }}
          contentEditable
        ></td>
        {renderStudentData()}
        {/* // TODO - THIS CALCULATES THE STUDENTS AVERAGE */}
        <td
          style={{
            border: tableProperties.border,
            // backgroundColor: tableProperties.final.failing,
          }}
        >
          30
        </td>
      </tr>
    );
  };
  useEffect(() => {
    if (singleProject.criterias.length > 0) {
      setProjects((prevProjects) => [...prevProjects, singleProject]);
      setSingleProject({ title: "", criterias: [] });
    }
  }, [singleProject]);

  return (
    <div className="container mt-2">
      <form
        style={{ display: "flex", flexDirection: "column", gap: 20 }}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {/* ------------ ----------- ---------- // ? ADDING UNIT TITLE */}
        <section className="add-unit-title">
          <h5>Unit title</h5>
          <input
            onChange={(e) => {
              setUnitTitle(e.target.value);
            }}
            value={unitTitle}
            placeholder="Biology Unit"
          ></input>
        </section>
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
        {singleProject.title && (
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
                  <option value="Knowledge and Understanding">
                    Knowledge and Understanding
                  </option>
                  <option value="Application">Application</option>
                  <option value="Thinking and Inquiry">
                    Thinking and Inquiry
                  </option>
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
                        percentage: parseInt(e.target.value.trim()),
                      });
                    }}
                    placeholder="20"
                    type="number"
                    value={singleCriteria.percentage}
                  ></input>
                  <span style={{ marginLeft: "5px" }}>%</span>
                </div>
              </div>
            </div>
            <button
              style={{ marginTop: 10 }}
              onClick={() => {
                if (
                  !singleCriteria.label.trim() ||
                  !singleCriteria.letter ||
                  !singleCriteria.percentage
                ) {
                  return setDisplayErr({
                    reveal: true,
                    label: `Please fill all fields`,
                  });
                }
                setAllCriterias([...allCriterias, singleCriteria]); // Pushing new criteria to the array
                setSingleCriteria({ label: "", letter: "", percentage: 0 });
              }}
            >
              Add Criteria
            </button>
          </section>
        )}
        {/* ------------ ----------- ---------- // ? PREVIEWING/EDITING CRITERIA'S - ADDING PROJECT TO UNIT */}
        {allCriterias.length >= 1 && (
          <section className="preview-criteria">
            <h5>The criteria's for {singleProject.title}</h5>
            {allCriterias.length > 0 &&
              allCriterias.map((criteria, i) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <p style={{ margin: 0 }}>{criteria.label}</p>
                    <p style={{ margin: 0 }}>({criteria.letter})</p>
                    <p style={{ margin: 0 }}>{criteria.percentage}%</p>
                    <button
                      onClick={() => {
                        deleteCriteria(i);
                      }}
                    >
                      Delete
                    </button>
                    <button>Edit</button>
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
              }}
            >
              Add Project
            </button>
          </section>
        )}
        {/* ------------ ----------- ---------- // ? PREVIEWING/EDITING PROJECTS - ADDING THE UNIT */}
        {projects.length >= 1 && (
          <section className="preview-projects">
            <h5>Preview/Edit/Delete Projects</h5>
            <p>Projects for {unitTitle}:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 25 }}>
              {projects.map((project, i) => {
                return (
                  <div
                    style={{
                      backgroundColor: "rgba(0,0,0,0.10)",
                    }}
                  >
                    <button>Edit</button>
                    <button
                      onClick={() => {
                        deleteProject(i);
                      }}
                    >
                      Delete
                    </button>
                    <div style={{ display: "flex" }}>
                      <p style={{ margin: 0, fontSize: 18 }}>{project.title}</p>
                    </div>
                    {project.criterias.map((criteria, i) => {
                      return (
                        <p style={{ margin: 0, fontSize: 14 }}>
                          {criteria.label}({criteria.letter}){" "}
                          {criteria.percentage}%
                        </p>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <h5 style={{ marginTop: 40 }}>Add Unit</h5>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 20,
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
          </section>
        )}
        {/* ------------ ----------- ---------- // ? PREVIEW/EDITING UNITS */}
        {units.length >= 1 && (
          <section className="preview-units">
            <h5>Your Units</h5>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {units.length > 0 &&
                units.map((unit, i) => {
                  return (
                    <div>
                      <h5>{unit.title}</h5>
                      <h5 style={{ color: unit.themeColor }}>
                        Your theme color
                      </h5>
                      {unit.projects.map((project) => {
                        return (
                          <div>
                            <p style={{ margin: 0, fontSize: 18 }}>
                              {project.title}
                            </p>
                            {project.criterias.map((criteria, i) => {
                              return (
                                <p style={{ margin: 0, fontSize: 14 }}>
                                  Criteria #{i + 1}: {criteria.label}(
                                  {criteria.letter}) {criteria.percentage}%
                                </p>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
            </div>
            <h5 style={{ marginTop: 30 }}>Generate Table</h5>
            <button>Generate Table</button>
          </section>
        )}
        {units.length >= 1 && (
          <table class="table" style={{ border: "1px solid rgba(0,0,0,0.2)" }}>
            <thead>
              <tr>
                <th
                  style={{
                    backgroundColor: "#333",
                    border: tableProperties.border,
                  }}
                ></th>
                {renderUnits()}
                <th
                  style={{
                    backgroundColor: "#333",
                    border: tableProperties.border,
                  }}
                ></th>
              </tr>
              <tr style={{ margin: 0, textAlign: "center" }}>
                <th
                  style={{
                    backgroundColor: "#333",
                    border: tableProperties.border,
                  }}
                ></th>
                {renderProjects()}
                <th
                  style={{
                    backgroundColor: "#333",
                    border: tableProperties.border,
                  }}
                ></th>
              </tr>
              <tr style={{ margin: 0, textAlign: "center" }}>
                <th
                  style={{
                    backgroundColor: "#333",
                    border: tableProperties.border,
                    color: "#FFFFFF",
                    textTransform: "uppercase",
                  }}
                >
                  Students
                </th>
                {renderCriteriaLabels()}
                <th
                  style={{
                    backgroundColor: "#333",
                    border: tableProperties.border,
                    color: "#FFFFFF",
                    textTransform: "uppercase",
                  }}
                >
                  Final
                </th>
              </tr>
            </thead>
            <tbody>{renderData()}</tbody>
          </table>
        )}
        {/* ------------ ----------- ---------- // ? GENERATED TABLE */}
        <div className="main-table">
          <table class="table" style={{ border: "1px solid rgba(0,0,0,0.2)" }}>
            <thead>
              <tr>
                <th
                  style={{
                    backgroundColor: "#333",
                    border: tableProperties.border,
                  }}
                ></th>
                <th
                  className="table-unit-title-th"
                  colSPan="6"
                  style={{
                    border: tableProperties.border,
                  }}
                >
                  <p className="table-unit-title">Biology</p>
                </th>
                <th
                  className="table-unit-title-th"
                  style={{
                    border: tableProperties.border,
                  }}
                >
                  <p className="table-unit-title">Science</p>
                </th>
                <th
                  style={{
                    backgroundColor: "#333",
                    border: tableProperties.border,
                  }}
                ></th>
              </tr>
              <tr>
                <th
                  style={{
                    backgroundColor: "#333",
                    border: tableProperties.border,
                  }}
                ></th>
                <th
                  colsPan="3"
                  style={{
                    backgroundColor: tableProperties.colors[1],
                    border: tableProperties.border,
                  }}
                >
                  Project 1
                </th>
                <th
                  colsPan="2"
                  style={{
                    backgroundColor: tableProperties.colors[1],
                    border: tableProperties.border,
                  }}
                >
                  <p style={{ margin: 0 }}>Theory Paper</p>
                </th>
                <th
                  style={{
                    backgroundColor: tableProperties.colors[1],
                    border: tableProperties.border,
                  }}
                >
                  Project 2
                </th>

                <th
                  style={{
                    border: tableProperties.border,
                    backgroundColor: tableProperties.colors[5],
                  }}
                >
                  Project
                </th>
                <th
                  style={{
                    backgroundColor: "#333",
                    border: tableProperties.border,
                  }}
                ></th>
              </tr>
              <tr style={{ margin: 0, textAlign: "center" }}>
                <th
                  style={{
                    backgroundColor: "#333",
                    border: tableProperties.border,
                    color: "#FFFFFF",
                    textTransform: "uppercase",
                  }}
                >
                  Students
                </th>
                <th
                  style={{
                    backgroundColor: tableProperties.colors[1],
                    border: tableProperties.border,
                  }}
                >
                  K
                </th>
                <th
                  style={{
                    backgroundColor: tableProperties.colors[1],
                    border: tableProperties.border,
                  }}
                >
                  A
                </th>
                <th
                  style={{
                    backgroundColor: tableProperties.colors[1],
                    border: tableProperties.border,
                  }}
                >
                  C
                </th>
                {/* // TODO On the last length, we render this borderLeft block */}
                <th
                  style={{
                    backgroundColor: tableProperties.colors[1],
                    border: tableProperties.border,
                  }}
                >
                  A
                </th>
                <th
                  style={{
                    backgroundColor: tableProperties.colors[1],
                    border: tableProperties.border,
                  }}
                >
                  C
                </th>
                <th
                  style={{
                    backgroundColor: tableProperties.colors[1],
                    border: tableProperties.border,
                  }}
                >
                  C
                </th>
                <th
                  style={{
                    backgroundColor: tableProperties.colors[5],
                    border: tableProperties.border,
                  }}
                >
                  K
                </th>
                <th
                  style={{
                    backgroundColor: "#333",
                    border: tableProperties.border,
                    color: "#FFFFFF",
                    textTransform: "uppercase",
                  }}
                >
                  Final
                </th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ margin: 0, textAlign: "center" }}>
                <td
                  style={{
                    backgroundColor: tableProperties.final.failing,
                    border: tableProperties.border,
                  }}
                >
                  Carlos
                </td>
                <td
                  style={{
                    backgroundColor: tableProperties.colors[1],
                    border: tableProperties.border,
                    borderLeftWidth: "1px",
                    borderRightWidth: "1px",
                    borderRightColor: "rgba(0,0,0,0.10)",
                    borderLeftColor: "rgba(0,0,0,0.10)",
                  }}
                >
                  30%
                </td>
                <td
                  style={{
                    backgroundColor: tableProperties.colors[1],
                    border: tableProperties.border,
                    borderLeftWidth: "1px",
                    borderRightWidth: "1px",
                    borderRightColor: "rgba(0,0,0,0.10)",
                    borderLeftColor: "rgba(0,0,0,0.10)",
                  }}
                >
                  90%
                </td>
                <td
                  style={{
                    backgroundColor: tableProperties.colors[1],
                    border: tableProperties.border,
                    borderLeftWidth: "1px",
                    borderRightWidth: "1px",
                    borderRightColor: "rgba(0,0,0,0.10)",
                    borderLeftColor: "rgba(0,0,0,0.10)",
                  }}
                >
                  50%
                </td>
                <td
                  style={{
                    backgroundColor: tableProperties.colors[1],
                    border: tableProperties.border,
                    borderLeftWidth: "1px",
                    borderRightWidth: "1px",
                    borderRightColor: "rgba(0,0,0,0.10)",
                    borderLeftColor: "rgba(0,0,0,0.10)",
                  }}
                >
                  30%
                </td>
                <td
                  style={{
                    backgroundColor: tableProperties.colors[1],
                    border: tableProperties.border,
                    borderLeftWidth: "1px",
                    borderRightWidth: "1px",
                    borderRightColor: "rgba(0,0,0,0.10)",
                    borderLeftColor: "rgba(0,0,0,0.10)",
                  }}
                >
                  50%
                </td>
                <td
                  style={{
                    backgroundColor: tableProperties.colors[1],
                    border: tableProperties.border,
                    borderLeftWidth: "0",
                    borderRightWidth: "0",
                  }}
                >
                  30%
                </td>
                <td
                  style={{
                    backgroundColor: tableProperties.colors[5],
                    border: tableProperties.border,
                    borderRightWidth: "0",
                  }}
                >
                  90%
                </td>
                {/* // TODO If a student's final mark grade is below 50%, add this class  */}
                <td
                  style={{
                    border: tableProperties.border,
                    backgroundColor: tableProperties.final.failing,
                  }}
                >
                  30%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </form>
    </div>
  );
};

export default Marks;
