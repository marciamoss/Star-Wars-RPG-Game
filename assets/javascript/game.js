$(document).ready(function() {
    //global vars
    var characters=[], enemies=[], defender=[];
    var mycharhp, mycharap, enemycharhp, enemycharap; 

    //reset function
    function reset(){
        characters=[], enemies=[], defender=[];
        mycharhp="", mycharap="";
        enemycharhp="", enemycharap="";
        $("#warriors, #enemies, #defender").empty();
        $(".warriorsClass, .enemiesClass, .defenderClass").empty();
        $(".warriorsClass").off("click");$(".enemiesClass").off("click");
        $(".attack").off("click");$(".restart").off("click");$("#outcome").empty();
        begin();
    }
    reset();
    //functions
    function begin(){ 
        //character objects
        var char1 = {name: "rey", health: 120, attackPower: 8, counterPower: 8};
        var char2 = {name: "obi", health: 100, attackPower: 10, counterPower: 10};
        var char3 = {name: "finn", health: 150, attackPower: 20, counterPower: 20};
        var char4 = {name: "kylo", health: 180, attackPower: 25, counterPower: 25};

        characters=[char1, char2, char3, char4];
        
        $("#warriors").append(warriors); 
        
        function charDisplay(chararr,i,idName,clname){
            var warriors = $("<img>");
            warriors.addClass(clname);
            var img="assets/images/"+chararr[i].name+".jpg";
            // Each warriors will be given a src link to the image
            warriors.attr("src", img);
            //assign name
            warriors.attr("data-nameValue", chararr[i].name);
            //assign health points
            warriors.attr("data-hpValue", chararr[i].health);
            warriors.attr("data-apValue", chararr[i].attackPower);
            warriors.attr("data-cpValue", chararr[i].counterPower);
            text=chararr[i].name+" "+chararr[i].health;
            $(idName).append(warriors);     
            $(idName).append(text);  
        }

        function getindex(chararr,fighter) {
            for(var i=0;i<chararr.length;i++){
                if (chararr[i].name===fighter){
                    return i;
                }
            }  
        }

        function getenemy(that,charindex){  
            //Pick the defender from enemies
            var index =  getindex(characters,($(that).attr("data-nameValue")));
            for (var i=0;i<characters.length;i++){
                enemies.pop(characters[i]);
                if(i===index){
                    defender.push(characters[i]);   
                }
            }
            //repop enemies
            for (var i=0;i<characters.length;i++){
                if(i!==charindex && i!==index && characters[i].health>0){
                    enemies.push(characters[i]);
                }
            }
            //display enemy character
            $("#enemies").empty();
            for (var i = 0; i < enemies.length; i++) {
                charDisplay(enemies,i,"#enemies","enemiesClass");
            }

            //display defender char
            $("#defender").empty();
            for (var i = 0; i < defender.length; i++) {
                charDisplay(defender,i,"#defender","defenderClass");
            }
            return enemies;
        }
        //displays all characters
        for (var i = 0; i < characters.length; i++) {
            charDisplay(characters,i,"#warriors","warriorsClass");
        }
        
        $(".warriorsClass").on("click", function() {  
            var charindex =  getindex(characters,($(this).attr("data-nameValue")));
            for (var i=0;i<characters.length;i++){
                if(i!==charindex){
                    enemies.push(characters[i]);
                }
            }

            //pick your character
            $("#warriors").empty();
            charDisplay(characters,charindex,"#warriors","warriorsClass");

            //display enemy character
            for (var i = 0; i < enemies.length; i++) {
                charDisplay(enemies,i,"#enemies","enemiesClass");
            }
            $(".warriorsClass").off("click");
            
            $(".attack").on("click", function(event) {        
                if (defender.length===0){
                    var damage="No enemy here!!!";
                    $("#outcome").html(damage);     
                }                
            });

            $(".enemiesClass").on("click", function() {   
                var that=this;
                enemies=getenemy(that,charindex);
                $("#outcome").empty();
            
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
                            enemycharhp=enemycharhp-mycharap;
                            $(".warriorsClass").attr("data-hpValue", mycharhp);
                            characters[charindex].health=mycharhp;
                            var damage="You attacked "+defender[(defender.length-1)].name+" for "+characters[charindex].attackPower+" damage"+"<br>"
                            +defender[(defender.length-1)].name+" attacked you for "+defender[(defender.length-1)].counterPower+" damage";
                            $("#outcome").html(damage);
                            
                            characters[charindex].attackPower=characters[charindex].attackPower+characters[charindex].counterPower;
                            $("#warriors").empty();
                            charDisplay(characters,charindex,"#warriors","warriorsClass");

                            defender[(defender.length-1)].health=defender[(defender.length-1)].health-mycharap;
                            $(".defenderClass   ").attr("data-hpValue", defender[(defender.length-1)].health);
                                                                        
                            $("#defender").empty();
                            charDisplay(defender,(defender.length-1),"#defender","defenderClass");
                            
                        }
                        
                        if (enemycharhp<=0){
                            mycharhp=mycharhp+enemycharap;
                            characters[charindex].health=mycharhp;
                            $("#warriors").empty();
                            charDisplay(characters,charindex,"#warriors","warriorsClass");
                            var defname=defender[(defender.length-1)].name;
                            $("#defender").empty();
                            defender=[];
                            
                            if(enemies.length>0){
                                var damage="You have defeated "+ defname+", choose another enemy  to fight";
                                $("#outcome").html(damage);
                                $(".enemiesClass").on("click", function() {   
                                    $("#outcome").empty();
                                    var that=this;
                                    enemies=getenemy(that,charindex);
                                });
                            }else{
                                var damage="You Won!!!! GAME OVER!!! <br>";
                                $("#outcome").html(damage);
                                var outcomeBtn = $("<button>");
                                outcomeBtn.addClass("button1")
                                outcomeBtn.text("Restart");
                                $("#outcome").append(outcomeBtn);
                            }
                        }
                        if (mycharhp<=0){
                            var damage="You have been defeated...GAME OVER!!! <br>";
                            $("#outcome").html(damage);
                            var outcomeBtn = $("<button>");
                            outcomeBtn.addClass("button1")
                            outcomeBtn.text("Restart");
                            $("#outcome").append(outcomeBtn);
                        }
                    });
                    $(".restart").on("click", function(event) {
                        reset();
                    });
                }     
            });
        });
    }
});

