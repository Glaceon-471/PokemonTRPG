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
        let name = InputValue("Name")
        a.download = `${name != "" ? name : "data"}.json`
        $(a).click((e) => {
            e.target.href = URL.createObjectURL(new Blob([Export()], {
                type: "text/plain"
            }))
        })
        a.click()
    })
    
    for (let [i, elements] of GetSkillElementList().entries()) {
        for (let [j, element] of elements.entries()) {
            $(element).click(() => {
                if (!InputBoolValue("SkillCheckMode")) {
                    $(element).toggleClass("selected")
                    UpdateSkillList()
                }
                else SkillCheck(`${SkillGapTexts[i]}${j + 2}`)
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
    
    AddMoveList(["たいあたり", "ノーマル", 40, null, 0, null])
    AddMoveList(["なきごえ", "ノーマル", 0, "対象の攻撃ランク1ダウン", 0, null])
})