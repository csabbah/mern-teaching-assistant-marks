import React from "react";

const Students = () => {
  return (
    <div>
      Students
      <p>
        Make this information viewable inside a table with filter methods
        included. Some filter methods include:{" "}
        <span style={{ fontWeight: "bold" }}>
          By Grade, Name, Missing Projects, Classes they are in
        </span>
      </p>
      <div>
        <p style={{ margin: 0 }}>Carlos</p>
        <p style={{ margin: 0 }}>Classes they are in: Science and Biology</p>
        <p style={{ margin: 0 }}>
          Averages: 40% Science / 0% (Missing projects) Biology
        </p>
        <button>Send Report</button>
        <button>Add project</button>
        <p>
          If add project is clicked, a modal appears asking which class to add
          project to as well as the grades per weight, afterwhich, a new modal
          appears 'Added Test 1 to Biology', don't leave page after project is
          added
        </p>
        <p style={{ margin: 0 }}>Jessica</p>
        <p style={{ margin: 0 }}>Classes they are in: Science</p>
        <p style={{ margin: 0 }}>Averages: 90% Science</p>
        <button>Send Report</button>
        <button>Add project</button>
        <p>
          If add project is clicked, a modal appears asking which class to add
          project to as well as the grades per weight, afterwhich, a new modal
          appears 'Added Test 1 to Biology', don't leave page after project is
          added
        </p>
      </div>
    </div>
  );
};

export default Students;
