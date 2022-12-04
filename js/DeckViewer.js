// Listener for Enter key to be used on text inputs - I will use it on DeckCodeInputField
const onEnterSubmit = (event, submitFunction) => {
    // 13 is Enter
    if (event && event.keyCode === 13) {
        submitFunction();
    }
};

const ViewDiffDeckButton = function () {
    document.getElementById("DeckCodeInputContainer").style.display = "block";
    document.getElementById("DeckExampleTabsContainer").style.display = "flex";
    document.getElementById("DeckExamplesOuterContainer").style.display = "block";
    document.getElementById("DeckViewerDeckOuterContainer").style.display = "none";
};

// ---------
// Deck data treatment functions
// ---------

const findCardJSONIndexFromID = (cardID) => {
    // The amount of times this is run on this code is scaring me
    for (let index = 0; index < CardJSON.length; index++) {
        if (CardJSON[index]["card_id"] === cardID) {
            return index;
        }
    }
    return -1;
};
const getDecodedDeckFromCode = (deckCode, errorMsg) => {
    try {
        if (!deckCode) {
            throw "No Code Provided";
        }
        return CArtifactDeckDecoder.ParseDeck(deckCode);
    } catch (error) {
        console.error(errorMsg, error);
        return false;
    }
};
const getCardDataFromDecoded = (decodedDeck) => {
    const cardData = {
        DeckName:
            decodedDeck["name"].charAt(0) === "%"
                ? "Unnamed Deck"
                : decodedDeck["name"],
        HeroDeck: [],
        ItemDeck: [],
        MainDeck: [],
    };

    // Add Signatures to base data
    // I oppose this concept of unlabeled parameter mutability, but I'm not gonna redo this
    const SortedHeroes = DV_OrderHeroesByTurn(decodedDeck["heroes"]);

    for (let ch = 0; ch < SortedHeroes.length; ch++) {
        const HeroID = SortedHeroes[ch]["id"];
        const CardArrayIndex = findCardJSONIndexFromID(HeroID);

        if (CardArrayIndex !== -1) {
            const LatestHeroVersion =
                CardJSON[CardArrayIndex]["versions"].length - 1;
            const HeroIconForSignature =
                CardJSON[CardArrayIndex]["versions"][LatestHeroVersion][
                    "icon"
                    ] || "";
            let SigIDV = "";
            cardData.HeroDeck.push({
                id: CardJSON[CardArrayIndex]["card_id"],
                colour:
                CardJSON[CardArrayIndex]["versions"][LatestHeroVersion]
                    .colour,
            });

            if (
                CardJSON[CardArrayIndex]["versions"][LatestHeroVersion][
                    "signature"
                    ].length === 1
            ) {
                SigIDV =
                    CardJSON[CardArrayIndex]["versions"][LatestHeroVersion][
                        "signature"
                        ][0];
                SigIDV = SigIDV.split("_");
                SigID = SigIDV[0];
                decodedDeck["cards"].push({
                    id: SigID,
                    count: 3,
                    heroicon: HeroIconForSignature,
                });
            } else {
                // Lina and Mazzie
                for (
                    let sc = 0;
                    sc <
                    CardJSON[CardArrayIndex]["versions"][LatestHeroVersion][
                        "signature"
                        ].length;
                    sc++
                ) {
                    SigIDV =
                        CardJSON[CardArrayIndex]["versions"][LatestHeroVersion][
                            "signature"
                            ][sc];
                    SigIDV = SigIDV.split("_");
                    SigID = SigIDV[0];
                    decodedDeck["cards"].push({
                        id: SigID,
                        count: 1,
                        heroicon: HeroIconForSignature,
                    });
                }
            }
        } else {
            //Throw an error - we can't find that hero.
            break;
        }
    }

    // Add each deck to cardData
    for (let i = 0; i < decodedDeck["cards"].length; i++) {
        const DDCardID = decodedDeck["cards"][i].id;
        const DDCardCount = decodedDeck["cards"][i].count;
        let DDHeroIcon = decodedDeck["cards"][i]["heroicon"] || "";

        const CardArrayIndex = findCardJSONIndexFromID(DDCardID);

        if (CardArrayIndex !== -1) {
            const LatestCardVersion =
                CardJSON[CardArrayIndex]["versions"].length - 1;
            const CardType =
                CardJSON[CardArrayIndex]["versions"][LatestCardVersion][
                    "card_type"
                    ];
            if (CardType === "Item") {
                cardData.ItemDeck.push(CardJSON[CardArrayIndex]);
                cardData.ItemDeck[cardData.ItemDeck.length - 1][
                    "count"
                    ] = DDCardCount;
            } else {
                cardData.MainDeck.push(CardJSON[CardArrayIndex]);
                cardData.MainDeck[cardData.MainDeck.length - 1][
                    "count"
                    ] = DDCardCount;
                if (
                    "is_signature" in
                    CardJSON[CardArrayIndex]["versions"][LatestCardVersion]
                ) {
                    cardData.MainDeck[cardData.MainDeck.length - 1][
                        "heroicon"
                        ] = DDHeroIcon;
                }
            }
        } else {
            //Throw an error - we can't find that card.
            break;
        }
    }

    // Sort the Decks
    cardData.MainDeck = OrderCardList(0, cardData.MainDeck, 0);
    cardData.ItemDeck = OrderCardList(0, 0, cardData.ItemDeck);

    return cardData;
};
const getDeckStats = (cardData) => {
    const deckStats = {
        CardTypeCounts: {
            Creep: 0,
            Spell: 0,
            Improvement: 0,
            Weapon: 0,
            Armor: 0,
            Accessory: 0,
            Consumable: 0,
        },
        CardColourCounts: {
            R: new Array(8).fill(0),
            G: new Array(8).fill(0),
            B: new Array(8).fill(0),
            U: new Array(8).fill(0),
            C: new Array(8).fill(0),
        },
        TotalByMana: new Array(8).fill(0),
        TotalItems: 0,
        TotalCards: 0,
    };

    if (!cardData || !cardData.ItemDeck || !cardData.MainDeck) {
        console.error("Serious issue with constructing cardData", cardData);
        return deckStats;
    }

    // Items
    cardData.ItemDeck.forEach((item, index) => {
        if (!item.versions || !item.versions.length) {
            console.error(
                "Issue with item in cardData.ItemDeck. Index: " + index,
                item
            );
            console.error("Seriously, this shouldn't happen!");
            return deckStats;
        }
        const latestVersion = item.versions[item.versions.length - 1];

        // add count
        for (let i = 0; i < item.count; i++) {
            deckStats.CardTypeCounts[latestVersion.card_subtype]++;
            deckStats.TotalItems++;
        }
    });

    // Main Deck
    cardData.MainDeck.forEach((card, index) => {
        if (!card.versions || !card.versions.length) {
            console.error(
                "Issue with card in cardData.CardDeck. Index: " + index,
                card
            );
            console.error("Seriously, this shouldn't happen!");
            return deckStats;
        }
        const latestVersion = card.versions[card.versions.length - 1];

        // add count
        for (let i = 0; i < card.count; i++) {
            deckStats.CardTypeCounts[latestVersion.card_type]++;
            deckStats.CardColourCounts[latestVersion.colour][
            (latestVersion.cost > 7 ? 8 : Math.max(1, latestVersion.cost)) -
            1
                ]++;
            deckStats.TotalCards++;
            if (latestVersion.cost > 7) {
                deckStats.TotalByMana[7]++;
            } else {
                deckStats.TotalByMana[latestVersion.cost - 1]++;
            }
        }
    });

    return deckStats;
};

const Draft4Decks = function () {
    const containerHTML = document.getElementById("DeckExamplesInnerContainer");
    containerHTML.innerHTML = "";
    if (_deckTypeSelection === "community") {
        DV_LoadCommunityDecks(containerHTML);
    } else {
        DV_LoadValveDecks(containerHTML);
    }
}


// ---------
// Webpage Functions
// ---------

const LoadDeckFunc = function (skipHistory, deckCode) {
    const DeckCodeToLoad =
        deckCode || document.getElementById("DeckCodeInputField").value;
    document.getElementById("DeckViewerDeckOuterContainer").style.display =
        "block";
    document.getElementById("DeckCodeInputContainer").style.display = "none";
    document.getElementById("DeckCodeErrorContainer").style.display = "none";
    document.getElementById("DeckExamplesOuterContainer").style.display = "none";
    document.getElementById("DeckExampleTabsContainer").style.display = "none";

    const DecodedDeck = getDecodedDeckFromCode(
        DeckCodeToLoad,
        "There was a problem with the deckcode parser: "
    );

    if (DecodedDeck) {
        if (!skipHistory) {
            history.pushState(
                {},
                "Artifact 2 Deck Viewer",
                `?d=${DeckCodeToLoad}`
            );
        }

        // Required for copy paste
        document.getElementById("hiddenClipboard").value = document.location.href.split("?")[0] + "?d=" + DeckCodeToLoad;

        let DeckName = DecodedDeck["name"];
        if (DeckName.charAt(0) === "%") {
            DeckName = "Unnamed Deck";
        }
        const DV_SortedHeroes = DV_OrderHeroesByTurn(DecodedDeck["heroes"]);

        let HeroCards = [];
        let CardArrayIndex = -1;
        for (let ch = 0; ch < DV_SortedHeroes.length; ch++) {
            CardArrayIndex = -1;
            // OH GOD, HOW MANY TIMES DO WE RUN THIS AGAIN???
            for (let cj = 0; cj < CardJSON.length; cj++) {
                if (CardJSON[cj]["card_id"] === DV_SortedHeroes[ch]["id"]) {
                    CardArrayIndex = cj;
                    break;
                }
            }
            if (CardArrayIndex !== -1) {
                HeroCards.push({id: CardJSON[CardArrayIndex]["card_id"]});

                //Push Signatures to the CardDeck
                let LatestHeroVersion =
                    CardJSON[CardArrayIndex]["versions"].length - 1;
                let SigIDV = "";
                let HeroIconForSignature = "";
                if (
                    CardJSON[CardArrayIndex]["versions"][LatestHeroVersion][
                        "signature"
                        ].length === 1
                ) {
                    SigIDV =
                        CardJSON[CardArrayIndex]["versions"][LatestHeroVersion][
                            "signature"
                            ][0];
                    SigIDV = SigIDV.split("_");
                    SigID = SigIDV[0];
                    HeroIconForSignature =
                        CardJSON[CardArrayIndex]["versions"][LatestHeroVersion][
                            "icon"
                            ];
                    DecodedDeck["cards"].push({
                        id: SigID,
                        count: 3,
                        heroicon: HeroIconForSignature,
                    });
                } else {
                    for (
                        let sc = 0;
                        sc <
                        CardJSON[CardArrayIndex]["versions"][LatestHeroVersion][
                            "signature"
                            ].length;
                        sc++
                    ) {
                        SigIDV =
                            CardJSON[CardArrayIndex]["versions"][
                                LatestHeroVersion
                                ]["signature"][sc];
                        SigIDV = SigIDV.split("_");
                        SigID = SigIDV[0];
                        HeroIconForSignature =
                            CardJSON[CardArrayIndex]["versions"][LatestHeroVersion][
                                "icon"
                                ];
                        DecodedDeck["cards"].push({
                            id: SigID,
                            count: 1,
                            heroicon: HeroIconForSignature,
                        });
                    }
                }
            } else {
                //Throw an error - we can't find that hero.
                break;
            }
        }
        for (let hc = 0; hc < HeroCards.length; hc++) {
            document.getElementById(
                "DeckViewer_HeroCard" + (hc + 1)
            ).innerHTML = hc;
            GenerateCard(
                "DeckViewer_HeroCard" + (hc + 1),
                HeroCards[hc]["id"] + "_99"
            );
        }
        for (i = 0; i < CardJSON.length; i++) {
            LatestCardVersion = CardJSON[i]["versions"].length - 1;
        }
        let NonHeroNonItemCards = [];
        let NonHeroNonItemCardCounter = 0;
        let ItemCards = [];
        let ItemCardCounter = 0;

        for (let i = 0; i < DecodedDeck["cards"].length; i++) {
            let DDCardID = DecodedDeck["cards"][i].id;
            let DDCardCount = DecodedDeck["cards"][i].count;
            let DDHeroIcon = "";
            if ("heroicon" in DecodedDeck["cards"][i]) {
                DDHeroIcon = DecodedDeck["cards"][i]["heroicon"];
            }

            CardArrayIndex = -1;
            // AAAAAAAAAAAAAAAAAAAAAAAa
            for (let cj = 0; cj < CardJSON.length; cj++) {
                if (CardJSON[cj]["card_id"] === DDCardID) {
                    CardArrayIndex = cj;
                    break;
                }
            }
            if (CardArrayIndex !== -1) {
                let LatestCardVersion =
                    CardJSON[CardArrayIndex]["versions"].length - 1;
                let CardType =
                    CardJSON[CardArrayIndex]["versions"][LatestCardVersion][
                        "card_type"
                        ];
                if (CardType === "Item") {
                    ItemCards.push(CardJSON[CardArrayIndex]);
                    ItemCards[ItemCardCounter]["count"] = DDCardCount;
                    ItemCardCounter++;
                } else {
                    NonHeroNonItemCards.push(CardJSON[CardArrayIndex]);
                    NonHeroNonItemCards[NonHeroNonItemCardCounter][
                        "count"
                        ] = DDCardCount;
                    if (
                        "is_signature" in
                        CardJSON[CardArrayIndex]["versions"][LatestCardVersion]
                    ) {
                        NonHeroNonItemCards[NonHeroNonItemCardCounter][
                            "heroicon"
                            ] = DDHeroIcon;
                    }
                    NonHeroNonItemCardCounter++;
                }
            } else {
                //Throw an error - we can't find that card.
                break;
            }
        }

        NonHeroNonItemCards = OrderCardList(0, NonHeroNonItemCards, 0);
        ItemCards = OrderCardList(0, 0, ItemCards);

        let DV_NonHeroNonItemCardListHTML = "";
        let CardTypeCounts = [];
        CardTypeCounts["Creep"] = 0;
        CardTypeCounts["Spell"] = 0;
        CardTypeCounts["Improvement"] = 0;
        CardTypeCounts["Weapon"] = 0;
        CardTypeCounts["Armor"] = 0;
        CardTypeCounts["Accessory"] = 0;
        CardTypeCounts["Consumable"] = 0;

        let CardColourCounts = [];
        let ColourForLoop = "";
        for (let cc = 0; cc < 5; cc++) {
            switch (cc) {
                case 0:
                    ColourForLoop = "R";
                    break;
                case 1:
                    ColourForLoop = "U";
                    break;
                case 2:
                    ColourForLoop = "B";
                    break;
                case 3:
                    ColourForLoop = "G";
                    break;
                case 4:
                    ColourForLoop = "C";
                    break;
            }
            CardColourCounts[ColourForLoop] = [];
            for (let mc = 0; mc < 8; mc++) {
                CardColourCounts[ColourForLoop][mc] = 0;
            }
        }
        for (let i = 0; i < NonHeroNonItemCards.length; i++) {
            let HeroIcon = "";
            if ("heroicon" in NonHeroNonItemCards[i]) {
                HeroIcon =
                    "<img src='Images/HeroIcons/" +
                    NonHeroNonItemCards[i]["heroicon"] +
                    ".png'>";
            }
            let CardID = NonHeroNonItemCards[i]["card_id"];
            let LatestCardVersion =
                NonHeroNonItemCards[i]["versions"].length - 1;
            let CardIDV = CardID + "_" + LatestCardVersion;
            let CardName =
                NonHeroNonItemCards[i]["versions"][LatestCardVersion][
                    "card_name"
                    ]["english"];
            let CardCount = NonHeroNonItemCards[i]["count"];
            let CardMiniImage =
                NonHeroNonItemCards[i]["versions"][LatestCardVersion][
                    "miniimage"
                    ];
            let CardType =
                NonHeroNonItemCards[i]["versions"][LatestCardVersion][
                    "card_type"
                    ];
            let CardListCardTypeIconStyle = "CardList_CardTypeIcon" + CardType;
            let CardCost =
                NonHeroNonItemCards[i]["versions"][LatestCardVersion]["cost"];
            let CardColour =
                NonHeroNonItemCards[i]["versions"][LatestCardVersion]["colour"];
            DV_NonHeroNonItemCardListHTML +=
                '<a href="index.html?id=' +
                CardIDV +
                '"><div class="CardListItemContainer CardListItemContainer' +
                CardColour +
                '" onmousemove="CardViewerCardPreviewTooltip(\'' +
                CardIDV +
                '\',1);" onmouseout="CardViewerCardPreviewTooltip(0,0);"> \
            <div class="CardList_CardMiniPicture"><img src=Images/Cards/MiniImage/' +
                CardMiniImage +
                '.jpg></div> \
            <div class="CardList_CardTypeIcon ' +
                CardListCardTypeIconStyle +
                '"></div> \
            <div class="CardList_Cost CardList_ManaCost">' +
                CardCost +
                '</div> \
            <div class="CardList_CardName">' +
                CardName +
                '</div> \
            <div class="CardList_CardCount"> x ' +
                CardCount +
                '</div> \
            <div class="CardList_HeroIcon">' +
                HeroIcon +
                "</div> \
            </div></a>";

            //Update Counter Arrays
            if (CardCost > 8) {
                CardCost = 8;
            }
            CardColourCounts[CardColour][CardCost - 1] += CardCount;
            CardTypeCounts[CardType] += CardCount;
        }

        let DV_ItemCardListHTML = "";

        for (let i = 0; i < ItemCards.length; i++) {
            let CardID = ItemCards[i]["card_id"];
            let LatestCardVersion = ItemCards[i]["versions"].length - 1;
            let CardIDV = CardID + "_" + LatestCardVersion;
            let CardName =
                ItemCards[i]["versions"][LatestCardVersion]["card_name"][
                    "english"
                    ];
            let CardCount = ItemCards[i]["count"];
            let CardMiniImage =
                ItemCards[i]["versions"][LatestCardVersion]["miniimage"];
            let CardType =
                ItemCards[i]["versions"][LatestCardVersion]["card_subtype"];
            let CardListCardTypeIconStyle = "CardList_CardTypeIcon" + CardType;
            let CardCost = ItemCards[i]["versions"][LatestCardVersion]["gcost"];
            let CardColour = "I";
            DV_ItemCardListHTML +=
                '<a href="index.html?id=' +
                CardIDV +
                '"><div class="CardListItemContainer CardListItemContainer' +
                CardColour +
                '" onmousemove="CardViewerCardPreviewTooltip(\'' +
                CardIDV +
                '\',1);" onmouseout="CardViewerCardPreviewTooltip(0,0);"> \
            <div class="CardList_CardMiniPicture"><img src=Images/Cards/MiniImage/' +
                CardMiniImage +
                '.jpg></div> \
            <div class="CardList_CardTypeIcon ' +
                CardListCardTypeIconStyle +
                '"></div> \
            <div class="CardList_Cost CardList_GoldCost">' +
                CardCost +
                '</div> \
            <div class="CardList_CardName">' +
                CardName +
                '</div> \
            <div class="CardList_CardCount"> x ' +
                CardCount +
                '</div> \
            <div class="CardList_HeroIcon"></div> \
            </div></a>';

            //Update Counter Arrays
            CardTypeCounts[CardType] += CardCount;
        }

        //Update Counter Divs
        document.getElementById("NumberOfCreeps").innerHTML =
            CardTypeCounts["Creep"];
        document.getElementById("NumberOfSpells").innerHTML =
            CardTypeCounts["Spell"];
        document.getElementById("NumberOfTE").innerHTML =
            CardTypeCounts["Improvement"];
        document.getElementById("NumberOfWeapons").innerHTML =
            CardTypeCounts["Weapon"];
        document.getElementById("NumberOfArmour").innerHTML =
            CardTypeCounts["Armor"];
        document.getElementById("NumberOfAccessories").innerHTML =
            CardTypeCounts["Accessory"];
        document.getElementById("NumberOfConsumables").innerHTML =
            CardTypeCounts["Consumable"];

        let TotalR = 0;
        let TotalU = 0;
        let TotalB = 0;
        let TotalG = 0;
        for (let cc = 0; cc < 5; cc++) {
            switch (cc) {
                case 0:
                    for (let mc = 0; mc < 8; mc++) {
                        TotalR += CardColourCounts["R"][mc];
                    }
                    break;
                case 1:
                    for (let mc = 0; mc < 8; mc++) {
                        TotalU += CardColourCounts["U"][mc];
                    }
                    break;
                case 2:
                    for (let mc = 0; mc < 8; mc++) {
                        TotalB += CardColourCounts["B"][mc];
                    }
                    break;
                case 3:
                    for (let mc = 0; mc < 8; mc++) {
                        TotalG += CardColourCounts["G"][mc];
                    }
                    break;
            }
        }
        let TotalByMana = [];
        for (let mc = 0; mc < 8; mc++) {
            TotalByMana[mc] =
                CardColourCounts["R"][mc] +
                CardColourCounts["U"][mc] +
                CardColourCounts["B"][mc] +
                CardColourCounts["G"][mc] +
                CardColourCounts["C"][mc];
        }
        let MaxTotalByMana = Math.max(
            TotalByMana[0],
            TotalByMana[1],
            TotalByMana[2],
            TotalByMana[3],
            TotalByMana[4],
            TotalByMana[5],
            TotalByMana[6],
            TotalByMana[7]
        );
        let GraphHeightPerCard = 60 / MaxTotalByMana;

        for (let bg = 0; bg < 8; bg++) {
            let RedBarHeight = CardColourCounts["R"][bg] * GraphHeightPerCard;
            let BlueBarHeight = CardColourCounts["U"][bg] * GraphHeightPerCard;
            let BlackBarHeight = CardColourCounts["B"][bg] * GraphHeightPerCard;
            let GreenBarHeight = CardColourCounts["G"][bg] * GraphHeightPerCard;
            let ColourlessBarHeight =
                CardColourCounts["C"][bg] * GraphHeightPerCard;
            let PaddingBarHeight =
                60 -
                RedBarHeight -
                BlueBarHeight -
                BlackBarHeight -
                GreenBarHeight -
                ColourlessBarHeight;
            document.getElementById(
                "DeckViewerCardManaColourChartBar" + (bg + 1)
            ).innerHTML = `
                    <div class="DeckViewerCardManaColouringPadding" style="height: ${PaddingBarHeight}px;"></div>
                    <div class="DeckViewerCardManaColouringR" style="height: ${RedBarHeight}px;" onmousemove="ShowTextTooltip(1,'${CardColourCounts["R"][bg]} Red Cards');" onmouseout="ShowTextTooltip(0,0);"></div>
                    <div class="DeckViewerCardManaColouringU" style="height: ${BlueBarHeight}px;" onmousemove="ShowTextTooltip(1,'${CardColourCounts["U"][bg]} Blue Cards');" onmouseout="ShowTextTooltip(0,0);"></div>
                    <div class="DeckViewerCardManaColouringB" style="height: ${BlackBarHeight}px;" onmousemove="ShowTextTooltip(1,'${CardColourCounts["B"][bg]} Black Cards');" onmouseout="ShowTextTooltip(0,0);"></div>
                    <div class="DeckViewerCardManaColouringG" style="height: ${GreenBarHeight}px;" onmousemove="ShowTextTooltip(1,'${CardColourCounts["G"][bg]} Green Cards');" onmouseout="ShowTextTooltip(0,0);"></div>
                    <div class="DeckViewerCardManaColouringC" style="height: ${ColourlessBarHeight}px;" onmousemove="ShowTextTooltip(1,'${CardColourCounts["C"][bg]} Colourless Cards');" onmouseout="ShowTextTooltip(0,0);"></div>
                `;
        }

        document.getElementById("DeckViewerBoxChartR").outerHTML = `
                <div id="DeckViewerBoxChartR" class="DeckViewerCardColourBoxChartInner DeckViewerCardManaColouringR"  
                onmousemove="ShowTextTooltip(1, '${TotalR}  Red Cards');" 
                onmouseout="ShowTextTooltip(0,0);" >
                    ${TotalR}
                </div>
            `;
        document.getElementById("DeckViewerBoxChartU").outerHTML = `
                <div id="DeckViewerBoxChartU" class="DeckViewerCardColourBoxChartInner DeckViewerCardManaColouringU"  
                onmousemove="ShowTextTooltip(1, '${TotalU}  Blue Cards');" 
                onmouseout="ShowTextTooltip(0,0);" >
                    ${TotalU}
                </div>
            `;
        document.getElementById("DeckViewerBoxChartB").outerHTML = `
                <div id="DeckViewerBoxChartB" class="DeckViewerCardColourBoxChartInner DeckViewerCardManaColouringB"  
                onmousemove="ShowTextTooltip(1, '${TotalB}  Black Cards');" 
                onmouseout="ShowTextTooltip(0,0);" >
                    ${TotalB}
                </div>
            `;
        document.getElementById("DeckViewerBoxChartG").outerHTML = `
                <div id="DeckViewerBoxChartG" class="DeckViewerCardColourBoxChartInner DeckViewerCardManaColouringG"  
                onmousemove="ShowTextTooltip(1, '${TotalG}  Green Cards');" 
                onmouseout="ShowTextTooltip(0,0);" >
                    ${TotalG}
                </div>
            `;

        let TotalItemCards =
            CardTypeCounts["Weapon"] +
            CardTypeCounts["Armor"] +
            CardTypeCounts["Accessory"] +
            CardTypeCounts["Consumable"];
        if (TotalItemCards === 1) {
            document.getElementById("TotalNumberItems").innerHTML =
                TotalItemCards + " Item";
        } else {
            document.getElementById("TotalNumberItems").innerHTML =
                TotalItemCards + " Items";
        }
        let TotalNonHeroNonItemCards =
            CardTypeCounts["Creep"] +
            CardTypeCounts["Spell"] +
            CardTypeCounts["Improvement"];
        if (TotalNonHeroNonItemCards === 1) {
            document.getElementById("TotalNumberCards").innerHTML =
                TotalNonHeroNonItemCards + " Card";
        } else {
            document.getElementById("TotalNumberCards").innerHTML =
                TotalNonHeroNonItemCards + " Cards";
        }

        document.getElementById(
            "NonHeroNonItemCardListContainer"
        ).innerHTML = DV_NonHeroNonItemCardListHTML;
        document.getElementById(
            "ItemCardListContainer"
        ).innerHTML = DV_ItemCardListHTML;
        document.getElementById("DeckViewerDeckTitle").innerHTML = DeckName;
        //document.getElementById('OpenDeckInBuilderButton').innerHTML = '<a href="DeckBuilder.html?d='+document.getElementById('DeckCodeInputField').value+'><button type="button" class="ArtifactButtonSmall" onmousemove="ShowTextTooltip(1, \'Open this deck in the Deck Builder\');" onmouseout="ShowTextTooltip(0,0);">OPEN IN DECK BUILDER</button></a>';
        document.getElementById("OpenDeckInBuilderButton").innerHTML =
            '<button type="button" class="ArtifactButtonSmall" onmousemove="ShowTextTooltip(1, \'Open this deck in the Deck Builder\');" onmouseout="ShowTextTooltip(0,0);" onmouseup="window.location.href = \'DeckBuilder.html?d=' +
            DeckCodeToLoad +
            "'\">OPEN IN DECK BUILDER</button>";
    } else {
        //Invalid code, or some other error. Should probably put an error message here or something :-)
        document.getElementById("DeckCodeInputContainer").style.display =
            "block";
        document.getElementById("DeckCodeErrorContainer").style.display =
            "block";
        document.getElementById("DeckViewerDeckOuterContainer").style.display =
            "block";
        document.getElementById("DeckViewerDeckOuterContainer").style.display =
            "none";
    }
    const newDeckToSave = {
        "code": deckCode,
        "description": "没有描述",
        "creator": "未知",
        "submitter": "本地提交者"
    };
    DeckCodesJSON.push(newDeckToSave);
    fs.writeFile("json/DeckCodes.json", JSON.stringify(DeckCodesJSON), {flag: "w"}, function (err) {
        if (!err) {
            console.log("写入成功！");
        }
    })

};


let _deckTypeSelection = "community";
const LoadDeckExamples = () => {
    const containerHTML = document.getElementById("DeckExamplesInnerContainer");
    containerHTML.innerHTML = "";
    if (_deckTypeSelection === "community") {
        DV_LoadCommunityDecks(containerHTML);
    } else {
        DV_LoadValveDecks(containerHTML);
    }
};
const DV_LoadCommunityDecks = (containerHTML) => {
        let i;
// If we don't have deck code data, then something has gone horribly wrong.
        if (!DeckCodesJSON || !DeckCodesJSON.length) {
            containerHTML.style.display = "none";
        }

        // Add in button and unique header
        let DeckExamplesInnerHTML = `<h2>随机4套</h2>`;

        // Produce the actual example list by iterating through the data
//原始数组
        let original = [];
        //给原始数组original赋值
        for (let j = 0; j < DeckCodesJSON.length; j++) {
            original[j] = j;
        }
        //排序
        original.sort(function () {
            return 0.5 - Math.random();
        });
        original = original.slice(0, 4);
        //输出
        DeckCodesJSON.forEach((entry, index) => {
                if (original.includes(index)) {
                    // fetch all required data from the deck
                    const DecodedDeck = getDecodedDeckFromCode(
                        entry.code,
                        "Bad example deck code on index " + i + " with Error: "
                    );
                    if (!DecodedDeck) {
                        return;
                    }

                    const CardData = getCardDataFromDecoded(DecodedDeck);
                    const DeckStats = getDeckStats(CardData);

                    // Render
                    if (!("hidefromdecklist" in entry)) {
                        DeckExamplesInnerHTML += generateDeckExampleHTML(
                            CardData.DeckName,
                            entry.code,
                            entry.description,
                            entry.creator,
                            entry.submitter,
                            entry.media,
                            CardData.HeroDeck,
                            DeckStats
                        );
                    }
                }
            }
        );
        containerHTML.innerHTML = DeckExamplesInnerHTML;
    }
;
const DV_LoadValveDecks = (containerHTML) => {
    // If we don't have valve's deck code data, then something has gone horribly wrong.
    if (!ValveDeckCodesJSON || !ValveDeckCodesJSON.length) {
        containerHTML.style.display = "none";
    }

    // Add in button and unique header
    let DeckExamplesInnerHTML = `<h2>Valve Decks</h2>`;
    ValveDeckCodesJSON.forEach((entry, index) => {
        // fetch all required data from the deck
        const DecodedDeck = getDecodedDeckFromCode(
            entry.code,
            "Bad example deck code on index " + index + " with Error: "
        );
        if (!DecodedDeck) {
            return;
        }

        const CardData = getCardDataFromDecoded(DecodedDeck);
        const DeckStats = getDeckStats(CardData);

        // Render
        DeckExamplesInnerHTML += generateValveDeckExampleHTML(
            CardData.DeckName,
            entry.code,
            entry.description,
            entry.added,
            entry.removed,
            entry.updateLink,
            CardData.HeroDeck,
            DeckStats,
        );
    });
    containerHTML.innerHTML = DeckExamplesInnerHTML;
};
const DV_ChangeExamplesToTypeWithFade = (newSelection) => {
    // Avoid double calling this function by using empty string as a "waiting for animation end" flag
    // It is set with a new value by the time the initial button is gone
    if (
        !(_deckTypeSelection === "community" || _deckTypeSelection === "valve")
    ) {
        return;
    }
    // Avoid calling this function if the target is the same as current flag as well. Why animate no change?
    if (_deckTypeSelection === newSelection) {
        return;
    }

    _deckTypeSelection = "";

    //Change the selected tabs
    const communityTab = document.getElementById("exampleTabCommunity");
    const valveTab = document.getElementById("exampleTabValve");
    if (newSelection === "community") {
        communityTab.classList.add("selected");
        valveTab.classList.remove("selected");
    } else {
        communityTab.classList.remove("selected");
        valveTab.classList.add("selected");
    }


    // Fade out the current examples container element
    const containerHTML = document.getElementById("DeckExamplesInnerContainer");
    containerHTML.style.opacity = 0;

    // Timeout is 1.5s. This value MUST be the same as the transition timing on the CSS file for #DeckExamplesInnerContainer
    setTimeout(() => {
        // Set its display as non and performs changes to the content
        containerHTML.style.display = "none"
        _deckTypeSelection = newSelection;
        LoadDeckExamples();

        // Finally, fade in the new examples container
        containerHTML.style.display = "block"
        containerHTML.style.opacity = 1;
    }, 300);
};
const ShareDeckExample = (deckCode) => {
    const shareURL = document.location.href.split("?")[0] + "?d=" + deckCode;
    const copyText = document.getElementById("hiddenClipboard");
    copyText.value = shareURL;
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/
    try {
        document.execCommand("copy");
    } catch (err) {
        console.error("Oops, unable to copy");
    }
};

let alreadyRestoringShareButton = false;
const restoreShareButtonWithDelay = () => {
    if (alreadyRestoringShareButton) {
        clearTimeout(alreadyRestoringShareButton);
    }
    alreadyRestoringShareButton = setTimeout(() => {
        document.getElementById(
            "ShareCurrentDeckButton"
        ).children[0].innerText = "SHARE";
        alreadyRestoringShareButton = false;
    }, 3000);
};
const DeckCodeShareToClipboard = () => {
    const copyText = document.getElementById("hiddenClipboard");
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    try {
        const successful = document.execCommand("copy");

        document.getElementById(
            "ShareCurrentDeckButton"
        ).children[0].innerText = "Copied!";
        restoreShareButtonWithDelay();
    } catch (err) {
        console.error("Oops, unable to copy");
    }
};

window.onpopstate = (event) => {
    const param = getURLParams(document.location.href);
    if (param.d) {
        document.getElementById("DeckCodeInputField").value = param.d;
        LoadDeckFunc(true);
    } else {
        document.getElementById("DeckCodeInputField").value = "";
        document.getElementById("DeckCodeInputContainer").style.display =
            "block";
        document.getElementById("DeckCodeErrorContainer").style.display =
            "block";
        document.getElementById("DeckExamplesOuterContainer").style.display =
            "block";
        document.getElementById("DeckViewerDeckOuterContainer").style.display =
            "none";
        LoadDeckExamples();
    }
};
