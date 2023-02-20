import fs from "fs";

export function mkdirSafe(path) {
    if (!fs.existsSync(path))
        fs.mkdir(path, err => {
            if (err) console.error(err)
        })
}

export function getProjectPath(projectId) {
    return `./data/projects/${projectId}`
}

export function getSafeProjectPath(projectId) {
    return `./data/safe/${projectId}`
}

export function getProjectFiles(projectId) {
    try {
        return fs.readdirSync(getProjectPath(projectId))
    } catch (e) {
        console.error(e)
        return null
    }
}

export function getProjectFilesString(projectId) {
    let projectFiles = getProjectFiles(projectId)
    if (!projectFiles) return "Ошибка чтения файлов"
    return (projectFiles.length > 0) ? projectFiles.join("\n") : '-'
}