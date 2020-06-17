const InitialiseKeywordsPage = function() {
        
    KeywordsJSON = KeywordsJSON.sort((kw1, kw2) => {
        if (kw1.keyword > kw2.keyword) {
            return 1;
        } else {
            return -1
        }
    });

    let KeywordPageHTML = "";
    let Card1HTML = "";
    let Card2HTML = "";
    let ExCardContainer1 = "";
    let ExCardContainer2 = "";
    for (let i = 0; i < KeywordsJSON.length; i++) {
        if (!("hide_from_keyword_page" in KeywordsJSON[i])) {
            ExCardContainer1 = "KW"+i+"EX1";
            ExCardContainer2 = "KW"+i+"EX2";
            KeywordPageHTML += '<div class="KeywordContainer"> \
                                    <div class="KeywordInnerLeft"> \
                                        <div class="KeywordTitle"> \
                                            '+KeywordsJSON[i]['keyword']+' \
                                        </div> \
                                        <div class="KeywordDesc"> \
                                            '+KeywordsJSON[i]['desc']+' \
                                        </div> \
                                    </div> \
                                    <div class="KeywordInnerRight"> \
                                        <div id="'+ExCardContainer1+'" class="KeywordCardPreviewContainer">'+Card1HTML+'</div> \
                                        <div id="'+ExCardContainer2+'" class="KeywordCardPreviewContainer">'+Card2HTML+'</div> \
                                        <div class="clear"></div> \
                                    </div> \
                                    <div class="clear"></div> \
                                </div>';
        }
    }
    document.getElementById('KeywordsPage').innerHTML = KeywordPageHTML;

    for (let i = 0; i < KeywordsJSON.length; i++) {
        if (!("hide_from_keyword_page" in KeywordsJSON[i])) {
            ExCardContainer1 = "KW"+i+"EX1";
            ExCardContainer2 = "KW"+i+"EX2";
            for (let ec = 0; ec < KeywordsJSON[i]["example"].length; ec++) {
                if (ec == 0) {
                    Card1HTML = GenerateCard(ExCardContainer1,(KeywordsJSON[i]["example"][ec]+"_99"));
                } else {
                    Card2HTML = GenerateCard(ExCardContainer2,(KeywordsJSON[i]["example"][ec]+"_99"));
                }
            }
        }
    }
}