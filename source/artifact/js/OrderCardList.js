const OrderCardList = function(HeroArray, NonHeroNonItemArray, ItemArray) {
    const colorIndex = {R:1, U:2, B:3, G:4, C:5};

    let SortedHeroArray = new Array;
    if (HeroArray) { //DeckViewer keeps Heroes separate to the rest of the list.
        
        SortedHeroArray = HeroArray.sort((Card1, Card2) => {
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
    }

    let SortedNonHeroNonItemArray = new Array;
    if (NonHeroNonItemArray) {
        SortedNonHeroNonItemArray = NonHeroNonItemArray.sort((Card1, Card2) => {
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
    }

    let SortedItemArray = new Array;
    if (ItemArray) {
        SortedItemArray = ItemArray.sort((Card1, Card2) => {
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
    }

    let SortedCardListArray = new Array;
    if (HeroArray) {
        SortedCardListArray = SortedCardListArray.concat(SortedHeroArray);
    }
    if (NonHeroNonItemArray) {
        SortedCardListArray = SortedCardListArray.concat(SortedNonHeroNonItemArray);
    }
    if (ItemArray) {
        SortedCardListArray = SortedCardListArray.concat(SortedItemArray);
    }
    return SortedCardListArray;
}

const DV_OrderHeroesByTurn = function(HeroArray) {
    let DV_SortedHeroArray = new Array;
    DV_SortedHeroArray = HeroArray.sort((Hero1, Hero2) => {
        if ( Hero1.turn !== Hero2.turn) {
            if( Hero1.turn > Hero2.turn)
                return 1;
            else
                return -1;
        }
    });
    return DV_SortedHeroArray;
}