
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

// Tableau contenant les commandes (utile pour la complétion des commandes)
let commandsList = [];
commands.forEach(c => {
    commandsList.push(c.command);
})
commandsList.push('clear');

// Tableau contenant l'historique des commandes
const commandsHistory = [];
let historyMode = false;
let historyIndex = -1;
const terminalBody = document.querySelector('.terminal__body');

// Ajout de la ligne par défaut
addNewLine();

// Easter egg de décembre
const now = new Date();
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
 * Retourne le HTML de la réponse pour une commande donnée
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
    inputEl.dataset.active = "1"; // Utile pour le focus
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

    inputEl.focus(); // Ajoute le focus dès la création du champs
}

function onCommandInput(e) {
    const commandValue = e.target.value.trim();
    if (e.keyCode === 13) { // ENTER
        if (commandValue !== '') {
            historyMode = false;
            if (commandValue === 'clear') {
                terminalBody.innerHTML = `<div id="terminal"></div>`;
                addNewLine();
                return;
            }
            const idResponse = `response-${e.target.dataset.uid}`;
            const html = getDomForCommand(commandValue);
            const responseEl = document.getElementById(idResponse);
            if (responseEl) {
                responseEl.innerHTML  = html;
                commandsHistory.push(commandValue);
                addNewLine(e.target.id);
            }
        }
    } else if(e.keyCode === 9) { // TAB
        e.preventDefault();
        if (commandValue === '') {
            this.value = 'help';
        } else {
            const matchingCommand = commandsList.find(c => c.startsWith(commandValue));
            if (matchingCommand) {
                this.value = matchingCommand;
            }
        }
        historyMode = false;
    } else if(e.keyCode === 38 || e.keyCode === 40) { // UP / DOWN
        // Gestion de l'historique
        if (commandsHistory.length > 0) {
            if (historyMode === false) {
                historyIndex = commandsHistory.length - 1;
            } else {
                if (e.keyCode === 38 && historyIndex !== 0) { // UP
                    historyIndex--;
                } else if(e.keyCode === 40 && historyIndex !== commandsHistory.length - 1) {
                    historyIndex++;
                }
            }
            this.value = commandsHistory[historyIndex];
        }
        historyMode = true;
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
