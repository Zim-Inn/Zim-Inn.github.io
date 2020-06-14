const InitialiseDeckBuilder = function() {
    //GenerateCard("DeckBuilderSelectedCardPreview","10020_99");
    
    for (let cc = 0; cc < CardJSON.length; cc++) {
        let LatestCardVersion = CardJSON[cc]['versions'].length -1;
        let CardType = CardJSON[cc]['versions'][LatestCardVersion]['card_type'];
        let hidefromcardlistcheck = true; //if true show card.
        let issignaturecheck = true; //if true show card.

        if (!('hide_from_card_list' in CardJSON[cc])) {
            hidefromcardlistcheck = true;
        } else {
            hidefromcardlistcheck = false;
        }

        if (!('is_signature' in CardJSON[cc]['versions'][LatestCardVersion])) {
            issignaturecheck = true;
        } else {
            issignaturecheck = false;
        }
        
        if (CardType == "Hero") {
            CardJSON[cc]['available'] = 1;
        } else if ( (CardType == "Spell" || CardType == "Improvement" || CardType == "Creep" || CardType == "Item") && hidefromcardlistcheck && issignaturecheck ) {
            CardJSON[cc]['available'] = 3;
        } else {
            CardJSON[cc]['available'] = 0; // Summons and signatures not available to put into deck.
        }
    }

    //Globals
    DeckHeroCards = new Array;
    for (let ihc = 0; ihc < 5; ihc++) {
        DeckHeroCards.push({id: 0, turn: ihc+1, heroicon: "0"});
    }
    DeckItemCards = new Array; 
    DeckNonHeroNonItemCards = new Array;
    DeckSignatureCards = new Array;

    DeckBuilderGenerateAvailableCardList();
    UpdateDeckListDetails();
    DeckBuilderUpdateCardPreview("10020_99");
}

const DeckBuilderLoadDeckFromCode = function(DeckCode) {
    let DecodedDeck;
    try {
        DecodedDeck = CArtifactDeckDecoder.ParseDeck(DeckCode);
    } catch (error) {
        console.error("There was a problem with the deckcode parser: ", error);
        DecodedDeck = false;
    }

    if (DecodedDeck) {
        let DeckName = DecodedDeck['name'];
        if (DeckName.charAt(0) == "%") {
            DeckName = "Unnamed Deck";
        }
        document.getElementById('DeckBuilderDeckNameInput').value = DeckName;

        for (let hc = 0; hc < 5; hc++) {
            let HeroID = DecodedDeck['heroes'][hc]['id'];
            let HeroTurn = (DecodedDeck['heroes'][hc]['turn'])-1;
            DeckBuilderAddHeroToDeck(HeroID, HeroTurn);
        }
        for (let cc = 0; cc < DecodedDeck['cards'].length; cc++) {
            let CardID = DecodedDeck['cards'][cc]['id'];
            let CardCount = DecodedDeck['cards'][cc]['count'];
            for (let ac = 0; ac < CardCount; ac++){
                DeckBuilderAddCardToDeck(CardID);
            }
        }
    }
}


DeckBuilderAvailableCardsFilter = {
    text: "",
    includeabilitytext: true,
    set1: true,
    rarity1: true,
    rarity2: true,
    rarity3: true,
    rarity4: true,
    rarity5: true,
    quick: true,
    crosslane: true,
    // Colors
    R: true,
    U: true,
    B: true,
    G: true,
    C: true,
    // CardTypes
    Hero: true,
    Creep: true,
    Spell: true,
    Improvement: true,
    // Items
    Weapon: true,
    Armor: true,
    Accessory: true,
    Consumable: true,
    // Collections
    signature: true,
    uncollectable: false,
};

const DeckBuilderGenerateAvailableCardList = function() {
    DeckBuilderAvailableCardsFilter['text'] = document.getElementById('CardTextFilter').value;
    let HeroCards = new Array;
    let NonHeroNonItemCards = new Array;
    let ItemCards = new Array;

    for (let cc = 0; cc < CardJSON.length; cc++) {
        if (CardJSON[cc]['available'] > 0) {
            let LatestCardVersion = CardJSON[cc]['versions'].length -1;

            let textfilter = new RegExp(DeckBuilderAvailableCardsFilter['text'], "i");
            let CardTextForFilter = "";
            if ("text" in CardJSON[cc]['versions'][LatestCardVersion]) {
                CardTextForFilter += CardJSON[cc]['versions'][LatestCardVersion]["text"]["english"];
            } 
            if (DeckBuilderAvailableCardsFilter['includeabilitytext'] == true) {
                if ("abilities" in CardJSON[cc]['versions'][LatestCardVersion]) {
                    for (let aa1 = 0; aa1 < CardJSON[cc]['versions'][LatestCardVersion]['abilities'].length; aa1++) {
                        let AbilityIDV = CardJSON[cc]['versions'][LatestCardVersion]['abilities'][aa1].split("_");
                        let AbilityID = AbilityIDV[0];
                        let AbilityVersion = AbilityIDV[1];
                        let AbilityTextSearchArrayIndex = "";
                        for (let aa2 = 0; aa2 < AbilityJSON.length; aa2++) {
                            if ((AbilityJSON[aa2]['card_id']) == AbilityID) {
                                AbilityTextSearchArrayIndex = aa2;
                                break;
                            }
                        }
                        CardTextForFilter += AbilityJSON[AbilityTextSearchArrayIndex]['versions'][AbilityVersion]['ability_name']['english'];
                        CardTextForFilter += AbilityJSON[AbilityTextSearchArrayIndex]['versions'][AbilityVersion]['text']['english'];       
                    }
                } 
            }
            let SearchTermForFilter = "";
            if ("searchterm" in CardJSON[cc]) {
                SearchTermForFilter = CardJSON[cc]["searchterm"];
            }
            
            let ColourCheckPass = false;
            if (CardJSON[cc]['versions'][LatestCardVersion]['card_type'] == "Item") {
                ColourCheckPass = true;
            } else if (DeckBuilderAvailableCardsFilter[CardJSON[cc]['versions'][LatestCardVersion]['colour']] == true) {
                ColourCheckPass = true;
            }
            let CardType = CardJSON[cc]['versions'][LatestCardVersion]['card_type'];
            //Pass if
            const ItemFilterCheck =
            //card is not an item
            !(
                CardJSON[cc]["versions"][LatestCardVersion]["card_type"] ===
                "Item"
            ) ||
            // or subtype for the item is true in the filter
            DeckBuilderAvailableCardsFilter[
                [CardJSON[cc]["versions"][LatestCardVersion]["card_subtype"]]
            ];

            let CardTypeCheckPass = false;
            if (CardType == "Item") {
                CardTypeCheckPass = true;
            } else {
                if (DeckBuilderAvailableCardsFilter[CardType] == true) {
                    CardTypeCheckPass = true;
                }
            }

            if (CardJSON[cc]['versions'][LatestCardVersion]['card_name']['english'].search(textfilter) != -1 || CardTextForFilter.search(textfilter) != -1 || SearchTermForFilter.search(textfilter) != -1) {
                if (ColourCheckPass == true) {
                    if (ItemFilterCheck) {
                        if (CardTypeCheckPass) {
                            switch (CardType) {
                                case 'Hero':
                                    HeroCards.push(CardJSON[cc]);
                                    break;
                                case 'Item':
                                    ItemCards.push(CardJSON[cc]);
                                    break;
                                default:
                                    NonHeroNonItemCards.push(CardJSON[cc]);
                                    break;
                            }
                        }
                    }
                }
            }
        }
    }

    let AvailableCardsToList = new Array;
    AvailableCardsToList = OrderCardList(HeroCards, NonHeroNonItemCards, ItemCards);

    let AvailableCardsListHTML = "";
    for (let ac = 0; ac < AvailableCardsToList.length; ac++) {
        let RemoveFromDeckButtonHTML = "";
        let AddToDeckButtonHTML = "";
        let CardID = AvailableCardsToList[ac]['card_id'];
        let LatestCardVersion = AvailableCardsToList[ac]['versions'].length -1;
        let CardIDV = CardID+"_"+LatestCardVersion;
        let CardName = AvailableCardsToList[ac]['versions'][LatestCardVersion]['card_name']['english'];
        let CardCount = AvailableCardsToList[ac]['available'];
        let CardMiniImage = AvailableCardsToList[ac]['versions'][LatestCardVersion]['miniimage'];
        let CardType = AvailableCardsToList[ac]['versions'][LatestCardVersion]['card_type'];
        let CardListCardTypeIconStyle = "CardList_CardTypeIcon"+CardType;
        let CardCost = AvailableCardsToList[ac]['versions'][LatestCardVersion]['cost'];
        let CardCostStyle = "CardList_ManaCost";
        if (CardType == "Item") { 
            CardCost = AvailableCardsToList[ac]['versions'][LatestCardVersion]['gcost']
            CardCostStyle = "CardList_GoldCost";
        } else if (CardType == "Hero") {
            CardCost = "";
            CardCostStyle = "";
            RemoveFromDeckButtonHTML = "";
            AddToDeckButtonHTML = '<div class="DeckBuilderCardListAddToDeckButton DeckBuilderCardListAddToDeckButtonPadding" onmouseup="DeckBuilderAddCardToDeck('+CardID+');"></div>';
        }
        if (CardType != "Hero") {
            if (CardCount == 3) {
                RemoveFromDeckButtonHTML = "";
                AddToDeckButtonHTML = '<div class="DeckBuilderCardListAddToDeckButton DeckBuilderCardListAddToDeckButtonPadding" onmouseup="DeckBuilderAddCardToDeck('+CardID+');"></div>';
            } else {
                RemoveFromDeckButtonHTML = '<div class="DeckBuilderCardListRemoveFromDeckButton" onmouseup="DeckBuilderRemoveCardFromDeck('+CardID+');"></div>';
                AddToDeckButtonHTML = '<div class="DeckBuilderCardListAddToDeckButton" onmouseup="DeckBuilderAddCardToDeck('+CardID+');"></div>';
            }
        } else {
            let HeroCount = 0;
            for (let hc = 0; hc < 5; hc++) {
                if (DeckHeroCards[hc]['id'] != 0) {
                    HeroCount++;
                }
            }
            if (HeroCount >= 5) {
                AddToDeckButtonHTML = ""; //No space for heroes, so don't show the arrow.
            } else {
                AddToDeckButtonHTML = '<div class="DeckBuilderCardListAddToDeckButton DeckBuilderCardListAddToDeckButtonPadding" onmouseup="DeckBuilderAddHeroToDeck('+CardID+',-1);"></div>';
            }
            RemoveFromDeckButtonHTML = '';
        }
        let CardColour = "";
        if (CardType == "Item") {
            CardColour = "I";
        } else {
            CardColour = AvailableCardsToList[ac]['versions'][LatestCardVersion]['colour'];
        }
        let HeroIcon = "";

        let CardNameStyle = "CardList_CardNameS";
        if (CardName.length > 20 && CardName.length < 23) {
            CardNameStyle = "CardList_CardNameLong"
        } else if (CardName.length > 22) {
            CardNameStyle = "CardList_CardNameXLong"
        }

        AvailableCardsListHTML += '<div ondragstart="StartCardDrag(event,'+CardID+',\'CardList\',\''+CardType+'\')" draggable="true" class="CardListItemContainer CardListItemContainer'+CardColour+'" onmousemove="DeckBuilderUpdateCardPreview(\''+CardIDV+'\');" onmouseout="CardViewerCardPreviewTooltip(0,0);"> \
        <div class="CardList_CardMiniPicture"><img src=Images/Cards/MiniImage/'+CardMiniImage+'.jpg></div> \
        <div class="CardList_CardTypeIcon '+CardListCardTypeIconStyle+'"></div> \
        <div class="CardList_Cost '+CardCostStyle+'">'+CardCost+'</div> \
        <div class="'+CardNameStyle+'">'+CardName+'</div> \
        <div class="CardList_CardCount"> x '+CardCount+'</div> \
        <div class="DeckBuilderCardListAddRemoveButtonContainer"> \
            '+RemoveFromDeckButtonHTML+AddToDeckButtonHTML+' \
            <div class="clear"></div> \
        </div> \
        </div>';
    }

    document.getElementById('DeckBuilderAvailableCardsList').innerHTML = AvailableCardsListHTML;

}

let DeckBuilderCurrentVisibleCardIDV = "";
const DeckBuilderUpdateCardPreview = function(CardIDV) {
    if (CardIDV != DeckBuilderCurrentVisibleCardIDV) {
        DeckBuilderCurrentVisibleCardIDV = CardIDV;
        GenerateCard('DeckBuilderSelectedCardPreview',CardIDV);

        CardIDV = CardIDV.split("_");
        let CardID = CardIDV[0];
        let CardVersion = CardIDV[1];
        let CardArrayIndex = "";
        for (let i = 0; i < CardJSON.length; i++) {
            if ((CardJSON[i]['card_id']) == CardID) {
                CardArrayIndex = i;
                break;
            }
        }
        if (CardVersion > CardJSON[CardArrayIndex]['versions'].length -1) {
            CardVersion = CardJSON[CardArrayIndex]['versions'].length -1;
        }
        let LeftPanelSigCardDetailsHTML = "";
        if ("signature" in CardJSON[CardArrayIndex]['versions'][CardVersion]) { 
            
            for (let sc = 0; sc < CardJSON[CardArrayIndex]['versions'][CardVersion]['signature'].length; sc++) {
                let SigCardIDV = CardJSON[CardArrayIndex]['versions'][CardVersion]['signature'][sc];
                SigCardIDV = SigCardIDV.split("_");
                let SigCardID = SigCardIDV[0];
                let SigCardVersion = SigCardIDV[1];
                let SigCardArrayIndex = "";
                for (let sai = 0; sai < CardJSON.length; sai++) {
                    if ((CardJSON[sai]['card_id']) == SigCardID) {
                        SigCardArrayIndex = sai;
                        break;
                    }
                }
                let SigCardMiniImage = CardJSON[SigCardArrayIndex]['versions'][SigCardVersion]['miniimage'];
                let SigCardName = CardJSON[SigCardArrayIndex]['versions'][SigCardVersion]['card_name']['english'];
                let SigCardType = CardJSON[SigCardArrayIndex]['versions'][SigCardVersion]['card_type'];
                let SigCardText = CardViewer_AbilityTextFormatting(CardJSON[SigCardArrayIndex]['versions'][SigCardVersion]['text']['english']);
                let SigCardColour = CardJSON[SigCardArrayIndex]['versions'][SigCardVersion]['colour'];
                let SigCardMana = CardJSON[SigCardArrayIndex]['versions'][SigCardVersion]['cost'];
        
                LeftPanelSigCardDetailsHTML += '<div class="DeckBuilderSingleAbilityContainer DeckBuilderSignatureContainer'+SigCardColour+'" onmousemove="CardViewerCardPreviewTooltip(\''+SigCardID+'_'+SigCardVersion+'\',1);" onmouseout="CardViewerCardPreviewTooltip(0,0);"> \
                                                <div class="DeckBuilderAbilityTop"> \
                                                    <div class="DeckBuilderAbilityIcon"><img src="Images/Cards/MiniImage/'+SigCardMiniImage+'.jpg"></div> \
                                                    <div class="DeckBuilderSignatureMana">'+SigCardMana+'</div> \
                                                    <div class="DeckBuilderAbilityTopText"> \
                                                        <div class="DeckBuilderAbilityName">'+SigCardName.toUpperCase()+'</div> \
                                                        <div class="DeckBuilderSigCardText DeckBuilderSigCardText'+SigCardColour+'">SIGNATURE CARD</div> \
                                                    </div> \
                                                    <div class="clear"></div> \
                                                </div> \
                                                <div class="DeckBuilderAbilityText">'+SigCardText+'</div>\
                                            </div>';
            }
        } else {
            HTMLSignatureCardLeftPanel = "";
        } 

        //SHOW ABILITY DETAILS ON LEFT
        let HTMLCardAbilitiesLeftPanel = "";
        if ("abilities" in CardJSON[CardArrayIndex]['versions'][CardVersion]) { 
            
            if (CardJSON[CardArrayIndex]['versions'][CardVersion]['abilities'].length > 0) { //If the card has abilities
                for (let a = 0; a < CardJSON[CardArrayIndex]['versions'][CardVersion]['abilities'].length; a++) {
                    let AbilityIDV = CardJSON[CardArrayIndex]['versions'][CardVersion]['abilities'][a].split("_");
                    let AbilityID = AbilityIDV[0];
                    let AbilityVersion = AbilityIDV[1];
                    let AbilityArrayIndex = "";
                    for (let aa = 0; aa < AbilityJSON.length; aa++) {
                        if ((AbilityJSON[aa]['card_id']) == AbilityID) {
                            AbilityArrayIndex = aa;
                            break;
                        }
                    }
                    let AbilityName = AbilityJSON[AbilityArrayIndex]['versions'][AbilityVersion]['ability_name']['english'];
                    let AbilityType = AbilityJSON[AbilityArrayIndex]['versions'][AbilityVersion]['ability_type'];
                    if (AbilityType != "Continuous Effect") {
                        AbilityType = AbilityType + " Ability";
                    }
                    let AbilityImage = AbilityJSON[AbilityArrayIndex]['versions'][AbilityVersion]['image'];
                    let AbilityText = CardViewer_AbilityTextFormatting(AbilityJSON[AbilityArrayIndex]['versions'][AbilityVersion]['text']['english']);

                    HTMLCardAbilitiesLeftPanel += '<div class="DeckBuilderSingleAbilityContainer"> \
                    <div class="DeckBuilderAbilityTop"> \
                        <div class="DeckBuilderAbilityIcon"><img src="Images/Abilities/'+AbilityImage+'.jpg"></div> \
                        <div class="DeckBuilderAbilityTopText"> \
                            <div class="DeckBuilderAbilityName">'+AbilityName.toUpperCase()+'</div> \
                            <div class="DeckBuilderAbilityType">'+AbilityType+'</div> \
                        </div> \
                        <div class="clear"></div> \
                    </div> \
                    <div class="DeckBuilderAbilityText">'+AbilityText+'</div>\
                </div>';
                }
            } else {
                HTMLCardAbilitiesLeftPanel = "&nbsp";
            }
        } else {
            HTMLCardAbilitiesLeftPanel = "&nbsp";
        }

        document.getElementById('SigAbilityRelated_Container').innerHTML = "";
        document.getElementById('SigAbilityRelated_Container').innerHTML += LeftPanelSigCardDetailsHTML;
        document.getElementById('SigAbilityRelated_Container').innerHTML += HTMLCardAbilitiesLeftPanel;
    }
}

const DeckBuilderAddHeroToDeck = function(HeroID, Turn) { //Valid Turn is 0-4, not 1-5.
    //Check if Hero is already in deck
    let HeroAlreadyInDeck = false;
    for (let hc = 0; hc < DeckHeroCards.length; hc++) {
        if (HeroID == DeckHeroCards[hc]['id']) {
            HeroAlreadyInDeck = true;
        }
    }
    if (!HeroAlreadyInDeck) {
        if (Turn < 0 || Turn > 4) {
            //Search for a free Hero slot
            let FreeSlot = -1;
            for (hs = 0; hs < 5; hs++) {
                if (DeckHeroCards[hs]['id'] == 0) {
                    FreeSlot = hs;
                    break;
                }
            }
            if (FreeSlot != -1) {
                DeckBuilderAddHeroToDeckInner(HeroID, FreeSlot);
            } else {
                //No free slot for this hero.
            }
        } else {
            if (DeckHeroCards[Turn]['id'] == 0) { //If the slot is free.
                DeckBuilderAddHeroToDeckInner(HeroID,Turn);
            } else { //Slot in use, need to clear out current Hero first.
                DeckBuilderRemoveHeroFromDeck(DeckHeroCards[Turn]['id']);
                DeckBuilderAddHeroToDeckInner(HeroID,Turn);
            }
        }
    }
    DeckBuilderGenerateAvailableCardList();
    UpdateDeckListDetails();
}

const DeckBuilderAddHeroToDeckInner = function(HeroID, Turn) {
    //This is run inside DeckBuilderAddHeroToDeck after checks have been made to make sure adding the hero is valid.
    let HeroSignatureIDV = new Array;
    let HeroIcon = "";
    for (let fs = 0; fs < CardJSON.length; fs++) {
        if (HeroID == CardJSON[fs]['card_id']) {
            HeroSignatureIDV = CardJSON[fs]['versions'][CardJSON[fs]['versions'].length-1]['signature'];
            HeroIcon = CardJSON[fs]['versions'][CardJSON[fs]['versions'].length-1]['icon'];
            CardJSON[fs]['available'] = 0;
            break;
        }
    }
    DeckHeroCards[Turn]['id'] = HeroID;
    DeckHeroCards[Turn]['heroicon'] = HeroIcon;
    if (HeroSignatureIDV.length == 1) {
        let HeroSigCardIDV = HeroSignatureIDV[0].split("_");
        let HeroSignatureID = HeroSigCardIDV[0];
        DeckSignatureCards.push({id: HeroSignatureID, count: 3});
    } else {
        for (let hsl = 0; hsl < HeroSignatureIDV.length; hsl++) {
            let HeroSigCardIDV = HeroSignatureIDV[hsl].split("_");
            let HeroSignatureID = HeroSigCardIDV[0];
            DeckSignatureCards.push({id: HeroSignatureID, count: 1});
        }
    }
}

const DeckBuilderRemoveHeroFromDeck = function(HeroID) {
    let HeroIDCharLength = String(HeroID).length;
    let HeroIDWithUnderscore = String(HeroID)+"_";
    for (let fh = 0; fh < 5; fh++) {
        if (DeckHeroCards[fh]['id'] == HeroID) {
            DeckHeroCards[fh]['id'] = 0;
            DeckHeroCards[fh]['heroicon'] = "0";
            break;
        }
    }

    let CardIDToRemoveFromDeck = 0;

    for (let fs = 0; fs < CardJSON.length; fs++) {
        if (CardJSON[fs]['card_id'] == HeroID) {
            CardJSON[fs]['available'] = 1;
        }
        let LatestCardVersion = CardJSON[fs]['versions'].length -1;
        if ("is_signature" in CardJSON[fs]['versions'][LatestCardVersion]) {
            let StringToMatch = CardJSON[fs]['versions'][LatestCardVersion]['is_signature'].substring(0,HeroIDCharLength+1);
            if (StringToMatch == HeroIDWithUnderscore) {
                CardIDToRemoveFromDeck = CardJSON[fs]['card_id'];
                for (let ds = 0; ds < DeckSignatureCards.length; ds++) {
                    if (DeckSignatureCards[ds]['id'] == CardIDToRemoveFromDeck) {
                        DeckSignatureCards.splice(ds,1);
                        break;
                    }
                }
            }
        }
    }
    DeckBuilderGenerateAvailableCardList();
    UpdateDeckListDetails();
}

const DeckBuilderAddCardToDeck = function(CardID) {
    let CardArrayIndex = "";
    for (let i = 0; i < CardJSON.length; i++) {
        if ((CardJSON[i]['card_id']) == CardID) {
            CardArrayIndex = i;
            break;
        }
    }
    let QuantityAvailable = CardJSON[CardArrayIndex]['available'];
    let LatestCardVersion = CardJSON[CardArrayIndex]['versions'].length -1;
    let CardType = CardJSON[CardArrayIndex]['versions'][LatestCardVersion]['card_type'];

    let DeckSearchArrayIndex = -1;

    if (QuantityAvailable > 0) {
        if (CardType == "Item") {
            //Search array to see if we already have this card in the deck
            for (ds = 0; ds < DeckItemCards.length; ds++) {
                if (DeckItemCards[ds]['id'] == CardID) {
                    DeckSearchArrayIndex = ds;
                    break;
                }
            }
            if (DeckSearchArrayIndex == -1) { //Card is not current in the deck
                DeckItemCards.push({id: CardID, count: 1});
                CardJSON[CardArrayIndex]['available']--;
            } else { //Card is already in our deck
                if (DeckItemCards[DeckSearchArrayIndex]['count'] < 3) {
                    DeckItemCards[DeckSearchArrayIndex]['count']++;
                    CardJSON[CardArrayIndex]['available']--;
                } else {
                    DeckItemCards[DeckSearchArrayIndex]['count'] = 3;
                    CardJSON[CardArrayIndex]['available'] = 0;
                }
            }
        } else {
            //Search array to see if we already have this card in the deck
            for (ds = 0; ds < DeckNonHeroNonItemCards.length; ds++) {
                if (DeckNonHeroNonItemCards[ds]['id'] == CardID) {
                    DeckSearchArrayIndex = ds;
                    break;
                }
            }
            if (DeckSearchArrayIndex == -1) { //Card is not current in the deck
                DeckNonHeroNonItemCards.push({id: CardID, count: 1});
                CardJSON[CardArrayIndex]['available']--;
            } else { //Card is already in our deck
                if (DeckNonHeroNonItemCards[DeckSearchArrayIndex]['count'] < 3) {
                    DeckNonHeroNonItemCards[DeckSearchArrayIndex]['count']++;
                    CardJSON[CardArrayIndex]['available']--;
                } else {
                    DeckNonHeroNonItemCards[DeckSearchArrayIndex]['count'] = 3;
                    CardJSON[CardArrayIndex]['available'] = 0;
                }
            }
        }
    }
    DeckBuilderGenerateAvailableCardList();
    UpdateDeckListDetails();
}

const DeckBuilderRemoveCardFromDeck = function(CardID) {
    let CardArrayIndex = "";
    for (let i = 0; i < CardJSON.length; i++) {
        if ((CardJSON[i]['card_id']) == CardID) {
            CardArrayIndex = i;
            break;
        }
    }
    let LatestCardVersion = CardJSON[CardArrayIndex]['versions'].length -1;
    let CardType = CardJSON[CardArrayIndex]['versions'][LatestCardVersion]['card_type'];

    let DeckSearchArrayIndex = -1;
    if (CardType == "Item") {
        //Search array to see if we have this card in the deck
        for (ds = 0; ds < DeckItemCards.length; ds++) {
            if (DeckItemCards[ds]['id'] == CardID) {
                DeckSearchArrayIndex = ds;
                break;
            }
        }
        if (DeckSearchArrayIndex != -1) {
            if (DeckItemCards[DeckSearchArrayIndex]['count'] > 1) {
                DeckItemCards[DeckSearchArrayIndex]['count']--;
                CardJSON[CardArrayIndex]['available']++;
            } else {
                DeckItemCards.splice(DeckSearchArrayIndex,1);
                CardJSON[CardArrayIndex]['available'] = 3;
            }
        }
    } else {
        //Search array to see if we have this card in the deck
        for (ds = 0; ds < DeckNonHeroNonItemCards.length; ds++) {
            if (DeckNonHeroNonItemCards[ds]['id'] == CardID) {
                DeckSearchArrayIndex = ds;
                break;
            }
        }
        if (DeckSearchArrayIndex != -1) {
            if (DeckNonHeroNonItemCards[DeckSearchArrayIndex]['count'] > 1) {
                DeckNonHeroNonItemCards[DeckSearchArrayIndex]['count']--;
                CardJSON[CardArrayIndex]['available']++;
            } else {
                DeckNonHeroNonItemCards.splice(DeckSearchArrayIndex,1);
                CardJSON[CardArrayIndex]['available'] = 3;
            }
        }
    }
    DeckBuilderGenerateAvailableCardList();
    UpdateDeckListDetails();
}

const UpdateDeckListDetails = function() {
    HideDeckCode();
    let DeckItemCardsJSON = new Array;
    let DeckNonHeroNonItemCardsJSON = new Array;

    for (let hc = 0; hc < 5; hc++) {
        if (DeckHeroCards[hc]['id'] != 0) {
            document.getElementById('DeckBuilderHeroIcon'+hc).innerHTML = '<img src="Images/HeroIcons/'+DeckHeroCards[hc]['heroicon']+'.png" ondragstart="StartCardDrag(event,'+DeckHeroCards[hc]['id']+',\'H'+hc+'\',\'Hero\')" onmouseover="DeckBuilderUpdateCardPreview(\''+DeckHeroCards[hc]['id']+'_99\');">';
        } else {
            document.getElementById('DeckBuilderHeroIcon'+hc).innerHTML = "";
        }
    }

    for (let ic = 0; ic < DeckItemCards.length; ic++) {
        for (let js = 0; js < CardJSON.length; js++) {
            if (DeckItemCards[ic]['id'] == CardJSON[js]['card_id']) {
                DeckItemCardsJSON.push(CardJSON[js]);
                DeckItemCardsJSON[ic]['count'] = (DeckItemCards[ic]['count']);
                break;
            }
        }
    }
    DeckNonHeroNonItemCardsWithSignatures = DeckNonHeroNonItemCards.concat(DeckSignatureCards);
    for (let dc = 0; dc < DeckNonHeroNonItemCardsWithSignatures.length; dc++) {
        for (let js = 0; js < CardJSON.length; js++) {
            if (DeckNonHeroNonItemCardsWithSignatures[dc]['id'] == CardJSON[js]['card_id']) {
                DeckNonHeroNonItemCardsJSON.push(CardJSON[js]);
                DeckNonHeroNonItemCardsJSON[dc]['count'] = (DeckNonHeroNonItemCardsWithSignatures[dc]['count']);
                break;
            }
        }
    }

    DeckCardsJSON = OrderCardList(0, DeckNonHeroNonItemCardsJSON, DeckItemCardsJSON);

    let CardTypeCounts = new Array;
    CardTypeCounts['Creep'] = 0;
    CardTypeCounts['Spell'] = 0;
    CardTypeCounts['Improvement'] = 0;
    CardTypeCounts['Weapon'] = 0;
    CardTypeCounts['Armor'] = 0;
    CardTypeCounts['Accessory'] = 0;
    CardTypeCounts['Consumable'] = 0;

    let DeckListHTML = "";
    
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

    for (let c = 0; c < DeckCardsJSON.length; c++) {
        let RemoveFromDeckButtonHTML = "";
        let AddToDeckButtonHTML = "";
        let CardID = DeckCardsJSON[c]['card_id'];
        let LatestCardVersion = DeckCardsJSON[c]['versions'].length -1;
        let CardIDV = CardID+"_"+LatestCardVersion;
        let CardCount = DeckCardsJSON[c]['count'];
        let CardName = DeckCardsJSON[c]['versions'][LatestCardVersion]['card_name']['english'];
        let CardMiniImage = DeckCardsJSON[c]['versions'][LatestCardVersion]['miniimage'];
        let CardType = DeckCardsJSON[c]['versions'][LatestCardVersion]['card_type'];
        let CardListCardTypeIconStyle = "CardList_CardTypeIcon"+CardType;
        let CardCost = DeckCardsJSON[c]['versions'][LatestCardVersion]['cost'];
        let CardCostStyle = "CardList_ManaCost";
        if (CardType == "Item") { 
            CardCost = DeckCardsJSON[c]['versions'][LatestCardVersion]['gcost']
            CardCostStyle = "CardList_GoldCost";
        }
        let CardColour = "";
        if (CardType == "Item") {
            CardColour = "I";
        } else {
            CardColour = DeckCardsJSON[c]['versions'][LatestCardVersion]['colour'];
        }
        if (CardType != "Hero") {
            if (CardCount == 3) {
                RemoveFromDeckButtonHTML = '<div class="DeckBuilderCardListRemoveFromDeckButton" onmouseup="DeckBuilderRemoveCardFromDeck('+CardID+');"></div>';
                AddToDeckButtonHTML = '';
            } else {
                RemoveFromDeckButtonHTML = '<div class="DeckBuilderCardListRemoveFromDeckButton" onmouseup="DeckBuilderRemoveCardFromDeck('+CardID+');"></div>';
                AddToDeckButtonHTML = '<div class="DeckBuilderCardListAddToDeckButton" onmouseup="DeckBuilderAddCardToDeck('+CardID+');"></div>';
            }
        } 
        let HeroIconHTML = "";
        if ("is_signature" in DeckCardsJSON[c]['versions'][LatestCardVersion]) {
            RemoveFromDeckButtonHTML = "";
            AddToDeckButtonHTML = "";
            let HeroCardIDV = DeckCardsJSON[c]['versions'][LatestCardVersion]['is_signature'].split("_");
            let HeroCardID = HeroCardIDV[0];
            for (let si = 0; si < DeckHeroCards.length; si++) {
                if (HeroCardID == DeckHeroCards[si]['id']) {
                    HeroIconHTML = '<div class="CardList_HeroIcon"><img src="Images/HeroIcons/'+DeckHeroCards[si]['heroicon']+'.png"></div>';
                    break;
                }
            }
        }
        
        let CardNameStyle = "CardList_CardNameS";
        if (CardName.length > 15 && CardName.length < 21) {
            CardNameStyle = "CardList_CardNameLong"
        } else if (CardName.length > 20) {
            CardNameStyle = "CardList_CardNameXLong"
        }

        DeckListHTML += '<div ondragstart="StartCardDrag(event,'+CardID+',\'DeckList\',\''+CardType+'\')" draggable="true" class="CardListItemContainer CardListItemContainer'+CardColour+'" onmousemove="DeckBuilderUpdateCardPreview(\''+CardIDV+'\');" onmouseout="CardViewerCardPreviewTooltip(0,0);"> \
        <div class="CardList_CardMiniPicture"><img src=Images/Cards/MiniImage/'+CardMiniImage+'.jpg></div> \
        <div class="CardList_CardTypeIcon '+CardListCardTypeIconStyle+'"></div> \
        <div class="CardList_Cost '+CardCostStyle+'">'+CardCost+'</div> \
        <div class="'+CardNameStyle+'">'+CardName+'</div> \
        <div class="CardList_CardCount"> x '+CardCount+'</div> \
        <div class="DeckBuilderCardListAddRemoveButtonContainer"> \
            '+RemoveFromDeckButtonHTML + AddToDeckButtonHTML+ HeroIconHTML +' \
            <div class="clear"></div> \
        </div> \
        </div>';

        //Update Counter Arrays
        if (CardCost > 8) {
            CardCost = 8;
        }
        if (CardType != "Item") {
            CardColourCounts[CardColour][CardCost-1] += CardCount;
        }
        if (CardType == "Item") {
            CardType = DeckCardsJSON[c]['versions'][LatestCardVersion]['card_subtype'];
        }
        CardTypeCounts[CardType] += CardCount;


    }

    document.getElementById('DeckBuilderDeckCardListContainer').innerHTML = DeckListHTML;

    document.getElementById('NumberOfCreeps').innerHTML = CardTypeCounts['Creep'];
    document.getElementById('NumberOfSpells').innerHTML = CardTypeCounts['Spell'];
    document.getElementById('NumberOfTE').innerHTML = CardTypeCounts['Improvement'];
    document.getElementById('NumberOfWeapons').innerHTML = CardTypeCounts['Weapon'];
    document.getElementById('NumberOfArmour').innerHTML = CardTypeCounts['Armor'];
    document.getElementById('NumberOfAccessories').innerHTML = CardTypeCounts['Accessory'];
    document.getElementById('NumberOfConsumables').innerHTML = CardTypeCounts['Consumable'];

    let TotalItemCards = CardTypeCounts['Weapon']+CardTypeCounts['Armor']+CardTypeCounts['Accessory']+CardTypeCounts['Consumable'];
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
            TotalByMana[mc] = CardColourCounts['R'][mc] + CardColourCounts['U'][mc] + CardColourCounts['B'][mc] + CardColourCounts['G'][mc]+ CardColourCounts['C'][mc];
        }
        let MaxTotalByMana = Math.max(TotalByMana[0],TotalByMana[1],TotalByMana[2],TotalByMana[3],TotalByMana[4],TotalByMana[5],TotalByMana[6],TotalByMana[7]);
        let GraphHeightPerCard = 50/MaxTotalByMana;

        for (let bg = 0; bg < 8; bg++) {
            let RedBarHeight = CardColourCounts['R'][bg] * GraphHeightPerCard;
            let BlueBarHeight = CardColourCounts['U'][bg] * GraphHeightPerCard;
            let BlackBarHeight = CardColourCounts['B'][bg] * GraphHeightPerCard;
            let GreenBarHeight = CardColourCounts['G'][bg] * GraphHeightPerCard;
            let ColourlessBarHeight = CardColourCounts['C'][bg] * GraphHeightPerCard;
            let PaddingBarHeight = 50 - RedBarHeight - BlueBarHeight - BlackBarHeight - GreenBarHeight - ColourlessBarHeight;
            document.getElementById('DeckBuilderCardManaColourChartBar'+(bg+1)).innerHTML = '<div class="DeckBuilderCardManaColouringPadding" style="height: '+PaddingBarHeight+'px;"></div> \
                                                                                            <div class="DeckBuilderCardManaColouringR" style="height: '+RedBarHeight+'px;" onmousemove="ShowTextTooltip(1, \''+CardColourCounts['R'][bg]+' Red Cards\');" onmouseout="ShowTextTooltip(0,0);"></div> \
                                                                                            <div class="DeckBuilderCardManaColouringU" style="height: '+BlueBarHeight+'px;" onmousemove="ShowTextTooltip(1, \''+CardColourCounts['U'][bg]+' Blue Cards\');" onmouseout="ShowTextTooltip(0,0);"></div> \
                                                                                            <div class="DeckBuilderCardManaColouringB" style="height: '+BlackBarHeight+'px;" onmousemove="ShowTextTooltip(1, \''+CardColourCounts['B'][bg]+' Black Cards\');" onmouseout="ShowTextTooltip(0,0);"></div> \
                                                                                            <div class="DeckBuilderCardManaColouringG" style="height: '+GreenBarHeight+'px;" onmousemove="ShowTextTooltip(1, \''+CardColourCounts['G'][bg]+' Green Cards\');" onmouseout="ShowTextTooltip(0,0);"></div> \
                                                                                            <div class="DeckBuilderCardManaColouringC" style="height: '+ColourlessBarHeight+'px;" onmousemove="ShowTextTooltip(1, \''+CardColourCounts['C'][bg]+' Colourless Cards\');" onmouseout="ShowTextTooltip(0,0);"></div>';

        }
        document.getElementById('DeckBuilderBoxChartR').outerHTML = '<div id="DeckBuilderBoxChartR" class="DeckBuilderCardColourBoxChartInner DeckBuilderCardManaColouringR" onmousemove="ShowTextTooltip(1, \''+TotalR+' Red Cards\');" onmouseout="ShowTextTooltip(0,0);">'+TotalR+'</div>';
        document.getElementById('DeckBuilderBoxChartU').outerHTML = '<div id="DeckBuilderBoxChartU" class="DeckBuilderCardColourBoxChartInner DeckBuilderCardManaColouringU" onmousemove="ShowTextTooltip(1, \''+TotalU+' Blue Cards\');" onmouseout="ShowTextTooltip(0,0);">'+TotalU+'</div>';
        document.getElementById('DeckBuilderBoxChartB').outerHTML = '<div id="DeckBuilderBoxChartB" class="DeckBuilderCardColourBoxChartInner DeckBuilderCardManaColouringB" onmousemove="ShowTextTooltip(1, \''+TotalB+' Black Cards\');" onmouseout="ShowTextTooltip(0,0);">'+TotalB+'</div>';
        document.getElementById('DeckBuilderBoxChartG').outerHTML = '<div id="DeckBuilderBoxChartG" class="DeckBuilderCardColourBoxChartInner DeckBuilderCardManaColouringG" onmousemove="ShowTextTooltip(1, \''+TotalG+' Green Cards\');" onmouseout="ShowTextTooltip(0,0);">'+TotalG+'</div>';

}

const StartCardDrag = function(event, CardID, Source, Type) {
    event.dataTransfer.setData("ID", CardID);
    event.dataTransfer.setData("Source", Source);
    event.dataTransfer.setData("CardType", Type);
}
const EndCardDrag = function(event, Land) {
    event.preventDefault();
    let CardType = event.dataTransfer.getData("CardType");
    let Source = event.dataTransfer.getData("Source");
    let CardID = event.dataTransfer.getData("ID");
    if (Land == "H0" || Land == "H1" || Land == "H2" || Land == "H3" || Land == "H4") {
        if (CardType == "Hero") {
            HeroSlot = Land.substring(1,2);
            if (Source == "CardList") {
                DeckBuilderAddHeroToDeck(CardID,HeroSlot);
            } else if (Source == "H0" || Source == "H1" || Source == "H2" || Source == "H3" || Source == "H4") {
                let Hero1Slot = Land.substring(1,2);
                let Hero1ID = CardID;
                let Hero2Slot = Source.substring(1,2);
                let Hero2ID = DeckHeroCards[Hero1Slot]['id'];;
                DeckBuilderRemoveHeroFromDeck(Hero1ID);
                DeckBuilderRemoveHeroFromDeck(Hero2ID);
                DeckBuilderAddHeroToDeck(Hero2ID,Hero2Slot);
                DeckBuilderAddHeroToDeck(Hero1ID,Hero1Slot);
            }
        }
    } else if (Land == "DeckList") {
        if (CardType == "Hero") {
            DeckBuilderAddHeroToDeck(CardID,-1);
        } else {
            DeckBuilderAddCardToDeck(CardID);
            DeckBuilderAddCardToDeck(CardID);
            DeckBuilderAddCardToDeck(CardID);
        }
    } else if (Land == "CardList") {
        if (CardType == "Hero") {
            DeckBuilderRemoveHeroFromDeck(CardID);
        } else {
            if (Source == "DeckList") {
                DeckBuilderRemoveCardFromDeck(CardID);
                DeckBuilderRemoveCardFromDeck(CardID);
                DeckBuilderRemoveCardFromDeck(CardID);
            }
        }
    }
}
const allowDrop = function(event) {
    event.preventDefault();
}

const GenerateDeckCode = function() {
    let ErrorMessage = "";
    let ShowErrorMessage = false;
    let RefuseCode = false;
    let FullDeckArray = new Array;
    FullDeckArray['heroes'] = new Array;
    for (let h = 0; h < 5; h++) {
        FullDeckArray['heroes'][h] = new Array;
        FullDeckArray['heroes'][h]['id'] = DeckHeroCards[h]['id'];
        FullDeckArray['heroes'][h]['turn'] = DeckHeroCards[h]['turn'];
    }
    let TotalCardCount = 0; 
    for (let c = 0; c < DeckNonHeroNonItemCards.length; c++) {
        TotalCardCount += DeckNonHeroNonItemCards[c]['count'];
    }
    if (TotalCardCount < 25) {
        ErrorMessage = "Code generated, but this deck is invalid: <br> Not enough cards: "+(TotalCardCount+15);
        ShowErrorMessage = true;
    }
    let TotalItemCount = 0; 
    for (let c = 0; c < DeckItemCards.length; c++) {
        TotalItemCount += DeckItemCards[c]['count'];
    }
    if (TotalItemCount > 10) {
        ErrorMessage = "Code generated, but this deck is invalid: <br> Too many items: "+TotalItemCount;
        ShowErrorMessage = true;
    }

    FullDeckArray['cards'] = DeckNonHeroNonItemCards.concat(DeckItemCards);
    let DeckName = document.getElementById('DeckBuilderDeckNameInput').value;
    if (DeckName == "") {
        DeckName = "Unnamed Deck";
    }
    FullDeckArray['name'] = DeckName;
    
    let EnoughHeroesCheck = true;
    
    for (let hc = 0; hc < 5; hc++) {
        if (DeckHeroCards[hc]['id'] == 0) {
            EnoughHeroesCheck = false;
            ErrorMessage = "Failed to generate deck code: <br> There are not five heroes in this deck.";
            ShowErrorMessage = true;
            RefuseCode = true;
        }
    }
    if (ShowErrorMessage) {
        document.getElementById('DeckCodeErrorMsg').innerHTML = ErrorMessage;
        document.getElementById('DeckCodeErrorContainer').style.display = "block";
    } else {
        document.getElementById('DeckCodeErrorContainer').style.display = "none";
    }
    if (RefuseCode) {
        document.getElementById('DeckCode').style.display = "none";
    } else {
        document.getElementById('DeckCodeField').value = CArtifactDeckEncoder.EncodeDeck(FullDeckArray);
        document.getElementById('DeckCodeContainer').style.display = "block";
        document.getElementById('GenerateDeckCodeButton').style.display = "none";
    }
}

const DeckBuilderDismissMobileWarning = function() {
    document.getElementById('DeckBuilderMobileWarning').style.display = "none";
}

function DeckBuilderToggleFilter(FilterValue) {
    if (FilterValue == "R" || FilterValue == "U" || FilterValue == "B" || FilterValue == "G" || FilterValue == "C") {
        if (DeckBuilderAvailableCardsFilter[FilterValue] == true) {
            DeckBuilderAvailableCardsFilter[FilterValue] = false;
                document.getElementById("ColourFilter"+FilterValue).classList.add('CVOptionButtonUnselected');
                document.getElementById("ColourFilter"+FilterValue).classList.remove('CVOptionButtonSelected');
        } else {
            DeckBuilderAvailableCardsFilter[FilterValue] = true;
            document.getElementById("ColourFilter"+FilterValue).classList.add('CVOptionButtonSelected');
            document.getElementById("ColourFilter"+FilterValue).classList.remove('CVOptionButtonUnselected');
        }
    } else if (FilterValue == "abilitytext") {
        if (DeckBuilderAvailableCardsFilter['includeabilitytext'] == true) {
            DeckBuilderAvailableCardsFilter['includeabilitytext'] = false;
            document.getElementById("FilterIncludeAbilityText").classList.add('CVOptionButtonUnselected');
            document.getElementById("FilterIncludeAbilityText").classList.remove('CVOptionButtonSelected');
        } else {
            DeckBuilderAvailableCardsFilter['includeabilitytext'] = true;
            document.getElementById("FilterIncludeAbilityText").classList.add('CVOptionButtonSelected');
            document.getElementById("FilterIncludeAbilityText").classList.remove('CVOptionButtonUnselected');
        }
    } else if (
        FilterValue === "Weapon" ||
        FilterValue === "Armor" ||
        FilterValue === "Accessory" ||
        FilterValue === "Consumable"
    ) {  
        DeckBuilderAvailableCardsFilter[FilterValue] = !DeckBuilderAvailableCardsFilter[FilterValue];
        const el = document.getElementById("ItemFilter"+FilterValue)
        if (!DeckBuilderAvailableCardsFilter[FilterValue]) {
            el.classList.remove('CVOptionButtonSelected');
            el.classList.add('CVOptionButtonUnselected');
        } else {
            el.classList.add('CVOptionButtonSelected');
            el.classList.remove('CVOptionButtonUnselected');
        }
    } else if (FilterValue == "Hero" || FilterValue == "Creep" || FilterValue == "Spell" || FilterValue == "Improvement") {
        DeckBuilderAvailableCardsFilter[FilterValue] = !DeckBuilderAvailableCardsFilter[FilterValue];
        if (!DeckBuilderAvailableCardsFilter[FilterValue]) {
            document.getElementById('CardTypeFilter'+FilterValue).classList.remove('CVOptionButtonSelected');
            document.getElementById('CardTypeFilter'+FilterValue).classList.add('CVOptionButtonUnselected');
        } else {
            document.getElementById('CardTypeFilter'+FilterValue).classList.add('CVOptionButtonSelected');
            document.getElementById('CardTypeFilter'+FilterValue).classList.remove('CVOptionButtonUnselected');
        }
    }
    if (DeckBuilderAvailableCardsFilter["R"] == false && DeckBuilderAvailableCardsFilter["U"] == false && DeckBuilderAvailableCardsFilter["B"] == false && DeckBuilderAvailableCardsFilter["G"] == false && DeckBuilderAvailableCardsFilter["C"] == false && DeckBuilderAvailableCardsFilter["Weapon"] == false && DeckBuilderAvailableCardsFilter["Armor"] == false && DeckBuilderAvailableCardsFilter["Accessory"] == false && DeckBuilderAvailableCardsFilter["Consumable"] == false) { // If all colour filters and item filters are turned off
        document.getElementById('ColourFilterContainer').style.background = "rgba(135,31,38,0.6)";
        document.getElementById('ItemFilterContainer').style.background = "rgba(135,31,38,0.6)";
    } else {
        document.getElementById('ColourFilterContainer').style.background = "";
        document.getElementById('ItemFilterContainer').style.background = "";
    }
    DeckBuilderGenerateAvailableCardList();
}
const HideDeckCode = function() {
    document.getElementById('DeckCodeErrorContainer').style.display = "none";
    document.getElementById('DeckCodeContainer').style.display = "none";
    document.getElementById('GenerateDeckCodeButton').style.display = "block";
}