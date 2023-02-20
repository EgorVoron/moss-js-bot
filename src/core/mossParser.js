import got from "got"
import {JSDOM} from "jsdom"
import {noMatchesText} from "../texts.js";

function prettifyMossInfo(arr) {
    let outputText = "Совпадения:\n"
    for (let el of arr.slice(0, arr.length - 1)) {
        const infoEnd = el.indexOf("\n")
        outputText += (infoEnd) ? el.split(el[infoEnd])[0] : el
        outputText += '\n'
    }
    outputText += `\nСовпало строк: ${arr[arr.length - 1]}`
    return outputText
}

export async function getComparisonInfo(link) {
    try {
        let response = await got(link)
        const dom = new JSDOM(response.body)
        let resArr = Array.from(dom.window.document.querySelectorAll("TD"))
            .map(url => url.textContent)
        if (!resArr) return null
        if (resArr.length === 0) return noMatchesText
        return prettifyMossInfo(resArr)
    } catch (e) {
        console.error(e)
        return null
    }
}
