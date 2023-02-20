import chalk from "chalk"

function getUserString(user) {
    return `${user.id} ${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}${user.username ? ` @${user.username}` : ''}`
}

export async function loggingMiddleware(ctx, next) {
    const timestamp = new Date().toLocaleString()
    const updateType = ctx.updateType
    const userString = getUserString(ctx.from)
    const cbText = ctx?.update?.callback_query?.data
    const msgText = ctx.message?.text
    const text = (msgText || cbText) || ''
    await console.log(
        `${chalk.bold(chalk.yellow(timestamp))} [${chalk.cyanBright(updateType)}] [${chalk.bold(chalk.blue(userString))}]: ${chalk.bold(chalk.green(text))}`
    )
    return next()
}
