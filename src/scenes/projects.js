import {Scenes} from "telegraf";
import {Project} from "../db/dbClient.js";
import * as kb from "../keyboards.js";

export const projectsScene = new Scenes.BaseScene("projects")
projectsScene.enter(async ctx => {
    let projects = await Project.find({owner: ctx.from.id})
    if (!projects || projects.length === 0) await ctx.replyWithHTML("У тебя пока нет проектов")
    else {
        const projectsKb = kb.getProjectsKb(projects.map(project => project.projectName))
        const msgArgs = ["Выбери проект из списка:", projectsKb]
        if (ctx.scene.state.prevMessageId) {
            await ctx.telegram.editMessageText(
                ctx.from.id,
                ctx.scene.state.prevMessageId,
                undefined,
                ...msgArgs
            )
        } else await ctx.replyWithHTML(...msgArgs)
    }
})
projectsScene.action(/^p/, async ctx => {
    let text = ctx.update.callback_query.data
    let projectName = text.slice(1)
    await ctx.answerCbQuery()
    return ctx.scene.enter("project", {
        projectName: projectName,
        prevMessageId: ctx.update.callback_query.message.message_id
    })
})
