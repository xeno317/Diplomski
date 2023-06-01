window.addEventListener("DOMContentLoaded", (event) => {
    const el=document.getElementById('file');
    if(el){
        el.addEventListener('change',handleFileSelect, false);
    }
});

var mode="greyscale_mode";
var c;
var ctx;
var c_helper;
var ctx_helper;
var canvas2;
var ctx2;
var canvas4;
var ctx4;
var canvas3;
var ctx3;
var image;
var data=[];


function handleFileSelect(evt) {
    c = document.getElementById("canvas_original");
    ctx = c.getContext("2d");
    c_helper=document.getElementById("helperCanvas");
    ctx_helper=c_helper.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx_helper.clearRect(0,0,c_helper.width,c_helper.height);
    if(ctx2!=null){
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    }
    if(ctx3!=null){
        ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
    }
    if(ctx4!=null){
        ctx4.clearRect(0, 0, canvas4.width, canvas4.height);  
        
    }
    var files = evt.target.files;
    var selFile = files[0];
    var type=selFile.name.split('.').pop();
    var reader = new FileReader();
    if(type!="pgm"){
        image=new Image();
        image.onload=function(){
            if(mode=="greyscale_mode"){
                //var scale=Math.min(c.width/image.width,c.height/image.height);
                //var x=(c.width/2)-(image.width/2)*scale;
                //var y=(c.height/2)-(image.height/2)*scale;
                //ctx.drawImage(image,x,y,image.width*scale,image.height*scale);
                c_helper.width=image.width;
                c_helper.height=image.height;
                ctx_helper.drawImage(image,0,0);
                const imageData = ctx_helper.getImageData(0, 0, c_helper.width, c_helper.height);
                const idata = imageData.data;
                var tdata=[];
                for(let i=0;i<image.width;i++){
                    data[i]=[];
                    for(let j=0;j<image.height;j++){
                        data[i][j]=0;
                        tdata[i*image.width+j]=0;      
                    }
                }
                for(let i=0;i<idata.length/4;i++){
                    tdata[i]=idata[i*4+1];
                }
                for(let i=0;i<image.width;i++){
                    for(let j=0;j<image.height;j++){
                        data[i][j]=tdata[j*image.width+i];
                    }
                }
                ctx.clearRect(0, 0, c.width, c.height);
                for(let i=0;i<image.width;i++){
                    for(let j=0;j<image.height;j++){
                        ctx.fillStyle = `rgb(${data[i][j]},${data[i][j]},${data[i][j]})`;
                          ctx.fillRect(i, j, 1, 1);
                    }
                }
            }
            if(mode=="color_mode"){
                //var scale=Math.min(c.width/image.width,c.height/image.height);
                //var x=(c.width/2)-(image.width/2)*scale;
                //var y=(c.height/2)-(image.height/2)*scale;
                c_helper.width=image.width;
                c_helper.height=image.height;
                ctx_helper.drawImage(image,0,0);
                const imageData = ctx_helper.getImageData(0, 0, c_helper.width, c_helper.height);
                const idata = imageData.data;
                var tdata=[];
                for(let i=0;i<image.width;i++){
                    data[i]=[];
                    for(let j=0;j<image.height;j++){
                        data[i][j]=0;
                        tdata[i*image.width+j]=0;      
                    }
                }
                
                tdata=idata;

                for(let i=0;i<image.width;i++){
                    for(let j=0;j<image.height;j++){
                        data[i][j]=tdata[j*image.width+i];
                    }
                }
                console.log(data);
                ctx.clearRect(0, 0, c.width, c.height);
                for(let i=0;i<image.width;i++){
                    for(let j=0;j<image.height;j++){
                        ctx.fillStyle = `rgba(${data[i][j]},${data[i][j+1]},${data[i][j+2]},${data[i][j+3]})`;
                          ctx.fillRect(i, j, 1, 1);
                    }
                }

            }         
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

var result;

function image_FFT(){
    canvas2 = document.getElementById("canvas_fft");
    ctx2 = canvas2.getContext("2d");
    console.log("Resolution:"+image.width+"x"+image.height);
    const start = performance.now();
    result=math.fft(data);
    const end = performance.now();
    console.log(`FFT time: ${end - start} ms`);
    for(let i=0;i<image.width;i++){
        for(let j=0;j<image.height;j++){
            ctx2.fillStyle = `rgb(${Math.log(Math.abs(result[i][j].re))*15},${Math.log(Math.abs(result[i][j].re))*15},${Math.log(Math.abs(result[i][j].re))*15})`;
              ctx2.fillRect(i, j, 1, 1);
        }
    }
}

function reduce_FFT(){
    canvas3 = document.getElementById("canvas_reduction");
    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    ctx3 = canvas3.getContext("2d");
    var reductiony=(image.width*(slider.value/100))/2;
    var reductionx=(image.height*(slider.value/100))/2;
    console.log(reductionx,reductiony);
    for(let i=0;i<image.width;i++){
        for(let j=0;j<image.height;j++){
            if(i>reductiony && i<image.width-reductiony){
                result[i][j].re=0;
                result[i][j].im=0;
            }
            if(j>reductionx && j<image.height-reductionx){
                result[i][j].re=0;
                result[i][j].im=0;
            }
            ctx3.fillStyle = `rgb(${result[i][j].re},${result[i][j].re},${result[i][j].re})`;
            ctx3.fillRect(i, j, 1, 1);
        }
    }
}

function invert_FFT(){
    canvas4 = document.getElementById("canvas_inverse");
    ctx4 = canvas4.getContext("2d");
    const start = performance.now();
    var resultRe=math.ifft(result);
    const end=performance.now();
    console.log(`Inverse FFT time: ${end - start} ms`);
    for(let i=0;i<image.width;i++){
        for(let j=0;j<image.height;j++){
            ctx4.fillStyle = `rgb(${resultRe[i][j].re},${resultRe[i][j].re},${resultRe[i][j].re})`;
            ctx4.fillRect(i, j, 1, 1);
        }
    }
}

function download(){
    var c = document.getElementById("canvas_original");
    var ctx = c.getContext("2d");
    var anchor=document.createElement("a");
    anchor.href=ctx.canvas.toDataURL("image/"+format);
    anchor.download = "IMAGE."+format;
    anchor.click();
}

function setMode(value){
    mode=value
}