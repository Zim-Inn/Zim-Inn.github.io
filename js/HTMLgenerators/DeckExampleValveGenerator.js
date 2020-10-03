// Requires Helpers {generateDeckSummary, generateDeckColorStatistics}

const generateValveDeckExampleHTML = (name, code, description, dateAdded, dateRemoved, updateLink,   SortedHeroArray, DeckStats) => {
    return `
        <div class="DeckExampleContainer">
            <div class="DeckExampleHeader">
                <span>${name}</span>
                <div class="DeckExampleHeaderButtons">
                    <button 
                        class="ArtifactButtonSmall" 
                        onmousemove="ShowTextTooltip(1, 'Copies the URL for this deck to the clipboard');"
                        onmouseout="ShowTextTooltip(0,0);" 
                        onmouseup="ShareDeckExample('${code}')"
                        type="button" 
                    >
                        SHARE
                    </button>
                    <button 
                        class="ArtifactButtonSmall" 
                        onmousemove="ShowTextTooltip(1, 'View this deck');"
                        onmouseout="ShowTextTooltip(0,0);" 
                        onmouseup="LoadDeckFunc(false, '${code}')"
                        type="button" 
                    >
                        VIEW
                    </button>
                </div>
            </div>
            <div class="DeckExampleContents">
                <div class="DeckExampleGeneralInfo">
                    <div class="DeckDescription">
                        <span>${description}</span>
                    </div>
                    <div class="DeckCreditLine">
                        <div>
                            <span class="DeckCreditLabel">Added to Artifact on:  </span><span class="DeckDateText">${dateAdded}</span>
                        </div>
                    </div>
                    ${
                        dateRemoved &&
                        `
                            <div class="DeckCreditLine">
                                <div>
                                    <span class="DeckCreditLabel">Removed from Artifact on:  </span><span class="DeckDateText"> ${dateRemoved}</span>
                                </div>
                            </div>
                        ` || "" 
                    }
                    ${
                        updateLink &&
                        `
                            <div class="DeckMediaLine">
                                <a
                                    class="OtherButton" 
                                    onmousemove="ShowTextTooltip(1, 'See patch notes when this Deck was added)" 
                                    onmouseout="ShowTextTooltip(0,0)"
                                    href="${updateLink}" 
                                    target="_blank">
                                </a>
                            </div>
                        ` || ""
                    }   
                </div>
                <div class="DeckExampleStats">
                    <div class="DeckExampleHeroPortraits">
                        ${SortedHeroArray
                            .map((hero) => {
                                return `
                                        <div
                                            class="HeroIconContainer HeroIconBackground${hero.colour}"
                                        >
                                            <img 
                                                src="Images/HeroIcons/${hero.id}_0.png" 
                                            >
                                        </div>
                                `;
                            })
                            .join("")}
                    </div>
                    <div class="DeckExampleDeckStatistics">
                        ${generateDeckSummary(DeckStats)}
                    </div>
                    <div class="DeckExampleDeckColorStatistics">
                        ${generateDeckColorStatistics(DeckStats)}
                    </div>
                </div>
            </div>
        </div>
    `;
}
