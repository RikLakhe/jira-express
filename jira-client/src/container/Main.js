import axios from "axios";
import React from "react";

const Main = (props) => {
  const [startDate, setStartDate] = React.useState(undefined);
  const [endDate, setEndDate] = React.useState(undefined);
  const [selectedProject, setSelectedProject] = React.useState(undefined);
  const [selectedBoard, setSelectedBoard] = React.useState(undefined);
  const [projectList, setProjectList] = React.useState([]);
  const [boardList, setBoardList] = React.useState([]);

  const [result, setResult] = React.useState(undefined);

  const [error, setError] = React.useState(undefined);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(process.env.REACT_APP_API_URL + "/v3/issues", {
        startDate,
        endDate,
        boardId: selectedBoard,
      })
      .then((res) => {
        if (res && res.status === 200) {
          setResult(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleProjectSelect = (value) => {
    setSelectedProject(value);
    axios
      .post(process.env.REACT_APP_API_URL + "/v3/boards", {
        projectKeyOrId: value,
      })
      .then((res) => {
        if (res && res.status === 200) {
          setBoardList(res.data.values);
        }
      })
      .catch((err) => {
        setError(err);
      });
  };

  React.useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL + "/v3/projects")
      .then((res) => {
        if (res && res.status === 200) {
          setProjectList(res.data);
        }
      })
      .catch((err) => {
        setError(err);
      });
  }, [true]);

  return (
    <>
      <form>
        {projectList && projectList.length > 0 && (
          <select
            placeholder="Project"
            onChange={(e) => handleProjectSelect(e.target.value)}
          >
              <option value="">Select a project</option>
            {projectList.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        )}

        {boardList && boardList.length > 0 && (
          <>
            <select
              placeholder="Board"
              onChange={(e) => setSelectedBoard(e.target.value)}
            >
                <option value="">Select a board</option>
              {boardList.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.name}
                </option>
              ))}
            </select>
            <br />
            <input
              type="date"
              placeholder="Start Date"
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              placeholder="End Date"
              onChange={(e) => setEndDate(e.target.value)}
            />
            <br />
          </>
        )}

        {selectedBoard && startDate && endDate && (
          <button onClick={handleSubmit}>Submit</button>
        )}
      </form>

      {result && (
        <p>
          <h3>Total SP:{result.totalSP}</h3><br />
          <h3>Total Issues:{result?.issues?.length}</h3><br />
          {result?.issues && result?.issues?.length > 0 && (
            <>
              <h5>List :</h5>
              <ul>
                {result.issues.map((issue) => (
                  <li key={issue.id}>{issue.key}</li>
                ))}
              </ul>
            </>
          )}
        </p>
      )}
    </>
  );
};

export default Main;
