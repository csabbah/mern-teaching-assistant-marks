import React, { useState, useEffect, cloneElement } from "react";

const Marks = () => {
  // TODO - IMPORTANT - Instead of rendering multiple nested for loops across multiple functions...
  // TODO Take the one with ALL the data and simply render the rows in each nested loop

  // TODO - NEED TO ADD A NEW CLASS ROW (TO RENDER ABOVE UNIT)
  // TODO - UNITS ARE THE SECTIONS IN A CLASS (THERE ARE MULTIPLE UNITS) IN A BIOLODY CLASS
  // TODO Add the edit function for criterias, projects and units (use contentEditable)
  // ? SERVER SETUP ?------?------?------?------?------?------?------?------?------?------?------?------
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

  // Set the initial unitThemeColor to a default 'white' color
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
    id: "",
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

  const [singleProject, setSingleProject] = useState({
    title: "",
    criterias: [],
  });

  const [projects, setProjects] = useState([]);

  const [displayErr, setDisplayErr] = useState({ reveal: false, msg: "" });

  const renderTableHead = () => {
    const criteriaLabels = [];
    const allUnits = [];
    const projects = [];

    // iterate over all units
    for (let i = 0; i < units.length; i++) {
      const singleUnit = units[i];

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

      // iterate over all the projects in the units
      for (let j = 0; j < singleUnit.projects.length; j++) {
        const project = singleUnit.projects[j];

        projects.push(
          <th
            key={j}
            colSpan={project.criterias.length}
            style={{
              backgroundColor: units[i].themeColor,
              border: tableProperties.border,
            }}
          >
            {project.title}
          </th>
        );

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

    return (
      <thead>
        <tr>
          <th
            style={{
              backgroundColor: "#333",
              border: tableProperties.border,
            }}
          ></th>
          {allUnits}
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
          {projects}
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
          {criteriaLabels}
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
    );
  };

  const [allStudents, setAllStudents] = useState([]);

  // TODO Update repetitive code, renderTableBodyBlank and renderTableBodyGrades are very similar, differentiate between them by adding a param when calling the functions

  // TODO Add the ability to paste a large set of data to populate the table

  // TODO Future update - Try to re-implement on blur for the input field
  // TODO The issue occurs because you try to clear input field after adding new student
  // ? THE FULL SINGLE DATA ROW
  const renderTableBodyBlank = () => {
    const rowData = [];
    const uniqueId = Math.floor(Math.random() * 9e9) + 1e9;

    // ? Render this first (this is the student name column)
    rowData.push(
      <td
        style={{
          fontSize: 15,
          // backgroundColor: tableProperties.final.failing,
          border: tableProperties.border,
          width: "25%",
        }}
      >
        <input
          onChange={(e) => {
            setStudentData({
              ...studentData,
              id: uniqueId,
              name: e.target.value,
            });
          }}
          style={{
            width: "100%",
            border: "none",
            backgroundColor: "transparent",
            outline: "none",
            textAlign: "center",
          }}
          value={studentData.name ? studentData.name : ""}
        ></input>
      </td>
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
          const grade = studentData.grades.find(
            (grade) => grade.id === criteria.id
          );

          rowData.push(
            <td
              style={{
                backgroundColor: singleUnit.themeColor,
                border: tableProperties.border,
                borderLeftWidth: "1px",
                borderLeftColor: "rgba(0,0,0,1)",
                borderRightColor: "rgba(0,0,0,1)",
              }}
            >
              <input
                onChange={(e) => {
                  const mark = e.target.value;

                  if (grade) {
                    // Update the mark
                    const updatedGrades = studentData.grades.map((g) => {
                      if (g.id === grade.id) {
                        return {
                          ...g,
                          mark,
                        };
                      }
                      return g;
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
                          id: criteria.id,
                          unit: singleUnit.title,
                          project: project.title,
                          criteria: criteria.label,
                          weight: criteria.weight,
                          letter: criteria.letter,
                          mark,
                        },
                      ],
                    });
                  }
                }}
                style={{
                  width: "100%",
                  border: "none",
                  backgroundColor: "transparent",
                  outline: "none",
                  textAlign: "center",
                }}
                value={grade ? grade.mark : 0}
              ></input>
            </td>
          );
        }
      }
    }

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
        (sumOfTI ? sumOfTI : 0) +
        (sumOfC ? sumOfC : 0);

      return average.toFixed(2);
    }

    // ? Render this last (this is the final mark column)
    rowData.push(
      <td
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

  // TODO Update the contentEditable, replace with the input setup in renderTableBodyBlank function
  // TODO Need to update this to allow editing users data
  // TODO Would need to simply update the allStudents array, we would check the student id and criteria id
  const renderTableBodyGrades = (student) => {
    const rowData = [];

    // ? Render this first (this is the student name column)
    rowData.push(
      <td
        onBlur={(e) => {}}
        style={{
          fontSize: 15,
          // backgroundColor: tableProperties.final.failing,
          border: tableProperties.border,
          width: "25%",
        }}
        contentEditable
      >
        {student.name}
      </td>
    );

    // ? Render this in between (these are all the grade columns)
    for (let i = 0; i < units.length; i++) {
      const singleUnit = units[i];

      // iterate over all the projects in the units
      for (let j = 0; j < singleUnit.projects.length; j++) {
        const project = singleUnit.projects[j];

        // iterate over all the criterias in the project
        for (let k = 0; k < project.criterias.length; k++) {
          // const criteria = project.criterias[k];
          // rowData.push(
          //   <td
          //     key={k}
          //     className={`${criteria.weight}-${criteria.label}-${criteria.letter}-${singleUnit.title}-${project.title}`}
          //     style={{
          //       backgroundColor: singleUnit.themeColor,
          //       border: tableProperties.border,
          //       borderLeftWidth: "1px",
          //       borderLeftColor: "rgba(0,0,0,1)",
          //       borderRightColor: "rgba(0,0,0,1)",
          //     }}
          //     onBlur={(e) => {}}
          //     contentEditable
          //   >
          //     {student.grades[k].mark}
          //   </td>
          // );
          const criteria = project.criterias[k];
          const grade = student.grades.find(
            (grade) => grade.id === criteria.id
          );

          rowData.push(
            <td
              style={{
                backgroundColor: singleUnit.themeColor,
                border: tableProperties.border,
                borderLeftWidth: "1px",
                borderLeftColor: "rgba(0,0,0,1)",
                borderRightColor: "rgba(0,0,0,1)",
              }}
              onBlur={(e) => {}}
              contentEditable
            >
              {grade && grade.mark}
            </td>
          );
        }
      }
    }

    // TODO Refactor this code

    function calculateAverage() {
      const { grades } = student;

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
        (sumOfTI ? sumOfTI : 0) +
        (sumOfC ? sumOfC : 0);

      return average.toFixed(2);
    }

    // ? Render this last (this is the final mark column)
    rowData.push(
      <td
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

  // Add project to projects and reset singleProject data
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
        {/* ------------ ----------- ---------- // ? ADDING UNIT TITLE */}{" "}
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
                      id: uniqueId,
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
                setSingleCriteria({ id: "", label: "", letter: "", weight: 0 });
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
                            return { ...stateCriteria, weight: e.target.value };
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
            {renderTableHead()}
            <tbody>
              {/* // ? This will contain the rows that will be added */}
              {allStudents.map((student) => {
                return renderTableBodyGrades(student);
              })}
              {/* // ? Render the initial empty row first */}
              {renderTableBodyBlank()}
              {/* // ? This is the Add student function which renders a new row (pushes to studentRows) */}
              <tr
                className="add-student"
                onClick={() => {
                  setStudentData({ id: 0, name: "", grades: [], finalMark: 0 });
                  setAllStudents([...allStudents, studentData]);
                }}
              >
                <td style={{ border: "none" }}>Add Student +</td>
              </tr>
            </tbody>
          </table>
        )}
        {/* ------------ ----------- ---------- // ? GENERATED TABLE */}
      </form>
    </div>
  );
};

export default Marks;
