const CellTypes = Object.freeze({"js":1, "md":2, "html":3})

var Nb = {}
Nb.blocks = {}
Nb.blockId = 0
Nb.blockSelectedId = 0 

execute = {
    eval: eval
}

eval = (function(eval) {
    return function(expr) {
      return eval(expr);
    };
  })(eval);

// `<div id="codeblock" class="codediv">
// <pre>
//     <textarea class="inline-block" id="code${num}" contenteditable=true></textarea>
// </pre>
// <h3 class="inline-block res" id="html-res${num}"></h3>
// </div>`

function newCodeBlock(num, curCode) {
    let codeBlock = `<div id="codeblock" class="codediv"><pre><textarea class="inline-block" id="code${num}" contenteditable=true>${curCode}</textarea></pre><h3 class="inline-block res" id="html-res${num}"></h3><div id=md-res${num} class="md-div"></div></div>`

    $(`body`).on('blur', `#code${num}`, function() {
        curCode = Nb.blocks[num].html
        curInput = $(`#code${num}`).val()
        res = $(`#html-res${num}`).html()
        Nb.blocks[num].html = Nb.updateBlock(curInput, res, num) 
        $('#main-block').html(Nb.joinBlocks())

        autosize($('textarea'))
    })

    // $(`body`).on('keypress', `#code${num}`, function(event) {
    //     if (event.which === 13 && event.shiftKey) {
    //         runCell()
    //         autosize($('textarea'))
    //     }
    //   })

    $(`body`).on('click', `#code${num}`, function() {
        Nb.blockSelectedId = num
        autosize($('textarea'))
    })

    $(`body`).on('input', `#code${num}`, function() {
        autosize($('textarea'))
    })

    $(`body`).on('keydown', `#code${num}`, function(event) {
        tabPressed(num, event)
    })

    return codeBlock
}


$(document).ready(function(){

    $('#run-all').click(function() {
        Nb.runAll()
        autosize($('textarea'))
    })

    $('#insert-cell-bottom').click(function() {
        Nb.newBlock('')
        autosize($('textarea'))
    })

    $('#insert-cell-below').click(function() {
        if(Nb.lenBlocks() == 0) {
            Nb.newBlock('')
        } else {
            Nb.newBlockSelected(true)
        }
        autosize($('textarea'))
    })

    $('#insert-cell-above').click(function() {
        if(Nb.lenBlocks() == 0) {
            console.log("EEK")
            Nb.newBlock('')
        } else {
            console.log("OOF")
            Nb.newBlockSelected(false)
        }
        autosize($('textarea'))
    })

    $('#delete-cell').click(function() {
        Nb.blocks[Nb.blockSelectedId] = undefined 
        $('#main-block').html(Nb.joinBlocks())

        if(Nb.topBlock(Nb.blockSelectedId)) {
            Nb.increaseBlockSelectedId()
        } else {
            Nb.decreaseBlockSelectedId()
        }

        Nb.selectBlock(Nb.blockSelectedId)
        autosize($('textarea'))
    })

    $('#run-cell').click(function() {
        Nb.runCell()
        autosize($('textarea'))
    })

    $('#download-notebook').click(function() {
        downloadNotebook()
    })

    $('#open-notebook').change(function(e) {
        let file = e.target.files[0]
        const reader = new FileReader()
        reader.onload = function() {
            let content = reader.result
            loadNotebooks(content)
        }
        reader.readAsText(file)
    })

    $('#cell-type-md').click(function() {
        Nb.setCellType(CellTypes.md)
    })

    $('#cell-type-js').click(function() {
        Nb.setCellType(CellTypes.js)
    })



});
