function skewcard(sender,skew) {
    if (skew == 1) {
        sender.style.transitionDuration = "0s";
        XPosOnCard = (event.clientX+-(sender.offsetLeft - window.scrollX));
        YPosOnCard = (event.clientY+-(sender.offsetTop - window.scrollY));
        YSkew = ((XPosOnCard - (sender.offsetWidth / 2)) *4) / sender.offsetWidth; //Left-Right Skew
        XSkew = ((YPosOnCard - (sender.offsetHeight / 2)) *4) / sender.offsetHeight; //Up-Down Skew
        sender.style.transform = "perspective(400px) rotateX("+-XSkew+"deg) rotateY("+YSkew+"deg)";
    } else {
        sender.style.transform = "rotate(0deg)"; //Reset to normal.
        sender.style.transitionDuration = "0.5s";
    }
}

const getURLParams = function (url) {
    var params = {};
    var parser = document.createElement('a');
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
};

const InitialisePage = function(Page) {
    let p1 = new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.open("GET", 'json/Cards.json', true);
        req.onreadystatechange = function() {
           if (req.readyState == XMLHttpRequest.DONE ) {
              if (req.status == 200) {
                  resolve(req.response);
              } else {
                  reject(Error(req.statusText));    
              }
           }
        };
        req.send();
    });
    let p2 = new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.open("GET", 'json/Abilities.json', true);
        req.onreadystatechange = function() {
           if (req.readyState == XMLHttpRequest.DONE ) {
              if (req.status == 200) {
                  resolve(req.response);
              } else {
                  reject(Error(req.statusText));    
              }
           }
        };
        req.send();
    });
    let p3 = new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.open("GET", 'json/Keywords.json', true);
        req.onreadystatechange = function() {
           if (req.readyState == XMLHttpRequest.DONE ) {
              if (req.status == 200) {
                  resolve(req.response);
              } else {
                  reject(Error(req.statusText));    
              }
           }
        };
        req.send();
    });
    let p4 = new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.open("GET", 'json/DeckCodes.json', true);
        req.onreadystatechange = function() {
           if (req.readyState == XMLHttpRequest.DONE ) {
              if (req.status == 200) {
                  resolve(req.response);
              } else {
                  reject(Error(req.statusText));    
              }
           }
        };
        req.send();
    });

    Promise.all([p1,p2,p3,p4]).then(responses => {
        CardJSON = JSON.parse(responses[0]);
        AbilityJSON = JSON.parse(responses[1]);
        KeywordsJSON = JSON.parse(responses[2]);
        DeckCodesJSON = JSON.parse(responses[3]);

        if (Page == "CardBrowser") {
            GenerateCardListCardBrowser();
            const id = getURLParams(document.location.href).id;
            if(getURLParams(document.location.href).id){
                CardViewer_SelectCard(id, true);
            } else {
                CardViewer_SelectCard('10020_99', true);
            }
        } else if (Page == "DeckViewer") {
            if (getURLParams(document.location.href).d) {
                document.getElementById('DeckCodeInputField').value = getURLParams(document.location.href).d;
                LoadDeckFunc();
            } else {
                LoadDeckExamples()
            }
        } else if (Page == "DeckBuilder") {
            InitialiseDeckBuilder();
            if (getURLParams(document.location.href).d) {
                //alert(getURLParams(document.location.href).d);
                DeckBuilderLoadDeckFromCode(getURLParams(document.location.href).d);
            }
        } else if (Page == "Keywords") {
            InitialiseKeywordsPage();
        }
    })
}

function CVChangeViewStyle(View) {
    if (View < 0 || View > 1) {
        View = 0;
    }
    if (View == 0) {
        document.getElementById('CVCView').style.display = "none";
        document.getElementById('CVLView').style.display = "block";

        document.getElementById("CVOptionLayout1").classList.add('CVOptionButtonSelected');
        document.getElementById("CVOptionLayout1").classList.remove('CVOptionButtonUnselected');
        document.getElementById("CVOptionLayout2").classList.remove('CVOptionButtonSelected');
        document.getElementById("CVOptionLayout2").classList.add('CVOptionButtonUnselected');
    
    } else if (View == 1) {
        document.getElementById('CVCView').style.display = "block";
        document.getElementById('CVLView').style.display = "none";
        document.getElementById("CVOptionLayout2").classList.add('CVOptionButtonSelected');
        document.getElementById("CVOptionLayout2").classList.remove('CVOptionButtonUnselected');
        document.getElementById("CVOptionLayout1").classList.remove('CVOptionButtonSelected');
        document.getElementById("CVOptionLayout1").classList.add('CVOptionButtonUnselected');
    }
}

CardViewerFilter = {
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
    // Items
    Weapon: true,
    Armor: true,
    Accessory: true,
    Consumable: true,
    // Collections
    signature: true,
    uncollectable: false,
};

function GenerateCardListCardBrowser() {
    CardViewerFilter['text'] = document.getElementById('CardTextFilter').value;
    CardsToDisplay = new Array();

    A2Heroes = new Array();
    A2Items = new Array();
    A2Summons = new Array();
    A2SpecialItems = new Array();
    A2OtherCards = new Array(); //Spells, Improvements, Creeps.

    for (i = 0; i < CardJSON.length; i++) {
        LatestCardVersion = CardJSON[i]['versions'].length - 1;

        textfilter = new RegExp(CardViewerFilter['text'], "i");
        CardTextForFilter = "";
        if ("text" in CardJSON[i]['versions'][LatestCardVersion]) {
            CardTextForFilter += CardJSON[i]['versions'][LatestCardVersion]["text"]["english"];
        } 
        if (CardViewerFilter['includeabilitytext'] == true) {
            if ("abilities" in CardJSON[i]['versions'][LatestCardVersion]) {
                for (aa1 = 0; aa1 < CardJSON[i]['versions'][LatestCardVersion]['abilities'].length; aa1++) {
                    AbilityIDV = CardJSON[i]['versions'][LatestCardVersion]['abilities'][aa1].split("_");
                    AbilityID = AbilityIDV[0];
                    AbilityVersion = AbilityIDV[1];
                    for (aa2 = 0; aa2 < AbilityJSON.length; aa2++) {
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

        if ("searchterm" in CardJSON[i]) {
            SearchTermForFilter = CardJSON[i]["searchterm"];
        } else {
            SearchTermForFilter = "";
        }

        if (CardJSON[i]['versions'][LatestCardVersion]['card_type'] == "Item") {
            ColourCheckPass = true;
        } else if (CardViewerFilter[CardJSON[i]['versions'][LatestCardVersion]['colour']] == true) {
            ColourCheckPass = true;
        } else {
            ColourCheckPass = false;
        }

         //Pass if
        const ItemFilterCheck =
            //card is not an item
            !(
                CardJSON[i]["versions"][LatestCardVersion]["card_type"] ===
                "Item"
            ) ||
            // or subtype for the item is true in the filter
            CardViewerFilter[
                [CardJSON[i]["versions"][LatestCardVersion]["card_subtype"]]
            ];

        if (("is_signature" in CardJSON[i]['versions'][LatestCardVersion]) && CardViewerFilter['signature'] == false) {
            SignatureFilterCheck = false; //If this is a signature card and signatures are filtered out
        } else {
            SignatureFilterCheck = true; //Else show this card
        }

        if ("hide_from_card_list" in CardJSON[i] && CardViewerFilter['uncollectable'] == false) {
            HideFromCardListCheck = false; //If this card is uncollectable and uncollectables are filtered out
        } else {
            HideFromCardListCheck = true; //Else show this card
        }

        if (CardJSON[i]['versions'][LatestCardVersion]['card_name']['english'].search(textfilter) != -1 || CardTextForFilter.search(textfilter) != -1 || SearchTermForFilter.search(textfilter) != -1) {
            if (ColourCheckPass == true) {
                if (SignatureFilterCheck == true) {
                    if (ItemFilterCheck) {
                        if (HideFromCardListCheck == true) {
                            switch (CardJSON[i]['versions'][LatestCardVersion]["card_type"]) {
                                case 'Hero':
                                    A2Heroes.push(CardJSON[i]);
                                    break;
                                case 'Item':
                                    A2Items.push(CardJSON[i]);
                                    break;
                                case 'SpecialItem':
                                    A2SpecialItems.push(CardJSON[i]);
                                    break; 
                                default:
                                    A2OtherCards.push(CardJSON[i]);
                                    break;
                            }
                        }
                    }
                }
            }
        }
    }

    CardsToDisplay = OrderCardList(A2Heroes,A2OtherCards,A2Items);

    LongCardListHTML = "";
    CVCRedHeroHTML = "";
    CVCBlueHeroHTML = "";
    CVCBlackHeroHTML = "";
    CVCGreenHeroHTML = "";
    CVCColourlessHeroHTML = "";
    CVCRedCreepHTML = "";
    CVCBlueCreepHTML = "";
    CVCBlackCreepHTML = "";
    CVCGreenCreepHTML = "";
    CVCColourlessCreepHTML = "";
    CVCRedSpellHTML = "";
    CVCBlueSpellHTML = "";
    CVCBlackSpellHTML = "";
    CVCGreenSpellHTML = "";
    CVCColourlessSpellHTML = "";
    CVCRedImpHTML = "";
    CVCBlueImpHTML = "";
    CVCBlackImpHTML = "";
    CVCGreenImpHTML = "";
    CVCColourlessImpHTML = "";
    CVCWeaponHTML = "";
    CVCArmorHTML = "";
    CVCAccessoryHTML = "";
    CVCConsumableHTML = "";

    for (i = 0; i < CardsToDisplay.length; i++) {
        ThisCard = CardsToDisplay[i];
        CardID = ThisCard['card_id'];
        LatestCardVersion = ThisCard['versions'].length - 1;
        CardType = ThisCard['versions'][LatestCardVersion]['card_type'];
        CardMiniImage = ThisCard['versions'][LatestCardVersion]['miniimage'];
        CardName = ThisCard['versions'][LatestCardVersion]['card_name']['english'];
        CardIDV = CardID+'_'+LatestCardVersion;

        switch (CardType) {
            case "Hero":
                CardCostToDisplay = "";
                CardListCostStyle = "CardList_Cost";
                CardListCardTypeIconStyle = "CardList_CardTypeIconHero";
                CardColour = ThisCard['versions'][LatestCardVersion]['colour'];

                switch (CardColour) {
                    case 'R':
                        CVCRedHeroHTML += GenerateCVCHTML(ThisCard);
                        break;
                    case 'U':
                        CVCBlueHeroHTML += GenerateCVCHTML(ThisCard);
                        break;
                    case 'B':
                        CVCBlackHeroHTML += GenerateCVCHTML(ThisCard);
                        break;
                    case 'G':
                        CVCGreenHeroHTML += GenerateCVCHTML(ThisCard);
                        break;
                    case 'C':
                        CVCColourlessHeroHTML += GenerateCVCHTML(ThisCard);
                        break;
                }
                break;
            case "Creep":
                CardCostToDisplay = ThisCard['versions'][LatestCardVersion]['cost'];
                CardListCostStyle = "CardList_Cost CardList_ManaCost";
                CardListCardTypeIconStyle = "CardList_CardTypeIconCreep";
                CardColour = ThisCard['versions'][LatestCardVersion]['colour'];
                switch (CardColour) {
                    case 'R':
                        CVCRedCreepHTML += GenerateCVCHTML(ThisCard);
                        break;
                    case 'U':
                        CVCBlueCreepHTML += GenerateCVCHTML(ThisCard);
                        break;
                    case 'B':
                        CVCBlackCreepHTML += GenerateCVCHTML(ThisCard);
                        break;
                    case 'G':
                        CVCGreenCreepHTML += GenerateCVCHTML(ThisCard);
                        break;
                    case 'C':
                        CVCColourlessCreepHTML += GenerateCVCHTML(ThisCard);
                        break;
                }
                break;
            case "Summon":
                CardCostToDisplay = ThisCard['versions'][LatestCardVersion]['cost'];
                CardListCostStyle = "CardList_Cost CardList_ManaCost";
                CardListCardTypeIconStyle = "CardList_CardTypeIconCreep";
                CardColour = ThisCard['versions'][LatestCardVersion]['colour'];
                switch (CardColour) {
                    case 'R':
                        CVCRedCreepHTML += GenerateCVCHTML(ThisCard);
                        break;
                    case 'U':
                        CVCBlueCreepHTML += GenerateCVCHTML(ThisCard);
                        break;
                    case 'B':
                        CVCBlackCreepHTML += GenerateCVCHTML(ThisCard);
                        break;
                    case 'G':
                        CVCGreenCreepHTML += GenerateCVCHTML(ThisCard);
                        break;
                    case 'C':
                        CVCColourlessCreepHTML += GenerateCVCHTML(ThisCard);
                        break;
                }
                break;
            case "Spell":
                CardCostToDisplay = ThisCard['versions'][LatestCardVersion]['cost'];
                CardListCostStyle = "CardList_Cost CardList_ManaCost";
                CardListCardTypeIconStyle = "CardList_CardTypeIconSpell";
                CardColour = ThisCard['versions'][LatestCardVersion]['colour'];
                switch (CardColour) {
                    case 'R':
                        CVCRedSpellHTML += GenerateCVCHTML(ThisCard);
                        break;
                    case 'U':
                        CVCBlueSpellHTML += GenerateCVCHTML(ThisCard);
                        break;
                    case 'B':
                        CVCBlackSpellHTML += GenerateCVCHTML(ThisCard);
                        break;
                    case 'G':
                        CVCGreenSpellHTML += GenerateCVCHTML(ThisCard);
                        break;
                    case 'C':
                        CVCColourlessSpellHTML += GenerateCVCHTML(ThisCard);
                        break;
                }
                break;
            case "Improvement":
                CardCostToDisplay = ThisCard['versions'][LatestCardVersion]['cost'];
                CardListCostStyle = "CardList_Cost CardList_ManaCost";
                CardListCardTypeIconStyle = "CardList_CardTypeIconTE";
                CardColour = ThisCard['versions'][LatestCardVersion]['colour'];
                switch (CardColour) {
                    case 'R':
                        CVCRedImpHTML += GenerateCVCHTML(ThisCard);
                        break;
                    case 'U':
                        CVCBlueImpHTML += GenerateCVCHTML(ThisCard);
                        break;
                    case 'B':
                        CVCBlackImpHTML += GenerateCVCHTML(ThisCard);
                        break;
                    case 'G':
                        CVCGreenImpHTML += GenerateCVCHTML(ThisCard);
                        break;
                    case 'C':
                        CVCColourlessImpHTML += GenerateCVCHTML(ThisCard);
                        break;
                }
                break;
            case "Item":
                CardCostToDisplay = ThisCard['versions'][LatestCardVersion]['gcost'];
                CardListCostStyle = "CardList_Cost CardList_GoldCost";
                CardListCardTypeIconStyle = "CardList_CardTypeIcon"+ThisCard['versions'][LatestCardVersion]['card_subtype'];
                CardColour = "I";
                ItemSubtype = ThisCard['versions'][LatestCardVersion]['card_subtype'];

                switch (ItemSubtype) {
                    case 'Weapon':
                        CVCWeaponHTML += GenerateCVCHTML(ThisCard);
                        break;
                    case 'Armor':
                        CVCArmorHTML += GenerateCVCHTML(ThisCard);
                        break;
                    case 'Accessory':
                        CVCAccessoryHTML += GenerateCVCHTML(ThisCard);
                        break;
                    case 'Consumable':
                        CVCConsumableHTML += GenerateCVCHTML(ThisCard);
                        break;
                    default:
                        CVCConsumableHTML += GenerateCVCHTML(ThisCard);
                        break;
                }
                break;
            default:
                CardCostToDisplay = ThisCard['versions'][LatestCardVersion]['cost'];
                CardListCostStyle = "CardList_Cost CardList_ManaCost";
                CardListCardTypeIconStyle = "CardList_CardTypeIcon"+CardType;
                CardColour = ThisCard['versions'][LatestCardVersion]['colour'];
        }
        LongCardListHTML += '<div class="CardListItemContainer CardListItemContainer'+CardColour+'" onmouseup="CardViewer_SelectCard(\''+CardIDV+'\');"> \
                                <div class="CardList_CardMiniPicture"><img src=Images/Cards/MiniImage/'+CardMiniImage+'.jpg></div> \
                                <div class="CardList_CardTypeIcon '+CardListCardTypeIconStyle+'"></div> \
                                <div class="CardList_CardCost '+CardListCostStyle+'">'+CardCostToDisplay+'</div> \
                                <div class="CardList_CardName">'+CardName+'</div> \
                            </div>';
    }

    document.getElementById('CardViewerPageCardList').innerHTML = LongCardListHTML;
    document.getElementById('CVCRedHeroes').innerHTML = CVCRedHeroHTML;
    document.getElementById('CVCBlueHeroes').innerHTML = CVCBlueHeroHTML;
    document.getElementById('CVCBlackHeroes').innerHTML = CVCBlackHeroHTML;
    document.getElementById('CVCGreenHeroes').innerHTML = CVCGreenHeroHTML;
    document.getElementById('CVCColourlessHeroes').innerHTML = CVCColourlessHeroHTML;
    document.getElementById('CVCRedCreeps').innerHTML = CVCRedCreepHTML;
    document.getElementById('CVCBlueCreeps').innerHTML = CVCBlueCreepHTML;
    document.getElementById('CVCBlackCreeps').innerHTML = CVCBlackCreepHTML;
    document.getElementById('CVCGreenCreeps').innerHTML = CVCGreenCreepHTML;
    document.getElementById('CVCColourlessCreeps').innerHTML = CVCColourlessCreepHTML;
    document.getElementById('CVCRedSpells').innerHTML = CVCRedSpellHTML;
    document.getElementById('CVCBlueSpells').innerHTML = CVCBlueSpellHTML;
    document.getElementById('CVCBlackSpells').innerHTML = CVCBlackSpellHTML;
    document.getElementById('CVCGreenSpells').innerHTML = CVCGreenSpellHTML;
    document.getElementById('CVCColourlessSpells').innerHTML = CVCColourlessSpellHTML;
    document.getElementById('CVCRedImp').innerHTML = CVCRedImpHTML;
    document.getElementById('CVCBlueImp').innerHTML = CVCBlueImpHTML;
    document.getElementById('CVCBlackImp').innerHTML = CVCBlackImpHTML;
    document.getElementById('CVCGreenImp').innerHTML = CVCGreenImpHTML;
    document.getElementById('CVCColourlessImp').innerHTML = CVCColourlessImpHTML;
    document.getElementById('CVCWeapons').innerHTML = CVCWeaponHTML;
    document.getElementById('CVCArmor').innerHTML = CVCArmorHTML;
    document.getElementById('CVCAcc').innerHTML = CVCAccessoryHTML;
    document.getElementById('CVCCon').innerHTML = CVCConsumableHTML;
}

function GenerateCVCHTML(Card) {
    CardID = Card['card_id'];
    LatestVersion = Card['versions'].length - 1;
    CardType = Card['versions'][LatestCardVersion]['card_type'];
    CardMiniImage = Card['versions'][LatestCardVersion]['miniimage'];
    CardName = Card['versions'][LatestCardVersion]['card_name']['english'];
    
    CardIDV = CardID+'_'+LatestCardVersion;

    if (CardType == 'Hero') {
        CardColour = Card['versions'][LatestCardVersion]['colour'];
        CardCostToShow = '&nbsp;';
        CardCostStyle = "";
    } else if (CardType == 'Item') {
        CardColour = "I";
        CardCostToShow = Card['versions'][LatestCardVersion]['gcost'];
        CardCostStyle = "CVCCardListingCardCostGold";
    } else {
        CardColour = Card['versions'][LatestCardVersion]['colour'];
        CardCostToShow = Card['versions'][LatestCardVersion]['cost'];
        CardCostStyle = "CVCCardListingCardCostMana";
    }

    CVCCardHTML = '<div class="CVCCardListing CVCCardListing'+CardColour+'" onmousemove="CardViewerCardPreviewTooltip(\''+CardIDV+'\',1);" onmouseout="CardViewerCardPreviewTooltip(0,0);" onmouseup="CardViewer_SelectCard(\''+CardIDV+'\'); CVChangeViewStyle(0)"> \
                    <div class="CVCCardListingMiniImage"><img src="Images/Cards/MiniImage/'+CardMiniImage+'.jpg"></div> \
                    <div class="CVCCardListingCardCost '+CardCostStyle+'">'+CardCostToShow+'</div> \
                    <div class="CVCCardListingCardName">'+CardName+'</div> \
                    <div class="clear"></div>\
                </div>';
    return CVCCardHTML;
}

function CardViewer_SelectCard(CardIDV, skipHistory) {
    // Push Card to browser History
    // skipHistory is optional and defaults to null, so this won't affect existing code
    if(!skipHistory){
        history.pushState({}, "Artifact 2 Card Viewer", `?id=${CardIDV}&l=false`);
    }

    GenerateCard('CardContainerCardBrowser',CardIDV);
    CardViewerCardPreviewTooltip(0,0); //Hide Tooltip
    CardIDV = CardIDV.split("_");
    let CardID = CardIDV[0];
    let CardVersion = CardIDV[1];
    let CardArrayIndex = "";
    for (i = 0; i < CardJSON.length; i++) {
        if ((CardJSON[i]['card_id']) == CardID) {
            CardArrayIndex = i;
            break;
        }
    }
    if ((CardVersion > (CardJSON[CardArrayIndex]['versions'].length - 1)) || CardVersion < 0) { 
        CardVersion = (CardJSON[CardArrayIndex]['versions'].length - 1); // Get latest version of card if requested card version doesn't exist.
    }
    ThisCard = CardJSON[CardArrayIndex]['versions'][CardVersion];

    document.getElementById('CardDetailsPanelCardTitle').innerHTML = ThisCard['card_name']['english'];
    document.getElementById('ShareButton').onclick = () => CardShareToClipboard(CardID+"_"+CardVersion);
    
    if (ThisCard['card_type'] == "Item") {
        document.getElementById('CardDetailsPanelCardType').innerHTML = ThisCard['card_type']+' - '+ThisCard['card_subtype'];
    } else if (ThisCard['card_type'] == "Improvement") {
        document.getElementById('CardDetailsPanelCardType').innerHTML = "Tower Enchantment";
    } else {
        document.getElementById('CardDetailsPanelCardType').innerHTML = ThisCard['card_type'];
    }

    //SHOW SIGNATURE CARD DETAILS ON LEFT
    if ("signature" in ThisCard) { 
        if (ThisCard['signature'] == 0) {
            HTMLSignatureCardLeftPanel = '<div class="CardViewerPageSingleAbilityContainer CardViewerPageSignatureContainer'+ThisCard['colour']+'"> \
                                            <div class="CardViewerPageAbilityTop"> \
                                                <div class="CardViewerPageAbilityIcon"><img src="Images/Cards/MiniImage/PH.jpg"></div> \
                                                <div class="CardViewerPageAbilityTopText"> \
                                                    <div class="CardViewerPageAbilityName">SIGNATURE CARD NOT YET KNOWN</div> \
                                                    <div class="CardViewerPageSigCardText"></div> \
                                                </div> \
                                                <div class="clear"></div> \
                                            </div> \
                                            <div class="CardViewerPageAbilityText">This hero\'s Signature Card has not yet been revealed!</div>\
                                        </div>';
        } else {
            HTMLSignatureCardLeftPanel = "";
            for (sc = 0; sc < ThisCard['signature'].length; sc++) {
                SigCardIDV = ThisCard['signature'][sc];
                SigCardIDV = SigCardIDV.split("_");
                SigCardID = SigCardIDV[0];
                SigCardVersion = SigCardIDV[1];
                SigCardArrayIndex = "";
                for (s = 0; s < CardJSON.length; s++) {
                    if ((CardJSON[s]['card_id']) == SigCardID) {
                        SigCardArrayIndex = s;
                        break;
                    }
                }
                SigCardMiniImage = CardJSON[SigCardArrayIndex]['versions'][SigCardVersion]['miniimage'];
                SigCardName = CardJSON[SigCardArrayIndex]['versions'][SigCardVersion]['card_name']['english'];
                SigCardType = CardJSON[SigCardArrayIndex]['versions'][SigCardVersion]['card_type'];
                SigCardText = CardViewer_AbilityTextFormatting(CardJSON[SigCardArrayIndex]['versions'][SigCardVersion]['text']['english']);
                SigCardColour = CardJSON[SigCardArrayIndex]['versions'][SigCardVersion]['colour'];
        
                HTMLSignatureCardLeftPanel += '<div class="CursorPointer CardViewerPageSingleAbilityContainer CardViewerPageSignatureContainer'+SigCardColour+'" onmousemove="CardViewerCardPreviewTooltip(\''+SigCardID+'_'+SigCardVersion+'\',1);" onmouseout="CardViewerCardPreviewTooltip(0,0);" onmouseup="CardViewer_SelectCard(\''+SigCardID+'_'+SigCardVersion+'\')"> \
                                                <div class="CardViewerPageAbilityTop"> \
                                                    <div class="CardViewerPageAbilityIcon"><img src="Images/Cards/MiniImage/'+SigCardMiniImage+'.jpg"></div> \
                                                    <div class="CardViewerPageAbilityTopText"> \
                                                        <div class="CardViewerPageAbilityName">'+SigCardName.toUpperCase()+'</div> \
                                                        <div class="CardViewerPageSigCardText CardViewerPageSigCardText'+SigCardColour+'">SIGNATURE CARD</div> \
                                                    </div> \
                                                    <div class="clear"></div> \
                                                </div> \
                                                <div class="CardViewerPageAbilityText">'+SigCardText+'</div>\
                                            </div>';
            }
        }      
    } else {
        HTMLSignatureCardLeftPanel = "";
    }

    //SHOW HERO DETAILS IF THIS CARD IS A SIGNATURE CARD
    if ("is_signature" in ThisCard) {
        HeroCardIDV = ThisCard['is_signature'];
        HeroCardIDV = HeroCardIDV.split("_");
        HeroCardID = HeroCardIDV[0];
        HeroCardVersion = HeroCardIDV[1];
        HeroCardArrayIndex = "";
        for (h = 0; h < CardJSON.length; h++) {
            if ((CardJSON[h]['card_id']) == HeroCardID) {
                HeroCardArrayIndex = h;
                break;
            }
        }
        HeroCardMiniImage = CardJSON[HeroCardArrayIndex]['versions'][HeroCardVersion]['miniimage'];
        HeroCardName = CardJSON[HeroCardArrayIndex]['versions'][HeroCardVersion]['card_name']['english'];
        HeroCardType = CardJSON[HeroCardArrayIndex]['versions'][HeroCardVersion]['card_type'];
        HeroCardColour = CardJSON[HeroCardArrayIndex]['versions'][HeroCardVersion]['colour'];

        HTMLHeroCardLeftPanel = '<div class="CursorPointer CardViewerPageSingleAbilityContainer CardViewerPageSignatureContainer'+HeroCardColour+'" onmousemove="CardViewerCardPreviewTooltip(\''+HeroCardID+'_'+HeroCardVersion+'\',1);" onmouseout="CardViewerCardPreviewTooltip(0,0);" onmouseup="CardViewer_SelectCard(\''+HeroCardID+'_'+HeroCardVersion+'\')"> \
                                        <div class="CardViewerPageAbilityTop"> \
                                            <div class="CardViewerPageAbilityIcon"><img src="Images/Cards/MiniImage/'+HeroCardMiniImage+'.jpg"></div> \
                                            <div class="CardViewerPageAbilityTopText"> \
                                                <div class="CardViewerPageAbilityName">'+HeroCardName.toUpperCase()+'</div> \
                                                <div class="CardViewerPageSigCardText CardViewerPageSigCardText'+HeroCardColour+'">SIGNATURE CARD FOR '+HeroCardName.toUpperCase()+'</div> \
                                            </div> \
                                            <div class="clear"></div> \
                                        </div> \
                                        <div class="CardViewerPageAbilityText"></div>\
                                    </div>';
    } else {
        HTMLHeroCardLeftPanel = "";
    }

    //SHOW RELATED CARDS DETAILS ON LEFT
    if ("related_cards" in ThisCard) { 
        if (ThisCard['related_cards'] == 0) {
            HTMLRelatedCardsLeftPanel = "";
        } else {
            HTMLRelatedCardsLeftPanel = "";
            for (rc = 0; rc < ThisCard['related_cards'].length; rc++) {
                RelCardIDV = ThisCard['related_cards'][rc];
                RelCardIDV = RelCardIDV.split("_");
                RelCardID = RelCardIDV[0];
                RelCardVersion = RelCardIDV[1];
                RelCardArrayIndex = "";
                for (r = 0; r < CardJSON.length; r++) {
                    if ((CardJSON[r]['card_id']) == RelCardID) {
                        RelCardArrayIndex = r;
                        break;
                    }
                }
                RelCardMiniImage = CardJSON[RelCardArrayIndex]['versions'][RelCardVersion]['miniimage'];
                RelCardName = CardJSON[RelCardArrayIndex]['versions'][RelCardVersion]['card_name']['english'];
                RelCardType = CardJSON[RelCardArrayIndex]['versions'][RelCardVersion]['card_type'];
                if ("text" in CardJSON[RelCardArrayIndex]['versions'][RelCardVersion]) {
                    RelCardText = CardViewer_AbilityTextFormatting(CardJSON[RelCardArrayIndex]['versions'][RelCardVersion]['text']['english']);
                } else {
                    RelCardText = "";
                }
                if (CardJSON[RelCardArrayIndex]['versions'][RelCardVersion]["card_type"] == "Item") {
                    RelCardColour = "I";
                } else {
                    RelCardColour = CardJSON[RelCardArrayIndex]['versions'][RelCardVersion]['colour'];
                }
                HTMLRelatedCardsLeftPanel += '<div class="CursorPointer CardViewerPageSingleAbilityContainer CardViewerPageSignatureContainer'+RelCardColour+'" onmousemove="CardViewerCardPreviewTooltip(\''+RelCardID+'_'+RelCardVersion+'\',1);" onmouseout="CardViewerCardPreviewTooltip(0,0);" onmouseup="CardViewer_SelectCard(\''+RelCardID+'_'+RelCardVersion+'\')"> \
                                                <div class="CardViewerPageAbilityTop"> \
                                                    <div class="CardViewerPageAbilityIcon"><img src="Images/Cards/MiniImage/'+RelCardMiniImage+'.jpg"></div> \
                                                    <div class="CardViewerPageAbilityTopText"> \
                                                        <div class="CardViewerPageAbilityName">'+RelCardName.toUpperCase()+'</div> \
                                                        <div class="CardViewerPageSigCardText CardViewerPageSigCardText'+RelCardColour+'">RELATED CARD</div> \
                                                    </div> \
                                                    <div class="clear"></div> \
                                                </div> \
                                                <div class="CardViewerPageAbilityText">'+RelCardText+'</div>\
                                            </div>';
            }
        }      
    } else {
        HTMLRelatedCardsLeftPanel = "";
    }

    //SHOW ABILITY DETAILS ON LEFT
    if ("abilities" in ThisCard) { 
        HTMLCardAbilitiesLeftPanel = "";
        if (ThisCard['abilities'].length > 0) { //If the card has abilities
            for (a = 0; a < ThisCard['abilities'].length; a++) {
                AbilityIDV = ThisCard['abilities'][a].split("_");
                AbilityID = AbilityIDV[0];
                AbilityVersion = AbilityIDV[1];
                for (aa = 0; aa < AbilityJSON.length; aa++) {
                    if ((AbilityJSON[aa]['card_id']) == AbilityID) {
                        AbilityArrayIndex = aa;
                        break;
                    }
                }
                AbilityName = AbilityJSON[aa]['versions'][AbilityVersion]['ability_name']['english'];
                AbilityType = AbilityJSON[aa]['versions'][AbilityVersion]['ability_type'];
                if (AbilityType != "Continuous Effect") {
                    AbilityType = AbilityType + " Ability";
                }
                AbilityImage = AbilityJSON[aa]['versions'][AbilityVersion]['image'];
                AbilityText = CardViewer_AbilityTextFormatting(AbilityJSON[aa]['versions'][AbilityVersion]['text']['english']);

                HTMLCardAbilitiesLeftPanel += '<div class="CardViewerPageSingleAbilityContainer"> \
                <div class="CardViewerPageAbilityTop"> \
                    <div class="CardViewerPageAbilityIcon"><img src="Images/Abilities/'+AbilityImage+'.jpg"></div> \
                    <div class="CardViewerPageAbilityTopText"> \
                        <div class="CardViewerPageAbilityName">'+AbilityName.toUpperCase()+'</div> \
                        <div class="CardViewerPageAbilityType">'+AbilityType+'</div> \
                    </div> \
                    <div class="clear"></div> \
                </div> \
                <div class="CardViewerPageAbilityText">'+AbilityText+'</div>\
            </div>';
            }
        } else {
            HTMLCardAbilitiesLeftPanel = "&nbsp";
        }
    } else {
        HTMLCardAbilitiesLeftPanel = "&nbsp";
    }

    //SHOW CARD LORE
    if ("lore" in ThisCard) { 
        HTMLLoreTextLeftPanel = '<div id="CardViewerPageCardLoreTextBody">'+ThisCard['lore']['text']['english'].replace(/\/n/g,"<br>")+'</div>\
        <div id="CardViewerPageCardLoreTextTag">'+ThisCard['lore']['tag']['english']+'</div>';
    } else {
        HTMLLoreTextLeftPanel = '<div id="CardViewerPageCardLoreTextBody">&nbsp;</div>';
    }

    document.getElementById('SigAbilityRelated_Container').innerHTML = "";
    document.getElementById('SigAbilityRelated_Container').innerHTML += HTMLHeroCardLeftPanel;
    document.getElementById('SigAbilityRelated_Container').innerHTML += HTMLSignatureCardLeftPanel;
    document.getElementById('SigAbilityRelated_Container').innerHTML += HTMLRelatedCardsLeftPanel;
    document.getElementById('SigAbilityRelated_Container').innerHTML += HTMLCardAbilitiesLeftPanel;

    //document.getElementById('CardViewerPageCardLore').innerHTML = HTMLLoreTextLeftPanel;
    //document.getElementById('CardViewerPageCardLoreMobile').innerHTML = HTMLLoreTextLeftPanel;

    document.getElementById('CardViewerPage_CardHistoryChangeContainer').innerHTML = GetVersionChangesHTML(CardID);

    // Adapted from http://detectmobilebrowser.com/mobile
    const isMobile = (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      ) {
        return true;
      } else {
        return false;
      }
    })(navigator.userAgent || navigator.vendor || window.opera);
    
    // Scroll to Top on Mobile
    if(isMobile){
        window.scrollTo({top: 0, behavior: 'smooth'});
    }
}

CardViewerCardPreviewTooltipCurrentCardIDV = "";
function CardViewerCardPreviewTooltip(CardIDV, ShowHide) {

    if (CardIDV == 0) {
        //Do Nothing
    } else if (CardViewerCardPreviewTooltipCurrentCardIDV != CardIDV) {
        GenerateCard('CardPreviewTooltip',CardIDV);
        CardViewerCardPreviewTooltipCurrentCardIDV = CardIDV;
    } 

    if (ShowHide == 0) { //Hide
        document.getElementById('CardPreviewTooltip').style.display = "none";
    } else {
        const body = document.body;
        const html = document.documentElement;

        // preview is a fixed 170:290~px. Adding a 10px margin too.
        const maximumHeight = Math.max( body.scrollHeight, body.offsetHeight, 
                                html.clientHeight, html.scrollHeight, html.offsetHeight ) - 300;
        const maximumWidth = Math.max( body.scrollWidth, body.offsetWidth, 
                                html.clientWidth, html.scrollWidth, html.offsetWidth ) - 180;
                                
        document.getElementById('CardPreviewTooltip').style.display = "block";
        document.getElementById('CardPreviewTooltip').style.top = Math.min((event.clientY + window.scrollY + 10), maximumHeight)+"px";
        document.getElementById('CardPreviewTooltip').style.left = Math.min((event.clientX + 10),maximumWidth)+"px";
    }
}

function ShowKeywordTooltip(ShowHide, KeywordIndex) {

    if (ShowHide == 0) { //Hide
        document.getElementById('SpecialTextTooltip').style.display = "none";
    } else {
        document.getElementById('SpecialTextTitle').innerHTML = KeywordsJSON[KeywordIndex]['keyword'].toUpperCase();
        document.getElementById('SpecialTextDesc').innerHTML = KeywordsJSON[KeywordIndex]['desc'];
        document.getElementById('SpecialTextTooltip').style.display = "block";
        document.getElementById('SpecialTextTooltip').style.top = (event.clientY + window.scrollY + 10)+"px";
        document.getElementById('SpecialTextTooltip').style.left = (event.clientX + 10)+"px";
    }
}
function ShowTextTooltip(ShowHide, Text) {

    if (ShowHide == 0) { //Hide
        document.getElementById('SpecialTextTooltip').style.display = "none";
    } else {
        document.getElementById('SpecialTextTitle').innerHTML = "";
        document.getElementById('SpecialTextDesc').innerHTML = Text;
        document.getElementById('SpecialTextTooltip').style.display = "block";
        document.getElementById('SpecialTextTooltip').style.top = (event.clientY + window.scrollY + 10)+"px";
        document.getElementById('SpecialTextTooltip').style.left = (event.clientX + 10)+"px";
    }
}

// This is triggered every time the user manually changes page without leaving the current URL
window.onpopstate = (event) => {
    const param = getURLParams(document.location.href)
    if(param.l === "true"){
        CVChangeViewStyle(1);
    }
    else {
        CVChangeViewStyle(0);
        if(param.id){
            CardViewer_SelectCard(param.id, true);
        } else {
            CardViewer_SelectCard('10020_99', true);
        }
        
    }
};

function ToggleFilter(FilterValue) {
    if (FilterValue == "R" || FilterValue == "U" || FilterValue == "B" || FilterValue == "G" || FilterValue == "C") {
        if (CardViewerFilter[FilterValue] == true) {
            CardViewerFilter[FilterValue] = false;
                document.getElementById("ColourFilter"+FilterValue).classList.add('CVOptionButtonUnselected');
                document.getElementById("ColourFilter"+FilterValue).classList.remove('CVOptionButtonSelected');
                document.getElementById("CVCOuterContainer"+FilterValue).style.display = "none";
        } else {
            CardViewerFilter[FilterValue] = true;
            document.getElementById("ColourFilter"+FilterValue).classList.add('CVOptionButtonSelected');
            document.getElementById("ColourFilter"+FilterValue).classList.remove('CVOptionButtonUnselected');
            document.getElementById("CVCOuterContainer"+FilterValue).style.display = "block";
        }
    } else if (FilterValue == "signature") {
        if (CardViewerFilter[FilterValue] == true) {
            CardViewerFilter[FilterValue] = false;
            document.getElementById("HiddenFilterSignature").classList.add('CVOptionButtonUnselected');
            document.getElementById("HiddenFilterSignature").classList.remove('CVOptionButtonSelected');
        } else {
            CardViewerFilter[FilterValue] = true;
            document.getElementById("HiddenFilterSignature").classList.add('CVOptionButtonSelected');
            document.getElementById("HiddenFilterSignature").classList.remove('CVOptionButtonUnselected');
        }
    } else if (FilterValue == "uncollectable") {
        if (CardViewerFilter[FilterValue] == true) {
            CardViewerFilter[FilterValue] = false;
            document.getElementById("HiddenFilterUncollectable").classList.add('CVOptionButtonUnselected');
            document.getElementById("HiddenFilterUncollectable").classList.remove('CVOptionButtonSelected');
        } else {
            CardViewerFilter[FilterValue] = true;
            document.getElementById("HiddenFilterUncollectable").classList.add('CVOptionButtonSelected');
            document.getElementById("HiddenFilterUncollectable").classList.remove('CVOptionButtonUnselected');
        }
    } else if (FilterValue == "abilitytext") {
        if (CardViewerFilter['includeabilitytext'] == true) {
            CardViewerFilter['includeabilitytext'] = false;
            document.getElementById("FilterIncludeAbilityText").classList.add('CVOptionButtonUnselected');
            document.getElementById("FilterIncludeAbilityText").classList.remove('CVOptionButtonSelected');
        } else {
            CardViewerFilter['includeabilitytext'] = true;
            document.getElementById("FilterIncludeAbilityText").classList.add('CVOptionButtonSelected');
            document.getElementById("FilterIncludeAbilityText").classList.remove('CVOptionButtonUnselected');
        }
    } else if (
        FilterValue === "Weapon" ||
        FilterValue === "Armor" ||
        FilterValue === "Accessory" ||
        FilterValue === "Consumable"
    ) {  
        CardViewerFilter[FilterValue] = !CardViewerFilter[FilterValue];
        const el = document.getElementById("ItemFilter"+FilterValue)
        const sel = { 
            Weapon: "CVCWeapons",
            Armor: "CVCArmor",
            Accessory: "CVCAcc",
            Consumable: "CVCCon"
        }
        if (!CardViewerFilter[FilterValue]) {
            el.classList.remove('CVOptionButtonSelected');
            el.classList.add('CVOptionButtonUnselected');
            document.getElementById(sel[FilterValue]).style.display = "none";
        } else {
            el.classList.add('CVOptionButtonSelected');
            el.classList.remove('CVOptionButtonUnselected');
            document.getElementById(sel[FilterValue]).style.display = "block";
        }
    }
    if (CardViewerFilter["R"] == false && CardViewerFilter["U"] == false && CardViewerFilter["B"] == false && CardViewerFilter["G"] == false && CardViewerFilter["C"] == false && CardViewerFilter["Weapon"] == false && CardViewerFilter["Armor"] == false && CardViewerFilter["Accessory"] == false && CardViewerFilter["Consumable"] == false) { // If all colour filters and item filters are turned off
        document.getElementById('ColourFilterContainer').style.background = "rgba(135,31,38,0.6)";
        document.getElementById('ItemFilterContainer').style.background = "rgba(135,31,38,0.6)";
    } else {
        document.getElementById('ColourFilterContainer').style.background = "";
        document.getElementById('ItemFilterContainer').style.background = "";
    }
    GenerateCardListCardBrowser();
}

 // CARD SHARE FUNCTIONS
let alreadyRestoringSaveButton = false;
function restoreSaveButtonWithDelay(){
    if (alreadyRestoringSaveButton) {
        clearTimeout(alreadyRestoringSaveButton);
    }
    alreadyRestoringSaveButton = setTimeout(() => {
        document.getElementById("ShareButton").innerText = "Share This Card";
        alreadyRestoringSaveButton = false;
    }, 3000);
};

function CardShareToClipboard(CardIDV) {
    const copyText = document.getElementById("hiddenClipboard");

    copyText.value = document.location.href.split("?")[0] + "?id=" + CardIDV;
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    try {
        const successful = document.execCommand("copy");
        const msg = successful ? "successful" : "unsuccessful";

        document.getElementById("ShareButton").innerText = "Copied!";
        restoreSaveButtonWithDelay();
    } catch (err) {
        console.log("Oops, unable to copy");
    }
} 