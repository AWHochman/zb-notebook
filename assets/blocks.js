function updateBlock(curCode, code, res, num) {
    updatedCode = updateBlockInput(curCode, code, num)
    updatedCode2 = updateBlockRes(updatedCode, res, num)
    return updatedCode2
}

function updateBlockInput(curCode, code, num) {
    let startText = `<textarea class="inline-block" id="code${num}" contenteditable=true>`
    let entryIndexEnd = curCode.indexOf("</textarea>")
    let entryIndexStart = curCode.indexOf(startText)
    let startLen = startText.length
    var newEntry = curCode.slice(0, entryIndexStart+startLen) + code + curCode.slice(entryIndexEnd)
    return newEntry
}

function updateBlockRes(curCode, res, num) {
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

function lastBlock(num) {
    for (i=lenBlocks(); i>num; i--) {
        if (BLOCKS[i] != undefined) {
            return false 
        }
    }
    return true
}

function newBlockSelected(below) {
    if(below) {
        newBlockId = BLOCK_SELECTED_ID + 1 
    } else {
        newBlockId = BLOCK_SELECTED_ID
    }

    if (newBlockId == lenBlocks()) {
        newBlock('')
        return 
    }

    shiftBlocksDown(newBlockId)
    let curCode = joinBlocks()
    $('#main-block').html(curCode)
    BLOCKID ++ 
    
    if(below) {
        selectBlock(BLOCK_SELECTED_ID+1)
    } else {
        selectBlock(BLOCK_SELECTED_ID)
    }
}

function newBlock(content) {
    let curCode = joinBlocks()
    let newBlock = newCodeBlock(BLOCKID, content)
    $('#main-block').html(curCode + newBlock)
    BLOCKS[BLOCKID] = newBlock
    BLOCKID ++
}

function runBlock(num) {
    let code = $(`#code${num}`).val();
    let res = execute.eval(code)

    let curCode = BLOCKS[num]
    BLOCKS[num] = updateBlock(curCode, code, res, num)
    if (res != undefined) {
        $(`#html-res${num}`).html(res)
    } else {
        $(`#html-res${num}`).html("")
    }
}

function findLastBlock() {
    for (i=lenBlocks(); i>=0; i--) {
        if (BLOCKS[i] != undefined) {
            return i
        }
    }
}

function getBlockCode(num) {
    let curCode = BLOCKS[num]
    let startText = `<textarea class="inline-block" id="code${num}" contenteditable=true>`
    let entryIndexEnd = curCode.indexOf("</textarea>")
    let entryIndexStart = curCode.indexOf(startText)
    let startLen = startText.length
    var curInput = curCode.slice(entryIndexStart+startLen, entryIndexEnd)
    return curInput
}

function listBlocks() {
    let res = []
    for (k in BLOCKS) {
        res.push(BLOCKS[k])
    }
    return res
}

function joinBlocks() {
    let res = listBlocks()
    return res.join('')
}

function lenBlocks() {
    let size = 0 
    for (key in BLOCKS) {
        if (BLOCKS.hasOwnProperty(key)) size++;
    }
    return size
}

function shiftBlocksDown(newBlockId) {
    newBlocks = {}
    for (i=0; i < lenBlocks(); i++) {
        if (i < newBlockId) {
            newBlocks[i] = BLOCKS[i]

        } else if (i == newBlockId) {
            newBlocks[i] = newCodeBlock(newBlockId, '')
            increasedBlock = increaseBlock(BLOCKS[i], i)
            newBlocks[i+1] = increasedBlock

        } else {
            increasedBlock = increaseBlock(BLOCKS[i], i)
            newBlocks[i+1] = increasedBlock
        }
    }
    BLOCKS = newBlocks
}

function increaseBlock(html, num) {  
    let newHtml = html.replace(`<textarea class="inline-block" id="code${num}" contenteditable=true>`, `<textarea class="inline-block" id="code${num+1}" contenteditable=true>`)
    newHtml = newHtml.replace(`<h3 class="inline-block res" id="html-res${num}">`, `<h3 class="inline-block res" id="html-res${num+1}">`)
    return newHtml
}

function runAll() {
    if (lenBlocks() == 0) {
        return 
    }
    for (i in BLOCKS) {
        if (BLOCKS[i] != undefined) {
            runCell(i)
        }
    }
    let num = findLastBlock()
    if (getBlockCode(num) != ''){
        newBlock('')
    }
}

function runCell() {
    runBlock(BLOCK_SELECTED_ID)
    let lastId = findLastBlock()
    if (getBlockCode(lastId) != ''){
        newBlock('')
    }
    increaseBlockSelectedId(BLOCK_SELECTED_ID)
    $('#main-block').html(joinBlocks())
    selectBlock(BLOCK_SELECTED_ID)
}

function selectBlock(blockId) {
    $(`#code${blockId}`).select()
}

function topBlock(num) {
    for (i=0; i<num; i++) {
        if (BLOCKS[i] != undefined) {
            return false 
        }
    }
    return true 
}

function increaseBlockSelectedId(curId) {
    for (i=curId+1; i < lenBlocks(); i++) {
        if (BLOCKS[i] != undefined) {
            BLOCK_SELECTED_ID = i
            return 
        }
    }
}

function decreaseBlockSelectedId(curId) {
    for (i=curId-1; i >= 0; i--) {
        if (BLOCKS[i] != undefined) {
            BLOCK_SELECTED_ID = i 
            return 
        }
    }
}