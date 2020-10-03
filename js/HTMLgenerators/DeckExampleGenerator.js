// Requires Helpers {generateDeckSummary, generateDeckColorStatistics}

const generateDeckExampleHTML = (name, code, description, creator, submitter, media, SortedHeroArray, DeckStats) => {
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
                                    <a class="YoutubeButton" 
                                        onmousemove="ShowTextTooltip(1, 'Watch this deck or creator on Youtube')" 
                                        onmouseout="ShowTextTooltip(0,0)" 
                                        href="${media.youtube}" 
                                        target="_blank">
                                    </a>
                                    
                                    ` || ""
                                }
                                ${
                                    media.twitch &&
                                    `
                                    <a
                                        class="TwitchButton" 
                                        onmousemove="ShowTextTooltip(1, 'Watch this deck or creator on Twitch')" 
                                        onmouseout="ShowTextTooltip(0,0)"
                                        href="${media.twitch}" 
                                        target="_blank">
                                    </a>
                                    ` || ""
                                }
                                ${
                                    media.link &&
                                    `
                                    <a
                                        class="OtherButton" 
                                        onmousemove="ShowTextTooltip(1, 'Read or watch guide on another website')" 
                                        onmouseout="ShowTextTooltip(0,0)"
                                        href="${media.link}" 
                                        target="_blank">
                                    </a>
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
        `
}