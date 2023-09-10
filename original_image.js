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

function handleFileSelect(evt) {
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
                c_helper.width=image.width;
                c_helper.height=image.height;
                ctx_helper.drawImage(image,0,0);
                document.getElementById("res").innerHTML=image.width+"x"+image.height;
                document.getElementById("fft").innerHTML='';
                document.getElementById("ifft").innerHTML='';
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
                ctx_helper.clearRect(0, 0, image.width, image.height);
                for(let i=0;i<image.width;i++){
                    for(let j=0;j<image.height;j++){
                        ctx_helper.fillStyle = `rgb(${data[i][j]},${data[i][j]},${data[i][j]})`;
                        ctx_helper.fillRect(i, j, 1, 1);
                    }
                }
                var image1=ctx_helper.canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
                document.getElementById("starting_image").src=image1;
                ctx_helper.clearRect(0, 0, image.width, image.height);
            }
            if(mode=="color_mode"){
                c_helper.width=image.width;
                c_helper.height=image.height;
                document.getElementById("res").innerHTML=image.width+"x"+image.height;
                document.getElementById("fft").innerHTML='';
                document.getElementById("ifft").innerHTML='';
                ctx_helper.drawImage(image,0,0);
                const imageData = ctx_helper.getImageData(0, 0, c_helper.width, c_helper.height);
                const idata = imageData.data;
                for(let i=0;i<image.height;i++){
                    data[i]=[];
                    for(let j=0;j<image.width*4;j++){
                        data[i][j]=0; 
                    }
                }
                for(let i=0;i<image.height;i++){
                    for(let j=0;j<image.width*4;j++){
                        data[i][j]=idata[i*image.width*4+j];
                    }
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
    let get=document.getElementById("starting_image");
    let atr=get.getAttribute('src');
    if(atr===null || atr===''){
        alert("Početna slika nije odabrana!");
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
            for(let i=0;i<image.height;i++){
                for(let j=0;j<image.width;j++){
                    ctx_helper.fillStyle = `rgb(${Math.log(Math.abs(result[i][j][0]))*15},${Math.log(Math.abs(result[i][j][0]))*15},${Math.log(Math.abs(result[i][j][0]))*15})`;
                    ctx_helper.fillRect(i, j, 1, 1);
                }
            }
        }
        if(mode=="color_mode"){
            for(let i=0;i<image.height;i++){ 
                for(let j=0;j<image.width;j++){
                    ctx_helper.fillStyle = `rgb(${Math.log(Math.abs(result.fftResultArrayRed[i][j][0]))*15},${Math.log(Math.abs(result.fftResultArrayGreen[i][j][0]))*15},${Math.log(Math.abs(result.fftResultArrayBlue[i][j][0]))*15})`;
                    ctx_helper.fillRect(j, i, 1, 1);
                }
            }
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
    var reductiony=(image.width*(slider_value/100))/2;
    var reductionx=(image.height*(slider_value/100))/2;
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
        ctx_helper.clearRect(0, 0, image.width, image.height);
        if(mode=="greyscale_mode"){
            for(let i=0;i<image.width;i++){
                for(let j=0;j<image.height;j++){
                    ctx_helper.fillStyle = `rgb(${resultRe[i][j]},${resultRe[i][j]},${resultRe[i][j]})`;
                    ctx_helper.fillRect(i, j, 1, 1);
                }
            }
        }
        if(mode=="color_mode"){
            for(let i=0;i<image.height;i++){
                for(let j=0;j<image.width;j++){
                    ctx_helper.fillStyle = `rgb(${Math.abs(resultRe.inverseFFTArrayRed[i][j])},${Math.abs(resultRe.inverseFFTArrayGreen[i][j])},${Math.abs(resultRe.inverseFFTArrayBlue[i][j])})`;
                    ctx_helper.fillRect(j, i, 1, 1);
                }
            }
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
    if(value=="standard"){ 
        hide1.style.display="none";
        hide2.style.display="none";
        hide3.style.display="none";
    }
    if(value=="inverted"){
        hide1.style.display="block";
        hide2.style.display="block";
        hide3.style.display="block";
    }
    type=value;
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