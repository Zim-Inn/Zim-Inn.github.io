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
    const createColorBoxes = (DeckStats) => {
        return `
            <div class="DeckViewerCardColourBoxChartInner DeckViewerCardManaColouringR"
                onmousemove="ShowTextTooltip(1, '${DeckStats.CardColourCounts.R.reduce((a,b) => a+b)} Red Cards');" 
                onmouseout="ShowTextTooltip(0,0);"
            >
                ${DeckStats.CardColourCounts.R.reduce((a,b) => a+b)}
            </div>
            <div class="DeckViewerCardColourBoxChartInner DeckViewerCardManaColouringG"
                onmousemove="ShowTextTooltip(1, '${DeckStats.CardColourCounts.G.reduce((a,b) => a+b)} Green Cards');" 
                onmouseout="ShowTextTooltip(0,0);"
            >
                ${DeckStats.CardColourCounts.G.reduce((a,b) => a+b)}
            </div>
            <div class="DeckViewerCardColourBoxChartInner DeckViewerCardManaColouringU"
                onmousemove="ShowTextTooltip(1, '${DeckStats.CardColourCounts.U.reduce((a,b) => a+b)} Blue Cards');" 
                onmouseout="ShowTextTooltip(0,0);"
            >
                ${DeckStats.CardColourCounts.U.reduce((a,b) => a+b)}
            </div>
            <div class="DeckViewerCardColourBoxChartInner DeckViewerCardManaColouringB"
                onmousemove="ShowTextTooltip(1, '${DeckStats.CardColourCounts.B.reduce((a,b) => a+b)} Black Cards');" 
                onmouseout="ShowTextTooltip(0,0);"
            >
                ${DeckStats.CardColourCounts.B.reduce((a,b) => a+b)}
            </div>
            <div class="clear"></div>
        `
    }

    const createColorBars = (DeckStats) => {
        let result = "";
        for (let bg = 0; bg < 8; bg++) {

            const fullBarHeight = 60;
            const MaxTotalByMana = DeckStats.TotalByMana.reduce((a,b) => Math.max(a,b));
            const GraphHeightPerCard = 60 / MaxTotalByMana;

            const RedBarHeight = DeckStats.CardColourCounts["R"][bg] * GraphHeightPerCard;
            const BlueBarHeight = DeckStats.CardColourCounts["U"][bg] * GraphHeightPerCard;
            const BlackBarHeight = DeckStats.CardColourCounts["B"][bg] * GraphHeightPerCard;
            const GreenBarHeight = DeckStats.CardColourCounts["G"][bg] * GraphHeightPerCard;
            const ColourlessBarHeight = DeckStats.CardColourCounts["C"][bg] * GraphHeightPerCard;
            const PaddingBarHeight =
                fullBarHeight -
                    RedBarHeight -
                    BlueBarHeight -
                    BlackBarHeight -
                    GreenBarHeight -
                    ColourlessBarHeight;

            result += `
            <div class="SummaryBarsContainer">
                <div class="ChartBarOuter">
                    <div class="DeckViewerCardManaColouringPadding" style="height: ${PaddingBarHeight}px;">
                    </div>
                    <div class="DeckViewerCardManaColouringR" 
                        style="height: ${RedBarHeight}px;" 
                        onmousemove="ShowTextTooltip(1,'${DeckStats.CardColourCounts["R"][bg]} Red Cards');" 
                        onmouseout="ShowTextTooltip(0,0);">
                    </div>
                    <div class="DeckViewerCardManaColouringU" 
                        style="height: ${BlueBarHeight}px;" 
                        onmousemove="ShowTextTooltip(1,'${DeckStats.CardColourCounts["U"][bg]} Blue Cards');" 
                        onmouseout="ShowTextTooltip(0,0);">
                    </div>
                    <div class="DeckViewerCardManaColouringB" 
                        style="height: ${BlackBarHeight}px;" 
                        onmousemove="ShowTextTooltip(1,'${DeckStats.CardColourCounts["B"][bg]} Black Cards');" 
                        onmouseout="ShowTextTooltip(0,0);">
                    </div>
                    <div class="DeckViewerCardManaColouringG" 
                        style="height: ${GreenBarHeight}px;" 
                        onmousemove="ShowTextTooltip(1,'${DeckStats.CardColourCounts["G"][bg]} Green Cards');" 
                        onmouseout="ShowTextTooltip(0,0);">
                    </div>
                    <div class="DeckViewerCardManaColouringC" 
                        style="height: ${ColourlessBarHeight}px;" 
                        onmousemove="ShowTextTooltip(1,'${DeckStats.CardColourCounts["C"][bg]} Colourless Cards');" 
                        onmouseout="ShowTextTooltip(0,0);">
                    </div>
                </div>
                <div class="ChartNumber">${bg + 1}${bg === 7 ? "+" : ""}</div>
            </div>
            `
        }
        return result;        
    }

    return `
        <div class="DeckColorSummaryBoxes">
            ${createColorBoxes(DeckStats)}
        </div>
        <div class="DeckColorSummaryBars">
            ${createColorBars(DeckStats)}
        </div>
    `
}