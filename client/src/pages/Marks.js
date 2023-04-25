import React, { useState, useEffect } from "react";

const Marks = () => {
  // TODO Add the edit function for criterias, projects and units (use contentEditable)
  // TODO Revamp CSS (use bootstrap?)
  // ?------?------?------?------?------?------?------?------?------?------?------?------?------
  // TODO Update Model
  // TODO Add the ability to post to DB
  // TODO Add the ability to edit/delete the data after it's been posted to DB

  const [unitTitle, setUnitTitle] = useState("");
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
          <h5>Add unit title</h5>
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
            <h5>Add a project title</h5>
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
            <div>
              <label htmlFor="Label">Label</label>
              <input
                id="Label"
                onChange={(e) => {
                  setSingleCriteria({
                    ...singleCriteria,
                    label: e.target.value.trim(),
                  });
                }}
                placeholder="Knowledge"
                value={singleCriteria.label}
              ></input>
              <label htmlFor="Letter">Letter</label>
              <input
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
            </div>
            <div>
              <label htmlFor="Weight">Weight</label>
              <input
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
            <button
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
        {/* ------------ ----------- ---------- // ? PREVIEWING/EDITING CRITERIA'S */}
        {allCriterias.length >= 1 && (
          <section className="preview-criteria">
            <h5>The criteria's for {singleProject.title}</h5>
            {allCriterias.length > 0 &&
              allCriterias.map((criteria, i) => {
                return (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <p>{criteria.label}</p>
                    <p>({criteria.letter})</p>
                    <p>{criteria.percentage}%</p>
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
          </section>
        )}
        {/* ------------ ----------- ---------- // ? ADDING PROJECT */}
        {allCriterias.length >= 1 && (
          <section className="add-project">
            <h5>
              Add {singleProject.title} to {unitTitle}
            </h5>
            <button
              onClick={() => {
                if (allCriterias.length < 1) {
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
        {/* ------------ ----------- ---------- // ? PREVIEWING/EDITING PROJECTS */}
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
                      <p style={{ margin: 0, fontSize: 18 }}>
                        Project #{i + 1}: {project.title}
                      </p>
                    </div>
                    {project.criterias.map((criteria, i) => {
                      return (
                        <p style={{ margin: 0, fontSize: 14 }}>
                          Criteria #{i + 1}: {criteria.label}({criteria.letter}){" "}
                          {criteria.percentage}%
                        </p>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </section>
        )}
        {/* ------------ ----------- ---------- // ? ADDING UNIT */}
        {projects.length >= 1 && (
          <section className="adding-unit">
            <h5>Add Unit</h5>
            <button
              onClick={() => {
                if (projects.length < 1) {
                  // TODO UPDATE DISPLAY ERR HERE
                  return;
                }

                setUnits((prevUnits) => [
                  ...prevUnits,
                  {
                    title: unitTitle,
                    projects: projects,
                  },
                ]);
                setProjects([]);
                setUnitTitle("");
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
          </section>
        )}
        {units.length >= 1 && (
          <section className="generate-table">
            <h5>Generate Table</h5>
            <button
              onClick={() => {
                if (projects.length < 1) {
                  // TODO UPDATE DISPLAY ERR HERE
                  return;
                }

                setUnits((prevUnits) => [
                  ...prevUnits,
                  {
                    title: unitTitle,
                    projects: projects,
                  },
                ]);
                setProjects([]);
                setUnitTitle("");
              }}
            >
              Generate Table
            </button>
          </section>
        )}
        {/* <div className="main-table">
          <p
            style={{
              textAlign: "center",
              fontSize: 20,
              backgroundColor: "rgba(0,0,0,0.2)",
            }}
          >
            Unit 1
          </p>
          <div style={{ background: "rgba(0,0,0,0.1)" }}>
            <p>Test 1</p>
            <div style={{ display: "flex", gap: 15 }}>
              <p>Criteria #1 (K)</p>
              <p>Criteria #2 (P)</p>
              <p>Criteria #3 (C)</p>
            </div>
          </div>
          <div className="student-names">
            <p>Student Name</p>
            <p>Student Name</p>
            <p>Student Name</p>
            <p>Student Name</p>
            <p>Student Name</p>
            <p>Student Name</p>
            <p>Student Name</p>
            <p>Student Name</p>
            <p>Student Name</p>
            <p>Student Name</p>
          </div>
        </div> */}
      </form>
    </div>
  );
};

export default Marks;
