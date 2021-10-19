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
  Grid,
  Card,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Line } from "react-chartjs-2";

import { API_URL } from "../constant/appConfig";
import { isEmpty } from "../util/commonUtil";

import "./index.css";

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

  const [lineData, setLineData] = React.useState({});

  const [sprintList, setSprintList] = React.useState([]);

  const handleProjectSelect = (value) => {
    setSelectedProject(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setResult(undefined);
    setLineData({});
    setLoading(true);
    axios
      .post(API_URL + "/v4/search", {
        startDate,
        endDate,
        projectKey: selectedProject,
      })
      .then((res) => {
        if (res && res.status === 200) {
          setResult(res.data);

          let tempLineData = {
            labels: [],
            datasets: [
              {
                label: "Total Story Point",
                data: [],
                fill: false,
                borderColor: "rgba(75,192,192,1)",
                tension: 0.1,
              },
              {
                label: "Total Scope Change",
                data: [],
                fill: false,
                borderColor: "#742774",
                tension: 0.1,
              },
              {
                label: "Total Scope Creep",
                data: [],
                fill: false,
                borderColor: "#712324",
                tension: 0.1,
              },
            ],
          };

          if (!isEmpty(res.data.sprint)) {
            console.log("res.data.sprint", res.data.sprint);
            if (Object.entries(res.data.sprint).length === 1) {
              tempLineData = {
                labels: [moment(startDate).format("MMM DD")],
                datasets: [
                  {
                    label: "Total Story Point",
                    data: [0],
                    fill: false,
                    borderColor: "rgba(75,192,192,1)",
                    tension: 0.1,
                  },
                  {
                    label: "Total Scope Change",
                    data: [0],
                    fill: false,
                    borderColor: "#742774",
                    tension: 0.1,
                  },
                  {
                    label: "Total Scope Creep",
                    data: [0],
                    fill: false,
                    borderColor: "#712324",
                    tension: 0.1,
                  },
                ],
              };
            }

            let tempSprintList = [];

            Object.entries(res.data.sprint).forEach(async ([key, value]) => {
              tempLineData.labels.push(value.name);
              tempLineData.datasets[0].data.push(value.totalStoryPoint);
              tempLineData.datasets[1].data.push(value.scopeChange);
              tempLineData.datasets[2].data.push(value.scopeCreep);
              tempSprintList.push(value);
            });

            setSprintList(tempSprintList);
            setLineData(tempLineData);
          }

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
      .get(API_URL + "/v3/projects")
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

      {selectedProject && startDate && endDate && (
        <Button
          style={{ margin: "10px" }}
          variant="contained"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      )}

      <Grid container spacing={3}>
        {loading ? (
          <Grid item xs={12}>
            <h3>Loading....</h3>
          </Grid>
        ) : result ? (
          <>
            <Grid item xs={6}>
              <h3>Total SP:{result.totalSP}</h3>
              <h3>Total Scope Change:{result.totalSChange}</h3>
              <h3>Total Scope Creep:{result.totalSCreep}</h3>
              <Card variant="outlined">
                {lineData && (
                  <div className="chart-div">
                    <Line data={lineData} />
                  </div>
                )}
              </Card>
            </Grid>
            <Grid item xs={6}>
              <SprintReport sprintList={sprintList} />
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <h3>No jira issues</h3>
          </Grid>
        )}
      </Grid>
    </>
  );
};

const SprintReport = (props) => {
  const [expanded, setExpanded] = React.useState(false);
  const [sprintLoading, setSprintLoading] = React.useState(false);
  const [sprintData, setSprintData] = React.useState(undefined);
  const { sprintList } = props;

  if (sprintList && sprintList.length < 0) {
    return <Card variant="outlined">No sprint data</Card>;
  }

  const handleSprintSelect = (sprint) => async (event, isExpanded) => {
    setSprintLoading(true);
    setSprintData(undefined);
    setExpanded(sprint.name);

    await axios
      .post(API_URL + "/v4/sprints", {
        boardId: sprint.boardId,
        spintId: sprint.id,
      })
      .then((res) => {
        if (res && res.status === 200) {
          console.log("here", res.data);
          setSprintData(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    setSprintLoading(false);
  };

  return (
    <>
      {sprintList.map((sprint, index) => (
        <Accordion
          expanded={expanded === sprint.name}
          onChange={handleSprintSelect(sprint)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{sprint.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {sprintLoading ? (
              <h3>Loading....</h3>
            ) : sprintData ? (
              <div>
                <Typography>
                  <strong>Start Date: </strong>
                  {moment(sprintData.sprint.isoStartDate).format("YYYY/MM/DD")}
                </Typography>
                {sprintData.sprint.completeDate !== "None" && (
                  <Typography>
                    <strong>Complete Date: </strong>
                    {moment(sprintData.sprint.completeDate).format(
                      "YYYY/MM/DD"
                    )}
                  </Typography>
                )}
                <Typography style={{ whiteSpace: "pre-line" }}>
                  <strong>Goals</strong>
                  <br />
                  {sprintData.sprint.goal}
                </Typography>

                <Typography>
                  <strong>Inital Estimation: </strong>
                  {sprintData.contents.completedIssuesEstimateSum.value+sprintData.contents.issuesNotCompletedEstimateSum.value}
                </Typography>

                <Typography>
                  <strong>Completed: </strong>
                  {sprintData.contents.completedIssuesEstimateSum.value}<br />
                  {sprintData.contents.completedIssues.map((issue) => (issue.key+" "))}
                </Typography>

                <Typography>
                  <strong>Remaining: </strong>
                  {sprintData.contents.issuesNotCompletedEstimateSum.value}<br />
                  {sprintData.contents.issuesNotCompletedInCurrentSprint.map((issue) => (issue.key+" "))}
                </Typography>
              </div>
            ) : (
              <h3>No sprint data</h3>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default Main;
