import mongoose from "mongoose"

const Schema = mongoose.Schema

const userSchema = new Schema({
    userId: Number,
    username: String,
    createdAt: Date,
    projects: Array
})

const projectSchema = new Schema({
    projectId: Number,
    projectName: String,
    owner: Number, // userId
    lang: String,
    type: String,
    key: String,
    usersWithAccess: Array, // username[]
})

const safeProjectSchema = new Schema(
    {
        projectId: Number,
        projectName: String,
        owner: String, // userName
        lang: String,
    }
)

mongoose.connect(
    "mongodb://localhost:27017/moss_js_bot",
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    }).catch(err => console.error(err))

export const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"))

export const User = mongoose.model("User", userSchema)
export const Project = mongoose.model("Project", projectSchema)
export const SafeProject = mongoose.model("SafeProject", safeProjectSchema)