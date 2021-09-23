import JiraApi from "jira-client";
import jiraConstants from "./constants";

var jira = new JiraApi({
  protocol: "https",
  host: jiraConstants.host,
  username: jiraConstants.username,
  password: jiraConstants.pwd,
  apiVersion: '2',
  strictSSL: true
})

export default jira;

