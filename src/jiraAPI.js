import JiraApi from "jira-client";
import jiraConstants from "./constants";

var jiraAPI = new JiraApi({
  protocol: "https",
  host: jiraConstants.host,
  email: jiraConstants.username,
  password: jiraConstants.pwd,
  apiVersion: '2',
})

export default jiraAPI;

