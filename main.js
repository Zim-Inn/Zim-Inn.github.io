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

function InitializeCardViewerPage() { //Load JSON and load first card
    p1 = new Promise(function(resolve, reject) {
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
    p2 = new Promise(function(resolve, reject) {
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

    Promise.all([p1,p2]).then(responses => {
        CardJSON = JSON.parse(responses[0]);
        AbilityJSON = JSON.parse(responses[1]);
        GenerateCardViewerPage('');
        
        const id = getURLParams(document.location.href).id
        if(getURLParams(document.location.href).id){
            CardViewer_SelectCard(id, true);
        } else {
            CardViewer_SelectCard('200043_99', true);
        }
    })
}

InitializeCardViewerPage();

function CardTextFormatting(CardText) {
    CardText = CardText.replace(/\/n/g,"<br>");
    CardText = CardText.replace(/(\[ATT\])/g,"▣");
    CardText = CardText.replace(/(\[AR\])/g,"▤");
    CardText = CardText.replace(/(\[HP\])/g,"▥");
    CardText = CardText.replace(/(\[QU\])/g,"▢");
    CardText = CardText.replace(/(\[AC\])/g,"■");
    CardText = CardText.replace(/(\[RP\])/g,"□");
    CardText = CardText.replace(/(\[TG\])/g,"<span class=\"TextColour_Golden\">");
    CardText = CardText.replace(/(\[TRed\])/g,"<span class=\"TextColour_Red\">");
    CardText = CardText.replace(/(\[ET\])/g,"</span>");
    CardText = CardText.replace(/(Regeneration)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Regeneration\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Regeneration</span>");
    CardText = CardText.replace(/(After Combat)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'After Combat\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">After Combat</span>");
    CardText = CardText.replace(/(Aura)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Aura\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Aura</span>");
    CardText = CardText.replace(/(Bounce)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Bounce\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Bounce</span>");
    CardText = CardText.replace(/(Burn)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Burn\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Burn</span>");
    CardText = CardText.replace(/(Cross Lane)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Cross Lane\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Cross Lane</span>");
    CardText = CardText.replace(/(Cursed)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Cursed\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Cursed</span>");
    CardText = CardText.replace(/(Death Effect)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Death Effect\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Death Effect</span>");
    CardText = CardText.replace(/(Decay)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Decay\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Decay</span>");
    CardText = CardText.replace(/(Devour)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Devour\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Devour</span>");
    CardText = CardText.replace(/(Disarm)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Disarm\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Disarm</span>");
    CardText = CardText.replace(/(Dispel)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Dispel\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Dispel</span>");
    CardText = CardText.replace(/(Enchant)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Enchant\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Enchant</span>");
    CardText = CardText.replace(/(Feeble)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Feeble\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Feeble</span>");
    CardText = CardText.replace(/(Fountain)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Fountain\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Fountain</span>");
    CardText = CardText.replace(/(Jump)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Jump\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Jump</span>");
    CardText = CardText.replace(/(Lifesteal)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Lifesteal\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Lifesteal</span>");
    CardText = CardText.replace(/(Lock)/g,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Lock\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Lock</span>");
    CardText = CardText.replace(/(Minion)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Minion\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Minion</span>");
    CardText = CardText.replace(/(Mulch)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Mulch\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Mulch</span>");
    CardText = CardText.replace(/(Pierce)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Pierce\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Pierce</span>");
    CardText = CardText.replace(/(Piercing)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Piercing\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Piercing</span>");
    CardText = CardText.replace(/(Pillager)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Pillager\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Pillager</span>");
    CardText = CardText.replace(/(Push)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Push\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Push</span>");
    CardText = CardText.replace(/(Play Effect)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Play Effect\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Play Effect</span>");
    CardText = CardText.replace(/(Quickcast)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Quickcast\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Quickcast</span>");
    CardText = CardText.replace(/(Quickstrike)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Quickstrike\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Quickstrike</span>");
    CardText = CardText.replace(/(Retaliate)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Retaliate\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Retaliate</span>");
    CardText = CardText.replace(/(Rooted)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Rooted\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Rooted</span>");
    CardText = CardText.replace(/(Scheme)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Scheme\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Scheme</span>");
    CardText = CardText.replace(/(Siege)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Siege\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Siege</span>");
    CardText = CardText.replace(/(Stun)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Stun\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Stun</span>");
    if (!CardText.includes("Swap colors")) { //Body Modifications card
        CardText = CardText.replace(/(Swap)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Swap\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Swap</span>");
    }
    CardText = CardText.replace(/(Taunt)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Taunt\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Taunt</span>");
    CardText = CardText.replace(/(Trample)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Trample\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Trample</span>");
    CardText = CardText.replace(/(Untargetable)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Untargetable\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Untargetable</span>");

    return CardText;
}

function CardViewer_AbilityTextFormatting(Text) {
    Text = Text.replace(/\/n/g," ");
    Text = Text.replace(/(\[ATT\])/g,"▣");
    Text = Text.replace(/(\[AR\])/g,"▤");
    Text = Text.replace(/(\[HP\])/g,"▥");
    Text = Text.replace(/(\[QU\])/g,"<br>▢");
    Text = Text.replace(/(\[AC\])/g,"■");
    Text = Text.replace(/(\[RP\])/g,"□");
    Text = Text.replace(/(\[TG\])/g,"");
    Text = Text.replace(/(\[TRed\])/g,"");
    Text = Text.replace(/(\[ET\])/g,"");
    return Text;
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

CardViewerFilter = {text:"", set1: true, rarity1: true, rarity2: true, rarity3: true, rarity4: true, rarity5: true, quick: true, crosslane: true, R: true, U: true, B: true, G: true, C: true, signature: true, uncollectable: false}

function GenerateCardViewerPage() {
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
        if ("text" in CardJSON[i]['versions'][LatestCardVersion]) {
            CardTextForFilter = CardJSON[i]['versions'][LatestCardVersion]["text"]["english"];
        } else {
            CardTextForFilter = "";
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
                    //if (!("hide_from_card_list" in CardJSON[i]) || HideFromCardListFilter.contains(CardJSON[i]['hide_from_card_list'])) {
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

    const colorIndex = {R:1, U:2, B:3, G:4, C:5};

    A2Heroes = A2Heroes.sort((Card1, Card2) => {
        c1 = Card1.versions[Card1.versions.length-1];
        c2 = Card2.versions[Card2.versions.length-1];
        c1colour = colorIndex[c1.colour]
        c2colour = colorIndex[c2.colour]

        if ( c1colour !== c2colour) {
            if( c1colour > c2colour)
                return 1;
            else
                return -1;
        }
        if (c1.card_name.english > c2.card_name.english) {
            return 1;
        } else {
            return -1
        }
    });
    A2OtherCards = A2OtherCards.sort((Card1, Card2) => {
        c1 = Card1.versions[Card1.versions.length-1];
        c2 = Card2.versions[Card2.versions.length-1];
        c1colour = colorIndex[c1.colour]
        c2colour = colorIndex[c2.colour]

        if ( c1.cost !== c2.cost) {
            if( c1.cost > c2.cost)
                return 1;
            else
                return -1;
        }
        if ( c1colour !== c2colour) {
            if( c1colour > c2colour)
                return 1;
            else
                return -1;
        }
        if (c1.card_name.english > c2.card_name.english) {
            return 1;
        } else {
            return -1
        }
    });

    A2Items = A2Items.sort((Card1, Card2) => {
        c1 = Card1.versions[Card1.versions.length-1];
        c2 = Card2.versions[Card2.versions.length-1];
        c1colour = colorIndex[c1.colour]
        c2colour = colorIndex[c2.colour]

        if (c1.gcost !== c2.gcost) {
            if (c1.gcost > c2.gcost) {
                return 1;
            } else {
                return -1;
            }
        }
        if (c1.card_name.english > c2.card_name.english) {
            return 1;
        } else {
            return -1
        }
    });

    CardsToDisplay = CardsToDisplay.concat(A2Heroes);
    CardsToDisplay = CardsToDisplay.concat(A2OtherCards);
    CardsToDisplay = CardsToDisplay.concat(A2SpecialItems);
    CardsToDisplay = CardsToDisplay.concat(A2Items);

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

    CardHTML = '<div class="CVCCardListing CVCCardListing'+CardColour+'" onmousemove="CardViewerCardPreviewTooltip(\''+CardIDV+'\',1);" onmouseout="CardViewerCardPreviewTooltip(0,0);" onmouseup="CardViewer_SelectCard(\''+CardIDV+'\'); CVChangeViewStyle(0)"> \
                    <div class="CVCCardListingMiniImage"><img src="Images/Cards/MiniImage/'+CardMiniImage+'.jpg"></div> \
                    <div class="CVCCardListingCardCost '+CardCostStyle+'">'+CardCostToShow+'</div> \
                    <div class="CVCCardListingCardName">'+CardName+'</div> \
                    <div class="clear"></div>\
                </div>';
    return CardHTML;
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
    CardID = CardIDV[0];
    CardVersion = CardIDV[1];
    CardArrayIndex = "";
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
    if (ThisCard['card_type'] == "Item") {
        document.getElementById('CardDetailsPanelCardType').innerHTML = ThisCard['card_type']+' - '+ThisCard['card_subtype'];
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
        HTMLLoreTextLeftPanel = '<div id="CardViewerPageCardLoreTextBody">'+ThisCard['lore']['text']['english']+'</div>\
        <div id="CardViewerPageCardLoreTextTag">'+ThisCard['lore']['tag']['english']+'</div>';
    } else {
        HTMLLoreTextLeftPanel = '<div id="CardViewerPageCardLoreTextBody">The lore for this card is currently unknown.</div>';
    }

    document.getElementById('SigAbilityRelated_Container').innerHTML = "";
    document.getElementById('SigAbilityRelated_Container').innerHTML += HTMLHeroCardLeftPanel;
    document.getElementById('SigAbilityRelated_Container').innerHTML += HTMLSignatureCardLeftPanel;
    document.getElementById('SigAbilityRelated_Container').innerHTML += HTMLRelatedCardsLeftPanel;
    document.getElementById('SigAbilityRelated_Container').innerHTML += HTMLCardAbilitiesLeftPanel;

    document.getElementById('CardViewerPageCardLore').innerHTML = HTMLLoreTextLeftPanel;
    document.getElementById('CardViewerPageCardLoreMobile').innerHTML = HTMLLoreTextLeftPanel;
}

function GenerateCard(Container,CardIDV) {
    LoadingHTML = '<div class="CardContainer_LoadingPlaceholder"><div class="LoadingCardThrobberContainer"><img src="Images/Styles/throbber20px.gif"></div></div>';
    document.getElementById(Container).innerHTML = LoadingHTML;

    CardHTML = "";
    CardArrayIndex = "";
    CardIDV = CardIDV.split("_");
    CardID = CardIDV[0];
    CardVersion = CardIDV[1];
    for (i = 0; i < CardJSON.length; i++) {
        if ((CardJSON[i]['card_id']) == CardID) {
            CardArrayIndex = i;
            break;
        }
    }
    if ((CardVersion > (CardJSON[CardArrayIndex]['versions'].length - 1)) || CardVersion < 0) { 
        CardVersion = (CardJSON[CardArrayIndex]['versions'].length - 1); // Get latest version of card if requested card version doesn't exist.
    }
    Card = CardJSON[CardArrayIndex]['versions'][CardVersion];

    CardName = Card['card_name']['english'];
    CardImage = Card['image'];
    CardSetIconStyle = "CardBottomIconSet"+Card['set']+"-"+Card['rarity'];
    CardType = Card['card_type'];
    
    switch(CardType) {

        case 'Hero':
            CardHeroIcon = Card['icon'];
            CardColourStyle = "CardColour"+Card['colour'];
            CardAttack = "▣"+Card['attack'];
            if (Card['armour'] == 0) {
                CardArmour = "&nbsp;"
            } else {
                CardArmour = "▤"+Card['armour'];
            }
            CardHP = "▥"+Card['hp'];
            CardAbilities = Card['abilities'];

            CardAbilityHTML = "";
            AbilityArrayIndex = "";

            if (CardAbilities.length > 0) {

                CardAbilityHTML += '<div class="CardAbilityContainer">';

                for (a = 0; a < CardAbilities.length; a++) {
                    AbilityIDV = CardAbilities[a].split("_");
                    AbilityID = AbilityIDV[0];
                    AbilityVersion = AbilityIDV[1];
                    for (i = 0; i < AbilityJSON.length; i++) {
                        if ((AbilityJSON[i]['card_id']) == AbilityID) {
                            AbilityArrayIndex = i;
                            break;
                        }
                    }
                    AbilityBorderStyle = "";
                    switch (AbilityJSON[AbilityArrayIndex]['versions'][AbilityVersion]['ability_type']) {
                        case 'Active':
                            AbilityBorderStyle = "CardAbilityBorderStyle1";
                            break;
                        case 'Passive':
                            AbilityBorderStyle = "CardAbilityBorderStyle2";
                            break;
                        case 'Continuous':
                            AbilityBorderStyle = "CardAbilityBorderStyle2";
                            break;
                        default:
                            AbilityBorderStyle = "CardAbilityBorderStyle1";
                    }
                    AbilityImage = AbilityJSON[AbilityArrayIndex]['versions'][AbilityVersion]['image'];
    
                    CardAbilityHTML += '<div class="CardAbilityIconPer '+AbilityBorderStyle+'"> \
                                            <img src="Images/Abilities/'+AbilityImage+'.jpg"> \
                                        </div>';     
                }
                CardAbilityHTML += '<div class="clear"></div></div>';
            }

            CardHTML += '<div class="CardHeaderOuter '+CardColourStyle+'"> \
                            <div class="CardHeaderInner"> \
                                <div class="CardHeaderLeftPer CardHeaderLeftPer_HeroIconBackCircle"><img src="Images/HeroIcons/'+CardHeroIcon+'.png"></div> \
                                <div class="CardHeaderCardName">'+CardName+'</div> \
                            </div> \
                        </div> \
                        <div class="CardCentreContainerPer" style="background-image: url(\'Images/Cards/CardArt/'+CardImage+'.jpg\')"> \
                            <div class="CardCentreTopPer"></div> \
                            <div class="CardCentreBotPer_Stats"> \
                                '+CardAbilityHTML+' \
                            </div> \
                        </div> \
                        <div class="CardBottomSetIconContainerPer '+CardColourStyle+' '+CardSetIconStyle+'"></div> \
                        <div class="CardStatsPer '+CardColourStyle+'"> \
                            <div class="CardStatInnerPerRad">'+CardAttack+'</div> \
                            <div class="CardStatInnerPerRad">'+CardArmour+'</div> \
                            <div class="CardStatInnerPerRad">'+CardHP+'</div> \
                            <div class="clear"></div> \
                        </div> \
                        <div class="CardEndPer '+CardColourStyle+'"></div>';
            break;
        case 'Creep':
            CardColourStyle = "CardColour"+Card['colour'];
            CardManaCost = Card['cost'];
            CardAttack = "▣"+Card['attack'];
            if (Card['armour'] == 0) {
                CardArmour = "&nbsp;"
            } else {
                CardArmour = "▤"+Card['armour'];
            }
            CardHP = "▥"+Card['hp'];
            CardText = CardTextFormatting(Card['text']['english']);
            if (CardText == "") {
                TextBackgroundStyle = "";
            } else {
                TextBackgroundStyle = "CardCentreSplitBotBG2";
            }
            CardAbilities = Card['abilities'];
            CardSetIconStyle = "CardBottomIconSet"+Card['set']+"-"+Card['rarity'];

            CardHTML += '<div class="CardHeaderOuter '+CardColourStyle+'"> \
                            <div class="CardHeaderInner"> \
                                <div class="CardHeaderLeftPer CardHeaderLeftPer_ManaCost">'+CardManaCost+'</div> \
                                <div class="CardHeaderCardName">'+CardName+'</div> \
                            </div> \
                        </div> \
                        <div class="CardCentreContainerPer" style="background-image: url(\'Images/Cards/CardArt/'+CardImage+'.jpg\')"> \
                            <div class="CardCentreTopPer"></div> \
                            <div class="CardCentreBotPer_Stats '+TextBackgroundStyle+'"> \
                                <div class="CardCentreSplitBotText">'+CardText+'</div> \
                            </div> \
                        </div> \
                        <div class="CardBottomSetIconContainerPer '+CardColourStyle+' '+CardSetIconStyle+'"></div> \
                        <div class="CardStatsPer '+CardColourStyle+'"> \
                            <div class="CardStatInnerPerRad">'+CardAttack+'</div> \
                            <div class="CardStatInnerPerRad">'+CardArmour+'</div> \
                            <div class="CardStatInnerPerRad">'+CardHP+'</div> \
                            <div class="clear"></div> \
                        </div> \
                        <div class="CardEndPer '+CardColourStyle+'"></div>';
            break;
        case 'Summon':
            CardColourStyle = "CardColour"+Card['colour'];
            CardManaCost = Card['cost'];
            CardAttack = "▣"+Card['attack'];
            if (Card['armour'] == 0) {
                CardArmour = "&nbsp;"
            } else {
                CardArmour = "▤"+Card['armour'];
            }
            CardHP = "▥"+Card['hp'];
            CardText = CardTextFormatting(Card['text']['english']);
            if (CardText == "") {
                TextBackgroundStyle = "";
            } else {
                TextBackgroundStyle = "CardCentreSplitBotBG2";
            }
            CardAbilities = Card['abilities'];
            CardSetIconStyle = "CardBottomIconSet"+Card['set']+"-"+Card['rarity'];

            CardHTML += '<div class="CardHeaderOuter '+CardColourStyle+'"> \
                            <div class="CardHeaderInner"> \
                                <div class="CardHeaderLeftPer CardHeaderLeftPer_ManaCost">'+CardManaCost+'</div> \
                                <div class="CardHeaderCardName">'+CardName+'</div> \
                            </div> \
                        </div> \
                        <div class="CardCentreContainerPer" style="background-image: url(\'Images/Cards/CardArt/'+CardImage+'.jpg\')"> \
                            <div class="CardCentreTopPer"></div> \
                            <div class="CardCentreBotPer_Stats '+TextBackgroundStyle+'"> \
                                <div class="CardCentreSplitBotText">'+CardText+'</div> \
                            </div> \
                        </div> \
                        <div class="CardBottomSetIconContainerPer '+CardColourStyle+' '+CardSetIconStyle+'"></div> \
                        <div class="CardStatsPer '+CardColourStyle+'"> \
                            <div class="CardStatInnerPerRad">'+CardAttack+'</div> \
                            <div class="CardStatInnerPerRad">'+CardArmour+'</div> \
                            <div class="CardStatInnerPerRad">'+CardHP+'</div> \
                            <div class="clear"></div> \
                        </div> \
                        <div class="CardEndPer '+CardColourStyle+'"></div>';
            break;
        case 'Item':
            CardManaCost = Card['cost'];
            CardGoldCost = Card['gcost'];
            CardText = CardTextFormatting(Card['text']['english']);
            CardSetIconStyle = "CardBottomIconSet"+Card['set']+"-"+Card['rarity'];

            switch (CardGoldCost) {
                case 10:
                    TextBackgroundImage = "CardCentreSplitBotBG3";
                    break;
                case 15:
                    TextBackgroundImage = "CardCentreSplitBotBG4";
                    break;
                case 20:
                    TextBackgroundImage = "CardCentreSplitBotBG5";
                    break;
                case 25:
                    TextBackgroundImage = "CardCentreSplitBotBG6";
                    break;
                case 30:
                    TextBackgroundImage = "CardCentreSplitBotBG7";
                    break;
                default:
                    TextBackgroundImage = "CardCentreSplitBotBG1";
            }

            CardHTML += '<div class="CardHeaderOuter CardColourI"> \
                            <div class="CardHeaderInner"> \
                                <div class="CardHeaderLeftPer CardHeaderLeftPer_ManaCost">'+CardManaCost+'</div> \
                                <div class="CardHeaderCardName">'+CardName+'</div> \
                            </div> \
                        </div> \
                        <div class="CardCentreContainerPer"> \
                            <div class="CardCentreTopPer" style="background-image: url(\'Images/Cards/CardArt/'+CardImage+'.jpg\')"></div> \
                            <div class="CardGoldValue">'+CardGoldCost+'</div> \
                            <div class="CardCentreBotPer_NoStats '+TextBackgroundImage+'"> \
                                <div class="CardCentreSplitBotText">'+CardText+'</div> \
                            </div> \
                        </div> \
                        <div class="CardBottomSetIconContainerPer CardColourI '+CardSetIconStyle+'"></div> \
                        <div class="CardEndPer CardColourI"></div>';
            break;
        case 'Spell':
            CardColourStyle = "CardColour"+Card['colour'];
            CardManaCost = Card['cost'];
            if (Card['crosslane'] == true) {
                ManaCostStyle = "CardHeaderLeftPer_CrossLane";
            } else if (Card['quick'] == true) {
                ManaCostStyle = "CardHeaderLeftPer_Quick";
            } else {
                ManaCostStyle = "CardHeaderLeftPer_ManaCost";
            }
            CardText = CardTextFormatting(Card['text']['english']);
            CardSetIconStyle = "CardBottomIconSet"+Card['set']+"-"+Card['rarity'];

            CardHTML += '<div class="CardHeaderOuter '+CardColourStyle+'"> \
                            <div class="CardHeaderInner"> \
                                <div class="CardHeaderLeftPer '+ManaCostStyle+'">'+CardManaCost+'</div> \
                                <div class="CardHeaderCardName">'+CardName+'</div> \
                            </div> \
                        </div> \
                        <div class="CardCentreContainerPer"> \
                            <div class="CardCentreTopPer" style="background-image: url(\'Images/Cards/CardArt/'+CardImage+'.jpg\')"></div> \
                            <div class="CardCentreBotPer_NoStats CardCentreSplitBotBG1"> \
                                <div class="CardCentreSplitBotText">'+CardText+'</div> \
                            </div> \
                        </div> \
                        <div class="CardBottomSetIconContainerPer '+CardColourStyle+' '+CardSetIconStyle+'"></div> \
                        <div class="CardEndPer '+CardColourStyle+'"></div>';

            break;
        case 'Improvement':
            CardColourStyle = "CardColour"+Card['colour'];
            CardManaCost = Card['cost'];
            CardMiniImage = Card['miniimage'];
            CardText = CardTextFormatting(Card['text']['english']);
            CardSetIconStyle = "CardBottomIconSet"+Card['set']+"-"+Card['rarity'];
            switch (Card['improvement_type']) {
                case "Active":
                    ImprovementStyle = "CardImprovementTypeShellActive";
                    break;
                case "Reactive":
                    ImprovementStyle = "CardImprovementTypeShellReactive";
                    break;
                case "Passive":
                    ImprovementStyle = "CardImprovementTypeShellPassive";
                    break;
                default:
                    ImprovementStyle = "CardImprovementTypeShellPassive";
            }

            CardHTML += '<div class="CardHeaderOuter '+CardColourStyle+'"> \
                            <div class="CardHeaderInner"> \
                                <div class="CardHeaderLeftPer CardHeaderLeftPer_ManaCost">'+CardManaCost+'</div> \
                                <div class="CardHeaderCardName">'+CardName+'</div> \
                            </div> \
                        </div> \
                        <div class="CardCentreContainerPer"> \
                            <div class="CardCentreTopPer" style="background-image: url(\'Images/Cards/CardArt/'+CardImage+'.jpg\')"></div> \
                            <div class="CardImprovementTypeShell '+ImprovementStyle+'"><img src="Images/Cards/MiniImage/'+CardMiniImage+'.jpg"></div> \
                            <div class="CardCentreBotPer_NoStats CardCentreSplitBotBG1"> \
                                <div class="CardCentreSplitBotText">'+CardText+'</div> \
                            </div> \
                        </div> \
                        <div class="CardBottomSetIconContainerPer '+CardColourStyle+' '+CardSetIconStyle+'"></div> \
                        <div class="CardEndPer '+CardColourStyle+'"></div>';

            break;
        default:
            CardImage = "Err";
            CardHTML += '<div class="CardContainer_Error"></div>'
            break;
    }              
    var img = new Image();
    img.onload = function() {document.getElementById(Container).innerHTML = CardHTML; } // Wait until at least the main image has downloaded before showing the card. If the image can't be found, no card will be loaded at all.
    img.src = 'Images/Cards/CardArt/'+CardImage+'.jpg';
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

Keywords = [];
Keywords['Regeneration'] = "The unit heals this amount during the combat phase. Regeneration is applied before checking for death.";
Keywords['After Combat'] = "An effect that triggers after the Combat Phase.";
Keywords['Aura'] = "An effect which applies to units when they enter a specified area and is removed when they leave.";
Keywords['Bounce'] = "Return a unit to owners hand if a creep, or fountain if a hero.";
Keywords['Burn'] = "Remove mana from the enemy player.";
Keywords['Cross Lane'] = "Cross Lane cards are cast by heroes in one lane, but can target objects in a different lane.";
Keywords['Cursed'] = "Destroyed when replaced by another item.";
Keywords['Death Effect'] = "An effect that is processed after this unit dies.";
Keywords['Decay'] = "This unit will take extra damage in combat. Ignores armor entirely.";
Keywords['Devour'] = "When this unit is placed on top of another unit, it gains that unit's Attack and Health.";
Keywords['Disarm'] = "A disarmed unit does not attack its target during battles. Lasts until the end of round by default.";
Keywords['Dispel'] = "Remove an enchantment.";
Keywords['Enchant'] = "An enchantment lasts until dispelled, remaining even through death.";
Keywords['Feeble'] = "When a unit deals Attack damage to this unit in combat, excess damage is dealt to your tower.";
Keywords['Fountain'] = "When heroes die they are placed in the Fountain zone for a full round before becoming ready to redeploy. When heroes enter the Fountain they are fully healed and temporary effects on them are purged.";
Keywords['Jump'] = "Select a new target for this effect.";
Keywords['Lifesteal'] = "This unit heals equal to its Attack if it survives a combat in which it damaged another unit.";
Keywords['Lock'] = "Cards cannot be played as long as they are locked. Lock is applied for a duration in rounds. At the end of a round, all locked cards lose 1 Lock. Locked cards are revealed.";
Keywords['Minion'] = "An effect which applies to this unit when adjacent to an allied hero.";
Keywords['Mulch'] = "When this card is played draw a card from your deck which costs less mana.";
Keywords['Pierce'] = "Piercing damage is not reduced by the target's armor.";
Keywords['Piercing'] = "Piercing damage is not reduced by the target's armor.";
Keywords['Pillager'] = "This unit steals 2 gold from the opponent whenever it damages their tower.";
Keywords['Play Effect'] = "An additional effect that is processed at the time you play this creep.";
Keywords['Push'] = "Move a unit 1 slot randomly left or right to an occupied spot.";
Keywords['Quickcast'] = "After you play this, you get the initiative coin and may immediately take another action. If you use this action to pass, you will retain initiative and may act first next round.";
Keywords['Quickstrike'] = "Units with quickstrike attack before units without quickstrike. Regeneration and decay are applied at the same time as combat damage, after quickstrike damage resolves.";
Keywords['Retaliate'] = "When attacked during a battle (even outside of the combat phase), deal this much extra damage to the attackers.";
Keywords['Rooted'] = "Can't be moved.";
Keywords['Scheme'] = "An effect which triggers when the card's owner passes.";
Keywords['Siege'] = "During the combat phase, deal Siege damage to the enemy tower.";
Keywords['Stun'] = "A stunned unit is silenced (cannot use any active abilities and cannot be used to play cards of its color) and disarmed (does not attack its target during battles). Lasts until the end of round by default.";
Keywords['Swap'] = "Move a unit to the targeted slot. If that slot was occupied, the unit in that space move to the original unit's position.";
Keywords['Tower Enchantment'] = "A tower enchantment is a spell that adds a permanent effect to a tower or lane. Tower enchantments are not units and do not occupy combat positions.";
Keywords['Taunt'] = "When a unit taunts all of its enemy neighbors change their combat target to that unit. Targets reset after each round.";
Keywords['Trample'] = "This unit deals excess Attack damage to the tower when it battles in combat.";
Keywords['Untargetable'] = "Can't be targeted by enemy spells of abilities.";

function ShowKeywordTooltip(ShowHide, KeyWord) {

    if (ShowHide == 0) { //Hide
        document.getElementById('SpecialTextTooltip').style.display = "none";
    } else {
        document.getElementById('SpecialTextTitle').innerHTML = KeyWord.toUpperCase();
        document.getElementById('SpecialTextDesc').innerHTML = Keywords[KeyWord];
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
            CardViewer_SelectCard('200043_99', true);
        }
        
    }
};
function ShowFilterTooltip(ShowHide, Text) {

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
function ToggleFilter(FilterValue) {
    if (FilterValue == "R" || FilterValue == "U" || FilterValue == "B" || FilterValue == "G" || FilterValue == "C") {
        if (CardViewerFilter[FilterValue] == true) {
            CardViewerFilter[FilterValue] = false;
            if (CardViewerFilter["R"] == false && CardViewerFilter["U"] == false && CardViewerFilter["B"] == false && CardViewerFilter["G"] == false && CardViewerFilter["C"] == false) { // If all colour filters are turned off
                //Turn them all back on
                document.getElementById("ColourFilterR").classList.remove('CVOptionButtonUnselected');
                document.getElementById("ColourFilterR").classList.add('CVOptionButtonSelected');
                document.getElementById("ColourFilterU").classList.remove('CVOptionButtonUnselected');
                document.getElementById("ColourFilterU").classList.add('CVOptionButtonSelected');
                document.getElementById("ColourFilterB").classList.remove('CVOptionButtonUnselected');
                document.getElementById("ColourFilterB").classList.add('CVOptionButtonSelected');
                document.getElementById("ColourFilterG").classList.remove('CVOptionButtonUnselected');
                document.getElementById("ColourFilterG").classList.add('CVOptionButtonSelected');
                document.getElementById("ColourFilterC").classList.remove('CVOptionButtonUnselected');
                document.getElementById("ColourFilterC").classList.add('CVOptionButtonSelected');
                document.getElementById("CVCOuterContainerR").style.display = "block";
                document.getElementById("CVCOuterContainerU").style.display = "block";
                document.getElementById("CVCOuterContainerB").style.display = "block";
                document.getElementById("CVCOuterContainerG").style.display = "block";
                document.getElementById("CVCOuterContainerC").style.display = "block";
                CardViewerFilter["R"] = true;
                CardViewerFilter["U"] = true;
                CardViewerFilter["B"] = true;
                CardViewerFilter["G"] = true;
                CardViewerFilter["C"] = true;
            } else {
                document.getElementById("ColourFilter"+FilterValue).classList.add('CVOptionButtonUnselected');
                document.getElementById("ColourFilter"+FilterValue).classList.remove('CVOptionButtonSelected');
                document.getElementById("CVCOuterContainer"+FilterValue).style.display = "none";
            }
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
    }
    GenerateCardViewerPage();
}
