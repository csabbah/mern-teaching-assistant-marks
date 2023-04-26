import React, { useState, useEffect } from "react";

const Marks = () => {
  // TODO Add the edit function for criterias, projects and units (use contentEditable)
  // TODO Revamp CSS (use bootstrap?)
  // ?------?------?------?------?------?------?------?------?------?------?------?------?------
  // TODO Update Model
  // TODO Add the ability to post to DB
  // TODO Add the ability to edit/delete the data after it's been posted to DB

  const [unitTitle, setUnitTitle] = useState("");
  const colors = [
    "rgba(255,255,255,0.5)", // white
    "rgba(173,216,230,0.5)", // Light Blue
    "rgba(255,192,203,0.5)", // Light Pink
    "rgba(255,215,0,0.5)", // Gold
    "rgba(255,165,0,0.5)", // Orange
    "rgba(144,238,144,0.5)", // Light Green
  ];

  const [unitThemeColor, setUnitThemeColor] = useState(colors[0]);
  const [units, setUnits] = useState([]);

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

  useEffect(() => {
    if (singleProject.criterias.length > 0) {
      setProjects((prevProjects) => [...prevProjects, singleProject]);
      setSingleProject({ title: "", criterias: [] });
    }
  }, [singleProject]);

  let tableProperties = { border: "1px solid #333" };

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
        {console.log(allCriterias.length)}
        {/* ------------ ----------- ---------- // ? ADDING CRITERIA'S */}
        {singleProject.title && (
          <section className="add-criteria">
            <h5>Add the criteria's for {singleProject.title}</h5>
            <div style={{ display: "flex", gap: 15, alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ margin: 0 }} htmlFor="Label">
                  Label
                </label>
                {/* <input
                id="Label"
                onChange={(e) => {
                  setSingleCriteria({
                    ...singleCriteria,
                    label: e.target.value.trim(),
                  });
                }}
                placeholder="Knowledge"
                value={singleCriteria.label}
              ></input> */}
                <select
                  id="Label"
                  value={singleCriteria.label}
                  onChange={(e) => {
                    setSingleCriteria({
                      ...singleCriteria,
                      label: e.target.value.trim(),
                    });
                  }}
                  style={{ height: 30 }}
                >
                  <option value="">Select criteria</option>
                  <option value="Knowledge">Knowledge and Understanding</option>
                  {/* K/U */}
                  <option value="Communication">Communication</option>
                  <option value="Application">Application</option>
                  {/* A */}
                  <option value="Thinking">Thinking and Inquiry</option>
                  {/* T/I */}
                </select>
              </div>
              {/* // TODO By default simply uses the first letter of each criteria */}
              {/* <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ margin: 0 }} htmlFor="Letter">
                  Letter
                </label>
                <input
                  style={{ width: 50, height: 30 }}
                  id="Letter"
                  onChange={(e) => {
                    setSingleCriteria({
                      ...singleCriteria,
                      letter: e.target.value,
                    });
                  }}
                  placeholder="K"
                  value={singleCriteria.letter}
                ></input>
              </div> */}
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
                      backgroundColor: "rgba(0,0,0,0.15)",
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
                {colors.map((color, i) => {
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
                setUnitThemeColor(colors[0]);
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
            <button onClick={() => {}}>Generate Table</button>
          </section>
        )}
        {/* ------------ ----------- ---------- // ? GENERATED TABLE */}
        <div className="main-table">
          {/* <input placeholder="Search Student"></input> */}
          {/* // ? 'table' makes the table responsive */}
          <table
            class="table table-hover"
            style={{ border: "1px solid rgba(0,0,0,0.2)" }}
          >
            <thead>
              <tr>
                {/* // TODO Render this for the student names*/}
                <th
                  style={{ backgroundColor: "#333", border: "1px solid #333" }}
                ></th>
                {/* // TODO ColsPan should equal length of projects */}
                <th
                  colSPan="6"
                  style={{
                    backgroundColor: "#333",
                    border: tableProperties.border,
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 18,
                      letterSpacing: 5,
                      textTransform: "uppercase",
                      color: "#FFFFFF",
                    }}
                  >
                    Biology
                  </p>
                </th>
                <th
                  style={{
                    backgroundColor: "#333",
                    border: tableProperties.border,
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 18,
                      letterSpacing: 5,
                      textTransform: "uppercase",
                      color: "#FFFFFF",
                    }}
                  >
                    Science
                  </p>
                </th>
                {/* // TODO The last column to render final marks */}
                <th
                  style={{
                    backgroundColor: "#333",
                    border: tableProperties.border,
                  }}
                ></th>
              </tr>
              {/* // TODO ColsPan should equal the length of criterias */}
              <tr style={{ margin: 0, textAlign: "center" }}>
                <th
                  style={{ backgroundColor: "#333", border: "1px solid #333" }}
                ></th>
                <th
                  colsPan="3"
                  style={{
                    backgroundColor: colors[1],
                    border: tableProperties.border,
                  }}
                >
                  Project 1
                </th>
                <th
                  colsPan="2"
                  style={{
                    backgroundColor: colors[1],
                    border: tableProperties.border,
                  }}
                >
                  <p style={{ margin: 0 }}>Theory Paper</p>
                </th>
                <th
                  style={{
                    backgroundColor: colors[1],
                    border: tableProperties.border,
                  }}
                >
                  Project 2
                </th>

                <th
                  style={{
                    border: tableProperties.border,
                    backgroundColor: colors[5],
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
                    backgroundColor: colors[1],
                    border: tableProperties.border,
                  }}
                >
                  K
                </th>
                <th
                  style={{
                    backgroundColor: colors[1],
                    border: tableProperties.border,
                  }}
                >
                  A
                </th>
                <th
                  style={{
                    backgroundColor: colors[1],
                    border: tableProperties.border,
                  }}
                >
                  C
                </th>
                {/* // TODO On the last length, we render this borderLeft block */}
                <th
                  style={{
                    backgroundColor: colors[1],
                    border: tableProperties.border,
                  }}
                >
                  A
                </th>
                <th
                  style={{
                    backgroundColor: colors[1],
                    border: tableProperties.border,
                  }}
                >
                  C
                </th>
                <th
                  style={{
                    backgroundColor: colors[1],
                    border: tableProperties.border,
                  }}
                >
                  C
                </th>
                <th
                  style={{
                    backgroundColor: colors[5],
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
                    backgroundColor: "rgba(255, 255,0,0.4)",
                    border: tableProperties.border,
                  }}
                >
                  Carlos
                </td>
                <td
                  style={{
                    backgroundColor: colors[1],
                    border: tableProperties.border,
                  }}
                >
                  30%
                </td>
                <td
                  style={{
                    backgroundColor: colors[1],
                    border: tableProperties.border,
                  }}
                >
                  90%
                </td>
                <td
                  style={{
                    backgroundColor: colors[1],
                    border: tableProperties.border,
                  }}
                >
                  50%
                </td>
                <td
                  style={{
                    backgroundColor: colors[1],
                    border: tableProperties.border,
                  }}
                >
                  30%
                </td>
                <td
                  style={{
                    backgroundColor: colors[1],
                    border: tableProperties.border,
                  }}
                >
                  50%
                </td>
                <td
                  style={{
                    backgroundColor: colors[1],
                    border: tableProperties.border,
                  }}
                >
                  30%
                </td>
                <td
                  style={{
                    backgroundColor: colors[5],
                    border: tableProperties.border,
                  }}
                >
                  90%
                </td>
                {/* // TODO If a student's final mark grade is below 50%, add this class  */}
                <td
                  style={{
                    border: tableProperties.border,
                    backgroundColor: "rgba(255,0,0,0.2)",
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
