import {Scenes} from "telegraf";
import {getProjectPath, getSafeProjectPath, mkdirSafe} from "../utils/fsUtils.js";
import {User, Project, SafeProject} from "../db/dbClient.js";
import sanitize from "mongo-sanitize";

const MAX_PROJECT_NAME_LENGTH = 60

function genId() {
    return Math.floor(Math.random() * 1e10)
}

export const newProjectNameScene = new Scenes.BaseScene("newProjectName")
newProjectNameScene.enter(ctx => ctx.replyWithHTML("Отлично, новый проект. Как назовем его?\n" +
    "Прим.: Длина названия не должна превышать 60 символов"))
newProjectNameScene.on("text", async ctx => {
    const userId = ctx.from.id
    const clearProjectName = sanitize(ctx.message.text)

    if (clearProjectName.length > MAX_PROJECT_NAME_LENGTH) {
        await ctx.replyWithHTML("Слишком длинное название, выбери другое")
        return ctx.scene.enter("newProjectName", {}, true)
    }
    let res = await Project.findOne({projectName: clearProjectName, owner: userId})
    if (res) {
        await ctx.replyWithHTML("Проект с таким именем у тебя уже есть, выбери другое")
        return ctx.scene.enter("newProjectName", {}, true)
    }

    const projectId = genId()
    const newProject = new Project({
        projectId,
        projectName: clearProjectName,
        owner: userId,
        usersWithAccess: [ctx.from.username]
    })
    const newSafeProject = new SafeProject({
        projectId,
        projectName: clearProjectName,
        owner: ctx.from.username
    })
    newProject.save().catch(err => console.error(err))
    newSafeProject.save().catch(err => console.error(err))

    await User.findOneAndUpdate(
        {userId},
        {$addToSet: {projects: projectId}}
    )
    try {
        // Дальше идет физическое создание папки './projectId'
        mkdirSafe(getProjectPath(projectId))
        mkdirSafe(getSafeProjectPath(projectId))
    } catch (e) {
        await ctx.replyWithHTML("Ошибка: не могу создать проект")
        return ctx.scene.leave()
    }
    return ctx.scene.enter("newProjectLang", {projectId})
})
