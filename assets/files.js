function downloadNotebook() {
    const a = document.createElement("a")
    const type = "text/plain"

    a.style.display = "none"
    document.body.appendChild(a)

    let data = jsonifyBlocks(Nb.blocks)
    let name = $('#notebook-name').html()

    a.href = window.URL.createObjectURL(
    new Blob([data], { type })
    );

    a.setAttribute("download", `${name}.zbnb`)

    a.click()

    window.URL.revokeObjectURL(a.href)
    document.body.removeChild(a)
}

function jsonifyBlocks() {
    fileData = {}
    jsonBlocks = []
    for(block in Nb.blocks) {
        if(Nb.blocks[block] != undefined) {
            let content = getBlockContent(Nb.blocks[block].html)
            let curBlock = {}
            curBlock.html = content 
            curBlock.type = Nb.blocks[block].type
            jsonBlocks.push(curBlock)
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
    let blocks = fileData["blocks"]
    Nb.blockId = 0
    for(i in blocks) {
        Nb.newBlock(blocks[i].html, blocks[i].type)
    }
    autosize($('textarea'))
}