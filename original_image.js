window.addEventListener("DOMContentLoaded", (event) => {
    const slider_input=document.getElementById("slider_input");
    const slider=document.getElementById("myRange");

    slider_input.addEventListener('input',function(){
        slider.value=slider_input.value;
    });
    slider.addEventListener('input',function(){
        slider_input.value=slider.value;
    });
    const el=document.getElementById('file');
    if(el){
        el.addEventListener('change',handleFileSelect,false);
    }
    const radioButtons = document.querySelectorAll('input[type="radio"][name="mode"]');
    radioButtons.forEach(radio => {
      radio.addEventListener('click', () => {
        el.value = null;
      });
    });
});

var mode="greyscale_mode";
var type="inverted";
var shape="circle";
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
var result1;
var resultRe;
var modeNow;

function handleFileSelect(evt) {
    if(evt.target.files.length==0){
        alert("Ponovno odaberite sliku!");
        return;
    }
    result1=null;
    resultRe=null;
    data=[];
    c_helper=document.getElementById("helperCanvas");
    ctx_helper=c_helper.getContext("2d",{ willReadFrequently: true });
    ctx_helper.clearRect(0,0,c_helper.width,c_helper.height);
    if(document.getElementById("fft_image").src){
        document.getElementById("fft_image").src='';
    }
    if(document.getElementById("reduction_result_image").src){
        document.getElementById("reduction_result_image").src='';
    }
    if(document.getElementById("inverse_fft_image").src){
        document.getElementById("inverse_fft_image").src='';
    }
    var files = evt.target.files;
    var selFile = files[0];
    var type=selFile.name.split('.').pop();
    var reader = new FileReader();
    if(type!="pgm"){
        image=new Image();
        image.onload=function(){
            if(mode=="greyscale_mode"){
                modeNow="greyscale_mode"
                c_helper.width=image.width;
                c_helper.height=image.height;
                ctx_helper.drawImage(image,0,0);
                document.getElementById("res").innerHTML=image.width+"x"+image.height;
                document.getElementById("fft").innerHTML='';
                document.getElementById("ifft").innerHTML='';
                const imageData = ctx_helper.getImageData(0, 0, c_helper.width, c_helper.height);
                const idata = imageData.data;
                const tdata=new Uint8Array(c_helper.width*c_helper.height);

                for(let i=0;i<idata.length/4;i++){
                    tdata[i]=idata[i*4+1];
                }
                let index=0;
                for(let i=0;i<image.height;i++){
                    const row=[];
                    for(let j=0;j<image.width;j++){
                        if(index<tdata.length){
                            row.push(tdata[index]);
                            index++;
                        }
                        else{
                            row.push(null);                        
                        }
                    }
                    data.push(row);
                }
                let drawData=new Uint8ClampedArray(data.flat());
                let completeDrawData=new Uint8ClampedArray(drawData.length*4);
                let counter=0;
                for(let i=0;i<completeDrawData.length;i+=4){
                    completeDrawData[i]=drawData[counter];
                    completeDrawData[i+1]=drawData[counter];
                    completeDrawData[i+2]=drawData[counter];
                    completeDrawData[i+3]=255;
                    counter++;
                }
                let imageDataNew=ctx_helper.createImageData(c_helper.width,c_helper.height);
                ctx_helper.clearRect(0, 0, image.width, image.height);
                imageDataNew.data.set(completeDrawData);
                ctx_helper.putImageData(imageDataNew,0,0);
                var image1=ctx_helper.canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
                document.getElementById("starting_image").src=image1;
                ctx_helper.clearRect(0, 0, image.width, image.height);
            }
            if(mode=="color_mode"){
                modeNow="color_mode"
                c_helper.width=image.width;
                c_helper.height=image.height;
                document.getElementById("res").innerHTML=image.width+"x"+image.height;
                document.getElementById("fft").innerHTML='';
                document.getElementById("ifft").innerHTML='';
                ctx_helper.drawImage(image,0,0);
                const imageData = ctx_helper.getImageData(0, 0, c_helper.width, c_helper.height);
                const idata = imageData.data;
                let index=0;
                for(let i=0;i<image.height;i++){
                    const row=[];
                    for(let j=0;j<image.width*4;j++){
                        if(index<idata.length){
                            row.push(idata[index]);
                            index++;
                        }
                        else{
                            row.push(null);                        
                        }
                    }
                    data.push(row);
                }
                var image1=ctx_helper.canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
                document.getElementById("starting_image").src=image1;
                ctx_helper.clearRect(0, 0, image.width, image.height);
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
var typeNow=type;
function image_FFT(){
    var fileInput = document.querySelector('.input-file');
    let get=document.getElementById("starting_image");
    let atr=get.getAttribute('src');
    if(atr===null || atr===''){
        fileInput.style.backgroundColor="rgb(255,155,155)";
        fileInput.style.transition="0.2s"
        setTimeout(function() {
            fileInput.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
        }, 100);
        return;
    }
    if(mode!=modeNow){
        alert("Ponovno odabertite sliku!");
        return;
    }
    if(document.getElementById("fft_image").src){
        document.getElementById("fft_image").src='';
    }
    if(document.getElementById("reduction_result_image").src){
        document.getElementById("reduction_result_image").src='';
    }
    if(document.getElementById("inverse_fft_image").src){
        document.getElementById("inverse_fft_image").src='';
    }
    const worker = new Worker('worker.js');
    c_helper=document.getElementById("helperCanvas");
    ctx_helper=c_helper.getContext("2d");
    const start = performance.now();
    document.getElementById("fft_image").src="loading.svg";
    worker.postMessage({data:data,type:type,mode:mode,result:result,typeNow:typeNow});
    typeNow=type;

    worker.onmessage = function(event) {
        result=event.data;
        const end = performance.now();
        document.getElementById("fft").innerHTML=Math.round(end-start,5);
        ctx_helper.clearRect(0, 0, image.width, image.height);
        if(mode=="greyscale_mode"){            
            let drawData = new Array(image.height).map(() => new Array(image.width));
            for (let i = 0; i < image.height; i++) {
                const row = result[i];
                const realPart = row.map((value) => value[0]);
                drawData[i] = realPart;
              }
            drawData=drawData.flat();
            const logValues = drawData.map(val => Math.log(Math.abs(val)) * 15);
            let completeDrawData=new Uint8ClampedArray(drawData.length*4);
            let counter=0;
            for(let i=0;i<completeDrawData.length;i+=4){
                let value=logValues[counter];
                completeDrawData[i]=value;
                completeDrawData[i+1]=value;
                completeDrawData[i+2]=value;
                completeDrawData[i+3]=255;
                counter++;
            }
            let imageDataNew=ctx_helper.createImageData(c_helper.width,c_helper.height);
            ctx_helper.clearRect(0, 0, image.width, image.height);
            imageDataNew.data.set(completeDrawData);
            ctx_helper.putImageData(imageDataNew,0,0);   
        }
        if(mode=="color_mode"){
            let drawDataRed = new Array(image.height).map(() => new Array(image.width));
            let drawDataGreen = new Array(image.height).map(() => new Array(image.width));
            let drawDataBlue = new Array(image.height).map(() => new Array(image.width));
            for (let i = 0; i < image.height; i++) {
                const rowRed = result.fftResultArrayRed[i];
                const realPartRed = rowRed.map((value) => value[0]);
                const rowGreen = result.fftResultArrayGreen[i];
                const realPartGreen = rowGreen.map((value) => value[0]);
                const rowBlue = result.fftResultArrayBlue[i];
                const realPartBlue = rowBlue.map((value) => value[0]);
                drawDataRed[i] = realPartRed;
                drawDataGreen[i] = realPartGreen;
                drawDataBlue[i] = realPartBlue;
              }
            drawDataRed=drawDataRed.flat();
            drawDataGreen=drawDataGreen.flat();
            drawDataBlue=drawDataBlue.flat();
            const logValuesRed = drawDataRed.map(val => Math.log(Math.abs(val)) * 15);
            const logValuesGreen = drawDataGreen.map(val => Math.log(Math.abs(val)) * 15);
            const logValuesBlue = drawDataBlue.map(val => Math.log(Math.abs(val)) * 15);
            let completeDrawData=new Uint8ClampedArray(drawDataRed.length*4);
            let counter=0;
            for(let i=0;i<completeDrawData.length;i+=4){
                let valueRed=logValuesRed[counter];
                let valueGreen=logValuesGreen[counter];
                let valueBlue=logValuesBlue[counter];
                completeDrawData[i]=valueRed;
                completeDrawData[i+1]=valueGreen;
                completeDrawData[i+2]=valueBlue;
                completeDrawData[i+3]=255;
                counter++;
            }
            let imageDataNew=ctx_helper.createImageData(c_helper.width,c_helper.height);
            ctx_helper.clearRect(0, 0, image.width, image.height);
            imageDataNew.data.set(completeDrawData);
            ctx_helper.putImageData(imageDataNew,0,0);

        }
        var image1=ctx_helper.canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
        document.getElementById("fft_image").src=image1;
        worker.terminate();
    };
   
    
}
function reduce_FFT(){
    result1=null;
    let get=document.getElementById("starting_image");
    let atr=get.getAttribute('src');
    let getFFT=document.getElementById("fft_image");
    let atrFFT=getFFT.getAttribute('src');
    if(atr===null || atr===''){
        alert("Početna slika nije odabrana!");
        return;
    }
    if(atrFFT===null || atrFFT===''){
        alert("FFT nije proveden!");
        return;
    }
    if(mode!=modeNow){
        alert("Ponovno odabertite sliku!");
        return;
    }
    document.getElementById("ifft").innerHTML='';
    if(document.getElementById("reduction_result_image").src){
        document.getElementById("reduction_result_image").src='';
    }
    if(document.getElementById("inverse_fft_image").src){
        document.getElementById("inverse_fft_image").src='';
    }
    var c_helper=document.getElementById("helperCanvas");
    var ctx_helper=c_helper.getContext("2d");
    var slider = document.getElementById("myRange");
    var slider_value=Math.abs(slider.value-100);
    var reductiony=(image.height*(slider_value/100))/2;
    var reductionx=(image.width*(slider_value/100))/2;
    ctx_helper.clearRect(0, 0, image.width, image.height);
    if(mode=="greyscale_mode"){
        result1=copyArray(result);
    }
    if(mode=="color_mode"){  
        result1=JSON.parse(JSON.stringify(result));
    }
    var selected_filter = document.getElementById("filter");
    var text = selected_filter.options[selected_filter.selectedIndex].value;
    if(type=="standard"){
        if(shape=="circle"){
            switch(text){
                case 'low_pass':
                    result1=low_pass_circle_standard(result1,image.width,image.height,ctx_helper,slider_value,mode);
                    break;
                case 'high_pass':
                    result1=high_pass_circle_standard(result1,image.width,image.height,ctx_helper,slider_value,mode);
                    break;
            }
        }
        if(shape=="rect"){
            switch(text){
                case 'low_pass':
                    result1=low_pass(result1,image.width,image.height,ctx_helper,reductionx,reductiony,mode);
                    break;
                case 'high_pass':
                    result1=high_pass(result1,image.width,image.height,ctx_helper,slider_value,mode);
                    break;
            }
        }
    }
    if(type=="inverted"){
        if(shape=="circle"){
            switch(text){
                case 'low_pass':
                    result1=low_pass_circle(result1,image.width,image.height,ctx_helper,slider_value,mode);
                    break;
                case 'high_pass':
                    result1=high_pass_circle(result1,image.width,image.height,ctx_helper,slider_value,mode);
                    break;
                case 'sharpen':
                    result1=sharpen(result1,image.width,image.height,ctx_helper,slider_value,mode);
                    break;
                case 'gauss_low_pass':
                    result1=gaussLowPass(result1,ctx_helper,slider_value,mode);
                    break;
                case 'gauss_high_pass':
                    result1=gaussHighPass(result1,ctx_helper,slider_value,mode);
                    break;
            }
        }
        if(shape=="rect"){
            switch(text){
                case 'low_pass':
                    result1=low_pass_inverted(result1,image.width,image.height,ctx_helper,slider_value,mode);
                    break;
                case 'high_pass':
                    result1=high_pass_inverted(result1,image.width,image.height,ctx_helper,reductionx,reductiony,mode);
                    break;
                case 'sharpen':
                    result1=sharpen(result1,image.width,image.height,ctx_helper,slider_value,mode);
                    break;
                case 'gauss_low_pass':
                    result1=gaussLowPass(result1,ctx_helper,slider_value,mode);
                    break;
                case 'gauss_high_pass':
                    result1=gaussHighPass(result1,ctx_helper,slider_value,mode);
                    break;
            }
        }
    }  
    

    var image1=ctx_helper.canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
    document.getElementById("reduction_result_image").src=image1;

}

function invert_FFT(){
    let get=document.getElementById("starting_image");
    let atr=get.getAttribute('src');
    let getFFT=document.getElementById("fft_image");
    let atrFFT=getFFT.getAttribute('src');
    let getRed=document.getElementById("reduction_result_image");
    let atrRed=getRed.getAttribute('src');
    if(atr===null || atr===''){
        alert("Početna slika nije odabrana!");
        return;
    }
    if(atrFFT===null || atrFFT===''){
        alert("FFT nije proveden!");
        return;
    }
    if(atrRed===null || atrRed===''){
        alert("Filtar nije primjenjen!");
        return;
    }
    if(mode!=modeNow){
        alert("Ponovno odabertite sliku!");
        return;
    }
    const worker1 = new Worker('workerifft.js');
    c_helper=document.getElementById("helperCanvas");
    ctx_helper=c_helper.getContext("2d");
    const start = performance.now();
    document.getElementById("inverse_fft_image").src="loading.svg";
    worker1.postMessage({data:result1,mode:mode,type:type});
    
    worker1.onmessage = function(event) {
        resultRe=event.data;
        const end=performance.now();
        document.getElementById("ifft").innerHTML=Math.round(end-start,5);
        ctx_helper.clearRect(0, 0, image.height, image.width);
        if(mode=="greyscale_mode"){
            let drawData = new Array(image.height).fill(0).map(() => new Array(image.width).fill(0));
            for (let i = 0; i < image.height; i++) {
                const row = resultRe[i];
                const realPart = row.map((value) => value[0]);
                drawData[i] = realPart;
              }
            drawData=drawData.flat();
            let completeDrawData=new Uint8ClampedArray(drawData.length*4);
            let counter=0;
            for(let i=0;i<completeDrawData.length;i+=4){
                completeDrawData[i]=drawData[counter];
                completeDrawData[i+1]=drawData[counter];
                completeDrawData[i+2]=drawData[counter];
                completeDrawData[i+3]=255;
                counter++;
            }
            let imageDataNew=ctx_helper.createImageData(c_helper.width,c_helper.height);
            ctx_helper.clearRect(0, 0, image.width, image.height);
            imageDataNew.data.set(completeDrawData);
            ctx_helper.putImageData(imageDataNew,0,0);
        }
        if(mode=="color_mode"){
            let drawDataRed = new Array(image.height).map(() => new Array(image.width));
            let drawDataGreen = new Array(image.height).map(() => new Array(image.width));
            let drawDataBlue = new Array(image.height).map(() => new Array(image.width));
            for (let i = 0; i < image.height; i++) {
                const rowRed = resultRe.inverseFFTArrayRed[i];
                const realPartRed = rowRed.map((value) => value[0]);
                const rowGreen = resultRe.inverseFFTArrayGreen[i];
                const realPartGreen = rowGreen.map((value) => value[0]);
                const rowBlue = resultRe.inverseFFTArrayBlue[i];
                const realPartBlue = rowBlue.map((value) => value[0]);
                drawDataRed[i] = realPartRed;
                drawDataGreen[i] = realPartGreen;
                drawDataBlue[i] = realPartBlue;
              }
            drawDataRed=drawDataRed.flat();
            drawDataGreen=drawDataGreen.flat();
            drawDataBlue=drawDataBlue.flat();
            let completeDrawData=new Uint8ClampedArray(drawDataRed.length*4);
            let counter=0;
            for(let i=0;i<completeDrawData.length;i+=4){
                completeDrawData[i]=drawDataRed[counter];
                completeDrawData[i+1]=drawDataGreen[counter];
                completeDrawData[i+2]=drawDataBlue[counter];
                completeDrawData[i+3]=255;
                counter++;
            }
            let imageDataNew=ctx_helper.createImageData(c_helper.width,c_helper.height);
            ctx_helper.clearRect(0, 0, image.width, image.height);
            imageDataNew.data.set(completeDrawData);
            ctx_helper.putImageData(imageDataNew,0,0);
        }
        var image1=ctx_helper.canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
        document.getElementById("inverse_fft_image").src=image1;
        worker1.terminate();
    };
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
    mode=value;

}
function setType(value){
    const filters=document.getElementById("filter");
    const hide1=filters.querySelector("option[value='sharpen");
    const hide2=filters.querySelector("option[value='gauss_low_pass");
    const hide3=filters.querySelector("option[value='gauss_high_pass");
    type=value;
    if(value=="standard"){ 
        hide1.style.display="none";
        hide2.style.display="none";
        hide3.style.display="none";
        image_FFT();
    }
    if(value=="inverted"){
        hide1.style.display="block";
        hide2.style.display="block";
        hide3.style.display="block";
        image_FFT();
    }
}
function setShape(value){
    shape=value
}
function copyArray(array) {
    if (!Array.isArray(array)) {
      return array;
    }
  
    const copiedArray = JSON.parse(JSON.stringify(array));
    return copiedArray;
}