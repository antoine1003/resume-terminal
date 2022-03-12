
/**
 * @typedef Command
 * @property {string} command
 * @property {string} responseType
 * @property {string?} value
 * @property {string[]?} headers
 * @property {string[]?} rows
 */

/**
 * @type {Command[]} commands
 */
import commands from "./resources/commands.json";

const terminalBody = document.querySelector('.terminal__body');
addNewLine();

const versionEl = document.getElementById('version');
if (versionEl) {
    versionEl.innerText = 'v2.0.0';
}

const now = new Date();
// Is December
if (now.getMonth() === 11) {
    // Christmas snow flakes
    let htmlFlakes = '';
    for (let i = 0; i < 6; i++) {
        htmlFlakes += `<div class="snowflake">❅</div><div class="snowflake">❆</div>`;
    }
    const html = `<div class="snowflakes" aria-hidden="true">${htmlFlakes}</div>`;
    document.body.append(stringToDom(html));
}

/**
 * Build DOM for a given command
 * @param {string} command
 */
function getDomForCommand(command) {
    const commandObj = commands.find(el => el.command === command);
    let html = "";
    if (commandObj === undefined) {
        html = `'${command.split(' ')[0]}' n’est pas reconnu en tant que commande interne ou externe, un programme exécutable ou un fichier de commandes. Taper la commande <code>help</code> pour afficher la liste des commandes disponibles.`;
    } else {
        if (commandObj.responseType === "list" && Array.isArray(commandObj.value)) {
            html = "<ul>";
            html += commandObj.value.map((s) => `<li>${s}</li>`).join("");
            html += "</ul>";
        } else if (commandObj.responseType === "text") {
            html = commandObj.value;
        } else if (commandObj.responseType === "table") {
            const headers = commandObj.headers;
            const rows    = commandObj.rows;
            const thsHtml = headers.map((h) => `<th>${h}</th>`).join("");
            const tdsHtml = rows
                .map((r) => `<tr>${r.map((rtd) => `<td>${rtd}</td>`).join("")}</tr>`)
                .join("");
            html          = `<table><thead><tr>${thsHtml}</tr></thead><tbody>${tdsHtml}</tbody></table>`;
        } else if (commandObj.responseType === "code") {
            html = `<pre>${commandObj.value.join('\n')}</pre>`;
        }
    }

    return html;
}

function addNewLine(previousUid = null) {
    const uid = Math.random().toString(36).replace('0.', '');
    // terminal__line
    const terminalLineEl = document.createElement('div');
    terminalLineEl.classList.add('terminal__line');

    // terminal__response
    const terminalResponseEl = document.createElement('div');
    terminalResponseEl.classList.add('terminal__response');
    terminalResponseEl.id = `response-${uid}`;

    // input text
    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.id = `input-${uid}`;
    inputEl.dataset.uid = uid;
    inputEl.dataset.active = "1";
    inputEl.addEventListener('keydown', onCommandInput)

    terminalLineEl.appendChild(inputEl);
    if (previousUid) {
        const previousInputEl = document.getElementById(previousUid);
        if (previousInputEl) {
            previousInputEl.setAttribute('disabled', 'true');
            previousInputEl.removeEventListener('keydown', onCommandInput);
            delete previousInputEl.dataset.active;
        }
    }
    document.getElementById('terminal').appendChild(terminalLineEl);
    document.getElementById('terminal').appendChild(terminalResponseEl);

    inputEl.focus();
}

function onCommandInput(e) {
    console.log(e.target.dataset.uid)
    if (e.keyCode === 13) {
        const commandValue = e.target.value.trim();
        if (commandValue !== '') {
            if (commandValue === 'clear') {
                terminalBody.innerHTML = `<div id="terminal"></div>`;
                addNewLine();
                return;
            }
            const idResponse = `response-${e.target.dataset.uid}`;
            const domResponse = getDomForCommand(commandValue);
            const responseEl = document.getElementById(idResponse);
            if (responseEl) {
                console.log(responseEl);
                responseEl.innerHTML  = domResponse;
                console.log(responseEl)
                addNewLine(e.target.id);
            }
        }
    }
}

/**
 * Convert HTML to DOM object
 * @param html
 * @returns {DocumentFragment}
 */
function stringToDom(html) {
    return document.createRange().createContextualFragment(html);
}

// Ajout du focus sur l'input même si on clique sur le body (pour garder le curseur)
document.body.addEventListener('click', function (e) {
    if (e.target.tagName !== 'INPUT') {
        const activeInput = document.querySelector('input[data-active]');
        activeInput.focus();
    }
});
