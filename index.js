
"use strict";

let people = [];

let select = document.getElementById("natOpts");

console.log($("#natOpts").attr("value"));

$(".btn-success").click(function(){
    alert("plz work")
    getPeople();
})

/*
$("#btnRicerca").click(function(){
    let nomeDaCercare = "";
    for(let person of people){
        if(
            person["name"]["first"] == $("#displayNome").text()
        ||  person["name"]["last"] == $("#displayCognome").text()
        ||  person["nat"] == $("#displayNazionalita").text()
        ||  person["cell"] == $("#displayTelefono").text()
        ){

        }
    }
})
    */

$("#cardContainer").on("click", ".card_icon",
    function(){
        //alert("pisda")
        
        let person = people[parseInt($(this).attr("id").split("_")[1])];

        let i = $("i[personIndex='" + person["personIndex"] + "']");

        if(i.hasClass("bi-heart")){
            i.removeClass("bi-heart").addClass("bi-heart-fill");
            addToFavs(person);
        }else{
            i.removeClass("bi-heart-fill").addClass("bi-heart");
            removeFromFavs($(this));
            $("#favContainer [uuid='" + person["login"]["uuid"] + "']")[0].remove();
        }

        
    }
)

$(".btn-outline-light").click(
    function(){
        $("input[type='radio'][checked]").removeAttr("checked")
        console.log("#" + $(this).attr("for"))
        $("#" + $(this).attr("for")).attr("checked", "");
    }
)

$("input[type='range']").on("input", function(){
    $("#nUtenti").text($(this).prop("value"));
})

//console.log($("option[name='natOpt'][selected]"))
/*

$("#natOpts").on("change", function(){
    alert("pisdaaaa")
    console.log($("option[name='natOpt'][selected]"))
    $("option[name='natOpt'][selected]").removeAttr("selected");
    $(this).attr("selected", "");
})

*/

//$("option[name='natOpt']")

init();

function init(){
    getPeople();

}

function removeFromFavs(iTag){
    //alert(person["login"]["uuid"])
    console.log(iTag[0])
    //$("[uuid=' + " + person["login"]["uuid"] + "']").remove();
}

function addToFavs(person){


    $("#favContainer").append(
        $("<div></div>")
        .addClass("card m-1 d-inline-block")
        .attr("style", "width: 100%;")
        .attr("uuid", person["login"]["uuid"])
        .append(
            $("<div></div>")
                .addClass("card-body d-inline-block")
                .attr("style", "width: 100%;")
                .append(
                    $("<img></img>")
                    .addClass("d-inline float-start")
                    .attr("src", person["picture"]["thumbnail"])
                    .attr("style", "width: 75px; height: 75px; border-radius: 100%; object-fit: contain;"),

                    $("<div></div>").addClass("row py-2").append(
                        $("<div></div>").addClass("col-6").text(person["name"]["first"] + " " + person["name"]["last"]),
                        $("<i></i>").addClass("col-6 bi bi-heart-fill")
                    ),

                    $("<div></div>").addClass("row py-2").append(
                        $("<div></div>").addClass("col-6").text(person["location"]["country"]),
                        $("<div></div>").addClass("col-6").text(person["dob"]["age"])
                    )
                )
    ))
}

function displayCards(people){

    $("#cardContainer").html("");

    //console.log("rqs", requests)

    let index = 0;
    for(let person of people){
        //console.log("person", person)
        person["personIndex"] = index;
        //console.log(person["personIndex"])
        let card = generateCard(person)
        //console.log(card);
        $("#cardContainer").append(card);
    
        index++;
    }

}
function generateCard(person){
    console.log(person)
    let card = $("<div></div>");
    card
    .addClass("card user_card m-2 mb-5 d-inline-block gy-5")
    .attr("style", "width: 15rem; ");

    card
    // Photo
    .append(
        $("<div></div>")
        .addClass("user_photo horizontal_center mt-4")
        .append(
            $("<img></img>").attr("src", person["picture"]["medium"])
            .addClass("vertical_center horizontal_center")
    ))
    // Basic info
    .append(generateBasicInfo(person))
    // Heart icon
    .append(
        $("<div></div>")
        .addClass("card_icon")
        .attr("uuid", person["login"]["uuid"])
        .attr("id", "icon_" + person["personIndex"])
        .append(
            $("<i></i>")
            .addClass("bi bi-heart")
            .attr("style", "font-size: 2rem;")
            .attr("personIndex", person["personIndex"])
        )
    );

    return card;
}
function generateBasicInfo(person){
    let basicInfoDiv = $("<div></div>")
    .addClass("card-body text-start")
    .append(
        $("<h5></h5>").addClass("card-title d-inline-block text-secondary").text("Nome"),
        $("<h5></h5>").addClass("d-inline-block float-end").text(person["name"]["first"]), $("<br>"),

        $("<h5></h5>").addClass("card-title d-inline-block text-secondary").text("Cog."),
        $("<h5></h5>").addClass("d-inline-block float-end").text(person["name"]["last"]), $("<br>"),

        $("<h5></h5>").addClass("card-title d-inline-block text-secondary").text("NAT"),
        $("<h5></h5>").addClass("d-inline-block float-end").text(person["nat"]), $("<br>"),

        /*
        $("<h5></h5>").addClass("card-title d-inline-block text-secondary").text("Mail"),
        $("<h5></h5>").addClass("d-inline-block float-end").text(person["email"]), $("<br>"),
        */

        $("<h5></h5>").addClass("card-title d-inline-block text-secondary").text("Tel."),
        $("<h5></h5>").addClass("d-inline-block float-end").text(person["cell"]), $("<br>"),
    )
    

    return basicInfoDiv;
}


function getPeople() {

    let params = {
        format: "pretty",
        results: $(nUtenti).text(),
        gender: getSelectedGender(),
        nat: $("#natOpts").prop("value")
    }

    console.log("nat: " + params["nat"])

    for(let param of Object.keys(params)){
        if(params[param] == null || params[param] == undefined){
            console.log("non tutti i campi sono stati compilati, la funzione terminerà ora");
            return;
        }
    }

    //                             metodo, risorsa, parametri
    let promise = ajax.sendRequest("GET",  "/api",  params)


    promise.catch(ajax.errore)
    promise.then(function (httpResponse) {

        people = httpResponse.data.results;

        //console.log(people);
        displayCards(people);


    })
}


function getSelectedGender(){
    let checkedGenderButton = $("input[type='radio'][checked]")
    if(checkedGenderButton.attr("id") != "all"){
        return checkedGenderButton.attr("id");
    } else {
        return "";
    }
}

function getSelectedNationality(){
    let selectedOption = $("option[selected]");
    if(selectedOption.attr("disabled") != "true"){
        return selectedOption.attr("value");
    } else {
        alert("seleziona una nazionalità");
        return null;
    }
}