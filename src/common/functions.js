export function chooseRandomly(array) {
    const randomChoice = array[Math.floor(Math.random() * array.length)];
    assertUndefined(randomChoice);
    return randomChoice;
}
export function shuffle(array) {
    const result = array.slice();
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmpI = result[i];
        const tmpJ = result[j];
        assertUndefined(tmpI);
        assertUndefined(tmpJ);
        [result[i], result[j]] = [tmpJ, tmpI];
    }
    return result;
}
export function assertUndefined(args) {
    if (args === undefined)
        throw new Error('undefined assertion');
}
