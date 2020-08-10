var BLOCKID = 0 
var BLOCKS = {}
var BLOCK_SELECTED_ID = 0
 
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
//     <h3 class="inline-block res" id="html-res${num}"><h3>
// </pre>
// </div>`

function newCodeBlock(num) {
    let codeBlock = `<div id="codeblock" class="codediv"><pre><textarea class="inline-block" id="code${num}" contenteditable=true></textarea><h3 class="inline-block res" id="html-res${num}"><h3></pre></div>`

    $(`body`).on('blur', `#code${num}`, function() {
        curCode = BLOCKS[num]
        curInput = $(`#code${num}`).val()
        res = $(`#html-res${num}`).html()
        BLOCKS[num] = updateBlock(curCode, curInput, res, num) 
        $('#main-block').html(joinBlocks())

        autosize($('textarea'))
    })

    // $(`body`).on('keypress', `#code${num}`, function(event) {
    //     if (event.which === 13 && event.shiftKey) {
    //         runCell()
    //         autosize($('textarea'))
    //     }
    //   })

    $(`body`).on('click', `#code${num}`, function() {
        BLOCK_SELECTED_ID = num
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
        runAll()
        autosize($('textarea'))
    })

    $('#insert-cell-bottom').click(function() {
        newBlock()
        autosize($('textarea'))
    })

    $('#insert-cell-below').click(function() {
        newBlockSelected(true)
        autosize($('textarea'))
    })

    $('#insert-cell-above').click(function() {
        newBlockSelected(false)
        autosize($('textarea'))
    })

    $('#delete-cell').click(function() {
        BLOCKS[BLOCK_SELECTED_ID] = undefined 
        $('#main-block').html(joinBlocks())
        if(topBlock(BLOCK_SELECTED_ID)) {
            increaseBlockSelectedId(BLOCK_SELECTED_ID)
            console.log(1)
        } else {
            decreaseBlockSelectedId(BLOCK_SELECTED_ID)
        }
        selectBlock(BLOCK_SELECTED_ID)
        autosize($('textarea'))
    })

    $('#run-cell').click(function() {
        runCell()
        autosize($('textarea'))
    })

});
