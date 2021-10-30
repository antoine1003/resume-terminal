/**
 * @typedef Config
 * @property {number} delayBetweenSteps Temps entre chaque étape
 * @property {number} enterDelay Temps que met le code à "exécuter" la commande
 */

/**
 * @typedef Step
 * @property {number} id
 * @property {string} line
 * @property {string} responseType
 * @property {string?} value
 * @property {string[]?} headers
 * @property {string[]?} rows
 */

import Typewriter from 'typewriter-effect/dist/core';
/**
 * @type Step[]
 */
import stepsJson from './resume.json';

/**
 * @type Config
 */
import config from './config.json';

const typewriterConfig = {

}

// On construit le dom de l'ensemble des éléments
stepsJson.forEach(step => {
    document.getElementById('terminal').append(getDom(step));
});

// Construction de la première ligne
if (stepsJson.length > 0)  {
    const step1 = stepsJson[0];
    play(0);
}

/**
 * Démarre le typewriter pour le step en cour
 * @param {number} stepIndex Index du step dans le tableau stepsJson
 */
function play(stepIndex) {
    const step = stepsJson[stepIndex];
    document.getElementById(`terminal-line${step.id}`).style.display = 'block';
    const betweenStepDelay = stepIndex === 0 ? 10 : config.delayBetweenSteps ?? 5000
    const typewriter = new Typewriter(`#line${step.id}`, typewriterConfig)
        .changeDelay(betweenStepDelay)
        .typeString('')
        .changeDelay('natural')
        .typeString(step.line)
        .changeDelay(config.enterDelay ?? 2000)
        .callFunction(() => {
            document.querySelector(`#line${step.id} > .Typewriter__cursor`).style.display = 'none';
            document.getElementById(`line${step.id}-response`).style.display = 'block';
            if (stepIndex + 1 < stepsJson.length) {
                // Il y a un element suivant
                play(stepIndex + 1)
            }
        })
        .start();
}

/**
 * Contruit le DOM pour une étape donnée
 * @param {Step} step Step pour lequel il faut construire le DOM
 */
function getDom(step) {
    let html = '';

    if (step.responseType === 'list' && Array.isArray(step.value)) {
        html = '<ul>';
        html += step.value.map(s => `<li>${s}</li>`).join('');
        html += '</ul>';
    } else if(step.responseType === 'text') {
        html = step.value;
    } else if (step.responseType === 'table') {
        const headers = step.headers;
        const rows = step.rows;
        const thsHtml = headers.map(h => `<th>${h}</th>`).join('')
        const tdsHtml = rows.map(r => `<tr>${r.map(rtd => `<td>${rtd}</td>`).join('')}</tr>`).join('');
        html = `<table><thead><tr>${thsHtml}</tr></thead><tbody>${tdsHtml}</tbody></table>`;
    }
    return stringToDom(` <div id="terminal-line${step.id}" class="terminal__line" style="display: none;">
            <span id="line${step.id}" class="line"></span>
            <div id="line${step.id}-response" class="response">
                ${html}
            </div>
        </div>`);
}

/**
 * Converti le html en objet DOM
 * @param html
 * @returns {DocumentFragment}
 */
function  stringToDom(html) {
    return document.createRange().createContextualFragment(html);
}
