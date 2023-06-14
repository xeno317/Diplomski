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
    //c = document.getElementById("canvas_original");
    //ctx = c.getContext("2d");
    c_helper=document.getElementById("helperCanvas");
    ctx_helper=c_helper.getContext("2d");
    //ctx.clearRect(0, 0, c.width, c.height);
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
                ctx_helper.clearRect(0, 0, ctx_helper.width, ctx_helper.height);
                for(let i=0;i<image.width;i++){
                    for(let j=0;j<image.height;j++){
                        ctx_helper.fillStyle = `rgb(${data[i][j]},${data[i][j]},${data[i][j]})`;
                        ctx_helper.fillRect(i, j, 1, 1);
                    }
                }
                var image1=ctx_helper.canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
                document.getElementById("starting_image").src=image1;
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
    const worker = new Worker('worker.js');
    c_helper=document.getElementById("helperCanvas");
    ctx_helper=c_helper.getContext("2d");
    document.getElementById("res").innerHTML=image.width+"x"+image.height;
    const start = performance.now();
    document.getElementById("fft_image").src="loading.svg";
    worker.postMessage(data);

    worker.onmessage = function(event) {
        result=event.data;
        const end = performance.now();
        document.getElementById("fft").innerHTML=math.round(end-start,5);
        ctx_helper.clearRect(0, 0, ctx_helper.width, ctx_helper.height);
        for(let i=0;i<image.width;i++){
            for(let j=0;j<image.height;j++){
                ctx_helper.fillStyle = `rgb(${Math.log(Math.abs(result[i][j].re))*15},${Math.log(Math.abs(result[i][j].re))*15},${Math.log(Math.abs(result[i][j].re))*15})`;
                  ctx_helper.fillRect(i, j, 1, 1);
            }
        }
        var image1=ctx_helper.canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
        document.getElementById("fft_image").src=image1;
        worker.terminate();
    };
   
    
}

function reduce_FFT(){
    c_helper=document.getElementById("helperCanvas");
    ctx_helper=c_helper.getContext("2d");
    var slider = document.getElementById("myRange");
    var slider_value=math.abs(slider.value-100);
    var reductiony=(image.width*(slider_value/100))/2;
    var reductionx=(image.height*(slider_value  /100))/2;
    ctx_helper.clearRect(0, 0, ctx_helper.width, ctx_helper.height);
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
            ctx_helper.fillStyle = `rgb(${result[i][j].re},${result[i][j].re},${result[i][j].re})`;
            ctx_helper.fillRect(i, j, 1, 1);
        }
    }
    var image1=ctx_helper.canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
    document.getElementById("reduction_result_image").src=image1;
}

var resultRe;
function invert_FFT(){
    const worker1 = new Worker('workerifft.js');
    c_helper=document.getElementById("helperCanvas");
    ctx_helper=c_helper.getContext("2d");
    const start = performance.now();
    document.getElementById("inverse_fft_image").src="loading.svg";
    worker1.postMessage(result);
    
    worker1.onmessage = function(event) {
        resultRe=event.data;
        const end=performance.now();
        document.getElementById("ifft").innerHTML=math.round(end-start,5);
        ctx_helper.clearRect(0, 0, ctx_helper.width, ctx_helper.height);
        for(let i=0;i<image.width;i++){
            for(let j=0;j<image.height;j++){
                ctx_helper.fillStyle = `rgb(${resultRe[i][j].re},${resultRe[i][j].re},${resultRe[i][j].re})`;
                ctx_helper.fillRect(i, j, 1, 1);
            }
        }
        var image1=ctx_helper.canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
        document.getElementById("inverse_fft_image").src=image1;
        worker1.terminate();
    };
    //var resultRe=math.ifft(result);
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