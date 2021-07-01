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
// @match        https://zenn.dev/*/articles/*
// @match        https://zenn.dev/settings/account
// ==/UserScript==

const zennRepoPath = (v = null) => v != null ? GM_setValue("zennRepoPath", v) : GM_getValue("zennRepoPath", "")
const vscodeURL = () => `vscode://file${zennRepoPath()}${location.pathname.replace(/\/edit$/, "")}.md`

const setIntervalTimeout = (cb, interval = 200, timeout = 5000) => { const stop = () => clearInterval(c), c = setInterval(cb, interval, stop); setTimeout(stop, timeout); cb(stop); return stop }
const collectElements = (selectorMap = {}, root = document) =>
    Object.fromEntries(Object.entries(selectorMap).map(([k, v]) =>
        typeof v == "string" ? [k, { selector: v, root }] : [k, Object.assign(v, { root })]
    ).flatMap(([k, { selector, children = {}, clone = false, root = document }]) => {
        const elm = clone ? root.querySelector(selector).cloneNode(true) : root.querySelector(selector)
        return [[k, elm], ...Object.entries(collectElements(children, elm))]
    }))

const setupUIforEditor = done => {
    const editorActions = document.querySelector(`div[class*="MarkdownEditor_actions"]`)
    if (editorActions) {
        editorActions.append(Object.assign(document.createElement("button"), {
            innerHTML: "VSCodeで開く",
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
setIntervalTimeout(setupUIforEditor, 200, 5000)

const setupUIforArticleView = done => {
    btnOpenGithub = document.querySelector(`[class*=ArticleHeader_editButtonContainer]>a[class*=Button][href^="https://github.com/"]`)
    if (btnOpenGithub) {
        btnOpenVSCode = Object.assign(Object.assign(document.createElement("div"), { innerHTML: btnOpenGithub.outerHTML }).firstChild, {
            innerText: "VSCodeで開く",
            onclick: e => zennRepoPath() ? console.log(vscodeURL()) || window.open(vscodeURL()) : editorActions.querySelector(`input[name^=zennRepoPath`,).focus()
        })
        btnOpenGithub.parentElement.append(btnOpenVSCode)
        done()
    }
}
setIntervalTimeout(setupUIforArticleView, 200, 5000)

const setupUIforAccountSetting = done => {
    const els = collectElements({
        settings: {
            selector: `[class~="edit-account"]`, children: {
                settingNew: {
                    selector: `div`, clone: true, children: {
                        action: `[class*=FormRowWide_action]`,
                        title: `[class*=FormRowWide_title]`,
                        content: `[class*=FormRowWide_content]`
                    }
                }
            }
        }
    })
    if (els.settings) {
        els.title.innerText = "VSCodeで開く（ユーザスクリプト）"
        els.action.remove()
        els.content.innerHTML = ''
        els.content.append(Object.assign(document.createElement("input"), {
            value: zennRepoPath(),
            placeholder: "Zenn用のローカルリポジトリのフルパス",
            onchange: e => zennRepoPath(e.target.value),
            style: "width:100%;"
        }))
        els.settings.append(els.settingNew)
        done()
    }
}
setIntervalTimeout(setupUIforAccountSetting, 200, 5000)
