import {Telegraf} from "telegraf";
import {Scenes} from "telegraf";
import LocalSession from "telegraf-session-local";
import {bot_token} from "./config.js"
import {loggingMiddleware} from "./middlewares/logs.js";
import {startText, helpText} from "./texts.js";
import {newProjectNameScene} from "./scenes/newProjectName.js";
import {newProjectLangScene} from "./scenes/newProjectLang.js";
import {newProjectTypeScene} from "./scenes/newProjectType.js";
import {filesScene} from "./scenes/files.js";
import {projectsScene} from "./scenes/projects.js";
import {projectScene} from "./scenes/project.js";
import {enterScene} from "./scenes/enter.js";
import {userSavingMiddleware} from "./middlewares/saveUser.js";
import chalk from "chalk"


const stage = new Scenes.Stage([
    newProjectNameScene, newProjectLangScene,
    newProjectTypeScene, filesScene, projectsScene,
    projectScene, enterScene
])


stage.hears("exit1", ctx => ctx.scene.leave())

const bot = new Telegraf(bot_token)
bot.use(loggingMiddleware)
bot.use((new LocalSession({database: "./db/session_db.json"})).middleware())
bot.use(stage.middleware())
bot.use(userSavingMiddleware)
bot.command('/start', ctx => ctx.replyWithHTML(startText))
bot.command('/help', ctx => ctx.replyWithHTML(helpText))
bot.command('/newproject', ctx => ctx.scene.enter("newProjectName"))
bot.command('/myprojects', ctx => ctx.scene.enter("projects"))
bot.command('/enterproject', ctx => ctx.scene.enter("enter"))
bot.use((ctx, next) => {
    ctx.replyWithHTML("Извини, не понял тебя. Пришли мне /help для большей информации")
})


console.log(chalk.bgGreen("Started"))
bot.catch(err => {
    console.log(chalk.bold(chalk.red(`global error:${err}`)))
})
bot.launch().catch(err => console.error(err))
