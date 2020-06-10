const GenerateCard = function(Container,CardIDV) {
    //This function relies on the CardJSON array having been populated.
    let LoadingHTML = '<div class="CardContainer_LoadingPlaceholder"><div class="LoadingCardThrobberContainer"><img src="Images/Styles/throbber20px.gif"></div></div>';
    document.getElementById(Container).innerHTML = LoadingHTML;

    let CardHTML = "";
    let CardArrayIndex = "";
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
                        case 'Continuous':
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
            let CardGoldCost = Card['gcost'];
            CardText = CardTextFormatting(Card['text']['english']);
            CardSetIconStyle = "CardBottomIconSet"+Card['set']+"-"+Card['rarity'];
            TextBackgroundStyle = "";

            switch (CardGoldCost) {
                case 10:
                    TextBackgroundStyle = "CardCentreSplitBotBG3";
                    break;
                case 15:
                    TextBackgroundStyle = "CardCentreSplitBotBG4";
                    break;
                case 20:
                    TextBackgroundStyle = "CardCentreSplitBotBG5";
                    break;
                case 25:
                    TextBackgroundStyle = "CardCentreSplitBotBG6";
                    break;
                case 30:
                    TextBackgroundStyle = "CardCentreSplitBotBG7";
                    break;
                default:
                    TextBackgroundStyle = "CardCentreSplitBotBG1";
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
            let CardMiniImage = Card['miniimage'];
            let ImprovementStyle = "";
            CardColourStyle = "CardColour"+Card['colour'];
            CardManaCost = Card['cost'];
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
    CardText = CardText.replace(/(Regeneration)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Regeneration\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Regeneration</span>");
    CardText = CardText.replace(/(After Combat)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'After Combat\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">After Combat</span>");
    CardText = CardText.replace(/(Aura)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Aura\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Aura</span>");
    CardText = CardText.replace(/(Bounce)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Bounce\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Bounce</span>");
    CardText = CardText.replace(/(Burn)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Burn\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Burn</span>");
    CardText = CardText.replace(/(Cleave)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Cleave\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Cleave</span>");
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
    CardText = CardText.replace(/(Purge)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Purge\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Purge</span>");
    CardText = CardText.replace(/(Play Effect)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Play Effect\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Play Effect</span>");
    CardText = CardText.replace(/(Quickcast)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Quickcast\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Quickcast</span>");
    CardText = CardText.replace(/(Quickstrike)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Quickstrike\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Quickstrike</span>");
    CardText = CardText.replace(/(Reflect)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Reflect\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Reflect</span>");
    CardText = CardText.replace(/(Retaliate)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Retaliate\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Retaliate</span>");
    CardText = CardText.replace(/(Root)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Root\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Root</span>");
    CardText = CardText.replace(/(Scheme)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Scheme\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Scheme</span>");
    CardText = CardText.replace(/(Siege)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Siege\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Siege</span>");
    CardText = CardText.replace(/(Stun)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Stun\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Stun</span>");
    CardText = CardText.replace(/(Sneak Attack)/gi,"<span class=\"CardCentreKeyWordText\" onmousemove=\"ShowKeywordTooltip(1,\'Sneak Attack\');\" onmouseout=\"ShowKeywordTooltip(0,0);\">Sneak Attack</span>");
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