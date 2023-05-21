import jiraConstants from "../constants";


export function getAxiosConfig() {
    let config = {
        headers: {
            Authorization: `Basic ${Buffer.from(`${jiraConstants.username}:${jiraConstants.pwd}`).toString('base64')}`,
            Accept: 'application/json'
        }
    }
    return config
}