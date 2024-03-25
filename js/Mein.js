let PokemonData = []

$.getJSON("https://raw.githubusercontent.com/Glaceon-471/PokemonTRPG/main/js/PokemonData.json", (data) => {
    PokemonData = data
    let SelectElements = new CsutomArray()
    SelectElements.TryPush(document.getElementById("SelectPokemon"))
    // SelectElements.TryPush(document.getElementById("SelectPokemon-ForSp"))
    
    if (SelectElements.length > 0) {
        for (let [key, value] of Object.entries(PokemonData)) {
            let option = document.createElement("option");
            option.value = value["name"][0]
            option.text = value["name"][1]
            for (let element of SelectElements) {
                element.appendChild(option.cloneNode(true))
            }
        }
        
        DataSet()
    }
    
    $(function() {
        $(".chosen").chosen({
            search_contains: true,
            no_results_text: "ありませんでした : ",
            width: "475px"
        })
    })
})

$(document).ready(() => {
    $("#SelectPokemon").change(() => {
        DataSet()
    })
    
    for (let id of ["BaseStats", "IndividualValue", "CorrectionValue"]) {
        for (let type of ["H", "A", "B", "C", "D", "S", "F"]) {
            $(`#${id}${type}`).change(() => {
                Recalculate()
            })
        }
    }
    
    $("#IndividualValueRandom").click(() => {
        let result =  window.confirm("個体値をランダムに振り直しますか？")
        if (result) {
            document.getElementById("IndividualValueH").value = Random(0, 31)
            document.getElementById("IndividualValueA").value = Random(0, 31)
            document.getElementById("IndividualValueB").value = Random(0, 31)
            document.getElementById("IndividualValueC").value = Random(0, 31)
            document.getElementById("IndividualValueD").value = Random(0, 31)
            document.getElementById("IndividualValueS").value = Random(0, 31)
            Recalculate()
        }
    })
    
    $("#DownloadButton").click(() => {
        let a = document.createElement("a");
        a.download = `${InputValue("Name")}.json`
        $(a).click((e) => {
            e.target.href = URL.createObjectURL(new Blob([Export()], {
                type: "text/plain"
            }))
        })
        a.click()
    })
    
    let data = []
    data.push(document.querySelectorAll("#HiddenMove > .data"))
    data.push(document.querySelectorAll("#Technology > .data"))
    data.push(document.querySelectorAll("#Knowledge > .data"))
    data.push(document.querySelectorAll("#Perception > .data"))
    data.push(document.querySelectorAll("#Emotion > .data"))
    data.push(document.querySelectorAll("#History > .data"))
    for (let elements of data) {
        for (let e of elements) {
            const element = e
            $(element).click(() => {
                $(element).toggleClass("selected")
            })
        }
    }
    
    for (let e of document.querySelectorAll(".paragraph.fineparagraph")) {
        const element = e
        let header = element.querySelector(".header")
        if (header == null) continue
        $(header).click(() => {
            $(header).toggleClass("selected")
            if ($(header).hasClass("selected")) $(element).addClass("selected")
            else $(element).removeClass("selected")
        })
    }
})