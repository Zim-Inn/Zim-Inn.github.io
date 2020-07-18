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
                    <div class="DeckExampleDeckStatistics">
                        ${generateDeckSummary(DeckStats)}
                    </div>
                    <div class="DeckExampleDeckColorStatistics">
                        ${generateDeckColorStatistics(DeckStats)}
                    </div>
                    <p>${JSON.stringify(DeckStats, null, 2)}</p>
                </div>
            </div>
        </div>
        `
}

const generateDeckSummary = (DeckStats) => {
    return `
        <div class="MainDeckSummary">
            <div class="DeckViewerCardAndItemTypeStatsHeader">
                ${DeckStats.TotalCards} Card${ DeckStats.TotalCards > 1 ? "s" : ""}
            </div>
            <div class="SummaryRow">
                <div class="SummaryTypeContainer">
                    <div class="DeckViewerCardTypeSymbol">▨</div>
                    <div class="DeckViewerCardTypeAmount">${DeckStats.CardTypeCounts.Creep}</div>
                </div>
                <div class="SummaryTypeContainer">
                    <div class="DeckViewerCardTypeSymbol">▪</div>
                    <div class="DeckViewerCardTypeAmount">${DeckStats.CardTypeCounts.Spell}</div>
                </div>
                <div class="SummaryTypeContainer">
                    <div class="DeckViewerCardTypeSymbol">▩</div>
                    <div class="DeckViewerCardTypeAmount">${DeckStats.CardTypeCounts.Improvement}</div>
                </div>
            </div>
        </div>
        <div class="ItemDeckSummary">
            <div class="DeckViewerCardAndItemTypeStatsHeader">
                ${DeckStats.TotalItems} Card${ DeckStats.TotalItems > 1 ? "s" : ""}
            </div>
            <div class="SummaryRow">
                <div class="SummaryTypeContainer">
                    <div class="DeckViewerCardTypeSymbol">▣</div>
                    <div class="DeckViewerCardTypeAmount">${DeckStats.CardTypeCounts.Weapon}</div>
                </div>
                <div class="SummaryTypeContainer">
                    <div class="DeckViewerCardTypeSymbol">▤</div>
                    <div class="DeckViewerCardTypeAmount">${DeckStats.CardTypeCounts.Armor}</div>
                </div>
                <div class="SummaryTypeContainer">
                    <div class="DeckViewerCardTypeSymbol">▥</div>
                    <div class="DeckViewerCardTypeAmount">${DeckStats.CardTypeCounts.Accessory}</div>
                </div>
                <div class="SummaryTypeContainer">
                    <div class="DeckViewerCardTypeSymbol">▦</div>
                    <div class="DeckViewerCardTypeAmount">${DeckStats.CardTypeCounts.Consumable}</div>
                </div>
            </div>
        </div>
    `
}

const generateDeckColorStatistics = (DeckStats) => {

    const createBars = () => {
        let result = "";
        for (let bg = 0; bg < 8; bg++) {
            

        //     let RedBarHeight = CardColourCounts["R"][bg] * GraphHeightPerCard;
        //     let BlueBarHeight = CardColourCounts["U"][bg] * GraphHeightPerCard;
        //     let BlackBarHeight = CardColourCounts["B"][bg] * GraphHeightPerCard;
        //     let GreenBarHeight = CardColourCounts["G"][bg] * GraphHeightPerCard;
        //     let ColourlessBarHeight =
        //         CardColourCounts["C"][bg] * GraphHeightPerCard;
        //     let PaddingBarHeight =
        //         60 -
        //         RedBarHeight -
        //         BlueBarHeight -
        //         BlackBarHeight -
        //         GreenBarHeight -
        //         ColourlessBarHeight;
        //     document.getElementById(
        //         "DeckViewerCardManaColourChartBar" + (bg + 1)
        //     ).innerHTML =
        //         '<div class="DeckViewerCardManaColouringPadding" style="height: ' + PaddingBarHeight +'px;"></div> \
        //             <div class="DeckViewerCardManaColouringR" style="height: ' + RedBarHeight +
        //         'px;" onmousemove="ShowTextTooltip(1, \'' +
        //         CardColourCounts["R"][bg] +
        //         ' Red Cards\');" onmouseout="ShowTextTooltip(0,0);"></div> \
        //             <div class="DeckViewerCardManaColouringU" style="height: ' +
        //         BlueBarHeight +
        //         'px;" onmousemove="ShowTextTooltip(1, \'' +
        //         CardColourCounts["U"][bg] +
        //         ' Blue Cards\');" onmouseout="ShowTextTooltip(0,0);"></div> \
        //             <div class="DeckViewerCardManaColouringB" style="height: ' +
        //         BlackBarHeight +
        //         'px;" onmousemove="ShowTextTooltip(1, \'' +
        //         CardColourCounts["B"][bg] +
        //         ' Black Cards\');" onmouseout="ShowTextTooltip(0,0);"></div> \
        //             <div class="DeckViewerCardManaColouringG" style="height: ' +
        //         GreenBarHeight +
        //         'px;" onmousemove="ShowTextTooltip(1, \'' +
        //         CardColourCounts["G"][bg] +
        //         ' Green Cards\');" onmouseout="ShowTextTooltip(0,0);"></div> \
        //             <div class="DeckViewerCardManaColouringC" style="height: ' +
        //         ColourlessBarHeight +
        //         'px;" onmousemove="ShowTextTooltip(1, \'' +
        //         CardColourCounts["C"][bg] +
        //         ' Colourless Cards\');" onmouseout="ShowTextTooltip(0,0);"></div>';

            result += `
            <div class="DeckViewerCardManaColourChartBarContainer">
                <div class="DeckViewerCardManaColourChartBarOuter"></div>                      
                <div class="DeckViewerCardManaColourChartNumber">${bg + 1}${bg === 7 ? "+" : ""}</div>
            </div>
            `
        }
        return result;        
    }

    return `
    <div class="DeckColorSummaryBoxes">
        <div class="DeckViewerCardColourBoxChartInner DeckViewerCardManaColouringR">
            ${DeckStats.CardColourCounts.R.reduce((a,b) => a+b)}
        </div>
        <div class="DeckViewerCardColourBoxChartInner DeckViewerCardManaColouringG">
            ${DeckStats.CardColourCounts.G.reduce((a,b) => a+b)}
        </div>
        <div class="DeckViewerCardColourBoxChartInner DeckViewerCardManaColouringU">
            ${DeckStats.CardColourCounts.U.reduce((a,b) => a+b)}
        </div>
        <div class="DeckViewerCardColourBoxChartInner DeckViewerCardManaColouringB">
            ${DeckStats.CardColourCounts.B.reduce((a,b) => a+b)}
        </div>
        <div class="clear"></div>
    </div>
    <div class="DeckColorSummaryBars">
        ${createBars()}
        <div class="clear"></div>
    </div>
    `
}