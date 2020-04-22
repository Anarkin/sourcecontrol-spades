export function mapObjectToArray<TIn, TOut>(object: { [key: string]: TIn }, map: (o: TIn) => TOut): (TOut & { key: string })[] {
    const array = [];

    for (const key of Object.keys(object)) {
        array.push({
            key,
            ...map(object[key])
        });
    }

    return array;
}

/**
 * explanation:
 *  `dictionary` is `Record<TKey, TValue>` or alternatively `{ [key: string]: TValue }`
 *
 *  `TIn` will capture `TValue` during type inference, extracting it from the original type,
 *  enabling us to build a type which is made of TValue + key, in other words:
 *
 *  `(TOut & { key: string })[]`
 */
