function downloadNotebook() {
    const a = document.createElement("a")
    const type = "text/plain"

    a.style.display = "none"
    document.body.appendChild(a)

    let data = jsonifyBlocks(BLOCKS)

    a.href = window.URL.createObjectURL(
    new Blob([data], { type })
    );

    a.setAttribute("download", "zbtestfile.zbnb")

    a.click()

    window.URL.revokeObjectURL(a.href)
    document.body.removeChild(a)
}

function jsonifyBlocks() {
    fileData = {}
    jsonBlocks = []
    for(block in BLOCKS) {
        if(BLOCKS[block] != undefined) {
            let content = getBlockContent(BLOCKS[block])
            jsonBlocks.push(content)
        }
    }
    fileData["blocks"] = jsonBlocks
    return JSON.stringify(fileData)
}

function getBlockContent(block) {
    let startText = `contenteditable=true>`
    let entryIndexEnd = block.indexOf("</textarea>")
    let entryIndexStart = block.indexOf(startText)
    let startLen = startText.length
    let curCode = block.slice(entryIndexStart+startLen, entryIndexEnd)
    return curCode
}

function loadNotebooks(content) {
    let fileData = JSON.parse(content)
    content = fileData["blocks"]
    BLOCKID = 0
    for(i in content) {
        newBlock(content[i])
    }
    autosize($('textarea'))
}