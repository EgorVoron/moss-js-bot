// project actions
import {Scenes} from "telegraf";
import rimraf from "rimraf";
import {nanoid} from "nanoid";
import {getProjectText, shareText} from "../texts.js";
import * as kb from "../keyboards.js";
import {getProjectFiles, getProjectFilesString, getProjectPath} from "../utils/fsUtils.js";
import {Project} from "../db/dbClient.js";
import {toRealLang} from "../utils/func.js"

export const projectScene = new Scenes.BaseScene("project")
projectScene.enter(async ctx => {
    const projectName = ctx.scene.state.projectName
    const projectDoc = await Project.findOne({projectName})
    if (!projectDoc) {
        await ctx.replyWithHTML("Проект недоступен или удален")
        return ctx.scene.enter("projects")
    }
    const projectLang = toRealLang(projectDoc.lang)
    let projectFilesString = getProjectFilesString(projectDoc.projectId)
    const accessedUsers = projectDoc.usersWithAccess.map(username => "@" + username).join(",\n")
    await ctx.telegram.editMessageText(
        ctx.from.id,
        ctx.scene.state.prevMessageId,
        undefined,
        getProjectText(projectLang, projectFilesString, accessedUsers),
        {
            parse_mode: "HTML",
            ...kb.projectKb
        })

})
projectScene.action("add", async ctx => {
    ctx.answerCbQuery()
    ctx.deleteMessage(ctx.update.callback_query.message.message_id)
    const projectDoc = await Project.findOne({projectName: ctx.scene.state.projectName})
    return ctx.scene.enter("files", {
        projectId: projectDoc.projectId,
    })
})
projectScene.action("delete", async ctx => {
    const projectDoc = await Project.findOne({projectName: ctx.scene.state.projectName})
    rimraf(getProjectPath(projectDoc.projectId), () => {
    })
    await Project.deleteOne({projectId: projectDoc.projectId})
    await ctx.telegram.editMessageText(
        ctx.from.id,
        ctx.update.callback_query.message.message_id,
        undefined,
        'Проект удален'
    )
    await ctx.answerCbQuery()
})
projectScene.action("share", async ctx => {
    const projectName = ctx.scene.state.projectName
    const projectDoc = await Project.findOne({projectName})
    ctx.answerCbQuery()
    if (projectDoc.key) {
        await ctx.telegram.editMessageText(
            ctx.from.id,
            ctx.update.callback_query.message.message_id,
            undefined,
            shareText + projectDoc.key
        )
        return
    }
    const newKey = nanoid()
    projectDoc.key = newKey
    projectDoc.save()
    await ctx.telegram.editMessageText(
        ctx.from.id,
        ctx.update.callback_query.message.message_id,
        undefined,
        shareText + newKey
    )
})
projectScene.action("back", ctx => {
    return ctx.scene.enter("projects", {
        prevMessageId: ctx.update.callback_query.message.message_id
    })
})