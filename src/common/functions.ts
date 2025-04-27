export function chooseRandomly<T> (array: T[]): T {
    const randomChoice = array[Math.floor(Math.random() * array.length)];

    assertUndefined(randomChoice);

    return randomChoice;
}

export function shuffle<T> (array: T[]): T[] {
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

export function assertUndefined<T> (args: T|undefined): asserts args is T {
    if (args === undefined) throw new Error('undefined detected');
}