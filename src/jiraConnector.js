import jiraConstants from "./constants";


const JiraClient = require('jira-connector');
const jiraConnector = new JiraClient({
  host: jiraConstants.host,
  basic_auth: {
    username: jiraConstants.username,
    password: jiraConstants.pwd
  }
});


export default jiraConnector;