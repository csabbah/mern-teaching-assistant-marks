import React, { useState, useEffect } from "react";

const Marks = () => {
  // TODO Add the edit function for criterias, projects and units (use contentEditable)
  // ?------?------?------?------?------?------?------?------?------?------?------?------?------
  // TODO Update Model (Need a Table and Student Model)
  // TODO Table model has all the data required to build the data - including units, projects and their criteria
  // TODO User model has the students name and grades
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
    id: 0,
    name: "",
    grades: [],
    finalMark: 0,
  });

  const [singleCriteria, setSingleCriteria] = useState({
    label: "",
    letter: "",
    weight: 0,
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

  const renderUnitRow = () => {
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

  const renderProjectRow = () => {
    const projects = [];
    for (let i = 0; i < units.length; i++) {
      for (let j = 0; j < units[i].projects.length; j++) {
        const criterias = units[i].projects[j];
        projects.push(
          <th
            key={j}
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

  const renderCriteriaLabelRow = () => {
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
              key={k}
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

  const [studentRows, setStudentRows] = useState([]);

  // TODO When rendering the row, that represents a single student
  // TODO Save each student to the studentRows array (for future render, it should be ok to render in chronological order)
  // ? THE FULL SINGLE DATA ROW
  const renderSingleDataRow = () => {
    const rowData = [];
    const uniqueId = Math.floor(Math.random() * 9e9) + 1e9;

    // ? Render this first (this is the student name column)
    rowData.push(
      <td
        key={"name"}
        className="firstName"
        onBlur={(e) => {
          setStudentData({
            ...studentData,
            id: uniqueId,
            name: e.target.textContent,
          });
        }}
        style={{
          fontSize: 15,
          // backgroundColor: tableProperties.final.failing,
          border: tableProperties.border,
          width: "25%",
        }}
        contentEditable
      ></td>
    );

    // ? Render this in between (these are all the grade columns)
    for (let i = 0; i < units.length; i++) {
      const singleUnit = units[i];

      // iterate over all the projects in the units
      for (let j = 0; j < singleUnit.projects.length; j++) {
        const project = singleUnit.projects[j];

        // iterate over all the criterias in the project
        for (let k = 0; k < project.criterias.length; k++) {
          const criteria = project.criterias[k];
          rowData.push(
            <td
              key={k}
              className={`${criteria.weight}-${criteria.label}-${criteria.letter}-${singleUnit.title}-${project.title}`}
              style={{
                backgroundColor: singleUnit.themeColor,
                border: tableProperties.border,
                borderLeftWidth: "1px",
                borderLeftColor: "rgba(0,0,0,1)",
                borderRightColor: "rgba(0,0,0,1)",
              }}
              onBlur={(e) => {
                const gradeExists =
                  studentData.grades.length > 0
                    ? studentData.grades.some((grade) => {
                        return (
                          grade.unit === singleUnit.title &&
                          grade.project === project.title &&
                          grade.criteria === criteria.label
                        );
                      })
                    : false;

                if (gradeExists) {
                  // Update the mark
                  const updatedGrades = studentData.grades.map((grade) => {
                    if (
                      grade.unit === singleUnit.title &&
                      grade.project === project.title &&
                      grade.criteria === criteria.label
                    ) {
                      return {
                        ...grade,
                        mark: e.target.textContent,
                      };
                    }
                    return grade;
                  });
                  setStudentData({
                    ...studentData,
                    grades: updatedGrades,
                  });
                } else {
                  // Add the grade
                  setStudentData({
                    ...studentData,
                    grades: [
                      ...studentData.grades,
                      {
                        unit: singleUnit.title,
                        project: project.title,
                        criteria: criteria.label,
                        weight: criteria.weight,
                        letter: criteria.letter,
                        mark: e.target.textContent,
                      },
                    ],
                  });
                }
              }}
              contentEditable
            ></td>
          );
        }
      }
    }

    // TODO Quadruple check that the math adds up accurately
    // TODO Refactor this code
    function calculateAverage() {
      const { grades } = studentData;

      let KU = [];
      let A = [];
      let TI = [];
      let C = [];

      grades.map((grade) => {
        if (grade.letter == "K/U") {
          KU.push({
            weight: grade.weight / 100,
            mark: parseInt(grade.mark) * (grade.weight / 100),
          });
        }
        if (grade.letter == "T/I") {
          TI.push({
            weight: grade.weight / 100,
            mark: parseInt(grade.mark) * (grade.weight / 100),
          });
        }
        if (grade.letter == "A") {
          A.push({
            weight: grade.weight / 100,
            mark: parseInt(grade.mark) * (grade.weight / 100),
          });
        }
        if (grade.letter == "C") {
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
        (sumOfC ? sumOfC : 0) +
        (sumOfTI ? sumOfTI : 0);

      const rounded = Math.round(average * 100) / 100; // Round to 2 decimal places

      return rounded;
    }

    // ? Render this last (this is the final mark column)
    rowData.push(
      <td
        key={"grade"}
        style={{
          border: tableProperties.border,
          // backgroundColor: tableProperties.final.failing,
          width: "7%",
        }}
      >
        {calculateAverage()}%
      </td>
    );

    // ? Render the full Row
    return <tr style={{ margin: 0, textAlign: "center" }}>{rowData}</tr>;
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
                  <option value="Communication">Communication</option>
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
                  !singleCriteria.label.trim() ||
                  !singleCriteria.letter ||
                  !singleCriteria.weight
                ) {
                  return setDisplayErr({
                    reveal: true,
                    label: `Please fill all fields`,
                  });
                }
                setAllCriterias([...allCriterias, singleCriteria]); // Pushing new criteria to the array
                setSingleCriteria({ label: "", letter: "", weight: 0 });
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
                    key={i}
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <p style={{ margin: 0 }}>{criteria.label}</p>
                    <p style={{ margin: 0 }}>({criteria.letter})</p>
                    <p style={{ margin: 0 }}>{criteria.weight}%</p>
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
                    key={i}
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
                        <p key={i} style={{ margin: 0, fontSize: 14 }}>
                          {criteria.label}({criteria.letter}) {criteria.weight}%
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
                    <div key={i}>
                      <h5>{unit.title}</h5>
                      <h5 style={{ color: unit.themeColor }}>
                        Your theme color
                      </h5>
                      {unit.projects.map((project, i) => {
                        return (
                          <div key={i}>
                            <p style={{ margin: 0, fontSize: 18 }}>
                              {project.title}
                            </p>
                            {project.criterias.map((criteria, i) => {
                              return (
                                <p key={i} style={{ margin: 0, fontSize: 14 }}>
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
                })}
            </div>
            <h5 style={{ marginTop: 30 }}>Generate Table</h5>
            {/* // TODO Add the function to upload to the model  */}
            <button>Generate Table</button>
          </section>
        )}
        {units.length >= 1 && (
          <table
            className="table"
            style={{ border: "1px solid rgba(0,0,0,0.2)" }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    backgroundColor: "#333",
                    border: tableProperties.border,
                  }}
                ></th>
                {renderUnitRow()}
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
                {renderProjectRow()}
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
                {renderCriteriaLabelRow()}
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
            <tbody>{renderSingleDataRow()}</tbody>
          </table>
        )}
        {/* ------------ ----------- ---------- // ? GENERATED TABLE */}
      </form>
    </div>
  );
};

export default Marks;
