// ==UserScript==
// @name         Zenn to VSCode
// @description  Add 'Open with vscode' button to zenn's edit page
// @version      0.3.0
// @author       kawaz
// @namespace    https://github.com/kawaz/userscript-zenn
// @supportURL   https://github.com/kawaz/userscript-zenn/issues
// @updateURL    https://github.com/kawaz/userscript-zenn/raw/master/zenn.user.js
// @downloadURL  https://github.com/kawaz/userscript-zenn/raw/master/zenn.user.js
// @icon         https://www.google.com/s2/favicons?domain=zenn.dev
// @grant        GM_getValue
// @grant        GM_setValue
// @match        https://zenn.dev/*/edit
// ==/UserScript==

const zennRepoPath = (v = null) => v != null ? GM_setValue("zennRepoPath", v) : GM_getValue("zennRepoPath", "")
const vscodeURL = () => `vscode://file${zennRepoPath()}${location.pathname.replace(/\/edit$/, "")}.md`
const setIntervalTimeout = (cb, interval = 200, timeout = 5000) => { const stop = () => clearInterval(c), c = setInterval(cb, interval, stop); setTimeout(stop, timeout); cb(stop); return stop }
const setupUI = done => {
    const editorActions = document.querySelector(`div[class*="MarkdownEditor_actions"]`)
    if (editorActions) {
        editorActions.append(Object.assign(document.createElement("button"), {
            innerHTML: "Open with VSCode",
            onclick: e => zennRepoPath() ? console.log(vscodeURL()) || window.open(vscodeURL()) : editorActions.querySelector(`input[name^=zennRepoPath`,).focus()
        }))
        editorActions.append(Object.assign(document.createElement("input"), {
            name: `zennRepoPath${Date.now()}`,
            title: "full path of local repository for zenn",
            placeholder: "Input full path of local repository for zenn",
            value: zennRepoPath(),
            onchange: e => zennRepoPath(e.target.value)
        }))
        done()
    }
}
setIntervalTimeout(setupUI, 200, 5000)