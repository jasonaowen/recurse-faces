export function powerSet(arr) {
    let result = new Set();

    // Base case
    if (!arr.length)
        return new Set([[]]);

    let first = arr[0];
    let set = powerSet(arr.slice(1))

    for (let entry of set) {
        result.add(entry.slice(0));
        entry.unshift(first);
        result.add(entry);
    }

    return result;
}
