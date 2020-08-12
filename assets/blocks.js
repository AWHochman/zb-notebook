Nb.updateBlock = function (code, res, num) {
    let curCode = this.blocks[num].html
    updatedCode = this.updateBlockInput(curCode, code, num)
    updatedCode2 = this.updateBlockRes(updatedCode, res, num)
    return updatedCode2
}

Nb.updateBlockMd = function (code, res, num) {
    let curCode = this.blocks[num].html 
    updatedCode = this.updateBlockInput(curCode, code, num)
    updatedCode2 = this.updateBlockResMd(updatedCode, res, num)
    return updatedCode2
}

Nb.updateBlockResMd = function (curCode, res, num) {
    if (res != undefined) {
        let startText = `<div id=md-res${num} class="md-div">`
        let entryIndexEnd = curCode.indexOf("</div>")
        let entryIndexStart = curCode.indexOf(startText)
        let startLen = startText.length
        var newEntry = curCode.slice(0, entryIndexStart+startLen) + res + curCode.slice(entryIndexEnd)
        return newEntry
    }
    return curCode
}

Nb.updateBlockInput = function (curCode, code, num) {
    let startText = `<textarea class="inline-block" id="code${num}" contenteditable=true>`
    let entryIndexEnd = curCode.indexOf("</textarea>")
    let entryIndexStart = curCode.indexOf(startText)
    let startLen = startText.length
    var newEntry = curCode.slice(0, entryIndexStart+startLen) + code + curCode.slice(entryIndexEnd)
    return newEntry
}

Nb.updateBlockRes = function (curCode, res, num) {
    if (res != undefined) {
        let startText = `<h3 class="inline-block res" id="html-res${num}">`
        let entryIndexEnd = curCode.indexOf("</h3>")
        let entryIndexStart = curCode.indexOf(startText)
        let startLen = startText.length
        var newEntry = curCode.slice(0, entryIndexStart+startLen) + res + curCode.slice(entryIndexEnd)
        return newEntry
    }
    return curCode
}

Nb.lastBlock = function (num) {
    for (i=this.lenBlocks(); i>num; i--) {
        if (Nb.blocks[i] != undefined) {
            return false 
        }
    }
    return true
}

Nb.newBlockSelected = function (below) {

    if(below) {
        newBlockId = this.blockSelectedId 
    } else {
        newBlockId = this.blockSelectedId - 1
    }

    if (newBlockId == this.lenBlocks()) {
        this.newBlock('', CellTypes.js)
        return 
    }
    
    this.shiftBlocksDown(newBlockId)
    let curCode = this.joinBlocks()
    $('#main-block').html(curCode)
    this.blockId ++ 
    
    if(below) {
        this.blockSelectedId ++ 
        this.selectBlock(this.blockSelectedId)
    } else {
        this.selectBlock(this.blockSelectedId)
    }
}

Nb.newBlock = function (content, blockType) {
    let curCode = this.joinBlocks()
    let newBlock = newCodeBlock(this.blockId, content)

    $('#main-block').html(curCode + newBlock)

    this.blocks[this.blockId] = {}
    this.blocks[this.blockId].html = newBlock
    this.setCellType(blockType, false)
    
    this.selectBlock(this.blockId)

    this.updatePage()

    if (this.blockId != 0) {
        this.blockSelectedId ++
    }

    this.blockId ++ 
}

Nb.runBlock = function (num) {
    let blockType = this.blocks[num].type 
    if(blockType == CellTypes.js || blockType == undefined) {
        this.runBlockJs(num)
    } else if (blockType == CellTypes.md) {
        this.runBlockMd(num)
    }
}

Nb.runBlockJs = function (num) {
    let res = undefined 
    let code = $(`#code${num}`).val()

    try {
        res = execute.eval(code)
      }
      catch(error) {
        res = error 
      }
    
    this.blocks[num].html = this.updateBlock(code, res, num)
    // if (res != undefined) {
    //     $(`#html-res${num}`).html(res)
    // } else {
    //     $(`#html-res${num}`).html("")
    // }
}

Nb.runBlockMd = function (num) {
    let code = $(`#code${num}`).val()
    let md = new Remarkable()
    let res = md.render(code)

    this.blocks[num].md = res
    this.blocks[num].html = this.updateBlockMd(code, res, num)
    // $(`#html-res${num}`).html(res)
}

Nb.findLastBlock = function () {
    for (i=this.lenBlocks(); i>=0; i--) {
        if (this.blocks[i] != undefined) {
            return i
        }
    }
}

Nb.getBlockCode = function (num) {
    let curCode = this.blocks[num].html
    let startText = `<textarea class="inline-block" id="code${num}" contenteditable=true>`
    let entryIndexEnd = curCode.indexOf("</textarea>")
    let entryIndexStart = curCode.indexOf(startText)
    let startLen = startText.length
    var curInput = curCode.slice(entryIndexStart+startLen, entryIndexEnd)
    return curInput
}

Nb.listBlocks = function () {
    let res = []
    for (k in this.blocks) {
        if (this.blocks[k] != undefined) {
            res.push(this.blocks[k].html)
        }
    }
    return res
}

Nb.joinBlocks = function () {
    let res = this.listBlocks()
    return res.join('')
}

Nb.lenBlocks = function () {
    let size = 0 
    for (key in this.blocks) {
        if (this.blocks.hasOwnProperty(key)) size++;
    }
    return size
}

Nb.shiftBlocksDown = function (newBlockId) {
    newBlocks = {}
    for (i=0; i < this.lenBlocks(); i++) {
        if (i < newBlockId) {
            newBlocks[i] = this.blocks[i]
        
        } else if (i == newBlockId) {
            newBlocks[i] = {}
            newBlocks[i].html = newCodeBlock(newBlockId, '')
            
            increasedBlock = this.increaseBlock(this.blocks[i].html, i)
            newBlocks[i+1] = {}
            newBlocks[i+1].html = increasedBlock

        } else {
            increasedBlock = this.increaseBlock(this.blocks[i].html, i)
            newBlocks[i+1] = {}
            newBlocks[i+1].html = increasedBlock
        }
    }
    this.blocks = newBlocks
}

Nb.increaseBlock = function (html, num) {  
    let newHtml = html.replace(`<textarea class="inline-block" id="code${num}" contenteditable=true>`, `<textarea class="inline-block" id="code${num+1}" contenteditable=true>`)
    newHtml = newHtml.replace(`<h3 class="inline-block res" id="html-res${num}">`, `<h3 class="inline-block res" id="html-res${num+1}">`)
    newHtml = newHtml.replace(`<div id=md-res${num} class="md-div">`, `<div id=md-res${num+1} class="md-div">`)
    newHtml = newHtml.replace(`<p id="cell-type${num}">`, `<p id="cell-type${num+1}">`)
    return newHtml
}

Nb.runAll = function () {
    if (this.lenBlocks() == 0) {
        return 
    }
    for (i in this.blocks) {
        this.runCellAllVersion(i)
    }
    let num = this.findLastBlock()
    if (this.getBlockCode(num) != ''){
        this.newBlock('', CellTypes.js)
    }
}

Nb.runCellAllVersion = function (num) {
    if (this.blocks[num] == undefined) {
        return 
    }
    this.runBlock(num)
    let lastId = this.findLastBlock()
    if (this.getBlockCode(lastId) != '') {
        this.newBlock('', CellType.js)
    }
    this.updatePage()
}

Nb.runCell = function () {
    if(this.blocks[this.blockSelectedId] == undefined) {
        return 
    }
    this.runBlock(this.blockSelectedId)
    let lastId = this.findLastBlock()
    if (this.getBlockCode(lastId) != ''){
        this.newBlock('', CellTypes.js)
    }
    this.increaseBlockSelectedId()
    this.updatePage()
    this.selectBlock(this.blockSelectedId)
}

Nb.selectBlock = function (blockId) {
    $(`#code${blockId}`).select()
}

Nb.topBlock = function (num) {
    for (i=0; i<num; i++) {
        if (this.blocks[i] != undefined) {
            return false 
        }
    }
    return true 
}

Nb.increaseBlockSelectedId = function () {
    let curId = this.blockSelectedId
    for (i=curId+1; i < this.lenBlocks(); i++) {
        if (this.blocks[i] != undefined) {
            this.blockSelectedId = i
            return 
        }
    }
}

Nb.decreaseBlockSelectedId = function () {
    let curId = this.blockSelectedId
    for (i=curId-1; i >= 0; i--) {
        if (this.blocks[i] != undefined) {
            this.blockSelectedId = i 
            return 
        }
    }
}

Nb.setCellType = function(cellType, clearContents) {
    let blockId = this.blockSelectedId

    if (!clearContents) {
        blockId = this.blockId
    }

    this.setBlockTypeIcon(cellType, blockId, clearContents)
    this.blocks[blockId].type = cellType

    this.updatePage()
    autosize($('textarea'))
}  

Nb.setBlockTypeIcon = function(cellType, blockId, clearContents) {
    let block = this.blocks[blockId]
    let cellHtml = block.html 

    let curCellType = this.parseCellTypes(block.type)
    let newCellType = this.parseCellTypes(cellType)

    let ogIcon = `<p id="cell-type${blockId}">${curCellType}<p>`
    let replacementIcon = `<p id="cell-type${blockId}">${newCellType}<p>`

    let updatedCellHtml = cellHtml.replace(ogIcon, replacementIcon)

    block.html = updatedCellHtml

    if (clearContents) {
        block.html = this.clearBlockContents(blockId)
    }
}

Nb.parseCellTypes = function (cellType) {
    if (cellType == CellTypes.js || cellType == undefined) {
        return "js"
    } else if (cellType == CellTypes.md) {
        return "md"
    } else if (cellType == CellTypes.html) {
        return "html"
    }
}

Nb.clearBlockContents = function (blockId) {
    return this.updateBlock('', '', blockId)
}

Nb.updatePage = function () {
    $('#main-block').html(this.joinBlocks())
}

Nb.runMarkDownBlocks = function () {
    if (this.lenBlocks() == 0) {
        return 
    }
    for (i in this.blocks) {
        if (this.blocks[i].type == CellTypes.md) {
            this.runCellAllVersion(i)
        }
    }
}