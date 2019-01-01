$(document).ready(function() {
    //global vars
    var characters=[];var healthPoints=[];var attackPower=[];var counterPower=[];
    var enemies=[];var enemieshp=[];var enemiesap=[];var enemiescp=[];
    var defender=[];var defenderhp=[];var defenderap=[];var defendercp=[];
    var mycharhp;var mycharap;var enemycharhp;var enemycharap; 
    //reset function
    function reset(){
        characters=[];healthPoints=[];attackPower=[];counterPower=[];
        enemies=[];enemieshp=[];enemiesap=[];enemiescp=[];
        defender=[];defenderhp=[];defenderap=[];defendercp=[];
        mycharhp="";mycharap="";
        enemycharhp="";enemycharap="";
        $("#warriors").empty();$("#enemies").empty();$("#defender").empty();
        $(".warriorsClass").empty();$("enemiesClass").empty();$("defenderClass").empty();
        $(".warriorsClass").off("click");$(".enemiesClass").off("click");
        $(".attack").off("click");$(".restart").off("click");$("#outcome").empty();
        begin();
    }

    reset();
    //functions
    function begin(){ 
        characters=["rey","obi","finn","kylo"];
        healthPoints=[120,100,150,180];
        attackPower=[8,5,20,25];
        counterPower=[8,5,20,25];

        function charDisplay(chararr,i,idName,clname,hp,ap,cp){
            var warriors = $("<img>");
            warriors.addClass(clname);
            var img="assets/images/"+chararr[i]+".jpg";
            // Each warriors will be given a src link to the image
            warriors.attr("src", img);
            //assign name
            warriors.attr("data-nameValue", chararr[i]);
            //assign health points
            warriors.attr("data-hpValue", hp[i]);
            warriors.attr("data-apValue", ap[i]);
            warriors.attr("data-cpValue", cp[i]);
            text=chararr[i]+" "+hp[i];
            $(idName).append(warriors);     
            $(idName).append(text);  
        }

        function getenemy(that){
            
            var def = ($(that).attr("data-nameValue"));
            var index = enemies.indexOf(def);
            
            defender.push(enemies[index]);
            defenderhp.push(enemieshp[index]);
            defenderap.push(enemiesap[index]);
            defendercp.push(enemiescp[index]);
            
            var defindex = defender.indexOf(def);
            charDisplay(defender,defindex,"#defender","defenderClass",defenderhp,defenderap,defendercp);

            enemies.splice(index,1);
            enemieshp.splice(index,1);
            enemiesap.splice(index,1);
            enemiescp.splice(index,1);
            $("#enemies").empty();
            for (var i = 0; i < enemies.length; i++) {
                charDisplay(enemies,i,"#enemies","enemiesClass",enemieshp,enemiesap,enemiescp);
            }
        }
        //displays all characters
        for (var i = 0; i < characters.length; i++) {
            charDisplay(characters,i,"#warriors","warriorsClass",healthPoints,attackPower,counterPower);
        }
        $(".warriorsClass").on("click", function() {  
            var fighter = ($(this).attr("data-nameValue"));
            var index = characters.indexOf(fighter);
            for (i=0;i<characters.length;i++){
                if(i!==index){
                    enemies.push(characters[i]);
                    enemieshp.push(healthPoints[i]);
                    enemiesap.push(attackPower[i]);
                    enemiescp.push(counterPower[i]);
                }
            }
            //pick your character
            $("#warriors").empty();
            charDisplay(characters,index,"#warriors","warriorsClass",healthPoints,attackPower,counterPower);

            //display enemy character
            for (var i = 0; i < enemies.length; i++) {
                charDisplay(enemies,i,"#enemies","enemiesClass",enemieshp,enemiesap,enemiescp);
            }
            $(".warriorsClass").off("click");

            //Pick the defender from enemies
            $(".enemiesClass").on("click", function() {   
                var that=this;
                getenemy(that);
            });
            
            if (enemies.length>0){
                $(".attack").on("click", function(event) {                    
                    mycharhp = ($(".warriorsClass").attr("data-hpvalue"));
                    mycharhp = parseInt(mycharhp);
                    mycharap = ($(".warriorsClass").attr("data-apvalue"));
                    mycharap = parseInt(mycharap);

                    enemycharhp = ($(".defenderClass").attr("data-hpvalue"));
                    enemycharhp = parseInt(enemycharhp);
                    enemycharap = ($(".defenderClass").attr("data-apvalue"));
                    enemycharap = parseInt(enemycharap);
                    
                    if(mycharhp>0 && enemycharhp>0){
                        mycharhp=mycharhp-enemycharap;
                        $(".warriorsClass").attr("data-hpValue", mycharhp);
                        var index = characters.indexOf(($("#warriors").text()).substr(0,(($("#warriors").text()).indexOf(" "))));
                        healthPoints[index]=mycharhp;
                        //
                        var damage="You attacked "+defender[(defender.length-1)]+" for "+attackPower[index]+" damage"+"<br>"
                        +defender[(defender.length-1)]+" attacked you for "+defenderap[(defender.length-1)]+" damage";
                        $("#outcome").html(damage);
                        //
                        attackPower[index]=attackPower[index]+counterPower[index];
                        $("#warriors").empty();
                        charDisplay(characters,index,"#warriors","warriorsClass",healthPoints,attackPower,counterPower);

                        enemycharhp=enemycharhp-mycharap;
                        $(".defenderClass   ").attr("data-hpValue", enemycharhp);
                        var index = defender.indexOf(($("#defender").text()).substr(0,(($("#defender").text()).indexOf(" "))));
                        defenderhp[index]=enemycharhp;
                                        
                        $("#defender").empty();
                        charDisplay(defender,index,"#defender","defenderClass",defenderhp,defenderap,defendercp);
                    }
                    if (enemycharhp<=0){
                        mycharhp=mycharhp+enemycharap;
                        $(".warriorsClass").attr("data-hpValue", mycharhp);
                        var index = characters.indexOf(($("#warriors").text()).substr(0,(($("#warriors").text()).indexOf(" "))));
                        healthPoints[index]=mycharhp;
                        $("#warriors").empty();
                        charDisplay(characters,index,"#warriors","warriorsClass",healthPoints,attackPower,counterPower);
                        $("#defender").empty();
                        if(enemies.length>0){
                            var damage="You have defeated "+ defender[(defender.length-1)]+", choose another enemy  to fight";
                            $("#outcome").html(damage);
                            $(".enemiesClass").on("click", function() {   
                                $("#outcome").empty();
                                var that=this;
                                getenemy(that);
                            });
                        }else{
                            var damage="You Won!!!! GAME OVER!!! <br>";
                            $("#outcome").html(damage);
                            var outcomeBtn = $("<button>");
                            outcomeBtn.text("Restart");
                            $("#outcome").append(outcomeBtn);
                        }
                    }
                    if (mycharhp<=0){
                        var damage="You have been defeated...GAME OVER!!! <br>";
                        $("#outcome").html(damage);
                        var outcomeBtn = $("<button>");
                        outcomeBtn.text("Restart");
                        $("#outcome").append(outcomeBtn);
                    }
                });
                $(".restart").on("click", function(event) {
                    reset();
                });
            }
        });
    }
});

