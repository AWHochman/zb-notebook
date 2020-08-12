Nb.updateBlock = function (code, res, num) {
    let curCode = this.blocks[num].html
    updatedCode = this.updateBlockInput(curCode, code, num)
    updatedCode2 = this.updateBlockRes(updatedCode, res, num)
    return updatedCode2
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
        this.newBlock('')
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

Nb.newBlock = function (content) {
    let curCode = this.joinBlocks()
    let newBlock = newCodeBlock(this.blockId, content)
    $('#main-block').html(curCode + newBlock)
    this.blocks[this.blockId] = {}
    this.blocks[this.blockId].html = newBlock
    this.selectBlock(this.blockId)
    
    this.blockId ++ 
    this.blockSelectedId ++
}

Nb.runBlock = function (num) {
    let blockType = this.blocks[num].type 
    if(blockType == CellTypes.js) {
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
    if (res != undefined) {
        $(`#html-res${num}`).html(res)
    } else {
        $(`#html-res${num}`).html("")
    }
}

Nb.runBlockMd = function (num) {
    let code = $(`#code${num}`).val()
    let md = new Remarkable()
    let res = md.render(code)
    console.log(res)

    this.blocks[num].html = this.updateBlock(code, res, num)
    $(`#html-res${num}`).html(res)
    console.log(5)
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
    return newHtml
}

Nb.runAll = function () {
    if (this.lenBlocks() == 0) {
        return 
    }
    for (i in this.blocks) {
        this.runCell(i)
    }
    let num = this.findLastBlock()
    if (this.getBlockCode(num) != ''){
        this.newBlock('')
    }
}

Nb.runCell = function () {
    if(this.blocks[this.blockSelectedId] == undefined) {
        return 
    }
    this.runBlock(this.blockSelectedId)
    let lastId = this.findLastBlock()
    if (this.getBlockCode(lastId) != ''){
        this.newBlock('')
    }
    this.increaseBlockSelectedId()
    $('#main-block').html(this.joinBlocks())
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

Nb.setCellType = function(cellType) {
    this.blocks[this.blockSelectedId].type = cellType
}