const GetVersionChangesHTML = function(CardID) {
    let CardHistoryHTML = "";
    let CardArrayIndex = 0;
    for (let i = 0; i < CardJSON.length; i++) {
        if (CardJSON[i]['card_id'] == CardID) {
            CardArrayIndex = i;
            break;
        }
    }
    let TotalCardVersions = CardJSON[CardArrayIndex]['versions'].length;

    if (TotalCardVersions > 1) {
        for (let counter = 0; counter < TotalCardVersions-1; counter++) {
            CardHistoryHTML += '<div class="CardViewerPage_CardHistoryChangeContainer"> \
                                    <div class="CardViewerPage_CardHistoryDateTitle"> \
                                        '+CardJSON[CardArrayIndex]['versions'][counter+1]['release_date']+' \
                                    </div> \
                                    <div class="CardViewerPage_CardHistoryDetails">';

            //English Card Name
            if (CardJSON[CardArrayIndex]['versions'][counter]['card_name']['english'] != CardJSON[CardArrayIndex]['versions'][counter+1]['card_name']['english']) {
                CardHistoryHTML += '<li>Card renamed from '+CardJSON[CardArrayIndex]['versions'][counter]['card_name']['english']+ ' to '+CardJSON[CardArrayIndex]['versions'][counter+1]['card_name']['english']+'. </li>';
            }
            //Card Type
            if (CardJSON[CardArrayIndex]['versions'][counter]['card_type'] != CardJSON[CardArrayIndex]['versions'][counter+1]['card_type']) {
                CardHistoryHTML += '<li>Card Type changed from '+CardJSON[CardArrayIndex]['versions'][counter]['card_type']+ ' to '+CardJSON[CardArrayIndex]['versions'][counter+1]['card_type']+'. </li>';
            }
            //Card Colour
            if ("colour" in CardJSON[CardArrayIndex]['versions'][counter]) {
                if (CardJSON[CardArrayIndex]['versions'][counter]['colour'] != CardJSON[CardArrayIndex]['versions'][counter+1]['colour']) {
                    CardHistoryHTML += '<li>Card color changed from '+CardHistory_ColourLetterToWord(CardJSON[CardArrayIndex]['versions'][counter]['colour'])+ ' to '+CardHistory_ColourLetterToWord(CardJSON[CardArrayIndex]['versions'][counter+1]['colour'])+'. </li>';
                }
            } 
            //Card Rarity
            if (CardJSON[CardArrayIndex]['versions'][counter]['rarity'] != CardJSON[CardArrayIndex]['versions'][counter+1]['rarity']) {
                CardHistoryHTML += '<li>Card Rarity changed from '+CardJSON[CardArrayIndex]['versions'][counter]['rarity']+'<span class=CardViewerPage_CardHistoryRarityIcon><img src="Images/SetIcons/'+CardJSON[CardArrayIndex]['versions'][counter]['set']+'-'+CardJSON[CardArrayIndex]['versions'][counter]['rarity']+'.png"></span> to '+CardJSON[CardArrayIndex]['versions'][counter+1]['rarity']+'<span class=CardViewerPage_CardHistoryRarityIcon><img src="Images/SetIcons/'+CardJSON[CardArrayIndex]['versions'][counter+1]['set']+'-'+CardJSON[CardArrayIndex]['versions'][counter+1]['rarity']+'.png"></span> </li>';
            }
            //English Card Text
            if ("text" in CardJSON[CardArrayIndex]['versions'][counter] || "text" in CardJSON[CardArrayIndex]['versions'][counter+1]) {
                if (CardJSON[CardArrayIndex]['versions'][counter]['text']['english'] != CardJSON[CardArrayIndex]['versions'][counter+1]['text']['english']) {
                    CardHistoryHTML += '<li>Card text changed. <br> <span class="CardViewerPage_CardHistoryCardTextChangeHeader">Previously:</span> <br> <span class="CardViewerPage_CardHistoryCardTextChangeDetails">'+CardHistory_CardTextFormatting(CardJSON[CardArrayIndex]['versions'][counter]['text']['english'])+ '</span> <br> <span class="CardViewerPage_CardHistoryCardTextChangeHeader">Changed to:</span> <br> <span class="CardViewerPage_CardHistoryCardTextChangeDetails">'+CardHistory_CardTextFormatting(CardJSON[CardArrayIndex]['versions'][counter+1]['text']['english'])+'</span> </li>';
                }
            }
            //HP, Armour and Attack Values
            if ("hp" in CardJSON[CardArrayIndex]['versions'][counter] && "hp" in CardJSON[CardArrayIndex]['versions'][counter+1]) {
                if ((CardJSON[CardArrayIndex]['versions'][counter]["hp"] != CardJSON[CardArrayIndex]['versions'][counter+1]["hp"]) || (CardJSON[CardArrayIndex]['versions'][counter]["armour"] != CardJSON[CardArrayIndex]['versions'][counter+1]["armour"]) || (CardJSON[CardArrayIndex]['versions'][counter]["attack"] != CardJSON[CardArrayIndex]['versions'][counter+1]["attack"]))
                CardHistoryHTML+='<li> Card stats changed from ▣'+CardJSON[CardArrayIndex]['versions'][counter]["attack"]+' ▤'+CardJSON[CardArrayIndex]['versions'][counter]["armour"]+' ▥'+CardJSON[CardArrayIndex]['versions'][counter]["hp"]+' to ▣'+CardJSON[CardArrayIndex]['versions'][counter+1]["attack"]+' ▤'+CardJSON[CardArrayIndex]['versions'][counter+1]["armour"]+' ▥'+CardJSON[CardArrayIndex]['versions'][counter+1]["hp"]+' </li>';
            }
            //Mana Cost
            if (CardJSON[CardArrayIndex]['versions'][counter]['cost'] != CardJSON[CardArrayIndex]['versions'][counter+1]['cost']) {
                CardHistoryHTML += '<li>Mana Cost changed from '+CardJSON[CardArrayIndex]['versions'][counter]['cost']+ ' to '+CardJSON[CardArrayIndex]['versions'][counter+1]['cost']+'. </li>';
            }
            //Gold Cost
            if ("gcost" in CardJSON[CardArrayIndex]['versions'][counter]) {
                if (CardJSON[CardArrayIndex]['versions'][counter]['gcost'] != CardJSON[CardArrayIndex]['versions'][counter+1]['gcost']) {
                    CardHistoryHTML += '<li>Gold Cost changed from '+CardJSON[CardArrayIndex]['versions'][counter]['gcost']+ ' to '+CardJSON[CardArrayIndex]['versions'][counter+1]['gcost']+'. </li>';
                }
            }
            //Card Signatures
                // TODO :-(

            //Card Abilities
            if ("abilities" in CardJSON[CardArrayIndex]['versions'][counter]) {
                let AbilityIDsCard1 = new Array();
                let AbilityVersCard1 = new Array();
                let AbilityIDsCard2 = new Array(); 
                let AbilityVersCard2 = new Array();
                let RemovedAbilities = new Array();
                let UpdatedAbilities = new Array(); //Even indices: Previous Version. Odd indices: Updated Version.
                let NewAbilities = new Array();

                for (let ac1 = 0; ac1 < CardJSON[CardArrayIndex]['versions'][counter]['abilities'].length; ac1++) {
                    let AbilityIDV = CardJSON[CardArrayIndex]['versions'][counter]['abilities'][ac1].split("_");
                    AbilityIDsCard1.push(AbilityIDV[0]);
                    AbilityVersCard1.push(AbilityIDV[1]);
                }
                for (let ac2 = 0; ac2 < CardJSON[CardArrayIndex]['versions'][counter+1]['abilities'].length; ac2++) {
                    let AbilityIDV = CardJSON[CardArrayIndex]['versions'][counter+1]['abilities'][ac2].split("_");
                    AbilityIDsCard2.push(AbilityIDV[0]);
                    AbilityVersCard2.push(AbilityIDV[1]);
                }

                for (let c1a = 0; c1a < AbilityIDsCard1.length; c1a++) {
                    let IsInCard2 = 0;
                    let Card2AbilityArrayIndex = -1;

                    for (let c2a = 0; c2a < AbilityIDsCard2.length; c2a++) {
                        if (AbilityIDsCard1[c1a] == AbilityIDsCard2[c2a]) {
                            IsInCard2 = 1;
                            Card2AbilityArrayIndex = c2a;
                            break;
                        } 
                    }
                    
                    if (IsInCard2 == 1) { //If Ability matches...
                        console.log("Card2Index: "+Card2AbilityArrayIndex);
                        console.log("c1 ver: "+AbilityVersCard1[c1a]+" ... c2 ver: "+AbilityVersCard2[Card2AbilityArrayIndex]);

                        if (AbilityVersCard1[c1a] == AbilityVersCard2[Card2AbilityArrayIndex]) {
                            console.log("No change");
                            // ... And the version matches - no change for this ability.
                        } else {
                            // ... But version doesn't match.
                            let OldAbility = AbilityIDsCard1[c1a]+"_"+AbilityVersCard1[c1a];
                            UpdatedAbilities.push(OldAbility);
                            let NewAbility = AbilityIDsCard2[Card2AbilityArrayIndex]+"_"+AbilityVersCard2[Card2AbilityArrayIndex];
                            UpdatedAbilities.push(NewAbility);
                        }
                    } else { // Ability not in the card.
                        let RemovedAbility = AbilityIDsCard1[c1a]+"_"+AbilityVersCard1[c1a];
                        RemovedAbilities.push(RemovedAbility);
                    }
                }

                for (let c2a = 0; c2a < AbilityIDsCard2.length; c2a++) {
                    console.log("c2a: "+c2a+". ID in array is: "+AbilityIDsCard2[c2a]);
                    let IsNewAbility = 1;
                    if (AbilityIDsCard1.includes(AbilityIDsCard2[c2a])) {
                        IsNewAbility = 0
                    } 
                    if (IsNewAbility == 1) {
                        let NewAbilityIDV = AbilityIDsCard2[c2a]+"_"+AbilityVersCard2[c2a];
                        NewAbilities.push(NewAbilityIDV);
                    }
                }

                if (RemovedAbilities.length > 0) {
                    for (let ra = 0; ra < RemovedAbilities.length; ra++) {
                        let RemovedAbilityIDV = RemovedAbilities[ra].split("_");
                        let RemovedAbilityID = RemovedAbilityIDV[0];
                        let RemovedAbilityVersion = RemovedAbilityIDV[1];
                        let RemovedAbilityArrayIndex = -1;
                        for (let ai = 0; ai < AbilityJSON.length; ai++) {
                            if (AbilityJSON[ai]['card_id'] == RemovedAbilityID) {
                                RemovedAbilityArrayIndex = ai;
                                break;
                            }
                        }
                        let RemovedAbilityName = AbilityJSON[RemovedAbilityArrayIndex]['versions'][RemovedAbilityVersion]['ability_name']['english'];
                        let RemovedAbilityText = AbilityJSON[RemovedAbilityArrayIndex]['versions'][RemovedAbilityVersion]['text']['english'];
                        CardHistoryHTML += '<li> Ability removed: '+RemovedAbilityName+' <br><span class="CardViewerPage_CardHistoryAbilityText">'+CardHistory_CardTextFormatting(RemovedAbilityText)+'</span></li>';
                    }
                }

                if (NewAbilities.length > 0) {
                    for (let na = 0; na < NewAbilities.length; na++) {
                        let NewAbilityIDV = NewAbilities[na].split("_");
                        let NewAbilityID = NewAbilityIDV[0];
                        let NewAbilityVersion = NewAbilityIDV[1];
                        let NewAbilityArrayIndex = -1;
                        for (let ai = 0; ai < AbilityJSON.length; ai++) {
                            if (AbilityJSON[ai]['card_id'] == NewAbilityID) {
                                NewAbilityArrayIndex = ai;
                                break;
                            }
                        }
                        console.log("New ability name: "+ AbilityJSON[NewAbilityArrayIndex]['versions'][NewAbilityVersion]['ability_name']['english']);
                        let NewAbilityName = AbilityJSON[NewAbilityArrayIndex]['versions'][NewAbilityVersion]['ability_name']['english'];
                        let NewAbilityText = AbilityJSON[NewAbilityArrayIndex]['versions'][NewAbilityVersion]['text']['english'];
                        CardHistoryHTML += '<li> Ability added: '+NewAbilityName+' <br><span class="CardViewerPage_CardHistoryAbilityText">'+CardHistory_CardTextFormatting(NewAbilityText)+'</span></li>';

                    }
                }

                if (UpdatedAbilities.length > 0) {
                    for (let ua = 0; ua < UpdatedAbilities.length; ua+=2) {
                        let UpdatedAbilityIDV = UpdatedAbilities[ua].split("_");
                        let UpdatedAbilityID = UpdatedAbilityIDV[0];
                        let UpdatedAbilityV1 = UpdatedAbilityIDV[1];
                        UpdatedAbilityIDV = UpdatedAbilities[ua+1].split("_");
                        let UpdatedAbilityV2 = UpdatedAbilityIDV[1];
                        let UpdatedAbilityArrayIndex = -1;
                        for (let ai = 0; ai < AbilityJSON.length; ai++) {
                            if (AbilityJSON[ai]['card_id'] == UpdatedAbilityID) {
                                UpdatedAbilityArrayIndex = ai;
                                break;
                            }
                        }

                        CardHistoryHTML += '<li> Ability updated: '+AbilityJSON[UpdatedAbilityArrayIndex]['versions'][UpdatedAbilityV1]['ability_name']['english']+'<br>';

                        //English Ability Name
                        if (AbilityJSON[UpdatedAbilityArrayIndex]['versions'][UpdatedAbilityV1]['ability_name']['english'] != AbilityJSON[UpdatedAbilityArrayIndex]['versions'][UpdatedAbilityV2]['ability_name']['english']) {
                            CardHistoryHTML += 'Ability renamed from '+AbilityJSON[UpdatedAbilityArrayIndex]['versions'][UpdatedAbilityV1]['ability_name']['english']+ ' to '+AbilityJSON[UpdatedAbilityArrayIndex]['versions'][UpdatedAbilityV2]['ability_name']['english']+'. </li>';
                        }
                        //English Ability Text
                        if (AbilityJSON[UpdatedAbilityArrayIndex]['versions'][UpdatedAbilityV1]['text']['english'] != AbilityJSON[UpdatedAbilityArrayIndex]['versions'][UpdatedAbilityV2]['text']['english']) {
                            CardHistoryHTML += '<div class="CardViewerPage_CardHistoryAbilityTextUpdate">Ability text changed. <br> <span class="CardViewerPage_CardHistoryCardTextChangeHeader">Previously:</span> <br> <span class="CardViewerPage_CardHistoryCardTextChangeDetails">'+CardHistory_CardTextFormatting(AbilityJSON[UpdatedAbilityArrayIndex]['versions'][UpdatedAbilityV1]['text']['english'])+ '</span> <br> <span class="CardViewerPage_CardHistoryCardTextChangeHeader">Changed to:</span> <br> <span class="CardViewerPage_CardHistoryCardTextChangeDetails">'+CardHistory_CardTextFormatting(AbilityJSON[UpdatedAbilityArrayIndex]['versions'][UpdatedAbilityV2]['text']['english'])+'</span> </div></li>';                        }
                        CardHistoryHTML += '</li>';
                    }
                }

            }

            CardHistoryHTML += '</div></div>'; //End CardHistoryDetails and End CardHistoryChangeContainer
        }

    } else {
        CardHistoryHTML = '<div class="CardViewerPage_CardHistoryChangeContainer"> \
        <div class="CardViewerPage_CardHistoryDetails"> \
            This card does not have any changes on record. \
        </div>'; 
    }

    return CardHistoryHTML;
}


const CardHistory_CardTextFormatting = function(Text) {
    Text = Text.replace(/\/n/g," ");
    Text = Text.replace(/(\[ATT\])/g,"▣");
    Text = Text.replace(/(\[AR\])/g,"▤");
    Text = Text.replace(/(\[HP\])/g,"▥");
    Text = Text.replace(/(\[QU\])/g,"▢");
    Text = Text.replace(/(\[AC\])/g,"■");
    Text = Text.replace(/(\[RP\])/g,"□");
    Text = Text.replace(/(\[TG\])/g,"");
    Text = Text.replace(/(\[TRed\])/g,"");
    Text = Text.replace(/(\[ET\])/g,"");
    return Text;
}
const CardHistory_ColourLetterToWord = function(Letter) {
    let Word = "";
    switch (Letter) {
        case "C":
            Word = "Colorless";
            break;
        case "R":
            Word = "Red";
            break;
        case "U":
            Word = "Blue";
            break;
        case "B":
            Word = "Black";
            break;
        case "G":
            Word = "Green";
            break;
    }
    return Word;
}