import jiraConstants from "./constants";
import { Version3Client } from 'jira.js';

  const jira = new Version3Client({
    host: jiraConstants.host,
    newErrorHandling: true,
    authentication: {
    basic: {
      email: jiraConstants.username,
      apiToken: jiraConstants.pwd,
    },
  },
  })

export default jira;