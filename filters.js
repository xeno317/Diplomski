function low_pass(result,width,height,ctx_helper,reductionx,reductiony,mode){
    if(mode=="greyscale_mode"){
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
    if(mode=="color_mode"){
        for(let i=0;i<width;i++){
            for(let j=0;j<height;j++){
                if(i>reductiony && i<width-reductiony){
                    result.red[i][j].re=0;
                    result.red[i][j].im=0;
                    result.green[i][j].re=0;
                    result.green[i][j].im=0;
                    result.blue[i][j].re=0;
                    result.blue[i][j].im=0;
                }
                if(j>reductionx && j<height-reductionx){
                    result.red[i][j].re=0;
                    result.red[i][j].im=0;
                    result.green[i][j].re=0;
                    result.green[i][j].im=0;
                    result.blue[i][j].re=0;
                    result.blue[i][j].im=0;
                }
                ctx_helper.fillStyle = `rgb(${result.red[i][j].re},${result.green[i][j].re},${result.blue[i][j].re})`;
                ctx_helper.fillRect(i, j, 1, 1);
            }
        }
        return result;
    }
    
}

function low_pass_inverted(result,width,height,ctx_helper,reduction,mode){
    if(mode=="greyscale_mode"){
        var reductiony=(width*(1-reduction/100))/2;
        var reductionx=(height*(1-reduction/100))/2;
        for(let i=0;i<width;i++){
            for(let j=0;j<height;j++){
                if(i<reductiony || i>width-reductiony){
                    result[i][j].re=0;
                    result[i][j].im=0;
                }
                
                if(j<reductionx || j>height-reductionx){
                    result[i][j].re=0;
                    result[i][j].im=0;
                }
                
                ctx_helper.fillStyle = `rgb(${result[i][j].re},${result[i][j].re},${result[i][j].re})`;
                ctx_helper.fillRect(i, j, 1, 1);
            }
        }
        return result;
    }
    if(mode=="color_mode"){
        var reductiony=(width*(1-reduction/100))/2;
        var reductionx=(height*(1-reduction/100))/2;
        for(let i=0;i<width;i++){
            for(let j=0;j<height;j++){
                if(i<reductiony || i>width-reductiony){
                    result.red[i][j].re=0;
                    result.red[i][j].im=0;
                    result.green[i][j].re=0;
                    result.green[i][j].im=0;
                    result.blue[i][j].re=0;
                    result.blue[i][j].im=0;
                }
                
                if(j<reductionx || j>height-reductionx){
                    result.red[i][j].re=0;
                    result.red[i][j].im=0;
                    result.green[i][j].re=0;
                    result.green[i][j].im=0;
                    result.blue[i][j].re=0;
                    result.blue[i][j].im=0;
                }
                
                ctx_helper.fillStyle = `rgb(${result.red[i][j].re},${result.green[i][j].re},${result.blue[i][j].re})`;
                ctx_helper.fillRect(i, j, 1, 1);
            }
        }
        return result;
    }
    
}

function high_pass(result,width,height,ctx_helper,reduction,mode){
    if(mode=="greyscale_mode"){
        var reductiony=(height*(1-reduction/100))/2;
        var reductionx=(width*(1-reduction/100))/2;
        for(let i=0;i<width;i++){
            for(let j=0;j<height;j++){
                
                if(i<reductionx && j<reductiony || i<reductionx && j>height-reductiony || i>width-reductionx && j>height-reductiony || i>width-reductionx && j<reductiony){
                    result[i][j].re=0;
                    result[i][j].im=0;
                }                          
                ctx_helper.fillStyle = `rgb(${result[i][j].re},${result[i][j].re},${result[i][j].re})`;
                ctx_helper.fillRect(i, j, 1, 1);
            }
        }
        return result;
    }
    if(mode=="color_mode"){
        var reductiony=(height*(1-reduction/100))/2;
        var reductionx=(width*(1-reduction/100))/2;
        for(let i=0;i<width;i++){
            for(let j=0;j<height;j++){
                
                if(i<reductionx && j<reductiony || i<reductionx && j>height-reductiony || i>width-reductionx && j>height-reductiony || i>width-reductionx && j<reductiony){
                    result.red[i][j].re=0;
                    result.red[i][j].im=0;
                    result.green[i][j].re=0;
                    result.green[i][j].im=0;
                    result.blue[i][j].re=0;
                    result.blue[i][j].im=0;
                }                          
                ctx_helper.fillStyle = `rgb(${result.red[i][j].re},${result.green[i][j].re},${result.blue[i][j].re})`;
                ctx_helper.fillRect(i, j, 1, 1);
            }
        }
        return result;
    }
    
}

function high_pass_inverted(result,width,height,ctx_helper,reductionx,reductiony,mode){
    if(mode=="greyscale_mode"){
        for(let i=0;i<width;i++){
            for(let j=0;j<height;j++){
                
                if(i>reductionx && i<width-reductionx && j>reductiony && j<height-reductiony){
                    result[i][j].re=0;
                    result[i][j].im=0;
                } 
                                         
                ctx_helper.fillStyle = `rgb(${result[i][j].re},${result[i][j].re},${result[i][j].re})`;
                ctx_helper.fillRect(i, j, 1, 1);
            }
        }
        return result;
    }
    if(mode=="color_mode"){
        for(let i=0;i<width;i++){
            for(let j=0;j<height;j++){
                
                if(i>reductionx && i<width-reductionx && j>reductiony && j<height-reductiony){
                    result.red[i][j].re=0;
                    result.red[i][j].im=0;
                    result.green[i][j].re=0;
                    result.green[i][j].im=0;
                    result.blue[i][j].re=0;
                    result.blue[i][j].im=0;
                } 
                                         
                ctx_helper.fillStyle = `rgb(${result.red[i][j].re},${result.green[i][j].re},${result.blue[i][j].re})`;
                ctx_helper.fillRect(i, j, 1, 1);
            }
        }
        return result;
    }
    
}

function low_pass_circle(result,width,height,ctx_helper,reduction,mode){ 
    if(mode=="greyscale_mode"){
        const rows=result.length;
        const cols=result[0].length;
    
        const middleRow=Math.floor(rows/2);
        const middleCol=Math.floor(cols/2);
        if(width<=height){
            reduction=(width*(reduction/100))/2;
        }
        if(width>height){
            reduction=(height*(reduction/100))/2;
        }
    
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                var distance=Math.sqrt(Math.pow(i-middleRow,2)+Math.pow(j-middleCol,2));
                if(distance>reduction){
                    result[i][j].re=0;
                    result[i][j].im=0;
                }
                ctx_helper.fillStyle = `rgb(${result[i][j].re},${result[i][j].re},${result[i][j].re})`;
                ctx_helper.fillRect(i, j, 1, 1);
            }
        }
        return result;
    }
    if(mode=="color_mode"){
        const rows=result.red.length;
        const cols=result.red[0].length;
    
        const middleRow=Math.floor(rows/2);
        const middleCol=Math.floor(cols/2);
        if(width<=height){
            reduction=(width*(reduction/100))/2;
        }
        if(width>height){
            reduction=(height*(reduction/100))/2;
        }
    
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                var distance=Math.sqrt(Math.pow(i-middleRow,2)+Math.pow(j-middleCol,2));
                if(distance>reduction){
                    result.red[i][j].re=0;
                    result.red[i][j].im=0;
                    result.green[i][j].re=0;
                    result.green[i][j].im=0;
                    result.blue[i][j].re=0;
                    result.blue[i][j].im=0;
                }
                ctx_helper.fillStyle = `rgb(${result.red[i][j].re},${result.green[i][j].re},${result.blue[i][j].re})`;
                ctx_helper.fillRect(i, j, 1, 1);
            }
        }
        return result;   
    }
   
}

function low_pass_circle_standard(result,width,height,ctx_helper,reduction,mode){
    if(mode=="greyscale_mode"){
        const rows=result.length;
        const cols=result[0].length;
    
        const upLeft=[0,0];
        const upRight=[rows,0];
        const downLeft=[0,cols];
        const downRight=[rows,cols];
        if(width<=height){
            reduction=(width*(reduction/100))/2;
        }
        if(width>height){
            reduction=(height*(reduction/100))/2;
        }
    
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                var distanceUpLeft=Math.sqrt(Math.pow(i-upLeft[0],2)+Math.pow(j-upLeft[1],2));
                var distanceUpRight=Math.sqrt(Math.pow(i-upRight[0],2)+Math.pow(j-upRight[1],2));
                var distanceDownLeft=Math.sqrt(Math.pow(i-downLeft[0],2)+Math.pow(j-downLeft[1],2));
                var distanceDownRight=Math.sqrt(Math.pow(i-downRight[0],2)+Math.pow(j-downRight[1],2));
                if(distanceUpLeft>reduction && distanceUpRight>reduction && distanceDownLeft>reduction && distanceDownRight>reduction){
                    result[i][j].re=0;
                    result[i][j].im=0;
                }
                ctx_helper.fillStyle = `rgb(${result[i][j].re},${result[i][j].re},${result[i][j].re})`;
                ctx_helper.fillRect(i, j, 1, 1);
            }
        }
        return result;
    } 
    if(mode=="color_mode"){
        const rows=result.red.length;
        const cols=result.red[0].length;
    
        const upLeft=[0,0];
        const upRight=[rows,0];
        const downLeft=[0,cols];
        const downRight=[rows,cols];
        if(width<=height){
            reduction=(width*(reduction/100))/2;
        }
        if(width>height){
            reduction=(height*(reduction/100))/2;
        }
    
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                var distanceUpLeft=Math.sqrt(Math.pow(i-upLeft[0],2)+Math.pow(j-upLeft[1],2));
                var distanceUpRight=Math.sqrt(Math.pow(i-upRight[0],2)+Math.pow(j-upRight[1],2));
                var distanceDownLeft=Math.sqrt(Math.pow(i-downLeft[0],2)+Math.pow(j-downLeft[1],2));
                var distanceDownRight=Math.sqrt(Math.pow(i-downRight[0],2)+Math.pow(j-downRight[1],2));
                if(distanceUpLeft>reduction && distanceUpRight>reduction && distanceDownLeft>reduction && distanceDownRight>reduction){
                    result.red[i][j].re=0;
                    result.red[i][j].im=0;
                    result.green[i][j].re=0;
                    result.green[i][j].im=0;
                    result.blue[i][j].re=0;
                    result.blue[i][j].im=0;
                }
                ctx_helper.fillStyle = `rgb(${result.red[i][j].re},${result.green[i][j].re},${result.blue[i][j].re})`;
                ctx_helper.fillRect(i, j, 1, 1);
            }
        }
        return result;
    }
}

function high_pass_circle(result,width,height,ctx_helper,reduction, mode){
    if(mode=="greyscale_mode"){
        const rows=result.length;
        const cols=result[0].length;
    
        const middleRow=Math.floor(rows/2);
        const middleCol=Math.floor(cols/2);
    
        if(width<=height){
            reduction=(width*(1-reduction/100))/2;
        }
        if(width>height){
            reduction=(height*(1-reduction/100))/2;
        }
    
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                var distance=Math.sqrt(Math.pow(i-middleRow,2)+Math.pow(j-middleCol,2));
                if(distance<reduction){
                    result[i][j].re=0;
                    result[i][j].im=0;
                }
     
                ctx_helper.fillStyle = `rgb(${result[i][j].re},${result[i][j].re},${result[i][j].re})`;
                ctx_helper.fillRect(i, j, 1, 1);
            }
        }
        return result;
    }
    if(mode=="color_mode"){
        const rows=result.red.length;
        const cols=result.red[0].length;
    
        const middleRow=Math.floor(rows/2);
        const middleCol=Math.floor(cols/2);
    
        if(width<=height){
            reduction=(width*(1-reduction/100))/2;
        }
        if(width>height){
            reduction=(height*(1-reduction/100))/2;
        }
    
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                var distance=Math.sqrt(Math.pow(i-middleRow,2)+Math.pow(j-middleCol,2));
                if(distance<reduction){
                    result.red[i][j].re=0;
                    result.red[i][j].im=0;
                    result.green[i][j].re=0;
                    result.green[i][j].im=0;
                    result.blue[i][j].re=0;
                    result.blue[i][j].im=0;
                }
     
                ctx_helper.fillStyle = `rgb(${result.red[i][j].re},${result.green[i][j].re},${result.blue[i][j].re})`;
                ctx_helper.fillRect(i, j, 1, 1);
            }
        }
        return result;
    }
   
}

function high_pass_circle_standard(result,width,height,ctx_helper,reduction,mode){
    if(mode=="greyscale_mode"){
        const rows=result.length;
        const cols=result[0].length;
    
        const upLeft=[0,0];
        const upRight=[rows,0];
        const downLeft=[0,cols];
        const downRight=[rows,cols];
        if(width<=height){
            reduction=(width*(1-reduction/100))/2;
        }
        if(width>height){
            reduction=(height*(1-reduction/100))/2;
        }
    
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                var distanceUpLeft=Math.sqrt(Math.pow(i-upLeft[0],2)+Math.pow(j-upLeft[1],2));
                var distanceUpRight=Math.sqrt(Math.pow(i-upRight[0],2)+Math.pow(j-upRight[1],2));
                var distanceDownLeft=Math.sqrt(Math.pow(i-downLeft[0],2)+Math.pow(j-downLeft[1],2));
                var distanceDownRight=Math.sqrt(Math.pow(i-downRight[0],2)+Math.pow(j-downRight[1],2));
                if(distanceUpLeft<reduction || distanceUpRight<reduction || distanceDownLeft<reduction || distanceDownRight<reduction){
                    result[i][j].re=0;
                    result[i][j].im=0;
                }
                ctx_helper.fillStyle = `rgb(${result[i][j].re},${result[i][j].re},${result[i][j].re})`;
                ctx_helper.fillRect(i, j, 1, 1);
            }
        }
        return result;
    }
    if(mode=="color_mode"){
        const rows=result.red.length;
        const cols=result.red[0].length;
    
        const upLeft=[0,0];
        const upRight=[rows,0];
        const downLeft=[0,cols];
        const downRight=[rows,cols];
        if(width<=height){
            reduction=(width*(1-reduction/100))/2;
        }
        if(width>height){
            reduction=(height*(1-reduction/100))/2;
        }
    
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                var distanceUpLeft=Math.sqrt(Math.pow(i-upLeft[0],2)+Math.pow(j-upLeft[1],2));
                var distanceUpRight=Math.sqrt(Math.pow(i-upRight[0],2)+Math.pow(j-upRight[1],2));
                var distanceDownLeft=Math.sqrt(Math.pow(i-downLeft[0],2)+Math.pow(j-downLeft[1],2));
                var distanceDownRight=Math.sqrt(Math.pow(i-downRight[0],2)+Math.pow(j-downRight[1],2));
                if(distanceUpLeft<reduction || distanceUpRight<reduction || distanceDownLeft<reduction || distanceDownRight<reduction){
                    result.red[i][j].re=0;
                    result.red[i][j].im=0;
                    result.green[i][j].re=0;
                    result.green[i][j].im=0;
                    result.blue[i][j].re=0;
                    result.blue[i][j].im=0;
                }
                ctx_helper.fillStyle = `rgb(${result.red[i][j].re},${result.green[i][j].re},${result.blue[i][j].re})`;
                ctx_helper.fillRect(i, j, 1, 1);
            }
        }
        return result;
    }
   
}
function sharpen(result,width,height,ctx_helper,reduction,mode){
    if(mode=="greyscale_mode"){
        const rows=result.length;
        const cols=result[0].length;
    
        const middleRow=Math.floor(rows/2);
        const middleCol=Math.floor(cols/2);
        if(width<=height){
            reduction=(width*(reduction/100))/2;
            var sharpenDistance=width/8*3;
        }
        if(width>height){
            reduction=(height*(reduction/100))/2;
            var sharpenDistance=height/8*3;
        }
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                var distance=Math.sqrt(Math.pow(i-middleRow,2)+Math.pow(j-middleCol,2));
                if(distance==0){
                    result[i][j].re=result[i][j].re*0.5;
                    result[i][j].im=result[i][j].im*0.5;
                }
                if(distance>0 && distance<=sharpenDistance){
                    var multiplier=(((distance*0.5)-0)*((4-0.5)/(sharpenDistance/2-0))+0.5);
                    result[i][j].re=result[i][j].re*multiplier;
                    result[i][j].im=result[i][j].im*multiplier;
                }
                if(distance>sharpenDistance){
                    result[i][j].re=result[i][j].re*4;
                    result[i][j].im=result[i][j].im*4;
                }
                ctx_helper.fillStyle = `rgb(${Math.log(Math.abs(result[i][j].re))*15},${Math.log(Math.abs(result[i][j].re))*15},${Math.log(Math.abs(result[i][j].re))*15})`;
                ctx_helper.fillRect(i, j, 1, 1);
            }
        }
        return result;
    }
    if(mode=="color_mode"){
        const rows=result.red.length;
        const cols=result.red[0].length;
    
        const middleRow=Math.floor(rows/2);
        const middleCol=Math.floor(cols/2);
        if(width<=height){
            reduction=(width*(reduction/100))/2;
            var sharpenDistance=width/8*3;
        }
        if(width>height){
            reduction=(height*(reduction/100))/2;
            var sharpenDistance=height/8*3;
        }
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                var distance=Math.sqrt(Math.pow(i-middleRow,2)+Math.pow(j-middleCol,2));
                if(distance==0){
                    result.red[i][j].re=result.red[i][j].re*0.5;
                    result.red[i][j].im=result.red[i][j].im*0.5;
                    result.green[i][j].re=result.green[i][j].re*0.5;
                    result.green[i][j].im=result.green[i][j].im*0.5;
                    result.blue[i][j].re=result.blue[i][j].re*0.5;
                    result.blue[i][j].im=result.blue[i][j].im*0.5;
                }
                if(distance>0 && distance<=sharpenDistance){
                    var multiplier=(((distance*0.5)-0)*((4-0.5)/(sharpenDistance/2-0))+0.5);
                    result.red[i][j].re=result.red[i][j].re*multiplier;
                    result.red[i][j].im=result.red[i][j].im*multiplier;
                    result.green[i][j].re=result.green[i][j].re*multiplier;
                    result.green[i][j].im=result.green[i][j].im*multiplier;
                    result.blue[i][j].re=result.blue[i][j].re*multiplier;
                    result.blue[i][j].im=result.blue[i][j].im*multiplier;
                }
                if(distance>sharpenDistance){
                    result.red[i][j].re=result.red[i][j].re*4;
                    result.red[i][j].im=result.red[i][j].im*4;
                    result.green[i][j].re=result.green[i][j].re*4;
                    result.green[i][j].im=result.green[i][j].im*4;
                    result.blue[i][j].re=result.blue[i][j].re*4;
                    result.blue[i][j].im=result.blue[i][j].im*4;
                }
                ctx_helper.fillStyle = `rgb(${Math.log(Math.abs(result.red[i][j].re))*15},${Math.log(Math.abs(result.green[i][j].re))*15},${Math.log(Math.abs(result.blue[i][j].re))*15})`;
                ctx_helper.fillRect(i, j, 1, 1);
            }
        }
        return result;
    }
   
}

function gaussLowPass(result,width,height,ctx_helper){
}