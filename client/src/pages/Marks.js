import React, { useState, useEffect, useRef } from "react";

const Marks = () => {
  // TODO Create the function to allow users to send progress reports emails to students

  // TODO Instead of rendering using multiple single useState variables, make it one object completely

  // TODO - IMPORTANT - Instead of rendering multiple nested for loops across multiple functions...
  // TODO Take the one with ALL the data and simply render the rows in each nested loop

  // TODO Add the edit function for units
  // TODO You should be able to add a new project to a unit after the unit has been added
  // TODO You should be able to edit classes and units after the table has been generated, maybe on the table itself?
  // ? SERVER SETUP ?------?------?------?------?------?------?------?------?------?------?------?------
  // TODO Update Model (Need a Table and Student Model)
  // TODO Table model should have all the data required to build the data - including units, projects and their criteria
  // TODO User model has the students name and grades
  // TODO Add the ability to post to DB
  // TODO Add the ability to edit/delete the data after it's been posted to DB

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

  // TODO Update all headers to be inputs and allow users to update the head data
  const renderTable = (singleClass, i) => {
    const allClasses = [];
    const allUnits = [];
    const projects = [];
    const criteriaLabels = [];

    let classesColSpan = 0;

    singleClass.units.map((unit) => {
      unit.projects.map((project) => {
        classesColSpan += project.criterias.length;
      });
    });

    allClasses.push(
      <th
        key={singleClass.title}
        className="table-unit-title"
        colSpan={classesColSpan}
        style={{
          backgroundColor: "#333",
          border: tableProperties.border,
        }}
      >
        <input
          onChange={(e) => {}}
          style={{
            color: "#FFFFFF",
            backgroundColor: "transparent",
            textTransform: "uppercase",
            letterSpacing: "3px",
            fontSize: 20,
            width: "100%",
            border: "none",
            outline: "none",
            textAlign: "center",
          }}
          value={`${singleClass.title} - ${singleClass.schoolYear}`}
        />
      </th>
    );
    singleClass.units.map((unit, i) => {
      let themeColor = unit.themeColor;

      let unitColSpan = 0;
      unit.projects.map((project) => {
        unitColSpan += project.criterias.length;
      });

      allUnits.push(
        <th
          key={unit.title}
          className="table-unit-title"
          colSpan={unitColSpan}
          style={{
            backgroundColor: themeColor,
            border: tableProperties.border,
          }}
        >
          <input
            onChange={(e) => {}}
            style={{
              backgroundColor: "transparent",
              textTransform: "uppercase",
              letterSpacing: "2px",
              width: "100%",
              border: "none",
              outline: "none",
              textAlign: "center",
            }}
            value={unit.title}
          />
        </th>
      );

      unit.projects.map((project, i) => {
        projects.push(
          <th
            key={project.title}
            className="table-unit-title"
            colSpan={project.criterias.length}
            style={{
              backgroundColor: themeColor,
              border: tableProperties.border,
            }}
          >
            <input
              onChange={(e) => {}}
              style={{
                backgroundColor: "transparent",
                textTransform: "uppercase",
                letterSpacing: "2px",
                width: "100%",
                border: "none",
                outline: "none",
                textAlign: "center",
              }}
              value={project.title}
            />
          </th>
        );

        project.criterias.map((criteria, i) => {
          criteriaLabels.push(
            <th
              style={{
                backgroundColor: themeColor,
                border: tableProperties.border,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p style={{ margin: 0 }}>{criteria.letter}</p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <input
                    onChange={(e) => {}}
                    style={{
                      width: 50,
                      border: "none",
                      outline: "none",
                      textAlign: "center",
                    }}
                    value={criteria.weight}
                  />
                  <p style={{ margin: 0 }}>%</p>
                </div>
              </div>
              <button>X</button>
            </th>
          );
        });
      });
    });

    return (
      <table
        className="table table-responsive"
        style={{
          display: viewingTable === i ? "unset" : "none",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                backgroundColor: "#333",
                border: tableProperties.border,
              }}
            ></th>
            {allClasses}
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
              <button onClick={() => setDecimal(!decimal)}>Fixed Point</button>
              Final
            </th>
          </tr>
        </thead>
        <tbody>
          {/* // ? This will contain the rows that will be added */}
          {allStudents.map((student) => {
            return (
              student.classId === singleClass.id &&
              renderTableBodyGrades(student, singleClass)
            );
          })}
          {/* // ? Render the initial empty row first */}
          {renderTableBodyBlank(singleClass)}
          {/* // ? This is the Add student function which renders a new row (pushes to studentRows) */}
          <tr
            className="add-student"
            onClick={() => {
              if (
                !studentData[singleClass.id] ||
                studentData[singleClass.id].name === undefined ||
                studentData[singleClass.id].name == ""
              ) {
                return setMissingData({
                  ...missingData,
                  [singleClass.id]: {
                    reveal: true,
                    classId: singleClass.id,
                  },
                });
              }
              // Add the student
              setAllStudents([...allStudents, studentData[singleClass.id]]);

              // Remove the student that was added from studentData (which contains the blankRow data)
              const updatedStudentData = { ...studentData };
              delete updatedStudentData[singleClass.id];
              setStudentData(updatedStudentData);
              inputRef.current.focus();
            }}
          >
            <td style={{ border: "none" }}>
              <button
                style={{ backgroundColor: "transparent", border: "none" }}
              >
                Add Student
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

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

  // TODO Update repetitive code, renderTableBodyBlank and renderTableBodyGrades are very similar, differentiate between them by adding a param when calling the functions
  // TODO Add the ability to paste a large set of data to populate the table
  // TODO Future update - Try to re-implement on blur for the input field - The issue occurs because you try to clear input field after adding new student

  // ? THE FULL SINGLE DATA ROW
  const renderTableBodyBlank = (singleClass) => {
    const rowData = [];
    const uniqueId = Math.floor(Math.random() * 9e9) + 1e9;

    let defaultGrades = [];

    // TODO Only run this once
    singleClass.units.flatMap((unit) =>
      unit.projects.flatMap((project) =>
        project.criterias.map((criteria) => {
          return defaultGrades.push({
            classId: singleClass.id,
            id: criteria.id,
            unit: unit.title,
            project: project.title,
            criteria: criteria.label,
            weight: criteria.weight,
            letter: criteria.letter,
            mark: 0,
          });
        })
      )
    );
    let defaultStudent = {
      id: uniqueId,
      classId: singleClass.id,
      name: "-",
      grades: defaultGrades,
    };

    // ? Render this first (this is the student name column)
    rowData.push(
      <td
        style={{
          fontSize: 15,
          // backgroundColor: tableProperties.final.failing,
          border: tableProperties.border,
          width: "25%",
          position: "relative",
        }}
      >
        <input
          ref={inputRef}
          onFocus={() => {
            return setMissingData({
              ...missingData,
              [singleClass.id]: {
                reveal: false,
                classId: singleClass.id,
              },
            });
          }}
          onChange={(e) => {
            setStudentData((prevStudentData) => ({
              ...prevStudentData,
              [singleClass.id]: {
                ...prevStudentData[singleClass.id],
                classId: singleClass.id,
                id: uniqueId,
                name: e.target.value,
                grades:
                  prevStudentData[singleClass.id] &&
                  prevStudentData[singleClass.id].grades
                    ? // If grades exist, keep those ones and spread them
                      [...prevStudentData[singleClass.id].grades]
                    : // Otherwise, set a default grade
                      defaultStudent.grades,
              },
            }));
          }}
          style={{
            width: "100%",
            border: "none",
            backgroundColor: "transparent",
            outline: "none",
            textAlign: "center",
          }}
          value={
            studentData[singleClass.id] && studentData[singleClass.id].name
              ? studentData[singleClass.id].name
              : ""
          }
        ></input>
        {missingData[singleClass.id] &&
          missingData[singleClass.id].reveal &&
          missingData[singleClass.id].classId === singleClass.id && (
            <span
              style={{
                letterSpacing: 0.2,
                width: "100%",
                position: "absolute",
                bottom: "50%",
                right: "50%",
                transform: "translateX(50%) translateY(50%)",
                color: "red",
                fontSize: 16,
                pointerEvents: "none",
              }}
            >
              Missing Student Name
            </span>
          )}
      </td>
    );

    // ? Render this in between (these are all the grade columns)
    for (let i = 0; i < singleClass.units.length; i++) {
      const singleUnit = singleClass.units[i];

      // iterate over all the projects in the units
      for (let j = 0; j < singleUnit.projects.length; j++) {
        const project = singleUnit.projects[j];

        // iterate over all the criterias in the project
        for (let k = 0; k < project.criterias.length; k++) {
          const criteria = project.criterias[k];

          const grade =
            (studentData[singleClass.id] &&
              studentData[singleClass.id].grades &&
              studentData[singleClass.id].grades.find(
                (grade) => grade.id === criteria.id
              )) ||
            null;

          rowData.push(
            <td
              key={criteria.id}
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
                    const updatedGrades = studentData[
                      singleClass.id
                    ].grades.map((g) => {
                      if (g.id === grade.id && g.classId === singleClass.id) {
                        return {
                          ...g,
                          mark,
                        };
                      }
                      return g;
                    });

                    setStudentData((prevStudentData) => ({
                      ...prevStudentData,
                      [singleClass.id]: {
                        ...prevStudentData[singleClass.id],
                        // id: uniqueId,
                        // classId: singleClass.id,
                        // name:
                        //   prevStudentData[singleClass.id] &&
                        //   prevStudentData[singleClass.id].name
                        //     ? prevStudentData[singleClass.id].name
                        //     : "",
                        grades: updatedGrades,
                      },
                    }));
                  } else {
                    setStudentData((prevStudentData) => ({
                      ...prevStudentData,
                      [singleClass.id]: {
                        ...prevStudentData[singleClass.id],
                        // id: uniqueId,
                        // classId: singleClass.id,
                        // name:
                        //   prevStudentData[singleClass.id] &&
                        //   prevStudentData[singleClass.id].name
                        //     ? prevStudentData[singleClass.id].name
                        //     : "",
                        grades: [
                          ...(prevStudentData[singleClass.id]?.grades ?? []),
                          {
                            classId: singleClass.id,
                            id: criteria.id,
                            unit: singleUnit.title,
                            project: project.title,
                            criteria: criteria.label,
                            weight: criteria.weight,
                            letter: criteria.letter,
                            mark,
                          },
                        ],
                      },
                    }));
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
              />
            </td>
          );
        }
      }
    }

    const grades =
      studentData[singleClass.id] && studentData[singleClass.id].grades;

    // ? Render this last (this is the final mark column)
    rowData.push(
      <td
        style={{
          border: tableProperties.border,
          backgroundColor:
            grades === undefined || grades.length === 0
              ? ""
              : calculateAverage(grades, singleClass) < 50
              ? tableProperties.final.failing
              : calculateAverage(grades, singleClass) > 80 &&
                tableProperties.final.top,
          width: "8%",
        }}
      >
        {grades === undefined || grades.length === 0
          ? (0).toFixed(decimal ? 2 : 0)
          : calculateAverage(grades, singleClass)}
        %
      </td>
    );

    // ? Render the full Row
    return (
      <tr
        style={{
          margin: 0,
          textAlign: "center",
        }}
      >
        {rowData}
      </tr>
    );
  };

  // TODO Need to update to allow users to edit student names
  // TODO Re-use the code that edits previous grades and just update student names
  const renderTableBodyGrades = (student, singleClass) => {
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
        {student.name && student.classId === singleClass.id ? student.name : ""}
      </td>
    );

    // ? Render this in between (these are all the grade columns)
    for (let i = 0; i < singleClass.units.length; i++) {
      const singleUnit = singleClass.units[i];

      // iterate over all the projects in the units
      for (let j = 0; j < singleUnit.projects.length; j++) {
        const project = singleUnit.projects[j];

        // iterate over all the criterias in the project
        for (let k = 0; k < project.criterias.length; k++) {
          const criteria = project.criterias[k];
          const grade =
            student.grades && student.grades.length > 0
              ? student.grades.find((grade) => grade.id === criteria.id)
              : null;

          rowData.push(
            <td
              key={criteria.id}
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
                  setAllStudents((prevStudents) =>
                    prevStudents.map((singleStudent) => {
                      if (singleStudent.id === student.id) {
                        const updatedGrades = singleStudent.grades.map(
                          (gradeObj) => {
                            if (
                              gradeObj.id === criteria.id &&
                              gradeObj.classId
                            ) {
                              return {
                                ...gradeObj,
                                mark: e.target.value,
                              };
                            }
                            return gradeObj;
                          }
                        );
                        return {
                          ...singleStudent,
                          grades: updatedGrades,
                        };
                      }
                      return singleStudent;
                    })
                  );
                }}
                style={{
                  width: "100%",
                  border: "none",
                  backgroundColor: "transparent",
                  outline: "none",
                  textAlign: "center",
                }}
                defaultValue={grade ? grade.mark : 0}
              ></input>
            </td>
          );
        }
      }
    }

    const grades = student.grades ? student.grades : null;

    // ? Render this last (this is the final mark column)
    rowData.push(
      <td
        style={{
          border: tableProperties.border,
          backgroundColor:
            grades === null || grades.length === 0
              ? ""
              : calculateAverage(grades, singleClass) < 50
              ? tableProperties.final.failing
              : calculateAverage(grades, singleClass) > 80 &&
                tableProperties.final.top,
          width: "8%",
        }}
      >
        {grades === null || grades.length === 0
          ? (0).toFixed(decimal ? 2 : 0)
          : calculateAverage(grades, singleClass)}
        %
      </td>
    );

    // ? Render the full Row
    return <tr style={{ margin: 0, textAlign: "center" }}>{rowData}</tr>;
  };

  const [addProject, setAddProject] = useState(false);
  const [addClass, setAddClass] = useState(false);

  // Add project to projects and reset singleProject data
  useEffect(() => {
    if (singleProject.criterias.length > 0 && addProject) {
      setProjects((prevProjects) => [...prevProjects, singleProject]);
      setSingleProject({ title: "", criterias: [] });
      setAddProject(false);
    }
    if (units.length > 0 && addClass) {
      const uniqueId = Math.floor(Math.random() * 9e9) + 1e9;
      setClasses([
        ...classes,
        { id: uniqueId, title: classTitle, units, schoolYear },
      ]);
      setClassTitle("");
      setUnits([]);
      setAddClass(false);
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
                setAddClass(true);
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

            <h5 style={{ marginTop: 30 }}>Generate Table</h5>
            {/* // TODO Add the function to upload to the model  */}
            <button>Generate Table</button>
          </section>
        )}
        <div style={{ display: "flex", gap: 15 }}>
          {classes.map((singleClass, i) => (
            <button
              onClick={() => {
                setViewingTable(i);
              }}
              style={{ width: 100 }}
            >
              {singleClass.title}
            </button>
          ))}
        </div>
        {classes.map(renderTable)}
        {/* ------------ ----------- ---------- // ? GENERATED TABLE */}
      </form>
    </div>
  );
};

export default Marks;
