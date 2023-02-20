import {Scenes} from "telegraf";
import {typeText} from "../texts.js";
import * as kb from "../keyboards.js";
import {Project} from "../db/dbClient.js";

export const newProjectTypeScene = new Scenes.BaseScene("newProjectType")
newProjectTypeScene.enter(async ctx => {
    await ctx.telegram.editMessageText(
        ctx.from.id,
        ctx.scene.state.prevMessageId,
        undefined,
        typeText,
        {
            parse_mode: "HTML",
            ...kb.typeKb
        }
    )
})
newProjectTypeScene.action(["implicit", "explicit"], async ctx => {
    let projectId = ctx.scene.state.projectId
    await Project.findOneAndUpdate({projectId}, {$set: {type: ctx.update.callback_query.data}})
    await ctx.answerCbQuery()
    ctx.deleteMessage(ctx.update.callback_query.message.message_id)
    return ctx.scene.enter("files", {
        projectId,
    })
})
