export const startText = `
Привет, на связи бот для поиска плагиата в коде. Для дополнительной информации пришли /help.
    
<b>Основные команды</b>:
/myprojects - редактировать проекты
/newproject - создать новый проект
/enterproject - войти в проект по ключу
`

export const helpText = `
Я использую Moss для сравнения файлов с кодом.
    
<b>Основные команды</b>:
/myprojects - редактировать проекты
/newproject - создать новый проект
/enterproject - войти в проект по ключу

<b>What's new:</b>
Теперь я умею принимать файлы от нескольких человек, а также присылать не ссылку на сравнение, а только процент плагиата (см. неявный режим)

Это бета-версия, если заметил баг - пиши в @feedback_input_bot.`

export const langText = `На каком языке программирования будут файлы с кодом?`

export const typeText = `
Выбери тип проекта:

<b>Явный</b>: бот будет присылать ссылку на построчное сравнение кода
<b>Неявный (beta)</b>: бот будет присылать только процент плагиата в коде. Подходит для проектов, в которых несколько человек присылают код, но не хотят показывать его другим участникам проекта.`

export const shareText = "Чтобы другой человек мог войти в этот проект, пришли ему ключ: "

export const noMatchesText = "Нет совпадений"

export function getProjectInfo(projectLang, projectFilesString, accessedUsers) {
    return `
<b>Язык проекта:</b> ${projectLang}

<b>Файлы в проекте:</b>
${projectFilesString}

<b>Доступ к проекту есть у:</b>
${accessedUsers}`
}

export function getProjectText(projectLang, projectFilesString, accessedUsers) {
    return getProjectInfo(projectLang, projectFilesString, accessedUsers) + `\n\nВыбери действие с проектом:`
}

export function getFilesText(projectName, projectLang, projectFilesString, accessedUsers, ps=true) {
    let output = getProjectInfo(projectLang, projectFilesString, accessedUsers) + `\n\nПришли мне файлы для поиска плагиата в <b>${projectName}</b>`
    if (ps) return output + '\n<b>Прим.</b>: Пока я умею сравнивать только 2 файла'
    return output
}