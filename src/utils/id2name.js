import {SafeProject} from "../db/dbClient.js"
const projectId = Number(process.argv[2])
console.log(await SafeProject.findOne({projectId}))