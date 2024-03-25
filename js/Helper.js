class CsutomArray extends Array {
    TryPush(item) {
        if (item == null) return
        if (item == undefined) return
        this.push(item)
    }
    
    Get(a, b) {
        let data = []
        for (let i in Array.from({ length: b - a + 1 }, (_, i) => i + a)) {
            data.push(this[i])
        }
        return data
    }
}

function MinMax(valse, min, max) {
    return Math.max(Math.min(valse, max), min)
}

function Random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
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