import {Scenes} from "telegraf";
import axios from "axios";
import path from "path";
import fs from "fs";
import * as kb from "../keyboards.js";
import {runMoss} from "../core/moss.js";
import {getProjectFilesString, getProjectPath, getSafeProjectPath} from "../utils/fsUtils.js";
import {Project} from "../db/dbClient.js";
import {getComparisonInfo} from "../core/mossParser.js";
import {getFilesText} from "../texts.js";
import {toRealLang} from "../utils/func.js"

const ALLOWED_EXTENSIONS = ['cpp', 'c', 'h', 'py', 'hpp', 'pyc']

function allowedExtension(filename) {
    let filenameList = filename.split('.')
    return ALLOWED_EXTENSIONS.includes(filenameList[filenameList.length - 1])
}


export const filesScene = new Scenes.BaseScene("files")
// requires: projectId
filesScene.enter(async ctx => {
        const projectId = ctx.scene.state.projectId
        const projectDoc = await Project.findOne({projectId})
        const projectFilesString = getProjectFilesString(projectId)
        await ctx.replyWithHTML(
            getFilesText(projectDoc.projectName, toRealLang(projectDoc.lang), projectFilesString, projectDoc.usersWithAccess),
            kb.checkOrLeaveKb.resize()
        )
    }
)
filesScene.on("document", async ctx => {
    console.log(ctx.update.message.document)
    let fileId = ctx.update.message.document.file_id
    let fileName = ctx.update.message.document.file_name
    if (fileName.indexOf(' ') !== -1) {
        await ctx.replyWithHTML("Название файла не должно содержать пробелов, файл не сохранен")
        return ctx.scene.enter("files", {
            projectId: ctx.scene.state.projectId,
        }, true)
    }
    if (!allowedExtension(fileName)) {
        await ctx.replyWithHTML(`Неверное расширение файла, доступные: ${ALLOWED_EXTENSIONS.join(',')}`)
        return ctx.scene.enter("files", {
            projectId: ctx.scene.state.projectId,
        }, true)
    }
    fileName = '@' + ctx.from.username + '_' + fileName
    ctx.telegram.getFileLink(fileId).then(url => {
        axios({url: url.href, responseType: 'stream'}).then(response => {
            return new Promise(() => {
                let pathToSave = path.join(getProjectPath(ctx.scene.state.projectId), fileName)
                let safePathToSave = path.join(getSafeProjectPath(ctx.scene.state.projectId), fileName)
                response.data.pipe(fs.createWriteStream(safePathToSave))
                response.data.pipe(fs.createWriteStream(pathToSave))
                    .on('finish', () => ctx.replyWithHTML("Сохранено", kb.checkOrLeaveKb.resize()))
                    .on('error', e => {
                        console.error(`error in @${ctx.from.username} "files" scene: ${e}`)
                        ctx.replyWithHTML(`Не удалось сохранить(`)
                    })
            });
        })
    })
})
filesScene.hears(kb.checkText, async ctx => {
    let projectPath = getProjectPath(ctx.scene.state.projectId)
    let filenames;
    try {
        filenames = fs.readdirSync(projectPath)
    } catch (e) {
        console.error(e)
        await ctx.replyWithHTML("Ошибка чтения файлов")
        return ctx.scene.leave()
    }

    if (filenames.length < 2) {
        if (filenames.length === 0) await ctx.replyWithHTML("В проекте нет файлов")
        if (filenames.length === 1) await ctx.replyWithHTML("В проекте один файл, не с чем сравнивать")
        return ctx.scene.enter("files", {
            projectId: ctx.scene.state.projectId,
        }, true)
    }
    await ctx.replyWithHTML("Сравниваю...", kb.checkOrLeaveKb.resize())
    let paths = filenames.map(item => path.join(projectPath, item))
    const projectDoc = await Project.findOne({projectId: ctx.scene.state.projectId})
    if (!paths) {
        await ctx.replyWithHTML("Ошибка чтения файлов")
        return ctx.scene.leave()
    }
    if (!projectDoc || !projectDoc.lang) {
        await ctx.replyWithHTML("Ошибка: язык не указан")
        return ctx.scene.leave()
    }
    const link = await runMoss({
        studentFiles: paths,
        lang: projectDoc.lang
    })
    if (link) {
        if (projectDoc.type === "explicit") await ctx.replyWithHTML(link)
        else {
            const comparisonRes = await getComparisonInfo(link)
            if (comparisonRes) await ctx.replyWithHTML(comparisonRes)
            else await ctx.replyWithHTML("Ошибка при попытке распарсить результат Moss(")
        }
    } else await ctx.replyWithHTML("Ошибка на стороне сервера Moss в Стенфорде(")
})
filesScene.hears(kb.leaveText, ctx => ctx.scene.leave())
filesScene.leave(ctx => ctx.replyWithHTML("Выхожу из проекта", kb.removeKeyboard))