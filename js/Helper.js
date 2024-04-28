const SkillGapTexts = ["A", "B", "C", "D", "E", "F"]

function MinMax(valse, min, max) {
    return Math.max(Math.min(valse, max), min)
}

function Random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function GetSkillDistance(a, b, isgap = true) {
    let [a_x, a_y] = GetSkillPos(a), [b_x, b_y] = GetSkillPos(b)
    let up = 0, down = 0, left = 0, right = 0
    
    // true = aが上, false = bが上
    let istop = b_y - a_y > 0
    if (istop) {
        up = a_y - b_y + 11
        down = b_y - a_y
    }
    else {
        up = b_y - a_y + 11
        down = a_y - b_y
    }
    
    // true = aが左, false = bが左
    let isleft = b_x - a_x > 0
    if (isleft) {
        left = a_x - b_x + 12
        right = b_x - a_x
    }
    else {
        left = b_x - a_x + 12
        right = a_x - b_x
    }
    
    if (isgap) {
        left -= GetWithinRangeGap(a_x, b_x, true).length
        right -= GetWithinRangeGap(a_x, b_x, false).length
    }
    
    return (up < down ? up : down) + (left < right ? left : right)
}

function GetSkillPos(text) {
    let d = [text.charAt(), text.substr(1)]
    if (!SkillGapTexts.includes(d[0])) {
        console.log(`GetSkillPos()でエラー\n分類を指定されていません\ntext : ${text}`)
        return null
    }
    if (!["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].includes(d[1])) {
        console.log(`GetSkillPos()でエラー\n種類を指定されていません\ntext : ${text}`)
        return null
    }
    let data = []
    data.push(SkillGapTexts.indexOf(d[0]) * 2 + 1)
    data.push(["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].indexOf(d[1]))
    return data
}

function GetWithinRangeGap(a, b, left = true) {
    // true = aが左, false = bが左
    let data = []
    let gaps = GetGaps()
    let isleft = b - a > 0
    if (left) {
        if (isleft) {
            for (let i = 0; i < (a - b) / 2 + 6; i++) {
                let pos = PositiveModulo(a - i * 2 - 1, 12)
                let gap = GetGapPos(pos)
                if (data.includes(gap)) continue
                if (gaps.includes(gap)) data.push(gap)
            }
        }
        else {
            for (let i = 0; i < (b - a) / 2 + 6; i++) {
                let pos = PositiveModulo(b - i * 2 - 1, 12)
                let gap = GetGapPos(pos)
                if (data.includes(gap)) continue
                if (gaps.includes(gap)) data.push(gap)
            }
        }
    }
    else {
        if (isleft) {
            for (let i = 0; i < (b - a) / 2; i++) {
                let pos = a + i * 2 + 1
                let gap = GetGapPos(pos)
                if (data.includes(gap)) continue
                if (gaps.includes(gap)) data.push(gap)
            }
        }
        else {
            for (let i = 0; i < (a - b) / 2; i++) {
                let pos = b + i * 2 + 1
                let gap = GetGapPos(pos)
                if (data.includes(gap)) continue
                if (gaps.includes(gap)) data.push(gap)
            }
        }
    }
    return data
}

function GetGapPos(x) {
    let i = parseInt(x)
    if (isNaN(i)) {
        console.log(`GetGapPos()でエラー\nxが数字に変換できませんでした\nx : ${x}`)
        return "A"
    }
    return SkillGapTexts[Math.floor(i / 2)]
}

function GetSkills() {
    let skill = []
    for (let [i, elements] of GetSkillElementList().entries()) {
        for (let [j, element] of elements.entries()) {
            if (!$(element).hasClass("selected")) continue
            skill.push(`${SkillGapTexts[i]}${j + 2}`)
        }
    }
    return skill
}

function GetGaps() {
    let gap = []
    for (let [i, element] of document.querySelectorAll(".paragraph#Gap").entries()) {
        let header = element.querySelector(".header")
        if (header == null) continue
        if (!$(header).hasClass("selected")) continue
        gap.push(SkillGapTexts[i])
    }
    return gap
}

function GetSkillElementList(inlist = true) {
    let data = []
    if (inlist) {
        data.push(document.querySelectorAll("#HiddenMove > .data"))
        data.push(document.querySelectorAll("#Technology > .data"))
        data.push(document.querySelectorAll("#Knowledge > .data"))
        data.push(document.querySelectorAll("#Perception > .data"))
        data.push(document.querySelectorAll("#Emotion > .data"))
        data.push(document.querySelectorAll("#History > .data"))
    }
    else {
        $.merge(data, document.querySelectorAll("#HiddenMove > .data"))
        $.merge(data, document.querySelectorAll("#Technology > .data"))
        $.merge(data, document.querySelectorAll("#Knowledge > .data"))
        $.merge(data, document.querySelectorAll("#Perception > .data"))
        $.merge(data, document.querySelectorAll("#Emotion > .data"))
        $.merge(data, document.querySelectorAll("#History > .data"))
    }
    return data
}

function GetSkillElement(pos) {
    let [x, y] = GetSkillPos(pos)
    x -= 1
    x /= 2
    return GetSkillElementList()[x][y]
}

function SelectedValue(id) {
    return $(`#${id} option:selected`).val()
}

function InputValue(id) {
    return $(`#${id}`).val()
}

function InputIntValue(id) {
    let text = $(`#${id}`).val()
    let num = parseInt(text)
    return !isNaN(num) ? num : 0
}

function InputBoolValue(id) {
    return $(`#${id}`).is(":checked")
}

function PositiveModulo(a, b) {
    return ((a % b) + b) % b;
}

class CsutomArray extends Array {
    TryPush(item) {
        if (item == null) return
        if (item == undefined) return
        this.push(item)
    }
    
    Get(a, b) {
        let data = []
        for (let i = b - a; i < b; i++) {
            data.push(this[i])
        }
        return data
    }
}