var username = process.env.JIRA_USERNAME || '';
var pwd = process.env.JIRA_PWD || '';
var host = process.env.JIRA_HOST || '';

var fields = ['issuetype','description','issuelinks','priority','status','summary']

export default {username, pwd, host, fields};
