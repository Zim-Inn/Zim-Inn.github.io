<!DOCTYPE html>
<html lang="en">
    <head>   
        <meta charset="utf-8" />   
        <title>Artifact Card Preview</title>   
        <link rel="preload" href="Styles/standard.css" as="style">
        <!--<link rel="preload" href="main.js" as="script">-->
        <link rel="stylesheet" href="Styles/standard.css">
        <link rel="stylesheet" href="Styles/cards.css">

        <style>
            @import url('https://fonts.googleapis.com/css2?family=Open+Sans');
            .JSONProgress {
                color: #eee;
                font-family: 'Open Sans',sans-serif;
                font-size: 12pt;
            }
            .JSONProgressSubtitle {
                font-size: 14pt;
                text-decoration: underline;
            }
            .ImageContainer {
                width: 100px;
                min-height: 35px;
                float: left;
                border: 1px solid rgba(255,255,255,0.2);
                line-height: 0;
            }
            .ImageContainer img {
                width: 100%;
            }
        </style>

        <script>
            function JSONProgress() {
                var JSONData = "";
                var InnerHTMLData = "";
                document.getElementById("PageContainer").innerHTML = '<img src="Images/Styles/throbber20px.gif"</img> Loading...';
                http = new XMLHttpRequest();
                var url = "json/Cards.json";
                var params = "";
                http.open("GET", url, true);
                http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                http.onreadystatechange = function() {
                    if(http.readyState == 4 && http.status == 200) {
                        console.log(JSON.parse(http.responseText));
                        JSONData = JSON.parse(http.responseText);
                        JSONData.forEach(function(Card) {
                            console.log(Card['card_id']);

                            LatestCardVersion = Card['versions'].length-1;
                            InnerHTMLData += '<div class="JSONProgressSubtitle">' + Card['versions'][LatestCardVersion]['card_type'] + '</div>';
                            InnerHTMLData += Card['card_id'] + " / " + Card['versions'][LatestCardVersion]['card_name']['english'] + "<br>";
                            InnerHTMLData += "<div class='ImageContainer'><img src='Images/Cards/CardArt/"+ Card['versions'][LatestCardVersion]['image'] + ".jpg'></div>";
                            InnerHTMLData += "<div class='ImageContainer'><img src='Images/Cards/MiniImage/"+ Card['versions'][LatestCardVersion]['miniimage'] + ".jpg'></div>";

                            if ("icon" in Card['versions'][0]) {
                                InnerHTMLData += "<div class='ImageContainer'><img src='Images/HeroIcons/"+ Card['versions'][LatestCardVersion]['icon'] + ".png'></div>";
                            }

                            InnerHTMLData += "<div class='clear'></div>";
                            InnerHTMLData += '<br><br>';
                            console.log(Card);
                        });
                        document.getElementById("PageContainer").innerHTML = InnerHTMLData;
                        JSONProgress2();

                    } else {
                        document.getElementById("PageContainer").innerHTML = '<img src="Images/Styles/throbber20px.gif"</img> Loading...<br>'+http.readyState+" ... "+http.status;
                    }
                }
                http.send();
                
            }

            function JSONProgress2() {
                var JSONData = "";
                var InnerHTMLData = "";
                document.getElementById("AbilityContainer").innerHTML = '<img src="Images/Styles/throbber20px.gif"</img> Loading...';
                http = new XMLHttpRequest();
                var url = "json/Abilities.json";
                var params = "";
                http.open("POST", url, true);
                http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                http.onreadystatechange = function() {
                    if(http.readyState == 4 && http.status == 200) {
                        console.log(JSON.parse(http.responseText));
                        JSONData = JSON.parse(http.responseText);
                        JSONData.forEach(function(Card) {
                            LatestCardVersion = Card['versions'].length-1;
                            InnerHTMLData += '<div class="JSONProgressSubtitle">' + Card['versions'][LatestCardVersion]['ability_type'] + '</div>';
                            InnerHTMLData += Card['card_id'] + " / " + Card['versions'][LatestCardVersion]['ability_name']['english'] + "<br>";
                            InnerHTMLData += "<div class='ImageContainer'><img src='Images/Abilities/"+ Card['versions'][LatestCardVersion]['image'] + ".jpg'></div>";
                            InnerHTMLData += "<div class='clear'></div>";
                            InnerHTMLData += '<br><br>';
                            console.log(Card);
                        });
                        document.getElementById("AbilityContainer").innerHTML = InnerHTMLData;



                    } else {
                        document.getElementById("AbilityContainer").innerHTML = '<img src="Images/Styles/throbber20px.gif"</img> Loading...<br>'+http.readyState+" ... "+http.status;
                    }
                }
                http.send();
            }


        </script>
        
    </head> 

    <body>
       

        <div id="PageHeader">
            <div id="PageHeaderTitle" class="RestrictWidth">
                JSON PROGRESS
            </div>
        </div>

        <div id="PageContainer" class="RestrictWidth JSONProgress">
        </div> <!-- PageContainer -->
        <div id="AbilityContainer" class="RestrictWidth JSONProgress">
        </div> <!-- PageContainer -->


        <script>            
            JSONProgress();
           // JSONProgress2();
        </script>

    </body>
    
</html>
