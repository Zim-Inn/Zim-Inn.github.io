// Requires an anchor element somewhere hidden in the page for the file download to work seamlessly
//  <a id="downloadAnchorElem" style="display:none"></a>
const removeDuplicateData = () => {
    fetch("json/Cards.json")
        .then((response) => response.json())
        .then((CardJSONData) => {
            const cardDataResult = [];

            CardJSONData.forEach((card) => {
                const newCard = {};

                // Preserve root level data except versions
                Object.keys(card).forEach((key) => {
                    if (key === "versions") {
                        newCard.versions = [];
                    } else {
                        newCard[key] = card[key];
                    }
                });

                // Process every version. First one has full data, later only include changes.
                let currentLatestVersion = {};
                card.versions.forEach((version, index) => {
                    // First version. Copy it directly to array
                    if (index === 0) {
                        currentLatestVersion = version;
                        newCard.versions.push(version);
                        return;
                    }

                    // Remaining versions. Only copy new data
                    const newFormatVersionObject = {};
                    Object.keys(version).forEach((dataLabel) => {
                        // Check if a key is unique to the newer version.
                        // This is unecessary, I just want to spot issues.
                        if (currentLatestVersion[dataLabel] === "undefined") {
                            console.log(
                                `A new unique key ${dataLabel} was detected on version ${index} of card ${card.card_id}`
                            );
                        }

                        // Use new value only if it is different from last version's value in the same key
                        if (
                            !areObjectsEqual(
                                version[dataLabel],
                                currentLatestVersion[dataLabel]
                            )
                        ) {
                            newFormatVersionObject[dataLabel] =
                                version[dataLabel];
                        }
                    });

                    newCard.versions.push(newFormatVersionObject);
                    currentLatestVersion = version;
                });

                // Add to results
                cardDataResult.push(newCard);
            });

            //Format the data
            const dataStr =
                "data:text/json;charset=utf-8," +
                encodeURIComponent(JSON.stringify(cardDataResult, null, 2));
            // Download it as JSON file
            const dlAnchorElem = document.getElementById("downloadAnchorElem");
            dlAnchorElem.setAttribute("href", dataStr);
            dlAnchorElem.setAttribute("download", "Cards_NewFormat.json");
            dlAnchorElem.click();
        });
};

//Helper function
const isObject = (object) => {
    return object != null && typeof object === "object";
};

// Important
const areObjectsEqual = (obj1, obj2) => {
    // Type mismatch, instant bail
    if (
        (isObject(obj1) && !isObject(obj2)) ||
        (!isObject(obj2) && isObject(obj1))
    ) {
        return false;
    }

    // Both are primitive types, perform a sumple comparison
    if (!isObject(obj1) && !isObject(obj2)) {
        return obj1 === obj2;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    // Potential early shortcut
    if (keys1.length !== keys2.length) {
        return false;
    }

    // Deep comparison with recursion
    for (const key of keys1) {
        const val1 = obj1[key];
        const val2 = obj2[key];
        const areObjects = isObject(val1) && isObject(val2);

        if (
            (areObjects && !areObjectsEqual(val1, val2)) ||
            (!areObjects && val1 !== val2)
        ) {
            return false;
        }
    }

    // Didn't find a difference.
    return true;
};
