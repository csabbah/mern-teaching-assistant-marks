import React, { useState, useEffect, useRef } from "react";

import { useQuery } from "@apollo/client";
import { GET_DATA } from "../utils/queries";

import Auth from "../utils/auth";
import { useHistory } from "react-router-dom";

import { useMutation } from "@apollo/client";
import {
  ADD_STUDENT,
  DELETE_STUDENT,
  UPDATE_STUDENT_GRADE,
  UPDATE_STUDENT_NAME,
} from "../utils/mutations";

const Classes = () => {
  const history = useHistory();

  const [fullData, setFullData] = useState([]);
  const [userId, setUserId] = useState(Auth.getProfile().data._id);

  const { loading, data, refetch } = useQuery(GET_DATA, {
    variables: { id: userId },
  });

  const [updateStudentGrade] = useMutation(UPDATE_STUDENT_GRADE);
  const handleUpdateStudentGrade = async (
    studentId,
    gradeId,
    mark,
    finalMark
  ) => {
    try {
      await updateStudentGrade({
        variables: { studentId, gradeId, mark, finalMark },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const [updateStudentName] = useMutation(UPDATE_STUDENT_NAME);
  const handleUpdateStudentName = async (studentId, name) => {
    try {
      await updateStudentName({
        variables: { studentId, name },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const [addStudent] = useMutation(ADD_STUDENT);
  const handleAddStudent = async (singleStudent) => {
    try {
      const studentAdded = await addStudent({
        variables: { studentToSave: { ...singleStudent, userId } },
      });

      setAllStudents([...allStudents, studentAdded.data.addStudent]);

      // Re-apply the default grades to empty body blank
      fullData.classes.map((singleClass) => {
        renderDefaultStudent(singleClass);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const [deleteStudent] = useMutation(DELETE_STUDENT);

  const handleDeleteStudent = async (studentId) => {
    try {
      await deleteStudent({
        variables: { userId, studentId },
      });

      const updatedStudents = allStudents.filter(
        (student) => student._id !== studentId
      );
      setAllStudents(updatedStudents);
    } catch (err) {
      console.log(err);
    }
  };

  const [allStudents, setAllStudents] = useState([]);

  const [missingData, setMissingData] = useState({});
  const inputRef = useRef(null);
  const [studentData, setStudentData] = useState({});

  let tableProperties = {
    border: "1px solid #333",
    final: {
      top: "rgba(255, 255, 0, 0.2)",
      passing: "rgba(255, 255, 255, 0.2)",
      failing: "rgba(255, 0, 0, 0.2)",
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

  useEffect(() => {
    refetch();

    setFullData(data?.fullData);
    setAllStudents(data?.fullData.students);

    // ? Upon first page load...
    if (fullData && fullData.classes) {
      // ? For each class, assign a default value to the studentData object so we don't miss any values
      fullData.classes.map((singleClass) => {
        renderDefaultStudent(singleClass);
      });
    }
  }, [loading, fullData, refetch]);

  // ? Update all StudentData objects with default data (to ensure all grades are included by default)
  const renderDefaultStudent = (singleClass) => {
    let defaultGrades = [];

    singleClass.units.flatMap((unit) =>
      unit.projects.flatMap((project) =>
        project.criterias.map((criteria) => {
          return defaultGrades.push({
            classId: singleClass._id,
            criteriaId: criteria._id,
            unit: unit.title,
            project: project.title,
            criteria: criteria.label,
            weight: parseInt(criteria.weight),
            letter: criteria.letter,
            mark: 0,
          });
        })
      )
    );

    setStudentData((prevStudentData) => ({
      ...prevStudentData,
      [singleClass._id]: {
        ...prevStudentData[singleClass._id],
        classId: singleClass._id,
        name: "",
        grades: defaultGrades,
      },
    }));
  };

  // TODO Update all headers to be inputs and allow users to update the head data
  // TODO Each cell now has a unique _id (in the resolver, maybe we can explicitly search for that unique id and update the value)
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
              key={criteria._id}
              style={{
                backgroundColor: themeColor,
                border: tableProperties.border,
                cursor: "pointer",
                userSelect: "none",
              }}
              onClick={() => {
                handleSort(criteria.letter, singleClass);
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p
                  className="gradeLetter"
                  style={{ position: "relative", margin: 0 }}
                >
                  {criteria.letter}{" "}
                  <span className="gradeWeight" style={{ fontSize: 15 }}>
                    ({criteria.weight}%)
                  </span>
                </p>
              </div>
            </th>
          );
        });
      });
    });

    return (
      <table
        key={i}
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
                position: "relative",
              }}
            >
              <input
                className="studentSearchInput"
                onChange={(e) => setStudentQuery(e.target.value)}
                value={studentQuery}
                style={{
                  position: "absolute",
                  bottom: "50%",
                  left: "50%",
                  transform: "translateX(-50%) translateY(50%)",
                  width: "95%",
                  height: 40,
                  paddingLeft: 10,
                  border: "none",
                  color: "white",
                  backgroundColor: "#777",
                }}
                placeholder="Search student"
              ></input>
            </th>
            {projects}
            <th
              style={{
                backgroundColor: "#333",
                border: tableProperties.border,
              }}
            >
              <button
                style={{
                  border: "none",
                  backgroundColor: "#999",
                  padding: "4px 13px",
                  color: "#ffffff",
                  borderRadius: 5,
                  fontSize: 15,
                }}
                onClick={() => setDecimal(!decimal)}
              >
                Decimal
              </button>
            </th>
          </tr>
          <tr style={{ margin: 0, textAlign: "center" }}>
            <th
              style={{
                backgroundColor: "#333",
                border: tableProperties.border,
                color: "#FFFFFF",
                textTransform: "uppercase",
                cursor: "pointer",
                userSelect: "none",
              }}
              onClick={() => handleSort("studentName", singleClass)}
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
                cursor: "pointer",
                userSelect: "none",
              }}
              onClick={() => handleSort("finalMark", singleClass)}
            >
              Final
            </th>
          </tr>
        </thead>
        <tbody>
          {/* // ? This will contain the rows that will be added */}
          {allStudents
            // ? Only render the students that are in the class we are viewing
            // ? And render students that match the search query
            .filter((student) => {
              // Check if the student belongs to the current class
              if (student.classId !== singleClass._id) {
                return false;
              }
              // Check if the user query is empty or matches the student name
              if (
                !studentQuery ||
                student.name.toLowerCase().includes(studentQuery.toLowerCase())
              ) {
                return true;
              }
              return false;
            })
            .map((student) => (
              <React.Fragment key={student._id}>
                {renderTableBodyGrades(student, singleClass)}
              </React.Fragment>
            ))}
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
              // Push student to DB
              handleAddStudent(studentData[singleClass._id]);

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

    // ? Render this first (this is the student name column)
    rowData.push(
      <td
        key={0}
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
                name: e.target.value,
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
                (grade) => grade.criteriaId === criteria._id
              )) ||
            null;

          rowData.push(
            <td
              key={criteria._id}
              style={{
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
                      if (
                        g.criteriaId === grade.criteriaId &&
                        g.classId === singleClass._id
                      ) {
                        return {
                          ...g,
                          mark: parseInt(mark),
                        };
                      }
                      return g;
                    });

                    setStudentData((prevStudentData) => ({
                      ...prevStudentData,
                      [singleClass._id]: {
                        ...prevStudentData[singleClass._id],
                        grades: updatedGrades,
                        finalMark: parseInt(
                          calculateAverage(updatedGrades, singleClass)
                        ),
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
                            criteriaId: criteria._id,
                            unit: singleUnit.title,
                            project: project.title,
                            criteria: criteria.label,
                            weight: criteria.weight,
                            letter: criteria.letter,
                            mark: parseInt(mark),
                          },
                        ],
                        finalMark: parseInt(
                          calculateAverage(
                            prevStudentData[singleClass._id]?.grades ?? [],
                            singleClass
                          )
                        ),
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
        key={1}
        style={{
          border: tableProperties.border,
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

  const renderTableBodyGrades = (student, singleClass) => {
    const rowData = [];

    // ? Render this first (this is the student name column)
    rowData.push(
      <td
        key={student.name}
        style={{
          position: "relative",
          fontSize: 15,
          // backgroundColor: tableProperties.final.failing,
          border: tableProperties.border,
          width: "30%",
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
          onBlur={(e) => {
            setAllStudents((prevStudents) =>
              prevStudents.map((singleStudent) => {
                if (singleStudent._id === student._id) {
                  return {
                    ...singleStudent,
                    name: e.target.value.trim(),
                  };
                }

                return singleStudent;
              })
            );
            handleUpdateStudentName(student._id, e.target.value.trim());
          }}
          defaultValue={
            student.name && student.classId === singleClass._id
              ? student.name
              : ""
          }
        />
        <button
          onClick={() => {
            handleDeleteStudent(student._id);
          }}
          style={{
            position: "absolute",
            left: 10,
            bottom: "50%",
            transform: "translateY(50%)",
            border: "none",
            backgroundColor: "red",
            padding: "3px 9px",
            color: "#ffffff",
            borderRadius: 5,
          }}
        >
          X
        </button>
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
              ? student.grades.find(
                  (grade) => grade.criteriaId === criteria._id
                )
              : null;

          rowData.push(
            <td
              key={criteria._id}
              style={{
                // backgroundColor: singleUnit.themeColor,
                backgroundColor:
                  grade.mark < 50
                    ? tableProperties.final.failing
                    : grade.mark > 80
                    ? tableProperties.final.top
                    : singleUnit.themeColor,
                border: tableProperties.border,
                borderLeftWidth: "1px",
                borderLeftColor: "rgba(0,0,0,1)",
                borderRightColor: "rgba(0,0,0,1)",
                width: "9%",
              }}
            >
              <input
                onBlur={(e) => {
                  let singleGradeId = "";
                  setAllStudents((prevStudents) =>
                    prevStudents.map((singleStudent) => {
                      if (singleStudent._id === student._id) {
                        const updatedGrades = singleStudent.grades.map(
                          (studentGrade) => {
                            if (studentGrade.criteriaId === criteria._id) {
                              singleGradeId = studentGrade._id;
                              return {
                                ...studentGrade,
                                mark: parseInt(e.target.value),
                              };
                            }

                            return studentGrade;
                          }
                        );

                        handleUpdateStudentGrade(
                          singleStudent._id,
                          singleGradeId,
                          parseInt(e.target.value),
                          parseInt(calculateAverage(updatedGrades, singleClass))
                        );

                        return {
                          ...singleStudent,
                          grades: updatedGrades,
                          finalMark: parseInt(
                            calculateAverage(updatedGrades, singleClass)
                          ),
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
        key={student.name + student._id}
        style={{
          border: tableProperties.border,
          backgroundColor:
            grades === null || grades.length === 0
              ? ""
              : calculateAverage(grades, singleClass) < 50
              ? tableProperties.final.failing
              : calculateAverage(grades, singleClass) > 80 &&
                tableProperties.final.top,
          width: "12%",
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

  const [studentQuery, setStudentQuery] = useState("");
  const [sorted, setSorted] = useState(true);
  const handleSort = (name, singleClass) => {
    setSorted((prevSorted) => !prevSorted); // Toggle the sorting order

    setAllStudents((prevAllStudents) => {
      const classStudents = prevAllStudents.filter(
        (student) => student.classId === singleClass._id
      );

      const sortedStudents = classStudents.sort((a, b) => {
        // Sorting logic based on the grade letter
        if (name === "studentName") {
          return sorted
            ? a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            : b.name.toLowerCase().localeCompare(a.name.toLowerCase());
        } else if (name === "finalMark") {
          return sorted ? a.finalMark - b.finalMark : b.finalMark - a.finalMark;
        } else {
          const aGrade = a.grades.find((grade) => grade.letter === name);
          const bGrade = b.grades.find((grade) => grade.letter === name);

          if (aGrade && bGrade) {
            if (aGrade.mark === bGrade.mark) {
              // Stable sorting when grade letter and mark are the same
              return classStudents.indexOf(a) - classStudents.indexOf(b);
            }
            return sorted
              ? aGrade.mark - bGrade.mark
              : bGrade.mark - aGrade.mark;
          }
          return 0;
        }
      });

      // Replace the students with sorted students specific to the class ID
      return prevAllStudents.map((student) =>
        student.classId === singleClass._id
          ? sortedStudents.shift() // Pop the sorted student for the specific class
          : student
      );
    });
  };

  if (loading || !fullData || !fullData.students || !fullData.classes) {
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
          {fullData.classes.map((singleClass, i) => (
            <div key={i}>
              <button
                onClick={() => {
                  setViewingTable(i);
                  setSorted(false);
                  setStudentQuery((prevQuery) => {
                    return (prevQuery = "");
                  });
                }}
                style={{
                  border: "none",
                  backgroundColor: "#555",
                  padding: "4px 10px",
                  color: "#ffffff",
                  borderRadius: 5,
                }}
              >
                {singleClass.title}
              </button>
              {i === fullData.classes.length - 1 && (
                <button
                  style={{
                    marginLeft: 15,
                    border: "none",
                    backgroundColor: "#555",
                    padding: "4px 10px",
                    color: "#ffffff",
                    borderRadius: 5,
                  }}
                  onClick={() => {
                    history.push("/add-classes");
                  }}
                >
                  Add Class +
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div>{fullData.classes.map(renderTable)}</div>
    </div>
  );
};

export default Classes;
