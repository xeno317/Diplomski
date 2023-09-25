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
var typeNow=type;
var shape="circle";
var c_helper;
var ctx_helper;
var image;
var data=[];
var result1;
var resultRe;
var modeNow;
var result;
var originalHeight;
var originalWidth;

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

    if(document.getElementById("fft_image").src){
        document.getElementById("fft_image").src='';
    }
    if(document.getElementById("reduction_result_image").src){
        document.getElementById("reduction_result_image").src='';
    }
    if(document.getElementById("inverse_fft_image").src){
        document.getElementById("inverse_fft_image").src='';
    }

    var reader = new FileReader();
    image=new Image();
    image.onload=function(){
        if(mode=="greyscale_mode"){
            modeNow="greyscale_mode";
            c_helper.width=image.width;
            c_helper.height=image.height;;
            originalWidth=image.width;
            originalHeight=image.height;
            if(image.width*image.height>4000000){
                alert("Odabrana slika visoke rezolucije, moguće je smanjenje performansi. Preporučuje se da ukupni broj piksela ne prelazi 4 milijuna.");
            }
            ctx_helper.drawImage(image,0,0);
            document.getElementById("res").innerHTML=image.width+"x"+image.height;
            document.getElementById("fft").innerHTML='';
            document.getElementById("ifft").innerHTML='';
            const imageData = ctx_helper.getImageData(0, 0, c_helper.width, c_helper.height);
            const idata = imageData.data;
            const tdata=new Uint8ClampedArray(c_helper.width*c_helper.height);

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
            imageDataNew.data.set(completeDrawData);
            ctx_helper.putImageData(imageDataNew,0,0);
            let dataURL = ctx_helper.canvas.toDataURL('image/png');
            document.getElementById("starting_image").src = dataURL;
        }
        if(mode=="color_mode"){
            modeNow="color_mode"
            c_helper.width=image.width;
            c_helper.height=image.height;
            originalWidth=image.width;
            originalHeight=image.height;
            if(image.width*image.height>2000000){
                alert("Odabrana slika visoke rezolucije, moguće je smanjenje performansi. Preporučuje se rad u crno-bijelom načinu.");
            }
            document.getElementById("res").innerHTML=image.width+"x"+image.height;
            document.getElementById("fft").innerHTML='';
            document.getElementById("ifft").innerHTML='';
            ctx_helper.drawImage(image,0,0);
            let imageData = ctx_helper.getImageData(0, 0, c_helper.width, c_helper.height);
            let idata = imageData.data;
            let index=0;
            for(let i=0;i<image.height;i++){
                let row=[];
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
            let dataURL = ctx_helper.canvas.toDataURL('image/png');
            document.getElementById("starting_image").src = dataURL;
        }         
    }
    image.src=URL.createObjectURL(evt.target.files[0]);   
    reader.onerror = function() {
    console.log(reader.error);
    };
}

function image_FFT(){
    ctx_helper.clearRect(0, 0, image.width, image.height);
    let fileInput = document.querySelector('.input-file');
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
    let start = performance.now();
    document.getElementById("fft_image").src="loading.svg";
    worker.postMessage({data:data,type:type,mode:mode});
    typeNow=type;

    worker.onmessage = function(event) {
        result=event.data;
        let end = performance.now();
        document.getElementById("fft").innerHTML=Math.round(end-start,5);
        if(mode=="greyscale_mode"){ 
            image.width=result[0].length;
            image.height=result.length;
            c_helper.width=image.width;
            c_helper.height=image.height;      
            let drawData = new Array(image.height).map(() => new Array(image.width));
            for (let i = 0; i < image.height; i++) {
                let row = result[i];
                let realPart = row.map((value) => value[0]);
                drawData[i] = realPart;
              }
            drawData=drawData.flat();
            let logValues = drawData.map(val => Math.log(Math.abs(val)) * 15);
            let completeDrawData=new Uint8ClampedArray(drawData.length*4);
            drawData=null;
            let counter=0;
            for(let i=0;i<completeDrawData.length;i+=4){
                let value=logValues[counter];
                completeDrawData[i]=value;
                completeDrawData[i+1]=value;
                completeDrawData[i+2]=value;
                completeDrawData[i+3]=255;
                counter++;
            }
            logValues=null;
            let imageDataNew=ctx_helper.createImageData(image.width,image.height);
            imageDataNew.data.set(completeDrawData);
            completeDrawData=null;
            ctx_helper.putImageData(imageDataNew,0,0);  
            imageDataNew=null; 
        }
        if(mode=="color_mode"){
            image.width=result.fftResultArrayRed[0].length;
            image.height=result.fftResultArrayRed.length;
            c_helper.width=image.width;
            c_helper.height=image.height;    
            let drawDataRed = new Array(image.height).map(() => new Array(image.width));
            let drawDataGreen = new Array(image.height).map(() => new Array(image.width));
            let drawDataBlue = new Array(image.height).map(() => new Array(image.width));
            for (let i = 0; i < image.height; i++) {
                let rowRed = result.fftResultArrayRed[i];
                let realPartRed = rowRed.map((value) => value[0]);
                let rowGreen = result.fftResultArrayGreen[i];
                let realPartGreen = rowGreen.map((value) => value[0]);
                let rowBlue = result.fftResultArrayBlue[i];
                let realPartBlue = rowBlue.map((value) => value[0]);
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
            let imageDataNew=ctx_helper.createImageData(image.width,image.height);
            imageDataNew.data.set(completeDrawData);
            ctx_helper.putImageData(imageDataNew,0,0);

        }
        let dataURL = ctx_helper.canvas.toDataURL('image/png');
        document.getElementById("fft_image").src = dataURL;
        worker.terminate();
    };   
}
function reduce_FFT(){
    ctx_helper.clearRect(0, 0, image.width, image.height);
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
    var slider = document.getElementById("myRange");
    var slider_value=Math.abs(slider.value-100);
    var reductiony=(image.height*(slider_value/100))/2;
    var reductionx=(image.width*(slider_value/100))/2;
    result1=result;
    var selected_filter = document.getElementById("filter");
    var text = selected_filter.options[selected_filter.selectedIndex].value;
    const worker = new Worker('filters.js');
    document.getElementById("reduction_result_image").src="loading.svg";
    worker.postMessage({result1:result1,type:type,shape:shape,text:text,width:image.width,height:image.height,slider_value:slider_value,mode:mode,reductionx:reductionx,reductiony:reductiony,mode:mode});
    worker.onmessage = function(event) {
        result1=event.data;
        if(mode=="greyscale_mode"){
            image.width=result[0].length;
            image.height=result.length;
            c_helper.width=image.width;
            c_helper.height=image.height;   
            let drawData = new Array(image.height).map(() => new Array(image.width));
            for (let i = 0; i < image.height; i++) {
                let row = result1[i];
                let realPart = row.map((value) => value[0]);
                drawData[i] = realPart;
              }
            drawData=drawData.flat();
            let logValues = drawData.map(val => Math.log(Math.abs(val)) * 15);
            let completeDrawData=new Uint8ClampedArray(drawData.length*4);
            drawData=null;
            let counter=0;
            for(let i=0;i<completeDrawData.length;i+=4){
                let value=logValues[counter];
                if(value==-Infinity){
                    value=0;
                }
                completeDrawData[i]=value;
                completeDrawData[i+1]=value;
                completeDrawData[i+2]=value;
                completeDrawData[i+3]=255;
                counter++;
            }
            logValues=null;
            let imageDataNew=ctx_helper.createImageData(image.width,image.height);
            imageDataNew.data.set(completeDrawData);
            completeDrawData=null;
            ctx_helper.putImageData(imageDataNew,0,0);  
            imageDataNew=null; 
        }
        if(mode=="color_mode"){
            image.width=result.fftResultArrayRed[0].length;
            image.height=result.fftResultArrayRed.length;
            c_helper.width=image.width;
            c_helper.height=image.height;    
            let drawDataRed = new Array(image.height);
            let drawDataGreen = new Array(image.height);
            let drawDataBlue = new Array(image.height);
            for(let i=0;i<image.height;i++){
                drawDataRed[i]=new Array(image.width);
                drawDataGreen[i]=new Array(image.width);
                drawDataBlue[i]=new Array(image.width);
            }
            for (let i = 0; i < image.height; i++) {
                let rowRed = result1.fftResultArrayRed[i];
                let realPartRed = rowRed.map((value) => value[0]);
                let rowGreen = result1.fftResultArrayGreen[i];
                let realPartGreen = rowGreen.map((value) => value[0]);
                let rowBlue = result1.fftResultArrayBlue[i];
                let realPartBlue = rowBlue.map((value) => value[0]);
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
                if(valueRed==-Infinity){
                    valueRed=0;
                }
                if(valueGreen==-Infinity){
                    valueGreen=0;
                }
                if(valueBlue==-Infinity){
                    valueBlue=0;
                }
                completeDrawData[i]=valueRed;
                completeDrawData[i+1]=valueGreen;
                completeDrawData[i+2]=valueBlue;
                completeDrawData[i+3]=255;
                counter++;
            }
            let imageDataNew=ctx_helper.createImageData(image.width,image.height);
            imageDataNew.data.set(completeDrawData);
            ctx_helper.putImageData(imageDataNew,0,0);

        }
        let dataURL = ctx_helper.canvas.toDataURL('image/png');
        document.getElementById("reduction_result_image").src = dataURL;
    
        worker.terminate();
    }
}

function invert_FFT(){
    document.getElementById("inverse_fft_image").src="loading.svg";
    ctx_helper.clearRect(0, 0, image.width, image.height);
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
    let start = performance.now();
    worker1.postMessage({data:result1,mode:mode,type:type,originalWidth:originalWidth,originalHeight:originalHeight});
    worker1.onmessage = function(event) {
        resultRe=event.data;
        let end=performance.now();
        document.getElementById("ifft").innerHTML=Math.round(end-start,5);
        if(mode=="greyscale_mode"){
            image.width=resultRe[0].length;
            image.height=resultRe.length;
            c_helper.width=image.width;
            c_helper.height=image.height;   
            let drawData = new Array(image.height).map(() => new Array(image.width));
            for (let i = 0; i < image.height; i++) {
                let row = resultRe[i];
                let realPart = row.map((value) => value[0]);
                drawData[i] = realPart;
            }
            drawData=drawData.flat();
            let completeDrawData=new Uint8ClampedArray(drawData.length*4);
            let counter=0;
            
            for(let i=0;i<completeDrawData.length;i+=4){
                completeDrawData[i] = drawData[counter];
                completeDrawData[i+1] = drawData[counter];
                completeDrawData[i+2] = drawData[counter];
                completeDrawData[i+3] = 255;
                counter++;
            }
            let imageDataNew=ctx_helper.createImageData(c_helper.width,c_helper.height);
            imageDataNew.data.set(completeDrawData);
            ctx_helper.putImageData(imageDataNew,0,0);
        }
        if(mode=="color_mode"){
            image.width=resultRe.inverseFFTArrayRed[0].length;
            image.height=resultRe.inverseFFTArrayRed.length;
            c_helper.width=image.width;
            c_helper.height=image.height;  
            let drawDataRed = new Array(image.height).map(() => new Array(image.width));
            let drawDataGreen = new Array(image.height).map(() => new Array(image.width));
            let drawDataBlue = new Array(image.height).map(() => new Array(image.width));
            for (let i = 0; i < image.height; i++) {
                let rowRed = resultRe.inverseFFTArrayRed[i];
                let realPartRed = rowRed.map((value) => value[0]);
                let rowGreen = resultRe.inverseFFTArrayGreen[i];
                let realPartGreen = rowGreen.map((value) => value[0]);
                let rowBlue = resultRe.inverseFFTArrayBlue[i];
                let realPartBlue = rowBlue.map((value) => value[0]);
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
            imageDataNew.data.set(completeDrawData);
            ctx_helper.putImageData(imageDataNew,0,0);
        }
        let dataURL = ctx_helper.canvas.toDataURL('image/png');
        document.getElementById("inverse_fft_image").src = dataURL;
        worker1.terminate();
    };
}

function setMode(value){
    mode=value;

}
function setType(value){
    let filters=document.getElementById("filter");
    let hide1=filters.querySelector("option[value='sharpen");
    let hide2=filters.querySelector("option[value='gauss_low_pass");
    let hide3=filters.querySelector("option[value='gauss_high_pass");
    type=value;
    if(value=="standard"){ 
        hide1.style.display="none";
        hide2.style.display="none";
        hide3.style.display="none";
        filters.value="low_pass";
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