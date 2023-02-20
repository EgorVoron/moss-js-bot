import {Scenes} from "telegraf";
import {langText} from "../texts.js";
import * as kb from "../keyboards.js";
import {Project, SafeProject} from "../db/dbClient.js";

export const newProjectLangScene = new Scenes.BaseScene("newProjectLang")
newProjectLangScene.enter(ctx => ctx.replyWithHTML(langText, kb.languagesKb))
newProjectLangScene.action(['c', 'cc', 'python'], async ctx => {
    let lang = ctx.update.callback_query.data
    let projectId = ctx.scene.state.projectId
    await ctx.answerCbQuery()


    await Project.findOneAndUpdate(
        {projectId},
        {$set: {lang}}
    )
    await SafeProject.findOneAndUpdate(
        {projectId},
        {$set: {lang}}
    )

    let prevMessageId = ctx.update.callback_query.message.message_id
    return ctx.scene.enter("newProjectType", {projectId, prevMessageId})
})
// newProjectLangScene.leave(ctx => ctx.replyWithHTML("exiting newProjectLang", kb.removeKeyboard))
