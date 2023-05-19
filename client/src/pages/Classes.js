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

  // TODO Add the download pdf functionality
  //      TODO Export a single PDF of the entire table
  //      TODO Export a report for a single student
  //      TODO The download pdf button is really close to the project title if the table is small

  // TODO RE-DO THE ENTIRE TABLE WIDTH PROPERTIES FOR EACH COLUMN
  // TODO Horizontal spacing needs to be refined, also the table columns need to be adjusted
  //      TODO Student names should always be long enough
  // TODO Create a local storage function that saves the borderWidth size and extracts it
  //      TODO Not worth pushing this data to database

  // TODO Fixed the position of the decimal button? Make the whole cell touchable
  const [borderWidth, setBorderWIdth] = useState(1);
  const [horizontalPadding, setHorizontalPadding] = useState(5);
  const [verticalPadding, setVerticalPadding] = useState(5);
  const [selectedFontSize, setSelectedFontSize] = useState(15);

  let tableProperties = {
    defaultColor: "#333",
    padding: `${verticalPadding}px ${horizontalPadding}px`,
    border: `${borderWidth}px solid #333`,
    final: {
      top: "rgba(255, 255, 0, 0.2)",
      topDark: "rgba(255, 255, 0, 0.35)",
      passing: "rgba(255, 255, 255, 0.2)",
      passingDark: "rgba(255, 255, 255, 0.35)",
      failing: "rgba(255, 0, 0, 0.2)",
      failingDark: "rgba(255, 0, 0, 0.35)",
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
    document.title = "Hershy - Your Classes";
  }, []);

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

  // TODO Add pagination if number of students exceeds 10 (Also add the options to view all students (without pagination))
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
        // 4 is to account for the 2 empty spaces on the left and right of the row
        // as well as the 2 items on the left, the delete and mail icon
        colSpan={4 + classesColSpan}
        style={{
          backgroundColor: tableProperties.defaultColor,
          border: `${borderWidth}px solid #333`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "5px 8px",
          }}
        >
          <p
            style={{ margin: 0, fontSize: parseInt(selectedFontSize) + 5 }}
          >{`${singleClass.title} - ${singleClass.schoolYear}`}</p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              userSelect: "none",
            }}
            className="downloadBtn"
          >
            <p style={{ margin: 0, fontSize: 14 }}>Download report</p>
            <img
              alt="download pdf button"
              style={{
                width: 18,
                height: 18,
                filter: "invert(100%)",
              }}
              src="/pdf.png"
            ></img>
          </div>
        </div>
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
            color: tableProperties.defaultColor,
            padding: tableProperties.padding,
            fontSize: parseInt(selectedFontSize) + 3,
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
              color: tableProperties.defaultColor,
              padding: tableProperties.padding,
              fontSize: parseInt(selectedFontSize) + 2,
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
                padding: tableProperties.padding,
                fontSize: parseInt(selectedFontSize),
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
                  position: "relative",
                }}
              >
                <p
                  className="gradeLetter"
                  style={{ position: "relative", margin: 0 }}
                >
                  <p className="criteriaHead" style={{ margin: 0 }}>
                    {criteria.letter}
                    {sorted && sortedBy === criteria.letter
                      ? `\u2191`
                      : !sorted && sortedBy === criteria.letter
                      ? `\u2193`
                      : ""}{" "}
                  </p>
                  <span
                    className="gradeWeight"
                    style={{
                      pointerEvents: "none",
                      fontSize: parseInt(selectedFontSize),
                    }}
                  >
                    <span>Weight {criteria.weight}%</span>
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
        style={{
          display: viewingTable === i ? "unset" : "none",
        }}
      >
        <thead>
          <tr>{allClasses}</tr>
          <tr>
            <th
              colSpan={3}
              style={{
                backgroundColor: tableProperties.defaultColor,
                border: tableProperties.border,
              }}
            ></th>
            {allUnits}
            <th
              style={{
                backgroundColor: tableProperties.defaultColor,
                border: tableProperties.border,
              }}
            ></th>
          </tr>
          <tr style={{ margin: 0, textAlign: "center" }}>
            <th
              colSpan={3}
              style={{
                backgroundColor: tableProperties.defaultColor,
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
                  width: "100%",
                  height: "100%",
                  paddingLeft: 5,
                  border: "none",
                  color: "white",
                  backgroundColor: "#777",
                  fontSize: parseInt(selectedFontSize),
                }}
                placeholder="Search student"
              ></input>
            </th>
            {projects}
            <th
              style={{
                backgroundColor: tableProperties.defaultColor,
                border: tableProperties.border,
              }}
            >
              <button
                className="decimalBtn"
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                  color: "#ffffff",
                }}
                onClick={() => setDecimal(!decimal)}
              >
                {!decimal ? (
                  <h5
                    style={{
                      fontSize: parseInt(selectedFontSize),
                      margin: 0,
                      alignSelf: "center",
                    }}
                  >
                    00
                  </h5>
                ) : (
                  <h5
                    style={{ fontSize: parseInt(selectedFontSize), margin: 0 }}
                  >
                    0
                  </h5>
                )}
              </button>
            </th>
          </tr>
          <tr style={{ margin: 0, textAlign: "center" }}>
            <th
              colSpan={2}
              style={{
                backgroundColor: tableProperties.defaultColor,
                border: tableProperties.border,
              }}
            ></th>
            <th
              style={{
                width: 100,
                backgroundColor: tableProperties.defaultColor,
                border: tableProperties.border,
                color: "#FFFFFF",
                textTransform: "uppercase",
                cursor: "pointer",
                userSelect: "none",
                fontSize: parseInt(selectedFontSize),
              }}
              onClick={() => handleSort("studentName", singleClass)}
            >
              <p className="studentHead" style={{ margin: 0 }}>
                {" "}
                Students
                {sorted && sortedBy === "studentName"
                  ? `\u2191`
                  : !sorted && sortedBy === "studentName"
                  ? `\u2193`
                  : ""}{" "}
              </p>
            </th>

            {criteriaLabels}
            <th
              style={{
                backgroundColor: tableProperties.defaultColor,
                border: tableProperties.border,
                color: "#FFFFFF",
                textTransform: "uppercase",
                cursor: "pointer",
                userSelect: "none",
                fontSize: parseInt(selectedFontSize),
                padding: "2px 5px",
              }}
              onClick={() => handleSort("finalMark", singleClass)}
            >
              <p className="finalHead" style={{ margin: 0 }}>
                {" "}
                Final
                {sorted && sortedBy === "finalMark"
                  ? `\u2191`
                  : !sorted && sortedBy === "finalMark"
                  ? `\u2193`
                  : ""}{" "}
              </p>
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
            .map((student, i) => (
              <React.Fragment key={student._id}>
                {renderTableBodyGrades(student, singleClass, i)}
              </React.Fragment>
            ))}
          {/* // ? Render the initial empty row first */}
          {renderTableBodyBlank(singleClass, i)}
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
  const renderTableBodyBlank = (singleClass, i) => {
    const rowData = [];

    // ? This is the Add student function which renders a new row (pushes to studentRows) */
    rowData.push(
      <td
        key={i}
        colSpan={2}
        style={{
          width: 50,
          cursor: "pointer",
          fontSize: parseInt(selectedFontSize),
          // backgroundColor: tableProperties.final.failing,
          border: tableProperties.border,
          position: "relative",
          padding: tableProperties.padding,
        }}
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
        <img
          alt="add student button"
          style={{ width: 15, height: 15 }}
          src="/add.png"
        ></img>
      </td>
    );

    // ? Render this first (this is the student name column)
    rowData.push(
      <td
        key={i + 1}
        style={{
          fontSize: parseInt(selectedFontSize),
          borderBottom: `${borderWidth}px solid #333`,
          borderTop: `${borderWidth}px solid #333`,
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
            fontSize: parseInt(selectedFontSize),
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
                width: "100%",
                position: "absolute",
                bottom: "50%",
                right: "50%",
                transform: "translateX(50%) translateY(50%)",
                color: "red",
                fontSize: parseInt(selectedFontSize) - 2,
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
                borderBottom: `${borderWidth}px solid #333`,
                borderTop: `${borderWidth}px solid #333`,
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
                  fontSize: parseInt(selectedFontSize) - 1,
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
        key={i + 2}
        style={{
          borderBottom: `${borderWidth}px solid #333`,
          borderTop: `${borderWidth}px solid #333`,
          borderRight: `${borderWidth}px solid #333`,
          width: 100,
          fontSize: parseInt(selectedFontSize),
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

  const renderTableBodyGrades = (student, singleClass, index) => {
    const isEvenRow = index % 2 === 0;

    const rowData = [];

    rowData.push(
      <th
        className="deleteBtn"
        style={{
          width: "5%",
          padding: "5px 8px",
          border: tableProperties.border,
          color: "#FFFFFF",
          textTransform: "uppercase",
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={() => {
          handleDeleteStudent(student._id);
        }}
      >
        <img
          className="deleteStudent"
          alt="delete student button"
          style={{
            width: 14,
            height: 14,
          }}
          src="/delete.png"
        ></img>
      </th>
    );

    rowData.push(
      <th
        className="pdfBtn"
        style={{
          width: "5%",
          padding: "5px 8px",
          border: tableProperties.border,
          color: "#FFFFFF",
          textTransform: "uppercase",
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={() => {}}
      >
        <img
          alt="download pdf button"
          style={{
            width: parseInt(selectedFontSize) + 8,
            height: parseInt(selectedFontSize) + 8,
          }}
          src="/pdf.png"
        ></img>
      </th>
    );

    // ? Render this first (this is the student name column)
    rowData.push(
      <td
        key={student.name}
        style={{
          position: "relative",
          fontSize: parseInt(selectedFontSize),
          borderBottom: `${borderWidth}px solid #333`,
          borderTop: `${borderWidth}px solid #333`,
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
                backgroundColor:
                  grade.mark < 50
                    ? isEvenRow
                      ? tableProperties.final.failingDark
                      : tableProperties.final.failing
                    : grade.mark > 80
                    ? isEvenRow
                      ? tableProperties.final.topDark
                      : tableProperties.final.top
                    : singleUnit.themeColor,
                borderBottom: `${borderWidth}px solid #333`,
                borderTop: `${borderWidth}px solid #333`,
                width: "5%",
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
                  fontSize: parseInt(selectedFontSize) - 1,
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
          borderBottom: `${borderWidth}px solid #333`,
          borderTop: `${borderWidth}px solid #333`,
          borderRight: `${borderWidth}px solid #333`,
          backgroundColor:
            grades === null || grades.length === 0
              ? ""
              : calculateAverage(grades, singleClass) < 50
              ? isEvenRow
                ? tableProperties.final.failingDark
                : tableProperties.final.failing
              : calculateAverage(grades, singleClass) > 80
              ? isEvenRow
                ? tableProperties.final.topDark
                : tableProperties.final.top
              : "",
          padding: tableProperties.padding,
          fontSize: parseInt(selectedFontSize),
        }}
      >
        {grades === null || grades.length === 0
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

  const [studentQuery, setStudentQuery] = useState("");
  const [sorted, setSorted] = useState(true);
  const [sortedBy, setSortedBy] = useState("");
  const handleSort = (name, singleClass) => {
    setSorted((prevSorted) => !prevSorted); // Toggle the sorting order
    setSortedBy(name);

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
        className="container mt-5"
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
      className="container mt-5"
    >
      <div>
        {fullData.classes.length !== 0 && (
          <div>
            <h4 style={{ textAlign: "center" }}>Your Classes</h4>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "10px 0",
                }}
              >
                <p style={{ margin: 0, fontSize: 15 }}>Adjust border</p>
                <input
                  style={{ cursor: "pointer" }}
                  onChange={(e) => {
                    setBorderWIdth(e.target.value);
                  }}
                  type="range"
                  min="0"
                  step={0.5}
                  max="3"
                  value={borderWidth}
                ></input>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "10px 0",
                }}
              >
                <p style={{ margin: 0, fontSize: 15 }}>Horizontal spacing</p>
                <input
                  style={{ cursor: "pointer" }}
                  onChange={(e) => {
                    setHorizontalPadding(e.target.value);
                  }}
                  type="range"
                  min="5"
                  step={1}
                  max="15"
                  value={horizontalPadding}
                ></input>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "10px 0",
                }}
              >
                <p style={{ margin: 0, fontSize: 15 }}>Vertical spacing</p>
                <input
                  style={{ cursor: "pointer" }}
                  onChange={(e) => {
                    setVerticalPadding(e.target.value);
                  }}
                  type="range"
                  min="3"
                  step={1}
                  max="9"
                  value={verticalPadding}
                ></input>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "10px 0",
                }}
              >
                <p style={{ margin: 0, fontSize: 15 }}>Font size</p>
                <input
                  style={{ cursor: "pointer" }}
                  onChange={(e) => {
                    setSelectedFontSize(e.target.value);
                  }}
                  type="range"
                  min="13"
                  step={1}
                  max="16"
                  value={selectedFontSize}
                ></input>
              </div>
            </div>
          </div>
        )}
        {fullData.classes.length === 0 && (
          <div
            style={{
              gap: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h5 style={{ margin: 0 }}>No Classes add yet</h5>
            <button
              style={{
                marginLeft: 5,
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
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 15,
            margin: "10px 0",
          }}
        >
          {fullData.classes.map((singleClass, i) => {
            return (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
                key={i}
              >
                <p
                  className="classTitleBtn"
                  onClick={() => {
                    setViewingTable(i);
                    setSorted(false);
                    setSortedBy("");
                    setStudentQuery((prevQuery) => {
                      return (prevQuery = "");
                    });
                  }}
                  style={{
                    fontSize: 16,
                    cursor: "pointer",
                    userSelect: "none",
                    borderBottom:
                      viewingTable === i
                        ? "2px solid rgba(1,75,255,0.5)"
                        : "2px solid transparent",
                    color:
                      viewingTable === i
                        ? "rgba(1,75,255,0.8)"
                        : tableProperties.defaultColor,
                  }}
                >
                  {singleClass.title}
                </p>
                {i === fullData.classes.length - 1 && (
                  <p
                    className="addClassBtn"
                    style={{
                      cursor: "pointer",
                      userSelect: "none",
                      marginLeft: 15,
                      border: "none",
                      backgroundColor: "#555",
                      padding: "5px 10px",
                      color: "#ffffff",
                      borderRadius: 5,
                      fontSize: 14,
                    }}
                    onClick={() => {
                      history.push("/add-classes");
                    }}
                  >
                    Add Class +
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ boxShadow: "0 0 5px 1px rgba(0,0,0,0.2)" }}>
        {fullData.classes.map(renderTable)}
      </div>
    </div>
  );
};

export default Classes;
