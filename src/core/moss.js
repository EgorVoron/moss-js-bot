import MossClient from 'moss-node-client';
import path from 'path'

export async function runMoss({studentFiles, lang}) {
    try {
        const client = new MossClient(lang, 1234)
        studentFiles.forEach(file => client.addFile(file, path.basename(file)))
        return await client.process().catch(error => console.error("runMoss error:", error))
    } catch (e) {
        console.error(e)
        return null
    }
}