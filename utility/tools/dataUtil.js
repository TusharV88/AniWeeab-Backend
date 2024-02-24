
// Shuffle Data
export function dataShuffler(data1, data2) {
    const mergedData = [...data1, ...data2];

    // Shuffle the merged dataay
    for (let i = mergedData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mergedData[i], mergedData[j]] = [mergedData[j], mergedData[i]];
    }

    return mergedData;
}

// Merge Sort
function merge(left, right, prop) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex][prop] > right[rightIndex][prop]) {
            result.push(left[leftIndex++]);
        } else {
            result.push(right[rightIndex++]);
        }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

export function sortByScore(arr, prop) {
    if (arr.length <= 1) {
        return arr;
    }

    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);

    return merge(sortByScore(left, prop), sortByScore(right, prop), prop);
}
