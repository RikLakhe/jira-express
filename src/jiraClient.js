import JiraClient from "jira-connector";
import jiraConstants from "./constants";

const jira = new JiraClient({
  host: jiraConstants.host,
  basic_auth: {
    username: jiraConstants.username,
    password: jiraConstants.pwd,
  },
});

export default jira;