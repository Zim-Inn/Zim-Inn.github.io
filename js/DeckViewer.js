// Listener for Enter key to be used on text inputs - I will use it on DeckCodeInputField
const onEnterSubmit = (event, submitFunction) => {
    // 13 is Enter
    if (event && event.keyCode==13) {
        console.log("BRUH")
        submitFunction();
    }
}

const ViewDiffDeckButton = function() {
    document.getElementById('DeckCodeInputContainer').style.display = "block";
}

const LoadDeckFunc = function() {
    const DeckCodeToLoad = document.getElementById('DeckCodeInputField').value;
    document.getElementById('DeckViewerDeckOuterContainer').style.display = "block";
    document.getElementById('DeckCodeInputContainer').style.display = "none";
    document.getElementById('DeckCodeErrorContainer').style.display = "none";

    let DecodedDeck;
    try {
        DecodedDeck = CArtifactDeckDecoder.ParseDeck(DeckCodeToLoad);
    } catch (error) {
        console.error("There was a problem with the deckcode parser: ", error);
        DecodedDeck = false;
    }
    
    if (DecodedDeck) {
        history.pushState({}, "Artifact 2 Deck Viewer", `?d=${DeckCodeToLoad}`);
        let DeckName = DecodedDeck['name'];
        if (DeckName.charAt(0) == "%") {
            DeckName = "Unnamed Deck";
        }
        let DV_SortedHeroes = DV_OrderHeroesByTurn(DecodedDeck['heroes']);

        let HeroCards = new Array();
        let CardArrayIndex = -1;
        for (let ch = 0; ch < DV_SortedHeroes.length; ch++) {
            CardArrayIndex = -1;
            for (let cj = 0; cj < CardJSON.length; cj++) {
                if ((CardJSON[cj]['card_id']) == DV_SortedHeroes[ch]['id']) {
                    CardArrayIndex = cj;
                    break;
                }
            }
            if (CardArrayIndex != -1) {
                HeroCards.push({id: CardJSON[CardArrayIndex]['card_id']});

                //Push Signatures to the CardDeck
                let LatestHeroVersion = CardJSON[CardArrayIndex]['versions'].length -1;
                let SigIDV = "";
                let HeroIconForSignature = "";
                if (CardJSON[CardArrayIndex]['versions'][LatestHeroVersion]['signature'].length == 1){
                    SigIDV = CardJSON[CardArrayIndex]['versions'][LatestHeroVersion]['signature'][0];
                    SigIDV = SigIDV.split("_");
                    SigID = SigIDV[0];
                    HeroIconForSignature = CardJSON[CardArrayIndex]['versions'][LatestHeroVersion]['icon'];
                    DecodedDeck['cards'].push({id: SigID, count: 3, heroicon: HeroIconForSignature});
                } else {
                    for (let sc = 0; sc < CardJSON[CardArrayIndex]['versions'][LatestHeroVersion]['signature'].length; sc++) {
                        SigIDV = CardJSON[CardArrayIndex]['versions'][LatestHeroVersion]['signature'][sc];
                        SigIDV = SigIDV.split("_");
                        SigID = SigIDV[0];
                        DecodedDeck['cards'].push({id: SigID, count: 1, heroicon: HeroIconForSignature});
                    }
                }
            } else {
                //Throw an error - we can't find that hero.
                break;
            }
        }
        for (let hc = 0; hc < HeroCards.length; hc++) {
            document.getElementById('DeckViewer_HeroCard'+(hc+1)).innerHTML = hc;
            GenerateCard('DeckViewer_HeroCard'+(hc+1),HeroCards[hc]['id']+"_99");            
        }
        for (i = 0; i < CardJSON.length; i++) {
            LatestCardVersion = CardJSON[i]['versions'].length - 1;
        }
        let NonHeroNonItemCards = new Array();
        let NonHeroNonItemCardCounter = 0;
        let ItemCards = new Array();
        let ItemCardCounter = 0;

        for (let i = 0; i < DecodedDeck['cards'].length; i++) {
            let DDCardID = DecodedDeck['cards'][i].id;
            let DDCardCount = DecodedDeck['cards'][i].count;
            let DDHeroIcon = "";
            if ("heroicon" in DecodedDeck['cards'][i]) {
                DDHeroIcon = DecodedDeck['cards'][i]['heroicon'];
            }
            

            CardArrayIndex = -1;
            for (let cj = 0; cj < CardJSON.length; cj++) {
                if ((CardJSON[cj]['card_id']) == DDCardID) {
                    CardArrayIndex = cj;
                    break;
                }
            }
            if (CardArrayIndex != -1) {
                let LatestCardVersion = CardJSON[CardArrayIndex]['versions'].length - 1;
                let CardType = CardJSON[CardArrayIndex]['versions'][LatestCardVersion]['card_type'];
                if (CardType == "Item") {
                    ItemCards.push(CardJSON[CardArrayIndex]);
                    ItemCards[ItemCardCounter]['count'] = DDCardCount;
                    ItemCardCounter++;
                } else {
                    NonHeroNonItemCards.push(CardJSON[CardArrayIndex]);
                    NonHeroNonItemCards[NonHeroNonItemCardCounter]['count'] = DDCardCount;
                    if ("is_signature" in CardJSON[CardArrayIndex]['versions'][LatestCardVersion]) {
                        NonHeroNonItemCards[NonHeroNonItemCardCounter]['heroicon'] = DDHeroIcon;
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
        let CardTypeCounts = new Array;
        CardTypeCounts['Creep'] = 0;
        CardTypeCounts['Spell'] = 0;
        CardTypeCounts['Improvement'] = 0;
        CardTypeCounts['Weapon'] = 0;
        CardTypeCounts['Armour'] = 0;
        CardTypeCounts['Accessory'] = 0;
        CardTypeCounts['Consumable'] = 0;

        let CardColourCounts = new Array;
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
            CardColourCounts[ColourForLoop] = new Array;
            for (let mc = 0; mc < 8; mc++) {
                CardColourCounts[ColourForLoop][mc] = 0;
            }
        }
        for (let i = 0; i < NonHeroNonItemCards.length; i++) {
            let HeroIcon = "";
            if ("heroicon" in NonHeroNonItemCards[i]) {
                HeroIcon = "<img src='Images/HeroIcons/"+NonHeroNonItemCards[i]['heroicon']+".png'>";
            }
            let CardID = NonHeroNonItemCards[i]['card_id'];
            let LatestCardVersion = NonHeroNonItemCards[i]['versions'].length -1;
            let CardIDV = CardID+"_"+LatestCardVersion;
            let CardName = NonHeroNonItemCards[i]['versions'][LatestCardVersion]['card_name']['english'];
            let CardCount = NonHeroNonItemCards[i]['count'];
            let CardMiniImage = NonHeroNonItemCards[i]['versions'][LatestCardVersion]['miniimage'];
            let CardType = NonHeroNonItemCards[i]['versions'][LatestCardVersion]['card_type'];
            let CardListCardTypeIconStyle = "CardList_CardTypeIcon"+CardType;
            let CardCost = NonHeroNonItemCards[i]['versions'][LatestCardVersion]['cost'];
            let CardColour = NonHeroNonItemCards[i]['versions'][LatestCardVersion]['colour'];
            DV_NonHeroNonItemCardListHTML += '<a href="index.html?id='+CardIDV+'"><div class="CardListItemContainer CardListItemContainer'+CardColour+'" onmousemove="CardViewerCardPreviewTooltip(\''+CardIDV+'\',1);" onmouseout="CardViewerCardPreviewTooltip(0,0);"> \
            <div class="CardList_CardMiniPicture"><img src=Images/Cards/MiniImage/'+CardMiniImage+'.jpg></div> \
            <div class="CardList_CardTypeIcon '+CardListCardTypeIconStyle+'"></div> \
            <div class="CardList_Cost CardList_ManaCost">'+CardCost+'</div> \
            <div class="CardList_CardName">'+CardName+'</div> \
            <div class="CardList_CardCount"> x '+CardCount+'</div> \
            <div class="CardList_HeroIcon">'+HeroIcon+'</div> \
            </div></a>';

            //Update Counter Arrays
            if (CardCost > 8) {
                CardCost = 8;
            }
            CardColourCounts[CardColour][CardCost-1] += CardCount;
            CardTypeCounts[CardType] += CardCount;
        }

        let DV_ItemCardListHTML = "";

        for (let i = 0; i < ItemCards.length; i++) {
            let CardID = ItemCards[i]['card_id'];
            let LatestCardVersion = ItemCards[i]['versions'].length -1;
            let CardIDV = CardID+"_"+LatestCardVersion;
            let CardName = ItemCards[i]['versions'][LatestCardVersion]['card_name']['english'];
            let CardCount = ItemCards[i]['count'];
            let CardMiniImage = ItemCards[i]['versions'][LatestCardVersion]['miniimage'];
            let CardType = ItemCards[i]['versions'][LatestCardVersion]['card_subtype'];
            let CardListCardTypeIconStyle = "CardList_CardTypeIcon"+CardType;
            let CardCost = ItemCards[i]['versions'][LatestCardVersion]['gcost'];
            let CardColour = "I";
            DV_ItemCardListHTML += '<a href="index.html?id='+CardIDV+'"><div class="CardListItemContainer CardListItemContainer'+CardColour+'" onmousemove="CardViewerCardPreviewTooltip(\''+CardIDV+'\',1);" onmouseout="CardViewerCardPreviewTooltip(0,0);"> \
            <div class="CardList_CardMiniPicture"><img src=Images/Cards/MiniImage/'+CardMiniImage+'.jpg></div> \
            <div class="CardList_CardTypeIcon '+CardListCardTypeIconStyle+'"></div> \
            <div class="CardList_Cost CardList_GoldCost">'+CardCost+'</div> \
            <div class="CardList_CardName">'+CardName+'</div> \
            <div class="CardList_CardCount"> x '+CardCount+'</div> \
            <div class="CardList_HeroIcon"></div> \
            </div></a>';

            //Update Counter Arrays
            CardTypeCounts[CardType] += CardCount;
        }

        //Update Counter Divs
        document.getElementById('NumberOfCreeps').innerHTML = CardTypeCounts['Creep'];
        document.getElementById('NumberOfSpells').innerHTML = CardTypeCounts['Spell'];
        document.getElementById('NumberOfTE').innerHTML = CardTypeCounts['Improvement'];
        document.getElementById('NumberOfWeapons').innerHTML = CardTypeCounts['Weapon'];
        document.getElementById('NumberOfArmour').innerHTML = CardTypeCounts['Armour'];
        document.getElementById('NumberOfAccessories').innerHTML = CardTypeCounts['Accessory'];
        document.getElementById('NumberOfConsumables').innerHTML = CardTypeCounts['Consumable'];

        let TotalR = 0;
        let TotalU = 0;
        let TotalB = 0;
        let TotalG = 0;
        for (let cc = 0; cc < 5; cc++) {
            switch (cc) {
                case 0:
                    for (let mc = 0; mc < 8; mc++) {
                        TotalR += CardColourCounts['R'][mc];
                    }
                    break;
                case 1:
                    for (let mc = 0; mc < 8; mc++) {
                        TotalU += CardColourCounts['U'][mc];
                    }
                    break;
                case 2:
                    for (let mc = 0; mc < 8; mc++) {
                        TotalB += CardColourCounts['B'][mc];
                    }
                    break;
                case 3:
                    for (let mc = 0; mc < 8; mc++) {
                        TotalG += CardColourCounts['G'][mc];
                    }
                    break;
            }
        }
        let TotalByMana = new Array;
        for (let mc = 0; mc < 8; mc++) {
            TotalByMana[mc] = CardColourCounts['R'][mc] + CardColourCounts['U'][mc] + CardColourCounts['B'][mc] + CardColourCounts['G'][mc];
        }
        let MaxTotalByMana = Math.max(TotalByMana[0],TotalByMana[1],TotalByMana[2],TotalByMana[3],TotalByMana[4],TotalByMana[5],TotalByMana[6],TotalByMana[7]);
        let GraphHeightPerCard = 60/MaxTotalByMana;

        for (let bg = 0; bg < 8; bg++) {
            let RedBarHeight = CardColourCounts['R'][bg] * GraphHeightPerCard;
            let BlueBarHeight = CardColourCounts['U'][bg] * GraphHeightPerCard;
            let BlackBarHeight = CardColourCounts['B'][bg] * GraphHeightPerCard;
            let GreenBarHeight = CardColourCounts['G'][bg] * GraphHeightPerCard;
            let PaddingBarHeight = 60 - RedBarHeight - BlueBarHeight - BlackBarHeight - GreenBarHeight;
            document.getElementById('DeckViewerCardManaColourChartBar'+(bg+1)).innerHTML = '<div class="DeckViewerCardManaColouringPadding" style="height: '+PaddingBarHeight+'px;"></div> \
                                                                                            <div class="DeckViewerCardManaColouringR" style="height: '+RedBarHeight+'px;" onmousemove="ShowTextTooltip(1, \''+CardColourCounts['R'][bg]+' Red Cards\');" onmouseout="ShowTextTooltip(0,0);"></div> \
                                                                                            <div class="DeckViewerCardManaColouringU" style="height: '+BlueBarHeight+'px;" onmousemove="ShowTextTooltip(1, \''+CardColourCounts['U'][bg]+' Blue Cards\');" onmouseout="ShowTextTooltip(0,0);"></div> \
                                                                                            <div class="DeckViewerCardManaColouringB" style="height: '+BlackBarHeight+'px;" onmousemove="ShowTextTooltip(1, \''+CardColourCounts['B'][bg]+' Black Cards\');" onmouseout="ShowTextTooltip(0,0);"></div> \
                                                                                            <div class="DeckViewerCardManaColouringG" style="height: '+GreenBarHeight+'px;" onmousemove="ShowTextTooltip(1, \''+CardColourCounts['G'][bg]+' Green Cards\');" onmouseout="ShowTextTooltip(0,0);"></div>';
        }
        document.getElementById('DeckViewerBoxChartR').outerHTML = '<div id="DeckViewerBoxChartR" class="DeckViewerCardColourBoxChartInner DeckViewerCardManaColouringR" onmousemove="ShowTextTooltip(1, \''+TotalR+' Red Cards\');" onmouseout="ShowTextTooltip(0,0);">'+TotalR+'</div>';
        document.getElementById('DeckViewerBoxChartU').outerHTML = '<div id="DeckViewerBoxChartU" class="DeckViewerCardColourBoxChartInner DeckViewerCardManaColouringU" onmousemove="ShowTextTooltip(1, \''+TotalU+' Blue Cards\');" onmouseout="ShowTextTooltip(0,0);">'+TotalU+'</div>';
        document.getElementById('DeckViewerBoxChartB').outerHTML = '<div id="DeckViewerBoxChartB" class="DeckViewerCardColourBoxChartInner DeckViewerCardManaColouringB" onmousemove="ShowTextTooltip(1, \''+TotalB+' Black Cards\');" onmouseout="ShowTextTooltip(0,0);">'+TotalB+'</div>';
        document.getElementById('DeckViewerBoxChartG').outerHTML = '<div id="DeckViewerBoxChartG" class="DeckViewerCardColourBoxChartInner DeckViewerCardManaColouringG" onmousemove="ShowTextTooltip(1, \''+TotalG+' Green Cards\');" onmouseout="ShowTextTooltip(0,0);">'+TotalG+'</div>';

        let TotalItemCards = CardTypeCounts['Weapon']+CardTypeCounts['Armour']+CardTypeCounts['Accessory']+CardTypeCounts['Consumable'];
        if (TotalItemCards == 1) {
            document.getElementById('TotalNumberItems').innerHTML = TotalItemCards+" Card";
        } else {
            document.getElementById('TotalNumberItems').innerHTML = TotalItemCards+" Cards";
        }
        let TotalNonHeroNonItemCards = CardTypeCounts['Creep']+CardTypeCounts['Spell']+CardTypeCounts['Improvement'];
        if (TotalNonHeroNonItemCards == 1) {
            document.getElementById('TotalNumberCards').innerHTML = TotalNonHeroNonItemCards+" Card";
        } else {
            document.getElementById('TotalNumberCards').innerHTML = TotalNonHeroNonItemCards+" Cards";
        }

        document.getElementById('NonHeroNonItemCardListContainer').innerHTML = DV_NonHeroNonItemCardListHTML;
        document.getElementById('ItemCardListContainer').innerHTML = DV_ItemCardListHTML;
        document.getElementById('DeckViewerDeckTitle').innerHTML = DeckName;


    } else { //Invalid code, or some other error. Should probably put an error message here or something :-)
        document.getElementById('DeckCodeInputContainer').style.display = "block";
        document.getElementById('DeckCodeErrorContainer').style.display = "block";
        document.getElementById('DeckViewerDeckOuterContainer').style.display = "none";
    }
}

