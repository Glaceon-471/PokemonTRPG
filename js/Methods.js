function DataSet() {
    const data = PokemonData[SelectedValue("SelectPokemon")]
    const sprites = data["sprite"]
    const official = sprites["official-artwork"]
    const stats = data["stats"]
    
    document.getElementById("BaseStatsH").value = stats[0]
    document.getElementById("BaseStatsA").value = stats[1]
    document.getElementById("BaseStatsB").value = stats[2]
    document.getElementById("BaseStatsC").value = stats[3]
    document.getElementById("BaseStatsD").value = stats[4]
    document.getElementById("BaseStatsS").value = stats[5]
    Recalculate()
    
    const element = document.getElementById("PokemonImage")
    element.alt = data["name"][1]
    if (official["front_default"] != null) {
        element.src = official["front_default"]
        return
    }
    element.src = sprites["front_default"]
}

function Recalculate() {
    const poke = SelectedValue("SelectPokemon")
    let data = []
    for (let i of ["H", "A", "B", "C", "D", "S"]) {
        data.push(InputIntValue(`BaseStats${i}`))
    }
    
    document.getElementById("BaseStatsF").value = 5 + MinMax(Math.floor(data.reduce((a, x) => a + x) / 40 - 8.75), 0, 5)
    
    document.getElementById("ActualValueH").value = Math.floor(data[0] + InputIntValue("IndividualValueH") / 2 + 60 + InputIntValue("CorrectionValueH"))
    if (poke == "Shedinja") document.getElementById("ActualValueH").value = data[0] + InputIntValue("CorrectionValueH")
    document.getElementById("ActualValueA").value = Math.floor(data[1] + InputIntValue("IndividualValueA") / 2 + 5 + InputIntValue("CorrectionValueA"))
    document.getElementById("ActualValueB").value = Math.floor(data[2] + InputIntValue("IndividualValueB") / 2 + 5 + InputIntValue("CorrectionValueB"))
    document.getElementById("ActualValueC").value = Math.floor(data[3] + InputIntValue("IndividualValueC") / 2 + 5 + InputIntValue("CorrectionValueC"))
    document.getElementById("ActualValueD").value = Math.floor(data[4] + InputIntValue("IndividualValueD") / 2 + 5 + InputIntValue("CorrectionValueD"))
    document.getElementById("ActualValueS").value = Math.floor(data[5] + InputIntValue("IndividualValueS") / 2 + 5 + InputIntValue("CorrectionValueS"))
    document.getElementById("ActualValueF").value = InputIntValue("BaseStatsF") + InputIntValue("CorrectionValueF")
}

function Export() {
    let abilityelement = []
    abilityelement.push(document.querySelectorAll("#HiddenMove > .data"))
    abilityelement.push(document.querySelectorAll("#Technology > .data"))
    abilityelement.push(document.querySelectorAll("#Knowledge > .data"))
    abilityelement.push(document.querySelectorAll("#Perception > .data"))
    abilityelement.push(document.querySelectorAll("#Emotion > .data"))
    abilityelement.push(document.querySelectorAll("#History > .data"))
    let ability = []
    for (let [i, elements] of abilityelement.entries()) {
        for (let [j, element] of elements.entries()) {
            if (!$(element).hasClass("selected")) continue
            let type;
            switch (i) {
                case 0:
                    type = "A"
                    break
                case 1:
                    type = "B"
                    break
                case 2:
                    type = "C"
                    break
                case 3:
                    type = "D"
                    break
                case 4:
                    type = "E"
                    break
                default:
                    type = "F"
                    break
            }
            ability.push(`${type}${j + 2}`)
        }
    }
    
    let gap = []
    for (let [i, element] of document.querySelectorAll(".paragraph.fineparagraph").entries()) {
        let header = element.querySelector(".header")
        if (header == null) continue
        if (!$(header).hasClass("selected")) continue
        let type;
        switch (i) {
            case 1:
                type = "A"
                break
            case 2:
                type = "B"
                break
            case 3:
                type = "C"
                break
            case 4:
                type = "D"
                break
            case 5:
                type = "E"
                break
            default:
                type = "F"
                break
        }
        gap.push(type)
    }
    
    let data = {
        "Name": InputValue("Name"),
        "Furigana": InputValue("Furigana"),
        "Age": InputValue("Age"),
        "Gender": InputValue("Gender"),
        "From": InputValue("From"),
        "Height": InputValue("Height"),
        "Weight": InputValue("Weight"),
        "Ability": InputValue("Ability"),
        "Type1": InputValue("Type1"),
        "Type2": InputValue("Type2"),
        "TeraType": InputValue("TeraType"),
        "Type3": InputValue("Type3"),
        "Affiliation": InputValue("Affiliation"),
        "Status": [
            [
                InputIntValue("BaseStatsH"),
                InputIntValue("BaseStatsA"),
                InputIntValue("BaseStatsB"),
                InputIntValue("BaseStatsC"),
                InputIntValue("BaseStatsD"),
                InputIntValue("BaseStatsS"),
                InputIntValue("BaseStatsF"),
            ],
            [
                InputIntValue("IndividualValueH"),
                InputIntValue("IndividualValueA"),
                InputIntValue("IndividualValueB"),
                InputIntValue("IndividualValueC"),
                InputIntValue("IndividualValueD"),
                InputIntValue("IndividualValueS"),
                InputIntValue("IndividualValueF"),
            ],
            [
                InputIntValue("CorrectionValueH"),
                InputIntValue("CorrectionValueA"),
                InputIntValue("CorrectionValueB"),
                InputIntValue("CorrectionValueC"),
                InputIntValue("CorrectionValueD"),
                InputIntValue("CorrectionValueS"),
                InputIntValue("CorrectionValueF"),
            ],
        ],
        "Ability": ability,
        "Gap": gap,
    }
    
    let json = JSON.stringify(data, null, 4)
    console.log(json)
    return json
}

/*
実数値の計算方法
このTRPGではレベル50の実数値を基礎とする


HPの実数値の計算
(種族値 + 個体値/2 + 努力値/8) + 60
努力値が無いため以下の通りとする
(種族値 + 個体値/2) + 60 + 補正値


HP以外の実数値の計算
{(種族値 + 個体値/2 + 努力値/8) + 5} * 性格補正
努力値が無いため以下の通りとする
性格補正は好きなようにできるようにする予定
{(種族値 + 個体値/2) + 5} * 性格補正 + 補正値


運の計算
全種族値の合計をnと置く
350 -> 5
550 -> 11
5 + (n - 350) / 40

a = (n - 350) / 40
max(a, 0)
min(a, 5)
*/