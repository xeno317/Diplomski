window.addEventListener("DOMContentLoaded", (event) => {
    const el=document.getElementById('file');
    if(el){
        el.addEventListener('change',handleFileSelect, false);
    }
});

function handleFileSelect(evt) {

    var files = evt.target.files;

    var selFile = files[0];
    var reader = new FileReader();
    reader.readAsText(selFile);

    reader.onload = function() {
    var result=reader.result.split('\n');
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    counter=4;
    var dimensions=result[2].split(" ");
    ctx.canvas.width=dimensions[0];
    ctx.canvas.height=dimensions[1];

    for(let y=0;y<dimensions[1];y++){
        for(let x=0;x<dimensions[0];x++){
            ctx.fillStyle=`rgb(${result[counter].toString()}, ${result[counter].toString()}, ${result[counter].toString()})`;
            ctx.fillRect(x,y,1,1);
            counter++;
        }
    }
    };  

    reader.onerror = function() {
    console.log(reader.error);
    };
}
