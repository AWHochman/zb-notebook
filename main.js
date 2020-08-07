var BLOCKID = 0 
var BLOCKS = []
 
execute = {
    eval: eval
}

eval = (function(eval) {
    return function(expr) {
      return eval(expr);
    };
  })(eval);


function newCodeBlock(num) {
    let codeBlock = 
    `<div id="codeblock">
        <pre>
            <p class="inline-block" style="margin: 1px"><a href="#" id="run-code${num}">Run</a></p>
            <textarea class="inline-block" id="code${num}" contenteditable=true></textarea>
            <h4 class="inline-block" id="delete-code${num}"><a href="#">Delete</a></h4>
            <h3 class="inline-block res" id="html-res${num}"><h3>
        </pre>
    </div>`
    
    $('body').on('click', `#run-code${num}`, function() {
        let code = $(`#code${num}`).val();
        let res = execute.eval(code)

        let curCode = BLOCKS[num]
        BLOCKS[num] = updateBlock(curCode, code, res, num)
        if (res != undefined) {

            $(`#html-res${num}`).html(res)
        } else {
            $(`#html-res${num}`).html("")
        }
    })

    $('body').on('click', `#delete-code${num}`, function() {
        for (i in BLOCKS) {
            if (i == num) {
                BLOCKS[i] = ''
            }
        }        
        $('#main-block').html(BLOCKS.join(''))
    })
    BLOCKS.push(codeBlock)
    return codeBlock
}



$(document).ready(function(){
    $('#new-block').click(function() {
        let curCode = BLOCKS.join('')
        $('#main-block').html(curCode + newCodeBlock(BLOCKID))
        BLOCKID ++
    })
});


function updateBlock(curCode, code, res, num) {
    updatedCode = updateBlockInput(curCode, code)
    updatedCode2 = updateBlockRes(updatedCode, res, num)
    return updatedCode2
}

function updateBlockInput(curCode, code) {
    let startText = "contenteditable=true>"
    let entryIndexEnd = curCode.indexOf("</textarea>")
    let entryIndexStart = curCode.indexOf(startText)
    let startLen = startText.length
    var newEntry = curCode.slice(0, entryIndexStart+startLen) + code + curCode.slice(entryIndexEnd)
    return newEntry
}

function updateBlockRes(curCode, res, num) {
    if (res != undefined) {
        let startText = `<h3 class="inline-block res" id="html-res${num}">`
        let entryIndexEnd = curCode.indexOf("<h3>")
        let entryIndexStart = curCode.indexOf(startText)
        let startLen = startText.length
        var newEntry = curCode.slice(0, entryIndexStart+startLen) + res + curCode.slice(entryIndexEnd)
        return newEntry
    }
    return curCode
}