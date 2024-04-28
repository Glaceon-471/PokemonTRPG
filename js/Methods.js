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
    
    document.getElementById("ActualValueH").value = Math.floor(data[0] + InputIntValue("IndividualValueH") / 2 + 60) + InputIntValue("CorrectionValueH")
    if (poke == "Shedinja") document.getElementById("ActualValueH").value = data[0] + InputIntValue("CorrectionValueH")
    document.getElementById("ActualValueA").value = Math.floor(data[1] + InputIntValue("IndividualValueA") / 2 + 5) + InputIntValue("CorrectionValueA")
    document.getElementById("ActualValueB").value = Math.floor(data[2] + InputIntValue("IndividualValueB") / 2 + 5) + InputIntValue("CorrectionValueB")
    document.getElementById("ActualValueC").value = Math.floor(data[3] + InputIntValue("IndividualValueC") / 2 + 5) + InputIntValue("CorrectionValueC")
    document.getElementById("ActualValueD").value = Math.floor(data[4] + InputIntValue("IndividualValueD") / 2 + 5) + InputIntValue("CorrectionValueD")
    document.getElementById("ActualValueS").value = Math.floor(data[5] + InputIntValue("IndividualValueS") / 2 + 5) + InputIntValue("CorrectionValueS")
    document.getElementById("ActualValueF").value = InputIntValue("BaseStatsF") - InputIntValue("CorrectionValueF")
}

function UpdateSkillList() {
    $("#SkillList").html([
        `<div class="paragraph">`,
        `    <div class="leftheader">習得特技</div>`,
        `    <div class="header">判定値</div>`,
        `</div>`
    ].join("\n"))
    for (let [i, elements] of GetSkillElementList().entries()) {
        for (let [j, element] of elements.entries()) {
            if (!$(element).hasClass("selected")) continue
            $("#SkillList").append([
                ``,
                `<div class="paragraph">`,
                `    <div class="leftheader">${element.innerText}</div>`,
                `    <div class="data">`,
                `        <div class="size">`,
                `            <div class="pos">`,
                `                <span id="${SkillGapTexts[i]}${j + 2}"></span>`,
                `            </div>`,
                `        </div>`,
                `    </div>`,
                `</div>`
            ].join("\n"))
        }
    }
}

function SkillCheck(pos) {
    let skill = GetSkillElement(pos)
    let min = Infinity
    let optimum = []
    for (let element of document.querySelectorAll("#SkillList > .paragraph")) {
        if (!element.querySelector(".data")) continue
        $(element).removeClass("optimum")
        let distance = GetSkillDistance(pos, element.querySelector("span").id)
        element.querySelector("span").innerText = `2D6>=${!InputBoolValue("AdditionMode") ? 5 + distance : (distance > 0 ? `5+${distance}` : 5)} (判定 : ${skill.querySelector("span").innerText}${distance > 0 ? `, 代用 : ${element.querySelector(".leftheader").innerText}` : ""})`
        if (distance < min) {
            min = distance
            for (let e of optimum) {
                $(e).removeClass("optimum")
            }
        }
        if (distance <= min) {
            $(element).addClass("optimum")
            optimum.push(element)
        }
    }
}

function AddMoveList(add) {
    $("#MoveList").append([
        ``,
        `<div class="paragraph">`,
        `    <div class="movename">`,
        `        <div class="size">`,
        `            <div class="pos">`,
        `                <input type="text"${add[0] != null ? ` value="${add[0]}"` : ""} id="MoveName">`,
        `            </div>`,
        `       </div>`,
        `    </div>`,
        `    <div class="input type">`,
        `        <div class="size">`,
        `            <div class="pos">`,
        `                <input type="text"${add[1] != null ? ` value="${add[1]}"` : ""} id="MoveType">`,
        `            </div>`,
        `        </div>`,
        `    </div>`,
        `    <div class="input number">`,
        `        <div class="size">`,
        `            <div class="pos">`,
        `                <input type="number"${add[2] != null ? ` value="${add[2]}"` : ""} id="MovePower">`,
        `            </div>`,
        `        </div>`,
        `    </div>`,
        `    <div class="input">`,
        `        <div class="size">`,
        `            <div class="pos">`,
        `                <input type="text"${add[3] != null ? ` value="${add[3]}"` : ""} id="MoveEffect">`,
        `            </div>`,
        `        </div>`,
        `    </div>`,
        `    <div class="input number">`,
        `        <div class="size">`,
        `            <div class="pos">`,
        `                <input type="number" min="0"${add[4] != null ? ` value="${add[4]}"` : ""} id="MoveCost">`,
        `            </div>`,
        `        </div>`,
        `    </div>`,
        `    <div class="input skill">`,
        `        <div class="size">`,
        `            <div class="pos">`,
        `                <input type="text"${add[5] != null ? ` value="${add[5]}"` : ""} id="MoveSkill">`,
        `            </div>`,
        `        </div>`,
        `    </div>`,
        `</div>`
    ].join("\n"))
}

function Export() {
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
        "Skill": GetSkills(),
        "Gap": GetGaps(),
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