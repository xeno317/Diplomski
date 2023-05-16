window.addEventListener("DOMContentLoaded", (event) => {
    const el=document.getElementById('file');
    if(el){
        el.addEventListener('change',handleFileSelect, false);
    }
});

var format="png";

function handleFileSelect(evt) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var files = evt.target.files;
    var selFile = files[0];
    var type=selFile.name.split('.').pop();
    var reader = new FileReader();
    if(type!="pgm"){
        var image=new Image();
        image.onload=function(){
            ctx.canvas.width=image.width;
            ctx.canvas.height=image.height
            ctx.drawImage(image,10,10);
        }
        image.src=URL.createObjectURL(evt.target.files[0]);
    }
    else{
 
    reader.readAsText(selFile);

    reader.onload = function() {
    var result=reader.result.split('\n');

    var data=[];
    for(let i=3;i<result.length-4;i++){
        data.push(result[i+3]);
        data.push(result[i+3]);
        data.push(result[i+3]);
        data.push(255);
    }
    var data1=new Uint8ClampedArray(data);
    var dimensions=result[2].split(" ");
    ctx.canvas.width=dimensions[0];
    ctx.canvas.height=dimensions[1];
    const imageData=ctx.createImageData(dimensions[0],dimensions[1]);
    imageData.data.set(data1);
    ctx.putImageData(imageData,10,10);

    var image=ctx.canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
    image.download=image.png;
    }; 
    }
   
    reader.onerror = function() {
    console.log(reader.error);
    };
}
function download(){
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var anchor=document.createElement("a");
    anchor.href=ctx.canvas.toDataURL("image/"+format);
    anchor.download = "IMAGE."+format;
    anchor.click();
}

function setFormat(value){
    format=value
}
