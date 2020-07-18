const generateDeckExampleHTML = function(name, code, description, creator, submitter, media, SortedHeroArray, DeckStats) {
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
                    ${
                        description
                            ? `
                            <div class="DeckDescription">
                                <span>${description}</span>
                            </div>
                        `
                            : ""
                    }
                    <div class="DeckCreditLine">
                        ${
                            creator &&
                            `
                            <div>
                                <span class="DeckCreditLabel">Created by:</span><span class="DeckCreditText"> ${creator}</span>
                            </div>
                        `
                        }
                        ${
                            submitter &&
                            `
                            <div>
                                <span class="DeckCreditLabel">Submitted by:</span><span class="DeckCreditText"> ${submitter}</span>
                            </div>
                        `
                        }
                    </div>
                    ${
                        media &&
                        `
                            <div class="DeckMediaLine">
                                ${
                                    media.youtube &&
                                    `
                                    <div>
                                        <span>[Video: ${media.youtube}] </span>
                                    </div>
                                    ` || ""
                                }
                                ${
                                    media.twitch &&
                                    `
                                    <div>
                                        <span>[Video: ${media.twitch}] </span>
                                    </div>
                                    ` || ""
                                }
                                ${
                                    media.link &&
                                    `
                                    <div>
                                        <span>[Video: ${media.link}] </span>
                                    </div>
                                    ` || ""
                                }
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
                                            class="HeroIconContainer"
                                        >
                                            <img 
                                                src="Images/HeroIcons/${hero.id}_0.png" 
                                            >
                                        </div>
                                `;
                            })
                            .join("")}
                    </div>
                    <div class="TODO">
                        <p>TODO</p>
                        <p>${JSON.stringify(DeckStats, null, 2)}</p>
                    </div>
                </div>
            </div>
        </div>
        `
}