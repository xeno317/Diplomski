function corner_cutoff(result,width,height,ctx_helper,reductionx,reductiony){
    for(let i=0;i<width;i++){
        for(let j=0;j<height;j++){
            if(i>reductiony && i<width-reductiony){
                result[i][j].re=0;
                result[i][j].im=0;
            }
            if(j>reductionx && j<height-reductionx){
                result[i][j].re=0;
                result[i][j].im=0;
            }
            ctx_helper.fillStyle = `rgb(${result[i][j].re},${result[i][j].re},${result[i][j].re})`;
            ctx_helper.fillRect(i, j, 1, 1);
        }
    }
    return result;

}

function high_pass(result,width,height,ctx_helper,reductionx,reductiony){
    for(let i=0;i<width;i++){
        for(let j=0;j<height;j++){
            if(j<reductiony || j>width-reductiony){
                result1[i][j].re=0;
                result1[i][j].im=0;
            }
            
            if(i<reductionx || i>height-reductionx){
                result1[i][j].re=0;
                result1[i][j].im=0;
            }
            
            ctx_helper.fillStyle = `rgb(${result1[i][j].re},${result1[i][j].re},${result1[i][j].re})`;
            ctx_helper.fillRect(i, j, 1, 1);
        }
    }
    return result;
}

function low_pass(result,width,height,ctx_helper,reductionx,reductiony){
    for(let i=0;i<width;i++){
        for(let j=0;j<height;j++){
            if(j>reductiony && j<width-reductiony && i>reductionx && i<height-reductionx){
                result1[i][j].re=0;
                result1[i][j].im=0;
            }
            ctx_helper.fillStyle = `rgb(${result1[i][j].re},${result1[i][j].re},${result1[i][j].re})`;
            ctx_helper.fillRect(i, j, 1, 1);
        }
    }
    return result;
}
var max=0;
function low_pass_circle(result,width,height,ctx_helper,slider_value){
    max=0;
    var min=result[0][0].re;
    for(let i=0;i<width;i++){
        for(let j=0;j<height;j++){
            if(Math.log(Math.abs(result[i][j].re))>max){
                max=Math.log(Math.abs(result[i][j].re));
            }
            if(Math.log(Math.abs(result[i][j].re))<min){
                min=Math.log(Math.abs(result[i][j].re));
            }
        }
    }
    var reduction_amount=(max-Math.abs(min))*(1-slider_value/100);
    for(let i=0;i<width;i++){
        for(let j=0;j<height;j++){
            if(Math.log(Math.abs(result[i][j].re))<reduction_amount){
                result1[i][j].re=0;
                result1[i][j].im=0;
            }
            ctx_helper.fillStyle = `rgb(${result1[i][j].re},${result1[i][j].re},${result1[i][j].re})`;
            ctx_helper.fillRect(i, j, 1, 1);
        }
    }
    return result;
}
function high_pass_circle(result,width,height,ctx_helper,slider_value){
    max=0;
    var min=result[0][0].re;
    for(let i=0;i<width;i++){
        for(let j=0;j<height;j++){
            if(Math.log(Math.abs(result[i][j].re))>max){
                max=Math.log(Math.abs(result[i][j].re));
            }
            if(Math.log(Math.abs(result[i][j].re))<min){
                min=Math.log(Math.abs(result[i][j].re));
            }
        }
    }
    var reduction_amount=(max-Math.abs(min))*(1-slider_value/100);
    for(let i=0;i<width;i++){
        for(let j=0;j<height;j++){
            if(Math.log(Math.abs(result[i][j].re))>reduction_amount){
                result1[i][j].re=0;
                result1[i][j].im=0;
            }
            ctx_helper.fillStyle = `rgb(${result1[i][j].re},${result1[i][j].re},${result1[i][j].re})`;
            ctx_helper.fillRect(i, j, 1, 1);
        }
    }
    return result;
}
function sharpen(result,width,height,ctx_helper,slider_value){
    max=0;
    var min=result[0][0].re;
    for(let i=0;i<width;i++){
        for(let j=0;j<height;j++){
            if(Math.log(Math.abs(result[i][j].re))>max){
                max=Math.log(Math.abs(result[i][j].re));
            }
            if(Math.log(Math.abs(result[i][j].re))<min){
                min=Math.log(Math.abs(result[i][j].re));
            }
        }
    }
    var sharpen_cutoff=(max-Math.abs(min))*(1-slider_value/100);
    for(let i=0;i<width;i++){
        for(let j=0;j<height;j++){
            if(Math.log(Math.abs(result[i][j].re))<sharpen_cutoff){
                result1[i][j].re=result1[i][j].re*5;
                result1[i][j].re=result1[i][j].im*5;
            }
            ctx_helper.fillStyle = `rgb(${result1[i][j].re},${result1[i][j].re},${result1[i][j].re})`;
            ctx_helper.fillRect(i, j, 1, 1);
        }
    }
    return result;
}