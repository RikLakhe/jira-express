import React from "react";
import axios from "axios";
import moment from "moment";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  TextField,
} from "@mui/material";

const Main = (props) => {
  const [startDate, setStartDate] = React.useState(
    moment().subtract(30, "days").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = React.useState(moment().format("YYYY-MM-DD"));
  const [selectedProject, setSelectedProject] = React.useState(undefined);
  const [projectList, setProjectList] = React.useState([]);

  const [result, setResult] = React.useState(undefined);

  const [error, setError] = React.useState(undefined);
  const [loading, setLoading] = React.useState(false);

  // const handleProjectSelect = (value) => {
  //   setSelectedBoard(undefined);
  //   setResult(undefined);
  //   setLoading(true);
  //   axios
  //     .post("https://jira-express-app.herokuapp.com/v3/boards", {
  //       projectKeyOrId: value,
  //     })
  //     .then((res) => {
  //       if (res && res.status === 200) {
  //         setBoardList(res.data.values);
  //         setLoading(false);
  //       }
  //     })
  //     .catch((err) => {
  //       setError(err);
  //       setLoading(false);
  //     });
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    setResult(undefined);
    setLoading(true);
    axios
      .post("https://jira-express-app.herokuapp.com/v4", {
        startDate,
        endDate,
        projectKey: selectedProject,
      })
      .then((res) => {
        if (res && res.status === 200) {
          setResult(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    setLoading(true);
    axios
      .get("https://jira-express-app.herokuapp.com/v3/projects")
      .then((res) => {
        if (res && res.status === 200) {
          setProjectList(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [true]);

  return (
    <>
      {projectList && projectList.length > 0 && (
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel htmlFor="project">Project</InputLabel>
          <Select
            id="project"
            aria-describedby="my-helper-project"
            onChange={(e) => handleProjectSelect(e.target.value)}
          >
            {projectList.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText id="my-helper-project">
            Select Project.
          </FormHelperText>
        </FormControl>
      )}

      {/* {boardList && boardList.length > 0 && (
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel htmlFor="board">Board</InputLabel>
          <Select
            id="board"
            aria-describedby="my-helper-board"
            onChange={(e) => setSelectedBoard(e.target.value)}
          >
            {boardList.map((board) => (
              <MenuItem key={board.id} value={board.id}>
                {board.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText id="my-helper-project">Select Board.</FormHelperText>
        </FormControl>
      )} */}

      {/* {selectedBoard && [ */}
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <TextField
            id="startDate"
            label="Start Date"
            type="date"
            defaultValue={moment().subtract(30, "days").format("YYYY-MM-DD")}
            sx={{ width: 220 }}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </FormControl>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <TextField
            id="endDate"
            label="End Date"
            type="date"
            defaultValue={moment().format("YYYY-MM-DD")}
            sx={{ width: 220 }}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </FormControl>
      {/* ]} */}

      {selectedProject && startDate && endDate && (
        <Button
          style={{ margin: "10px" }}
          variant="contained"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      )}

        {
          loading 
          ? (<h3>Loading....</h3>)
          : result 
            ? (
            <p>
              <h3>Total SP:{result.totalSP}</h3>
              <br />
              <h3>Total Scope Change:{result.totalSChange}</h3>
              <br />
              <h3>Total Scope Creep:{result.totalSCreep}</h3>
              <br />
              <h3>Total Issues:{result?.issues?.length}</h3>
              <br />
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
          )
        : (<h3>No jira issues</h3>)}
    </>
  );
};

export default Main;
