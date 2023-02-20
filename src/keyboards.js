import {Markup} from "telegraf";

export const leaveStartText = "Отменить создание проекта"
export const leaveStartKb = Markup.keyboard([leaveStartText])

export const checkText = "Сравнить!"
export const leaveText = "Выйти из проекта"
export const leaveKb = Markup.keyboard([leaveText])
export const checkOrLeaveKb = Markup.keyboard([checkText, leaveText])

export const cancelText = "Отмена"
export const cancelKb = Markup.keyboard([cancelText])

export const typeKb = Markup.inlineKeyboard(
    [
        Markup.button.callback("Явный", "explicit"),
        Markup.button.callback("Неявный", "implicit")
    ]
)

export const languagesKb = Markup.inlineKeyboard(
    [
        Markup.button.callback('c++', 'cc'),
        Markup.button.callback('python', 'python'),
        Markup.button.callback('c', 'c')
    ],
    {
        columns: 1
    }
)

export const removeKeyboard = Markup.removeKeyboard()


export function getProjectsKb(projects, buttonsInLine = 3) {
    return Markup.inlineKeyboard(
        projects.map(item =>
            Markup.button.callback(item, `p${item}`)),
        {columns: Math.floor(projects.length / buttonsInLine)})
}

export const projectKb = Markup.inlineKeyboard(
    [
        Markup.button.callback('Добавить файлы', 'add'),
        Markup.button.callback('Удалить проект', 'delete'),
        Markup.button.callback('Поделиться', 'share'),
        Markup.button.callback('Назад', 'back')
    ],
    {
        columns: 1
    }
)