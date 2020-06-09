const GenerateCard = function(Container,CardIDV) {
    //This function relies on the CardJSON array having been populated.
    let LoadingHTML = '<div class="CardContainer_LoadingPlaceholder"><div class="LoadingCardThrobberContainer"><img src="Images/Styles/throbber20px.gif"></div></div>';
    document.getElementById(Container).innerHTML = LoadingHTML;

    let CardHTML = "";
    let CardArrayIndex = "";
    let CardIDV = CardIDV.split("_");
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
   
    switch(CardType) {

        case 'Hero':
            let CardHeroIcon = Card['icon'];
            let CardColourStyle = "CardColour"+Card['colour'];
            const CardAttack = "▣"+Card['attack'];
            if (Card['armour'] == 0) {
                let CardArmour = "&nbsp;"
            } else {
                let CardArmour = "▤"+Card['armour'];
            }
            let CardHP = "▥"+Card['hp'];
            let CardAbilities = Card['abilities'];

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
                    let AbilityBorderStyle = "";
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
                    let AbilityImage = AbilityJSON[AbilityArrayIndex]['versions'][AbilityVersion]['image'];
    
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
            let CardColourStyle = "CardColour"+Card['colour'];
            let CardManaCost = Card['cost'];
            let CardAttack = "▣"+Card['attack'];
            if (Card['armour'] == 0) {
                let CardArmour = "&nbsp;"
            } else {
                let CardArmour = "▤"+Card['armour'];
            }
            let CardHP = "▥"+Card['hp'];
            let CardText = CardTextFormatting(Card['text']['english']);
            if (CardText == "") {
                let TextBackgroundStyle = "";
            } else {
                let TextBackgroundStyle = "CardCentreSplitBotBG2";
            }
            let CardAbilities = Card['abilities'];
            let CardSetIconStyle = "CardBottomIconSet"+Card['set']+"-"+Card['rarity'];

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
            let CardColourStyle = "CardColour"+Card['colour'];
            let CardManaCost = Card['cost'];
            let CardAttack = "▣"+Card['attack'];
            if (Card['armour'] == 0) {
                let CardArmour = "&nbsp;"
            } else {
                let CardArmour = "▤"+Card['armour'];
            }
            let CardHP = "▥"+Card['hp'];
            let CardText = CardTextFormatting(Card['text']['english']);
            if (CardText == "") {
                let TextBackgroundStyle = "";
            } else {
                let TextBackgroundStyle = "CardCentreSplitBotBG2";
            }
            let CardAbilities = Card['abilities'];
            let CardSetIconStyle = "CardBottomIconSet"+Card['set']+"-"+Card['rarity'];

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
            let CardManaCost = Card['cost'];
            let CardGoldCost = Card['gcost'];
            let CardText = CardTextFormatting(Card['text']['english']);
            let CardSetIconStyle = "CardBottomIconSet"+Card['set']+"-"+Card['rarity'];
            let TextBackgroundImage = "";

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
            let CardColourStyle = "CardColour"+Card['colour'];
            let CardManaCost = Card['cost'];
            if (Card['crosslane'] == true) {
                let ManaCostStyle = "CardHeaderLeftPer_CrossLane";
            } else if (Card['quick'] == true) {
                let ManaCostStyle = "CardHeaderLeftPer_Quick";
            } else {
                let ManaCostStyle = "CardHeaderLeftPer_ManaCost";
            }
            let CardText = CardTextFormatting(Card['text']['english']);
            let CardSetIconStyle = "CardBottomIconSet"+Card['set']+"-"+Card['rarity'];

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
            let CardColourStyle = "CardColour"+Card['colour'];
            let CardManaCost = Card['cost'];
            let CardMiniImage = Card['miniimage'];
            let CardText = CardTextFormatting(Card['text']['english']);
            let CardSetIconStyle = "CardBottomIconSet"+Card['set']+"-"+Card['rarity'];
            let ImprovementStyle = "";

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