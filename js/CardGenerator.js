const GenerateCard = function(Container,CardIDV) {
    //This function relies on the CardJSON array having been populated.
    let LoadingHTML = '<div class="CardContainer_LoadingPlaceholder"><div class="LoadingCardThrobberContainer"><img src="Images/Styles/throbber20px.gif"></div></div>';
    document.getElementById(Container).innerHTML = LoadingHTML;

    let CardHTML = "";
    let CardArrayIndex = 0;
    CardIDV = CardIDV.split("_");
    let CardID = CardIDV[0];
    let CardVersion = CardIDV[1];
    for (i = 0; i < CardJSON.length; i++) {
        if ((CardJSON[i]['card_id']) == CardID) {
            CardArrayIndex = i;
            break;
        }
    }
    if ((CardVersion > (CardJSON[CardArrayIndex]['versions'].length - 1)) || CardVersion < 0) { 
        CardVersion = (CardJSON[CardArrayIndex]['versions'].length - 1); // Get latest version of card if requested card version doesn't exist.
    }
    let Card = CardJSON[CardArrayIndex]['versions'][CardVersion];

    let CardName = Card['card_name']['english'];
    let CardImage = Card['image'];
    let CardSetIconStyle = "CardBottomIconSet"+Card['set']+"-"+Card['rarity'];
    let CardType = Card['card_type'];
    let CardColourStyle = "CardColourC";
    let CardAttack = 0;
    let CardArmour = 0;
    let CardHP = 0;
    let CardAbilities = new Array();
    let CardManaCost = 0;
    let ManaCostStyle = "CardHeaderLeftPer_ManaCost";
    let CardText = "";
    let TextBackgroundStyle = "";
    let CardTextStyle = "CardCentreSplitBotText";
   
    switch(CardType) {

        case 'Hero':
            let CardHeroIcon = Card['icon'];
            CardColourStyle = "CardColour"+Card['colour'];
            CardAttack = "▣"+Card['attack'];
            if (Card['armour'] == 0) {
                CardArmour = "&nbsp;"
            } else {
                CardArmour = "▤"+Card['armour'];
            }
            CardHP = "▥"+Card['hp'];
            CardAbilities = Card['abilities'];
            let CardAbilityHTML = "";
            let AbilityArrayIndex = "";

            if (CardAbilities.length > 0) {

                CardAbilityHTML += '<div class="CardAbilityContainer">';

                for (a = 0; a < CardAbilities.length; a++) {
                    let AbilityIDV = CardAbilities[a].split("_");
                    let AbilityID = AbilityIDV[0];
                    let AbilityVersion = AbilityIDV[1];
                    for (i = 0; i < AbilityJSON.length; i++) {
                        if ((AbilityJSON[i]['card_id']) == AbilityID) {
                            AbilityArrayIndex = i;
                            break;
                        }
                    }
                    let AbilityImage = AbilityJSON[AbilityArrayIndex]['versions'][AbilityVersion]['image'];
                    let AbilityBorderStyle = "";
                    switch (AbilityJSON[AbilityArrayIndex]['versions'][AbilityVersion]['ability_type']) {
                        case 'Active':
                            AbilityBorderStyle = "CardAbilityBorderStyle1";
                            break;
                        case 'Passive':
                            AbilityBorderStyle = "CardAbilityBorderStyle2";
                            break;
                        case 'Continuous Effect':
                            AbilityBorderStyle = "CardAbilityBorderStyle2";
                            break;
                        default:
                            AbilityBorderStyle = "CardAbilityBorderStyle1";
                    }
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
                            <div class="CardStatInnerPer RadianceFont">'+CardAttack+'</div> \
                            <div class="CardStatInnerPer Radiance1Font">'+CardArmour+'</div> \
                            <div class="CardStatInnerPer RadianceFont">'+CardHP+'</div> \
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
            if (Card['text']['english'].length > 200) {
                CardTextStyle += " CardCentreSplitBotTextSmallFont";
            }
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
                                <div class="'+CardTextStyle+'">'+CardText+'</div> \
                            </div> \
                        </div> \
                        <div class="CardBottomSetIconContainerPer '+CardColourStyle+' '+CardSetIconStyle+'"></div> \
                        <div class="CardStatsPer '+CardColourStyle+'"> \
                            <div class="CardStatInnerPer RadianceFont">'+CardAttack+'</div> \
                            <div class="CardStatInnerPer Radiance1Font">'+CardArmour+'</div> \
                            <div class="CardStatInnerPer RadianceFont">'+CardHP+'</div> \
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
            if (Card['text']['english'].length > 180) {
                CardTextStyle += " CardCentreSplitBotTextSmallFont";
            }
            CardText = CardTextFormatting(Card['text']['english']);
            if (CardText == "") {
                TextBackgroundStyle = "";
            } else {
                TextBackgroundStyle = "CardCentreSplitBotBG2";
            }
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
                                <div class="'+CardTextStyle+'">'+CardText+'</div> \
                            </div> \
                        </div> \
                        <div class="CardBottomSetIconContainerPer '+CardColourStyle+' '+CardSetIconStyle+'"></div> \
                        <div class="CardStatsPer '+CardColourStyle+'"> \
                            <div class="CardStatInnerPer RadianceFont">'+CardAttack+'</div> \
                            <div class="CardStatInnerPer Radiance1Font">'+CardArmour+'</div> \
                            <div class="CardStatInnerPer RadianceFont">'+CardHP+'</div> \
                            <div class="clear"></div> \
                        </div> \
                        <div class="CardEndPer '+CardColourStyle+'"></div>';
            break;
        case 'Item':
            CardManaCost = Card['cost'];
            let CardGoldCost = Card['gcost'];
            if (Card['text']['english'].length > 200) {
                CardTextStyle += " CardCentreSplitBotTextSmallFont";
            }
            CardText = CardTextFormatting(Card['text']['english']);
            if (CardText == "") {
                TextBackgroundStyle = "";
            } else {
                TextBackgroundStyle = "CardCentreSplitBotBG2";
            }
            CardText = CardTextFormatting(Card['text']['english']);
            CardSetIconStyle = "CardBottomIconSet"+Card['set']+"-"+Card['rarity'];
            //TextBackgroundStyle = "";

            switch (CardGoldCost) {
                case 10:
                    TextBackgroundStyle = "CardCentreSplitBotBG4";
                    break;
                case 15:
                    TextBackgroundStyle = "CardCentreSplitBotBG5";
                    break;
                case 20:
                    TextBackgroundStyle = "CardCentreSplitBotBG6";
                    break;
                case 25:
                    TextBackgroundStyle = "CardCentreSplitBotBG7";
                    break;
                case 30:
                    TextBackgroundStyle = "CardCentreSplitBotBG8";
                    break;
                default:
                    TextBackgroundStyle = "CardCentreSplitBotBG3";
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
                            <div class="CardCentreBotPer_NoStats '+TextBackgroundStyle+'"> \
                                <div class="'+CardTextStyle+'">'+CardText+'</div> \
                            </div> \
                        </div> \
                        <div class="CardBottomSetIconContainerPer CardColourI '+CardSetIconStyle+'"></div> \
                        <div class="CardEndPer CardColourI"></div>';
            break;
        case 'Spell':
            CardColourStyle = "CardColour"+Card['colour'];
            CardManaCost = Card['cost'];
            ManaCostStyle = "CardHeaderLeftPer_ManaCost";
            /*if (Card['crosslane'] == true) {
                ManaCostStyle = "CardHeaderLeftPer_CrossLane";
            } else if (Card['quick'] == true) {
                ManaCostStyle = "CardHeaderLeftPer_Quick";
            } */
            if (Card['text']['english'].length > 200) {
                CardTextStyle += " CardCentreSplitBotTextSmallFont";
            }
            CardText = CardTextFormatting(Card['text']['english']);
            if (CardText == "") {
                TextBackgroundStyle = "";
            } else {
                TextBackgroundStyle = "CardCentreSplitBotBG2";
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
                                <div class="'+CardTextStyle+'">'+CardText+'</div> \
                            </div> \
                        </div> \
                        <div class="CardBottomSetIconContainerPer '+CardColourStyle+' '+CardSetIconStyle+'"></div> \
                        <div class="CardEndPer '+CardColourStyle+'"></div>';

            break;
        case 'Improvement':
            let CardMiniImage = Card['miniimage'];
            let ImprovementStyle = "";
            CardColourStyle = "CardColour"+Card['colour'];
            CardManaCost = Card['cost'];
            if (Card['text']['english'].length > 200) {
                CardTextStyle += " CardCentreSplitBotTextSmallFont";
            }
            CardText = CardTextFormatting(Card['text']['english']);
            if (CardText == "") {
                TextBackgroundStyle = "";
            } else {
                TextBackgroundStyle = "CardCentreSplitBotBG2";
            }
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
                                <div class="'+CardTextStyle+'">'+CardText+'</div> \
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
    img.onload = function() {document.getElementById(Container).innerHTML = CardHTML;} // Wait until at least the main image has downloaded before showing the card. If the image can't be found, no card will be loaded at all.
    img.src = 'Images/Cards/CardArt/'+CardImage+'.jpg';
}

const CardTextFormatting = function(CardText) {
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

    for (let kw = 0; kw < KeywordsJSON.length; kw++) {
        let keywordregex = new RegExp(KeywordsJSON[kw]['match'], "ig");
        CardText = CardText.replace(keywordregex,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,"+kw+");\" onmouseout=\"ShowKeywordTooltip(0,0);\">"+KeywordsJSON[kw]['keyword']+"</span>");
    }
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
