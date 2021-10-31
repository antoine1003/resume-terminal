/**
 * @typedef Config
 * @property {number} delayBetweenSteps Time between each step
 * @property {number} enterDelay Delay of "execution" for a command line
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

import Typewriter from "typewriter-effect/dist/core";
/**
 * @type Step[]
 */
import stepsJson from "./resources/resume.json";

/**
 * @type Config
 */
import config from "./resources/config.json";

const typewriterConfig = {};

// Builduing DOM for all elements
stepsJson.forEach((step) => {
    document.getElementById("terminal").append(getDom(step));
});

// Starting terminal
if (stepsJson.length > 0) {
    play(0);
}

/**
 * Start typewriter for given step
 * @param {number} stepIndex Index of the step in the array stepsJson
 */
function play(stepIndex) {
    const step = stepsJson[stepIndex];
    document.getElementById(`terminal-line${step.id}`).style.display = "block";
    const betweenStepDelay = stepIndex === 0 ? 10 : config.delayBetweenSteps ?? 5000;
    new Typewriter(`#line${step.id}`, typewriterConfig)
        .pauseFor(betweenStepDelay)
        .typeString(step.line)
        .pauseFor(config.enterDelay ?? 2000)
        .callFunction(() => {
            // Hide cursor and show response
            document.querySelector(`#line${step.id} > .Typewriter__cursor`).style.display = "none";
            document.getElementById(`line${step.id}-response`).style.display              = "block";
            if (stepIndex + 1 < stepsJson.length) {
                // There is an other step
                play(stepIndex + 1);
            }
        })
        .start();
}

/**
 * Build DOM for a given step
 * @param {Step} step
 */
function getDom(step) {
    let html = "";

    if (step.responseType === "list" && Array.isArray(step.value)) {
        html = "<ul>";
        html += step.value.map((s) => `<li>${s}</li>`).join("");
        html += "</ul>";
    } else if (step.responseType === "text") {
        html = step.value;
    } else if (step.responseType === "table") {
        const headers = step.headers;
        const rows    = step.rows;
        const thsHtml = headers.map((h) => `<th>${h}</th>`).join("");
        const tdsHtml = rows
            .map((r) => `<tr>${r.map((rtd) => `<td>${rtd}</td>`).join("")}</tr>`)
            .join("");
        html          = `<table><thead><tr>${thsHtml}</tr></thead><tbody>${tdsHtml}</tbody></table>`;
    } else if (step.responseType === "code") {
        html = `<pre>${step.value.join('\n')}</pre>`;
    }
    return stringToDom(` <div id="terminal-line${step.id}" class="terminal__line" style="display: none;">
            <span id="line${step.id}" class="line"></span>
            <div id="line${step.id}-response" class="response">
                ${html}
            </div>
        </div>`);
}

/**
 * Convert HTML to DOM object
 * @param html
 * @returns {DocumentFragment}
 */
function stringToDom(html) {
    return document.createRange().createContextualFragment(html);
}
