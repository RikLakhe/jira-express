import JiraClient from "jira-connector";
import jiraConstants from "./constants";
import JiraApi from "jira-client";

const jira = new JiraClient({
  host: jiraConstants.host,
  basic_auth: {
    username: jiraConstants.username,
    password: jiraConstants.pwd,
  },
});

export default jira;

export const jira2 = new JiraApi({
  protocol: "https",
  host: jiraConstants.host,
  username: jiraConstants.username,
  password: jiraConstants.pwd,
  apiVersion: "2",
  strictSSL: false,
});