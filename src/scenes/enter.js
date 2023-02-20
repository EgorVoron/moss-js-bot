import {Scenes} from "telegraf";
import * as kb from "../keyboards.js";
import {Project} from "../db/dbClient.js";
import {cancelText} from "../keyboards.js";
import sanitize from "mongo-sanitize";

export const enterScene = new Scenes.BaseScene("enter")
enterScene.enter(ctx => ctx.replyWithHTML("Пришли мне ключ проекта", kb.cancelKb.resize()))
enterScene.hears(cancelText, async ctx => {
    await ctx.scene.leave()
})
enterScene.on("text", async ctx => {
    let clearUserKey = sanitize(ctx.message.text)
    let projectDoc = await Project.findOne({key: clearUserKey})
    if (projectDoc) {
        const projectId = projectDoc.projectId
        projectDoc.usersWithAccess.addToSet(ctx.from.username)
        projectDoc.save()
        return ctx.scene.enter("files", {projectId})
    }
    await ctx.replyWithHTML("Неверный ключ, попробуй еще")
})
enterScene.leave(ctx => ctx.replyWithHTML("Ок", kb.removeKeyboard))
enterScene.hears(kb.cancelText, ctx => ctx.scene.leave())
