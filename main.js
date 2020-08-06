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
    `<div id=\"codeblock\">
        <pre>
            <p class=\"inline-block\" style=\"margin: 1px\"><a href=\"#\" id=\"run-code${num}\">Run</a></p>
            <textarea class=\"inline-block\" id=\"code${num}\" contenteditable=true></textarea>
            <h4 class=\"inline-block\" id=\"delete-code${num}\"><a href=\"#\">Delete</a></h4>
        </pre>
    </div>`
    
    $('body').on('click', `#run-code${num}`, function() {
        let code = $(`#code${num}`).val();
        let res = execute.eval(code)
        if (res != undefined) {
            console.log(res)
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
        let curCode = $('#main-block').html()
        $('#main-block').html(curCode + newCodeBlock(BLOCKID))
        BLOCKID ++
    })
});

