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
        for (let counter = TotalCardVersions-1; counter >0; counter--) {
            CardHistoryHTML += '<div class="CardViewerPage_CardHistoryChangeContainer"> \
                                    <div class="CardViewerPage_CardHistoryDateTitle"> \
                                        '+CardJSON[CardArrayIndex]['versions'][counter]['release_date']+' \
                                    </div> \
                                    <div class="CardViewerPage_CardHistoryDetails">';
            //English Card Name
            if (CardJSON[CardArrayIndex]['versions'][counter-1]['card_name']['english'] != CardJSON[CardArrayIndex]['versions'][counter]['card_name']['english']) {
                CardHistoryHTML += '<li>Card renamed from '+CardJSON[CardArrayIndex]['versions'][counter-1]['card_name']['english']+ ' to '+CardJSON[CardArrayIndex]['versions'][counter]['card_name']['english']+'. </li>';
            }
            //CardArt
            if (CardJSON[CardArrayIndex]['versions'][counter-1]['image'] != CardJSON[CardArrayIndex]['versions'][counter]['image']) {
                let CardArtChangeIndicatorStyle = "CardViewerPage_CardHistoryCardArtHalfHeightChangeIndicator";
                if (CardJSON[CardArrayIndex]['versions'][counter]['card_type'] == "Hero" || CardJSON[CardArrayIndex]['versions'][counter]['card_type'] == "Creep") {
                    CardArtChangeIndicatorStyle = "CardViewerPage_CardHistoryCardArtFullHeightChangeIndicator";
                }
                CardHistoryHTML += '<li>Card art changed. </li>';
                CardHistoryHTML += '<div class="CardViewerPage_CardHistoryCardArtContainer"><img src="Images/Cards/CardArt/'+CardJSON[CardArrayIndex]['versions'][counter-1]['image']+'.jpg"></div><div class="'+CardArtChangeIndicatorStyle+'"></div><div class="CardViewerPage_CardHistoryCardArtContainer"><img src="Images/Cards/CardArt/'+CardJSON[CardArrayIndex]['versions'][counter]['image']+'.jpg"></div><div class="clear"></div>';
            }
            //Card Mini-image
            if (CardJSON[CardArrayIndex]['versions'][counter-1]['miniimage'] != CardJSON[CardArrayIndex]['versions'][counter]['miniimage']) {
                CardHistoryHTML += '<li>Card mini-image changed. </li>';
                CardHistoryHTML += '<div class="CardViewerPage_CardHistoryMiniImageContainer"><img src="Images/Cards/MiniImage/'+CardJSON[CardArrayIndex]['versions'][counter-1]['miniimage']+'.jpg"></div><div class="CardViewerPage_CardHistoryMiniImageChangeIndicator"></div><div class="CardViewerPage_CardHistoryMiniImageContainer"><img src="Images/Cards/MiniImage/'+CardJSON[CardArrayIndex]['versions'][counter]['image']+'.jpg"></div><div class="clear"></div>';
            }
            //Card Type
            if (CardJSON[CardArrayIndex]['versions'][counter-1]['card_type'] != CardJSON[CardArrayIndex]['versions'][counter]['card_type']) {
                CardHistoryHTML += '<li>Card Type changed from '+CardJSON[CardArrayIndex]['versions'][counter-1]['card_type']+ ' to '+CardJSON[CardArrayIndex]['versions'][counter]['card_type']+'. </li>';
            }
            //Card Colour
            if ("colour" in CardJSON[CardArrayIndex]['versions'][counter-1]) {
                if (CardJSON[CardArrayIndex]['versions'][counter-1]['colour'] != CardJSON[CardArrayIndex]['versions'][counter]['colour']) {
                    CardHistoryHTML += '<li>Card color changed from '+CardHistory_ColourLetterToWord(CardJSON[CardArrayIndex]['versions'][counter-1]['colour'])+ ' to '+CardHistory_ColourLetterToWord(CardJSON[CardArrayIndex]['versions'][counter]['colour'])+'. </li>';
                }
            } 
            //Card Rarity
            if (CardJSON[CardArrayIndex]['versions'][counter-1]['rarity'] != CardJSON[CardArrayIndex]['versions'][counter]['rarity']) {
                CardHistoryHTML += '<li>Card Rarity changed from '+CardJSON[CardArrayIndex]['versions'][counter-1]['rarity']+'<span class=CardViewerPage_CardHistoryRarityIcon><img src="Images/SetIcons/'+CardJSON[CardArrayIndex]['versions'][counter-1]['set']+'-'+CardJSON[CardArrayIndex]['versions'][counter-1]['rarity']+'.png"></span> to '+CardJSON[CardArrayIndex]['versions'][counter]['rarity']+'<span class=CardViewerPage_CardHistoryRarityIcon><img src="Images/SetIcons/'+CardJSON[CardArrayIndex]['versions'][counter]['set']+'-'+CardJSON[CardArrayIndex]['versions'][counter]['rarity']+'.png"></span> </li>';
            }
            //English Card Text
            if ("text" in CardJSON[CardArrayIndex]['versions'][counter-1] || "text" in CardJSON[CardArrayIndex]['versions'][counter]) {
                if (CardJSON[CardArrayIndex]['versions'][counter-1]['text']['english'] != CardJSON[CardArrayIndex]['versions'][counter]['text']['english']) {
                    CardHistoryHTML += '<li>Card text changed. <br> <span class="CardViewerPage_CardHistoryCardTextChangeHeader">Previously:</span> <br> <span class="CardViewerPage_CardHistoryCardTextChangeDetails">'+CardHistory_CardTextFormatting(CardJSON[CardArrayIndex]['versions'][counter-1]['text']['english'])+ '</span> <br> <span class="CardViewerPage_CardHistoryCardTextChangeHeader">Changed to:</span> <br> <span class="CardViewerPage_CardHistoryCardTextChangeDetails">'+CardHistory_CardTextFormatting(CardJSON[CardArrayIndex]['versions'][counter]['text']['english'])+'</span> </li>';
                }
            }
            //HP, Armour and Attack Values
            if ("hp" in CardJSON[CardArrayIndex]['versions'][counter-1] && "hp" in CardJSON[CardArrayIndex]['versions'][counter] && CardJSON[CardArrayIndex]['versions'][counter]["card_type"] != "Item") {
                if ((CardJSON[CardArrayIndex]['versions'][counter-1]["hp"] != CardJSON[CardArrayIndex]['versions'][counter]["hp"]) || (CardJSON[CardArrayIndex]['versions'][counter-1]["armour"] != CardJSON[CardArrayIndex]['versions'][counter]["armour"]) || (CardJSON[CardArrayIndex]['versions'][counter-1]["attack"] != CardJSON[CardArrayIndex]['versions'][counter]["attack"]))
                CardHistoryHTML+='<li> Card stats changed from ▣'+CardJSON[CardArrayIndex]['versions'][counter-1]["attack"]+' ▤'+CardJSON[CardArrayIndex]['versions'][counter-1]["armour"]+' ▥'+CardJSON[CardArrayIndex]['versions'][counter-1]["hp"]+' to ▣'+CardJSON[CardArrayIndex]['versions'][counter]["attack"]+' ▤'+CardJSON[CardArrayIndex]['versions'][counter]["armour"]+' ▥'+CardJSON[CardArrayIndex]['versions'][counter]["hp"]+' </li>';
            }
            //Mana Cost
            if (CardJSON[CardArrayIndex]['versions'][counter-1]['cost'] != CardJSON[CardArrayIndex]['versions'][counter]['cost']) {
                CardHistoryHTML += '<li>Mana Cost changed from '+CardJSON[CardArrayIndex]['versions'][counter-1]['cost']+ ' to '+CardJSON[CardArrayIndex]['versions'][counter]['cost']+'. </li>';
            }
            //Gold Cost
            if ("gcost" in CardJSON[CardArrayIndex]['versions'][counter-1]) {
                if (CardJSON[CardArrayIndex]['versions'][counter-1]['gcost'] != CardJSON[CardArrayIndex]['versions'][counter]['gcost']) {
                    CardHistoryHTML += '<li>Gold Cost changed from '+CardJSON[CardArrayIndex]['versions'][counter-1]['gcost']+ ' to '+CardJSON[CardArrayIndex]['versions'][counter]['gcost']+'. </li>';
                }
            }
            //Check if a card used to be a signature and isn't anymore
            if ("is_signature" in CardJSON[CardArrayIndex]['versions'][counter-1] && !("is_signature" in CardJSON[CardArrayIndex]['versions'][counter])) {
                let OriginalHeroIDV = CardJSON[CardArrayIndex]['versions'][counter-1]['is_signature'].split("_");
                let OriginalHeroID = OriginalHeroIDV[0];
                let HeroCardName = "";
                for (let hc = 0; hc < CardJSON.length; hc++) {
                    if (CardJSON[hc]['card_id'] == OriginalHeroID) {
                        HeroCardName = CardJSON[hc]['versions'][(CardJSON[hc]['versions'].length-1)]['card_name']['english'];
                        break;
                    }
                }
                CardHistoryHTML += '<li>No longer the signature card for '+HeroCardName+'. </li>';
            }
            //Card Signatures
            if ("signature" in CardJSON[CardArrayIndex]['versions'][counter-1]) {
                let SignatureIDsCard1 = new Array();
                let SignatureVersCard1 = new Array();
                let SignatureIDsCard2 = new Array(); 
                let SignatureVersCard2 = new Array();
                let RemovedSignatures = new Array();
                let UpdatedSignatures = new Array(); //Even indices: Previous Version. Odd indices: Updated Version.
                let NewSignatures = new Array();

                for (let sc1 = 0; sc1 < CardJSON[CardArrayIndex]['versions'][counter-1]['signature'].length; sc1++) {
                    let SignatureIDV = CardJSON[CardArrayIndex]['versions'][counter-1]['signature'][sc1].split("_");
                    SignatureIDsCard1.push(SignatureIDV[0]);
                    SignatureVersCard1.push(SignatureIDV[1]);
                }
                for (let sc2 = 0; sc2 < CardJSON[CardArrayIndex]['versions'][counter]['signature'].length; sc2++) {
                    let SignatureIDV = CardJSON[CardArrayIndex]['versions'][counter]['signature'][sc2].split("_");
                    SignatureIDsCard2.push(SignatureIDV[0]);
                    SignatureVersCard2.push(SignatureIDV[1]);
                }

                for (let c1a = 0; c1a < SignatureIDsCard1.length; c1a++) {
                    let IsInCard2 = 0;
                    let Card2ArrayIndex = -1;
                
                    for (let c2a = 0; c2a < SignatureIDsCard2.length; c2a++) {
                        if (SignatureIDsCard1[c1a] == SignatureIDsCard2[c2a]) {
                            IsInCard2 = 1;
                            Card2ArrayIndex = c2a;
                            break;
                        } 
                    }
                    
                    if (IsInCard2 == 1) { //If Signature matches...
                
                        if (SignatureVersCard1[c1a] == SignatureVersCard2[Card2ArrayIndex]) {
                            // ... And the version matches - no change for this signature.
                        } else {
                            // ... But version doesn't match.
                            let OldSignature = SignatureIDsCard1[c1a]+"_"+SignatureVersCard1[c1a];
                            UpdatedSignatures.push(OldSignature);
                            let NewSignature = SignatureIDsCard2[Card2ArrayIndex]+"_"+SignatureVersCard2[Card2ArrayIndex];
                            UpdatedSignatures.push(NewSignature);
                        }
                    } else { // Signature not on the card.
                        let RemovedSignature = SignatureIDsCard1[c1a]+"_"+SignatureVersCard1[c1a];
                        RemovedSignatures.push(RemovedSignature);
                    }
                }
                
                for (let c2a = 0; c2a < SignatureIDsCard2.length; c2a++) {
                    let IsNewSignature = 1;
                    if (SignatureIDsCard1.includes(SignatureIDsCard2[c2a])) {
                        IsNewSignature = 0
                    } 
                    if (IsNewSignature == 1) {
                        let NewSignatureIDV = SignatureIDsCard2[c2a]+"_"+SignatureVersCard2[c2a];
                        NewSignatures.push(NewSignatureIDV);
                    }
                }
                
                if (RemovedSignatures.length > 0) {
                    for (let rs = 0; rs < RemovedSignatures.length; rs++) {
                        let RemovedSignatureIDV = RemovedSignatures[rs].split("_");
                        let RemovedSignatureID = RemovedSignatureIDV[0];
                        let RemovedSignatureVersion = RemovedSignatureIDV[1];
                        let RemovedSignatureArrayIndex = -1;
                        for (let si = 0; si < CardJSON.length; si++) {
                            if (CardJSON[si]['card_id'] == RemovedSignatureID) {
                                RemovedSignatureArrayIndex = si;
                                break;
                            }
                        }
                        let RemovedSignatureName = CardJSON[RemovedSignatureArrayIndex]['versions'][RemovedSignatureVersion]['card_name']['english'];
                        let RemovedSignatureText = CardJSON[RemovedSignatureArrayIndex]['versions'][RemovedSignatureVersion]['text']['english'];
                        CardHistoryHTML += '<li> Signature Card removed: '+RemovedSignatureName+' <br><span class="CardViewerPage_CardHistoryRemovedAbilityText">'+CardHistory_CardTextFormatting(RemovedSignatureText)+'</span></li>';
                    }
                }
                
                if (NewSignatures.length > 0) {
                    for (let ns = 0; ns < NewSignatures.length; ns++) {
                        let NewSignatureIDV = NewSignatures[ns].split("_");
                        let NewSignatureID = NewSignatureIDV[0];
                        let NewSignatureVersion = NewSignatureIDV[1];
                        let NewSignatureArrayIndex = -1;
                        for (let si = 0; si < CardJSON.length; si++) {
                            if (CardJSON[si]['card_id'] == NewSignatureID) {
                                NewSignatureArrayIndex = si;
                                break;
                            }
                        }
                        let NewSignatureName = CardJSON[NewSignatureArrayIndex]['versions'][NewSignatureVersion]['card_name']['english'];
                        let NewSignatureText = CardJSON[NewSignatureArrayIndex]['versions'][NewSignatureVersion]['text']['english'];
                        CardHistoryHTML += '<li> Signature Card added: '+NewSignatureName+' <br><span class="CardViewerPage_CardHistoryAbilityTextUpdate">'+CardHistory_CardTextFormatting(NewSignatureText)+'</span></li>';
                
                    }
                }
                
                if (UpdatedSignatures.length > 0) {
                    for (let us = 0; us < UpdatedSignatures.length; us+=2) {
                        let UpdatedSignatureIDV = UpdatedSignatures[us].split("_");
                        let UpdatedSignatureID = UpdatedSignatureIDV[0];
                        let UpdatedSignatureV1 = UpdatedSignatureIDV[1];
                        UpdatedSignatureIDV = UpdatedSignatures[us+1].split("_");
                        let UpdatedSignatureV2 = UpdatedSignatureIDV[1];
                        let UpdatedSignatureArrayIndex = -1;
                        for (let si = 0; si < CardJSON.length; si++) {
                            if (CardJSON[si]['card_id'] == UpdatedSignatureID) {
                                UpdatedSignatureArrayIndex = si;
                                break;
                            }
                        }
                
                        CardHistoryHTML += '<li> Signature Card updated: '+CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV1]['card_name']['english']+'<br>';
                
                        //English Signature Name
                        if (CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV1]['card_name']['english'] != CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV2]['card_name']['english']) {
                            CardHistoryHTML += 'Card renamed from '+CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV1]['card_name']['english']+ ' to '+CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV2]['card_name']['english']+'. </li>';
                        }
                        //CardArt
                        if (CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV1]['image'] != CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV2]['image']) {
                            let CardArtChangeIndicatorStyle = "CardViewerPage_CardHistoryCardArtHalfHeightChangeIndicator";
                            if (CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV1]['card_type'] == "Hero" || CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV2]['card_type'] == "Creep") {
                                CardArtChangeIndicatorStyle = "CardViewerPage_CardHistoryCardArtFullHeightChangeIndicator";
                            }
                            CardHistoryHTML += '<li>Card art changed. </li>';
                            CardHistoryHTML += '<div class="CardViewerPage_CardHistoryCardArtContainer"><img src="Images/Cards/CardArt/'+CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV1]['image']+'.jpg"></div><div class="'+CardArtChangeIndicatorStyle+'"></div><div class="CardViewerPage_CardHistoryCardArtContainer"><img src="Images/Cards/CardArt/'+CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV2]['image']+'.jpg"></div><div class="clear"></div>';
                        }
                        //Card Mini-image
                        if (CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV1]['miniimage'] != CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV2]['miniimage']) {
                            CardHistoryHTML += '<li>Card mini-image changed. </li>';
                            CardHistoryHTML += '<div class="CardViewerPage_CardHistoryMiniImageContainer"><img src="Images/Cards/MiniImage/'+CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV1]['miniimage']+'.jpg"></div><div class="CardViewerPage_CardHistoryMiniImageChangeIndicator"></div><div class="CardViewerPage_CardHistoryMiniImageContainer"><img src="Images/Cards/MiniImage/'+CardJSON[CardArrayIndex]['versions'][UpdatedSignatureV2]['image']+'.jpg"></div><div class="clear"></div>';
                        }
                        //Card Type
                        if (CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV1]['card_type'] != CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV2]['card_type']) {
                            CardHistoryHTML += '<div class="CardViewerPage_CardHistoryAbilityTextUpdate">Card Type changed from '+CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV1]['card_type']+ ' to '+CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV2]['card_type']+'.</div>';
                        }
                        //Card Rarity
                        if (CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV1]['rarity'] != CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV2]['rarity']) {
                            CardHistoryHTML += '<div class="CardViewerPage_CardHistoryAbilityTextUpdate">Card Rarity changed from '+CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV1]['rarity']+'<span class=CardViewerPage_CardHistoryRarityIconSignature><img src="Images/SetIcons/'+CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV1]['set']+'-'+CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV1]['rarity']+'.png"></span> to '+CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV2]['rarity']+'<span class=CardViewerPage_CardHistoryRarityIconSignature><img src="Images/SetIcons/'+CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV2]['set']+'-'+CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV2]['rarity']+'.png"></span> </div>';
                        }
                        //English Signature Text
                        if (CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV1]['text']['english'] != CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV2]['text']['english']) {
                            CardHistoryHTML += '<div class="CardViewerPage_CardHistoryAbilityTextUpdate">Card text changed. <br> <span class="CardViewerPage_CardHistoryCardTextChangeHeader">Previously:</span> <br> <span class="CardViewerPage_CardHistoryCardTextChangeDetails">'+CardHistory_CardTextFormatting(CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV1]['text']['english'])+ '</span> <br> <span class="CardViewerPage_CardHistoryCardTextChangeHeader">Changed to:</span> <br> <span class="CardViewerPage_CardHistoryCardTextChangeDetails">'+CardHistory_CardTextFormatting(CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV2]['text']['english'])+'</span> </div>';
                        }
                        //HP, Armour and Attack Values
                        if ("hp" in CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV1] && "hp" in CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV2]) {
                            if ((CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV1]["hp"] != CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV2]["hp"]) || (CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV1]["armour"] != CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV2]["armour"]) || (CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV1]["attack"] != CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV2]["attack"]))
                            CardHistoryHTML+='<div class="CardViewerPage_CardHistoryAbilityTextUpdate">Card stats changed from ▣'+CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV1]["attack"]+' ▤'+CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV1]["armour"]+' ▥'+CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV1]["hp"]+' to ▣'+CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV2]["attack"]+' ▤'+CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV2]["armour"]+' ▥'+CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV2]["hp"]+'</div>';
                        }
                        //Mana Cost
                        if (CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV1]['cost'] != CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV2]['cost']) {
                            CardHistoryHTML += '<div class="CardViewerPage_CardHistoryAbilityTextUpdate">Mana Cost changed from '+CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV1]['cost']+ ' to '+CardJSON[UpdatedSignatureArrayIndex]['versions'][UpdatedSignatureV2]['cost']+'.</div>';
                        }

                        CardHistoryHTML += '</li>';
                    }
                }
            }

            //Card Abilities
            if ("abilities" in CardJSON[CardArrayIndex]['versions'][counter-1]) {
                let AbilityIDsCard1 = new Array();
                let AbilityVersCard1 = new Array();
                let AbilityIDsCard2 = new Array(); 
                let AbilityVersCard2 = new Array();
                let RemovedAbilities = new Array();
                let UpdatedAbilities = new Array(); //Even indices: Previous Version. Odd indices: Updated Version.
                let NewAbilities = new Array();

                for (let ac1 = 0; ac1 < CardJSON[CardArrayIndex]['versions'][counter-1]['abilities'].length; ac1++) {
                    let AbilityIDV = CardJSON[CardArrayIndex]['versions'][counter-1]['abilities'][ac1].split("_");
                    AbilityIDsCard1.push(AbilityIDV[0]);
                    AbilityVersCard1.push(AbilityIDV[1]);
                }
                for (let ac2 = 0; ac2 < CardJSON[CardArrayIndex]['versions'][counter]['abilities'].length; ac2++) {
                    let AbilityIDV = CardJSON[CardArrayIndex]['versions'][counter]['abilities'][ac2].split("_");
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

                        if (AbilityVersCard1[c1a] == AbilityVersCard2[Card2AbilityArrayIndex]) {
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
                        CardHistoryHTML += '<li> Ability removed: '+RemovedAbilityName+' <br><span class="CardViewerPage_CardHistoryRemovedAbilityText">'+CardHistory_CardTextFormatting(RemovedAbilityText)+'</span></li>';
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
                        let NewAbilityName = AbilityJSON[NewAbilityArrayIndex]['versions'][NewAbilityVersion]['ability_name']['english'];
                        let NewAbilityText = AbilityJSON[NewAbilityArrayIndex]['versions'][NewAbilityVersion]['text']['english'];
                        CardHistoryHTML += '<li> Ability added: '+NewAbilityName+' <br><span class="CardViewerPage_CardHistoryAbilityTextUpdate">'+CardHistory_CardTextFormatting(NewAbilityText)+'</span></li>';

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
                        //Ability Icon
                        if (AbilityJSON[UpdatedAbilityArrayIndex]['versions'][UpdatedAbilityV1]['image'] != AbilityJSON[UpdatedAbilityArrayIndex]['versions'][UpdatedAbilityV2]['image']) {
                            CardHistoryHTML += '<div class="CardViewerPage_CardHistoryAbilityTextUpdate">Ability icon changed.</div>';
                            CardHistoryHTML += '<div class="CardViewerPage_CardHistoryMiniImageContainer"><img src="Images/Abilities/'+AbilityJSON[UpdatedAbilityArrayIndex]['versions'][UpdatedAbilityV1]['image']+'.jpg"></div><div class="CardViewerPage_CardHistoryMiniImageChangeIndicator"></div><div class="CardViewerPage_CardHistoryMiniImageContainer"><img src="Images/Abilities/'+AbilityJSON[UpdatedAbilityArrayIndex]['versions'][UpdatedAbilityV2]['image']+'.jpg"></div><div class="clear"></div>';
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

        let CardVersionDateFormat = new Date(CardJSON[CardArrayIndex]['versions'][0]['release_date']);
        let NewCardDateCutoffPoint = new Date('2020-05-26');
        if (CardVersionDateFormat > NewCardDateCutoffPoint) {
            CardHistoryHTML += '<div class="CardViewerPage_CardHistoryChangeContainer"> \
                                        <div class="CardViewerPage_CardHistoryDateTitle"> \
                                            '+CardJSON[CardArrayIndex]['versions'][0]['release_date']+' \
                                        </div> \
                                        <div class="CardViewerPage_CardHistoryDetails"> \
                                            <li>Added to the game.</li> \
                                        </div>';
        }

    } else {
        let CardVersionDateFormat = new Date(CardJSON[CardArrayIndex]['versions'][0]['release_date']);
        let NewCardDateCutoffPoint = new Date('2020-05-26');
        if (CardVersionDateFormat > NewCardDateCutoffPoint) {
            CardHistoryHTML += '<div class="CardViewerPage_CardHistoryChangeContainer"> \
                                        <div class="CardViewerPage_CardHistoryDateTitle"> \
                                            '+CardJSON[CardArrayIndex]['versions'][0]['release_date']+' \
                                        </div> \
                                        <div class="CardViewerPage_CardHistoryDetails"> \
                                            <li>Added to the game.</li> \
                                        </div>';
        } else {
            CardHistoryHTML = '<div class="CardViewerPage_CardHistoryChangeContainer"> \
            <div class="CardViewerPage_CardHistoryDetails"> \
                This card does not have any changes on record. \
            </div>'; 
        }
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