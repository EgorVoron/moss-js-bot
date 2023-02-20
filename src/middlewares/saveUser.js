import {User} from "../db/dbClient.js";

export async function userSavingMiddleware(ctx, next) {
    const userId = ctx.from.id
    let res = await User.findOne({userId})
    if (!res) {
        const newUser = new User({
            userId,
            username: ctx.from.username,
            createdAt: new Date,
            projects: []
        })
        newUser.save().catch(err => console.error(err))
    }
    return next()
}