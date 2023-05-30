import axios from "axios";
import jiraConstants from "../constants";
import { getAxiosConfig } from "../utils/setAxiosConfig";



export async function getSprintDetails(sprintId) {
    let baseUrl = `${jiraConstants.host}/rest/agile/1.0`
    let endPoint = baseUrl + `/sprint/${sprintId}`
    let returnData = {}
    let sprint = await axios.get(endPoint, getAxiosConfig())
        .then((response) => {
            returnData.status = response.status
            returnData.data = response.data
        })
        .catch((err) => {
            returnData.status = err.response.status
            returnData.data = err.response.data
        })
    return returnData
}

export async function getAllIssueOfSprint(sprintId) {
    let baseUrl = `${jiraConstants.host}/rest/agile/1.0`
    let endPoint = baseUrl + `/sprint/${sprintId}/issue`
    let returnData = {}
    let issues = await axios.get(endPoint, getAxiosConfig())
        .then((response) => {
            returnData.status = response.status
            returnData.data = response.data
        })
        .catch((err) => {
            returnData.status = err.response.status
            returnData.data = err.response.data
        })
    return returnData
}