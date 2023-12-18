/**
 * Convert HTML to DOM object
 * @param html
 * @returns {DocumentFragment}
 */
export function stringToDom(html) {
    return document.createRange().createContextualFragment(html);
}