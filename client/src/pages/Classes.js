import React, { useState, useEffect, useRef } from "react";

import { useQuery } from "@apollo/client";
import { GET_USER } from "../utils/queries";

import Auth from "../utils/auth";
import { useHistory } from "react-router-dom";

const Classes = () => {
  const history = useHistory();

  const [missingData, setMissingData] = useState({});
  const inputRef = useRef(null);
  const [studentData, setStudentData] = useState({});
  const [allStudents, setAllStudents] = useState([]);

  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(Auth.getProfile().data._id);
  const { loading, error, data } = useQuery(GET_USER, {
    // This property and the 'network-only' value ensures it always fetches the latest data from the apollo server.
    // In short, it ensures if you attempt to login again during the same session that the data is unique based on the account
    fetchPolicy: "network-only",
    variables: { id: userId },
    onCompleted: (data) => {
      // Upon successful data fetch, update state object
      setUserData(data.user);
    },
  });

  useEffect(() => {
    setUserData(data?.user);
  }, [loading]);

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

  const [viewingTable, setViewingTable] = useState(0);

  const [decimal, setDecimal] = useState(false);

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
          textAlign: "center",
        }}
      >
        {`${singleClass.title} - ${singleClass.schoolYear}`}
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
            textAlign: "center",
            color: "#333",
          }}
        >
          {unit.title}
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
              textAlign: "center",
              color: "#333",
            }}
          >
            {project.title}
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
                <p style={{ margin: 0 }}>
                  {criteria.letter} ({criteria.weight}%)
                </p>
              </div>
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
              student.classId === singleClass._id &&
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
                !studentData[singleClass._id] ||
                studentData[singleClass._id].name === undefined ||
                studentData[singleClass._id].name == ""
              ) {
                return setMissingData({
                  ...missingData,
                  [singleClass._id]: {
                    reveal: true,
                    classId: singleClass._id,
                  },
                });
              }
              // Add the student
              setAllStudents([...allStudents, studentData[singleClass._id]]);

              // Remove the student that was added from studentData (which contains the blankRow data)
              const updatedStudentData = { ...studentData };
              delete updatedStudentData[singleClass._id];
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

  function calculateAverage(grades, singleClass) {
    let KU = [];
    let A = [];
    let TI = [];
    let C = [];

    grades.map((grade) => {
      // Only push grades that are in specific classes
      if (grade.letter == "K/U" && grade.classId === singleClass._id) {
        KU.push({
          weight: grade.weight / 100,
          mark: parseInt(grade.mark) * (grade.weight / 100),
        });
      }
      if (grade.letter == "T/I" && grade.classId === singleClass._id) {
        TI.push({
          weight: grade.weight / 100,
          mark: parseInt(grade.mark) * (grade.weight / 100),
        });
      }
      if (grade.letter == "A" && grade.classId === singleClass._id) {
        A.push({
          weight: grade.weight / 100,
          mark: parseInt(grade.mark) * (grade.weight / 100),
        });
      }
      if (grade.letter == "C" && grade.classId === singleClass._id) {
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
            classId: singleClass._id,
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
      classId: singleClass._id,
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
              [singleClass._id]: {
                reveal: false,
                classId: singleClass._id,
              },
            });
          }}
          onChange={(e) => {
            setStudentData((prevStudentData) => ({
              ...prevStudentData,
              [singleClass._id]: {
                ...prevStudentData[singleClass._id],
                classId: singleClass._id,
                id: uniqueId,
                name: e.target.value,
                grades:
                  prevStudentData[singleClass._id] &&
                  prevStudentData[singleClass._id].grades
                    ? // If grades exist, keep those ones and spread them
                      [...prevStudentData[singleClass._id].grades]
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
            studentData[singleClass._id] && studentData[singleClass._id].name
              ? studentData[singleClass._id].name
              : ""
          }
        ></input>
        {missingData[singleClass._id] &&
          missingData[singleClass._id].reveal &&
          missingData[singleClass._id].classId === singleClass._id && (
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
            (studentData[singleClass._id] &&
              studentData[singleClass._id].grades &&
              studentData[singleClass._id].grades.find(
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
                      singleClass._id
                    ].grades.map((g) => {
                      if (g.id === grade.id && g.classId === singleClass._id) {
                        return {
                          ...g,
                          mark,
                        };
                      }
                      return g;
                    });

                    setStudentData((prevStudentData) => ({
                      ...prevStudentData,
                      [singleClass._id]: {
                        ...prevStudentData[singleClass._id],
                        grades: updatedGrades,
                      },
                    }));
                  } else {
                    setStudentData((prevStudentData) => ({
                      ...prevStudentData,
                      [singleClass._id]: {
                        ...prevStudentData[singleClass._id],
                        grades: [
                          ...(prevStudentData[singleClass._id]?.grades ?? []),
                          {
                            classId: singleClass._id,
                            id: criteria.id,
                            unit: singleUnit.title,
                            project: project.title,
                            criteria: criteria.label,
                            weight: criteria.weight,
                            letter: criteria.letter,
                            mark: parseInt(mark),
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
      studentData[singleClass._id] && studentData[singleClass._id].grades;

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
        style={{
          fontSize: 15,
          // backgroundColor: tableProperties.final.failing,
          border: tableProperties.border,
          width: "25%",
        }}
      >
        <input
          style={{
            width: "100%",
            border: "none",
            backgroundColor: "transparent",
            outline: "none",
            textAlign: "center",
          }}
          onChange={(e) => {
            setAllStudents((prevStudents) =>
              prevStudents.map((singleStudent) => {
                if (singleStudent.id === student.id) {
                  return {
                    ...singleStudent,
                    name: e.target.value,
                  };
                }
                return singleStudent;
              })
            );
          }}
          defaultValue={
            student.name && student.classId === singleClass._id
              ? student.name
              : ""
          }
        />
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

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
        className="container mt-2"
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
      className="container mt-2"
    >
      <div>
        <p style={{ textAlign: "center" }}>Your Classes</p>
        <div style={{ display: "flex", gap: 15, marginBottom: 10 }}>
          {userData.classes.map((singleClass, i) => (
            <>
              <button
                onClick={() => {
                  setViewingTable(i);
                }}
                style={{ width: 100 }}
              >
                {singleClass.title}
              </button>
              {i === userData.classes.length - 1 && (
                <button
                  onClick={() => {
                    history.push("/add-classes");
                  }}
                >
                  Add Class +
                </button>
              )}
            </>
          ))}
        </div>
      </div>
      <div>{userData.classes.map(renderTable)}</div>
    </div>
  );
};

export default Classes;
