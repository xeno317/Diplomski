self.onmessage = function(event) {
    var result1=event.data.result1;
    const width=event.data.width;
    const height=event.data.height;
    const type=event.data.type;
    const shape=event.data.shape;
    const text=event.data.text;
    const slider_value=event.data.slider_value;
    const reductionx=event.data.reductionx;
    const reductiony=event.data.reductiony;
    const mode=event.data.mode;

    if(type=="standard"){
        if(shape=="circle"){
            switch(text){
                case 'low_pass':
                    result1=low_pass_circle_standard(result1,width,height,slider_value,mode);
                    break;
                case 'high_pass':
                    result1= high_pass_circle_standard(result1,width,height,slider_value,mode);
                    break;
            }
        }
        if(shape=="rect"){
            switch(text){
                case 'low_pass':
                    result1= low_pass(result1,width,height,reductionx,reductiony,mode);
                    break;
                case 'high_pass':
                    result1= high_pass(result1,width,height,slider_value,mode);
                    break;
            }
        }
    }
    if(type=="inverted"){
        if(shape=="circle"){
            switch(text){
                case 'low_pass':
                    result1= low_pass_circle(result1,width,height,slider_value,mode);
                    break;
                case 'high_pass':
                    result1= high_pass_circle(result1,width,height,slider_value,mode);
                    break;
                case 'sharpen':
                    result1= sharpen(result1,width,height,slider_value,mode);
                    break;
                case 'gauss_low_pass':
                    result1= gaussLowPass(result1,slider_value,mode);
                    break;
                case 'gauss_high_pass':
                    result1= gaussHighPass(result1,slider_value,mode);
                    break;
            }
        }
        if(shape=="rect"){
            switch(text){
                case 'low_pass':
                    result1= low_pass_inverted(result1,width,height,slider_value,mode);
                    break;
                case 'high_pass':
                    result1= high_pass_inverted(result1,width,height,reductionx,reductiony,mode);
                    break;
                case 'sharpen':
                    result1= sharpen(result1,width,height,slider_value,mode);
                    break;
                case 'gauss_low_pass':
                    result1= gaussLowPass(result1,slider_value,mode);
                    break;
                case 'gauss_high_pass':
                    result1=gaussHighPass(result1,slider_value,mode);
                    break;
            }
        }
    }
    self.postMessage(result1);  
}
function low_pass(result,width,height,reductionx,reductiony,mode){
    if(mode=="greyscale_mode"){
        for(let i=0;i<height;i++){
            for(let j=0;j<width;j++){
                if(i>reductiony && i<height-reductiony){
                    result[i][j][0]=0;
                    result[i][j][1]=0;
                }
                if(j>reductionx && j<width-reductionx){
                    result[i][j][0]=0;
                    result[i][j][1]=0;
                }
            }
        }
       
        return result;
    }
    if(mode=="color_mode"){
        for(let i=0;i<height;i++){
            for(let j=0;j<width;j++){
                if(i>reductiony && i<height-reductiony){
                    result.fftResultArrayRed[i][j][0]=0;
                    result.fftResultArrayRed[i][j][1]=0;
                    result.fftResultArrayGreen[i][j][0]=0;
                    result.fftResultArrayGreen[i][j][1]=0;
                    result.fftResultArrayBlue[i][j][0]=0;
                    result.fftResultArrayBlue[i][j][1]=0;
                }
                if(j>reductionx && j<width-reductionx){
                    result.fftResultArrayRed[i][j][0]=0;
                    result.fftResultArrayRed[i][j][1]=0;
                    result.fftResultArrayGreen[i][j][0]=0;
                    result.fftResultArrayGreen[i][j][1]=0;
                    result.fftResultArrayBlue[i][j][0]=0;
                    result.fftResultArrayBlue[i][j][1]=0;
                }
            }
        }
        return result;
    }
    
}

function low_pass_inverted(result,width,height,reduction,mode){
    if(mode=="greyscale_mode"){
        var reductiony=(height*(1-reduction/100))/2;
        var reductionx=(width*(1-reduction/100))/2;
        for(let i=0;i<height;i++){
            for(let j=0;j<width;j++){
                if(i<reductiony || i>height-reductiony){
                    result[i][j][0]=0;
                    result[i][j][1]=0;
                }
                
                if(j<reductionx || j>width-reductionx){
                    result[i][j][0]=0;
                    result[i][j][1]=0;
                }
            }
        }
        return result;
    }
    if(mode=="color_mode"){
        var reductiony=(height*(1-reduction/100))/2;
        var reductionx=(width*(1-reduction/100))/2;
        for(let i=0;i<height;i++){
            for(let j=0;j<width;j++){
                if(i<reductiony || i>height-reductiony){
                    result.fftResultArrayRed[i][j][0]=0;
                    result.fftResultArrayRed[i][j][1]=0;
                    result.fftResultArrayGreen[i][j][0]=0;
                    result.fftResultArrayGreen[i][j][1]=0;
                    result.fftResultArrayBlue[i][j][0]=0;
                    result.fftResultArrayBlue[i][j][1]=0;
                }
                
                if(j<reductionx || j>width-reductionx){
                    result.fftResultArrayRed[i][j][0]=0;
                    result.fftResultArrayRed[i][j][1]=0;
                    result.fftResultArrayGreen[i][j][0]=0;
                    result.fftResultArrayGreen[i][j][1]=0;
                    result.fftResultArrayBlue[i][j][0]=0;
                    result.fftResultArrayBlue[i][j][1]=0;
                }
            }
        }
        return result;
    }
    
}

function high_pass(result,width,height,reduction,mode){
    if(mode=="greyscale_mode"){
        var reductiony=(height*(1-reduction/100))/2;
        var reductionx=(width*(1-reduction/100))/2;
        for(let i=0;i<height;i++){
            for(let j=0;j<width;j++){
                
                if(j<reductionx && i<reductiony || j<reductionx && i>height-reductiony || j>width-reductionx && i>height-reductiony || j>width-reductionx && i<reductiony){
                    result[i][j][0]=0;
                    result[i][j][1]=0;
                }                          
            }
        }
        return result;
    }
    if(mode=="color_mode"){
        var reductiony=(height*(1-reduction/100))/2;
        var reductionx=(width*(1-reduction/100))/2;
        for(let i=0;i<height;i++){
            for(let j=0;j<width;j++){
                
                if(j<reductionx && i<reductiony || j<reductionx && i>height-reductiony || j>width-reductionx && i>height-reductiony || j>width-reductionx && i<reductiony){
                    result.fftResultArrayRed[i][j][0]=0;
                    result.fftResultArrayRed[i][j][1]=0;
                    result.fftResultArrayGreen[i][j][0]=0;
                    result.fftResultArrayGreen[i][j][1]=0;
                    result.fftResultArrayBlue[i][j][0]=0;
                    result.fftResultArrayBlue[i][j][1]=0;
                }                          
            }
        }
        return result;
    }
    
}

function high_pass_inverted(result,width,height,reductionx,reductiony,mode){
    if(mode=="greyscale_mode"){
        for(let i=0;i<height;i++){
            for(let j=0;j<width;j++){
                
                if(j>reductionx && j<width-reductionx && i>reductiony && i<height-reductiony){
                    result[i][j][0]=0;
                    result[i][j][1]=0;
                } 
            }
        }
        return result;
    }
    if(mode=="color_mode"){
        for(let i=0;i<height;i++){
            for(let j=0;j<width;j++){
                
                if(j>reductionx && j<width-reductionx && i>reductiony && i<height-reductiony){
                    result.fftResultArrayRed[i][j][0]=0;
                    result.fftResultArrayRed[i][j][1]=0;
                    result.fftResultArrayGreen[i][j][0]=0;
                    result.fftResultArrayGreen[i][j][1]=0;
                    result.fftResultArrayBlue[i][j][0]=0;
                    result.fftResultArrayBlue[i][j][1]=0;
                } 
            }
        }
        return result;
    }
    
}

function low_pass_circle(result,width,height,reduction,mode){ 
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
                    result[i][j][0]=0;
                    result[i][j][1]=0;
                }
            }
        }
        return result;
    }
    if(mode=="color_mode"){
        const rows=result.fftResultArrayRed.length;
        const cols=result.fftResultArrayRed[0].length;
    
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
                    result.fftResultArrayRed[i][j][0]=0;
                    result.fftResultArrayRed[i][j][1]=0;
                    result.fftResultArrayGreen[i][j][0]=0;
                    result.fftResultArrayGreen[i][j][1]=0;
                    result.fftResultArrayBlue[i][j][0]=0;
                    result.fftResultArrayBlue[i][j][1]=0;
                }
            }
        }
        return result;   
    }
   
}

function low_pass_circle_standard(result,width,height,reduction,mode){
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
                    result[i][j][0]=0;
                    result[i][j][1]=0;
                }
            }
        }
        return result;
    } 
    if(mode=="color_mode"){
        const rows=result.fftResultArrayRed.length;
        const cols=result.fftResultArrayRed[0].length;
    
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
                    result.fftResultArrayRed[i][j][0]=0;
                    result.fftResultArrayRed[i][j][1]=0;
                    result.fftResultArrayGreen[i][j][0]=0;
                    result.fftResultArrayGreen[i][j][1]=0;
                    result.fftResultArrayBlue[i][j][0]=0;
                    result.fftResultArrayBlue[i][j][1]=0;
                }
            }
        }
        return result;
    }
}

function high_pass_circle(result,width,height,reduction, mode){
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
                    result[i][j][0]=0;
                    result[i][j][1]=0;
                }
            }
        }
        return result;
    }
    if(mode=="color_mode"){
        const rows=result.fftResultArrayRed.length;
        const cols=result.fftResultArrayRed[0].length;
    
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
                    result.fftResultArrayRed[i][j][0]=0;
                    result.fftResultArrayRed[i][j][1]=0;
                    result.fftResultArrayGreen[i][j][0]=0;
                    result.fftResultArrayGreen[i][j][1]=0;
                    result.fftResultArrayBlue[i][j][0]=0;
                    result.fftResultArrayBlue[i][j][1]=0;
                }
            }
        }
        return result;
    }
   
}

function high_pass_circle_standard(result,width,height,reduction,mode){
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
                    result[i][j][0]=0;
                    result[i][j][1]=0;
                }
            }
        }
        return result;
    }
    if(mode=="color_mode"){
        const rows=result.fftResultArrayRed.length;
        const cols=result.fftResultArrayRed[0].length;
    
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
                    result.fftResultArrayRed[i][j][0]=0;
                    result.fftResultArrayRed[i][j][1]=0;
                    result.fftResultArrayGreen[i][j][0]=0;
                    result.fftResultArrayGreen[i][j][1]=0;
                    result.fftResultArrayBlue[i][j][0]=0;
                    result.fftResultArrayBlue[i][j][1]=0;
                }
            }
        }
        return result;
    }
   
}
function sharpen(result,width,height,reduction,mode){
    if(mode=="greyscale_mode"){
        const rows=result.length;
        const cols=result[0].length;
    
        const middleRow=Math.floor(rows/2);
        const middleCol=Math.floor(cols/2);
        if(width<=height){
            reduction=(width*(reduction/100))/2;
            var sharpenDistance=width*(reduction/100);
        }
        if(width>height){
            reduction=(height*(reduction/100))/2;
            var sharpenDistance=height*(reduction/100);
        }
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                var distance=Math.sqrt(Math.pow(i-middleRow,2)+Math.pow(j-middleCol,2));
                if(distance==0){
                    result[i][j][0]=result[i][j][0]*0.5;
                    result[i][j][1]=result[i][j][1]*0.5;
                }
                if(distance>0 && distance<=sharpenDistance){
                    var multiplier=(((distance*0.5)-0)*((4-0.5)/(sharpenDistance/2-0))+0.5);
                    result[i][j][0]=result[i][j][0]*multiplier;
                    result[i][j][1]=result[i][j][1]*multiplier;
                }
                if(distance>sharpenDistance){
                    result[i][j][0]=result[i][j][0]*4;
                    result[i][j][1]=result[i][j][1]*4;
                }
            }
        }
        return result;
    }
    if(mode=="color_mode"){
        const rows=result.fftResultArrayRed.length;
        const cols=result.fftResultArrayRed[0].length;
    
        const middleRow=Math.floor(rows/2);
        const middleCol=Math.floor(cols/2);
        if(width<=height){
            reduction=(width*(reduction/100))/2;
            var sharpenDistance=width*(reduction/100);
        }
        if(width>height){
            reduction=(height*(reduction/100))/2;
            var sharpenDistance=height*(reduction/100);
        }
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                var distance=Math.sqrt(Math.pow(i-middleRow,2)+Math.pow(j-middleCol,2));
                if(distance==0){
                    result.fftResultArrayRed[i][j][0]=result.fftResultArrayRed[i][j][0]*0.5;
                    result.fftResultArrayRed[i][j][1]=result.fftResultArrayRed[i][j][1]*0.5;
                    result.fftResultArrayGreen[i][j][0]=result.fftResultArrayGreen[i][j][0]*0.5;
                    result.fftResultArrayGreen[i][j][1]=result.fftResultArrayGreen[i][j][1]*0.5;
                    result.fftResultArrayBlue[i][j][0]=result.fftResultArrayBlue[i][j][0]*0.5;
                    result.fftResultArrayBlue[i][j][1]=result.fftResultArrayBlue[i][j][1]*0.5;
                }
                if(distance>0 && distance<=sharpenDistance){
                    var multiplier=(((distance*0.5)-0)*((4-0.5)/(sharpenDistance/2-0))+0.5);
                    result.fftResultArrayRed[i][j][0]=result.fftResultArrayRed[i][j][0]*multiplier;
                    result.fftResultArrayRed[i][j][1]=result.fftResultArrayRed[i][j][1]*multiplier;
                    result.fftResultArrayGreen[i][j][0]=result.fftResultArrayGreen[i][j][0]*multiplier;
                    result.fftResultArrayGreen[i][j][1]=result.fftResultArrayGreen[i][j][1]*multiplier;
                    result.fftResultArrayBlue[i][j][0]=result.fftResultArrayBlue[i][j][0]*multiplier;
                    result.fftResultArrayBlue[i][j][1]=result.fftResultArrayBlue[i][j][1]*multiplier;
                }
                if(distance>sharpenDistance){
                    result.fftResultArrayRed[i][j][0]=result.fftResultArrayRed[i][j][0]*4;
                    result.fftResultArrayRed[i][j][1]=result.fftResultArrayRed[i][j][1]*4;
                    result.fftResultArrayGreen[i][j][0]=result.fftResultArrayGreen[i][j][0]*4;
                    result.fftResultArrayGreen[i][j][1]=result.fftResultArrayGreen[i][j][1]*4;
                    result.fftResultArrayBlue[i][j][0]=result.fftResultArrayBlue[i][j][0]*4;
                    result.fftResultArrayBlue[i][j][1]=result.fftResultArrayBlue[i][j][1]*4;
                }
            }
        }
        return result;
    }
   
}

function gaussLowPass(result,slider_value,mode){
    if(mode=="greyscale_mode"){
        const rows = result.length;
        const cols = result[0].length;
        const middleRow = Math.floor(rows / 2);
        const middleCol = Math.floor(cols / 2);
        var sigma=slider_value;
    
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const distance=Math.sqrt(Math.pow(i-middleRow,2)+Math.pow(j-middleCol,2));
                const filterValue = Math.exp(-(distance ** 2) / (2 * sigma ** 2));
                result[i][j][0] *= filterValue;
                result[i][j][1] *= filterValue;                
            }
        }
    
        return result;
    }
    if(mode=="color_mode"){
        const rows = result.fftResultArrayRed.length;
        const cols = result.fftResultArrayRed[0].length;
        const middleRow = Math.floor(rows / 2);
        const middleCol = Math.floor(cols / 2);
        var sigma=slider_value;
    
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const distance=Math.sqrt(Math.pow(i-middleRow,2)+Math.pow(j-middleCol,2));
                const filterValue = Math.exp(-(distance ** 2) / (2 * sigma ** 2));
    
                result.fftResultArrayRed[i][j][0] *= filterValue;
                result.fftResultArrayRed[i][j][1] *= filterValue;
                result.fftResultArrayGreen[i][j][0] *= filterValue;
                result.fftResultArrayGreen[i][j][1] *= filterValue;
                result.fftResultArrayBlue[i][j][0] *= filterValue;
                result.fftResultArrayBlue[i][j][1] *= filterValue;
            }
        }
    
        return result;
    }
    
}
function gaussHighPass(result,slider_value,mode){
    if(mode=="greyscale_mode"){
        const rows = result.length;
        const cols = result[0].length;
        const middleRow = Math.floor(rows / 2);
        const middleCol = Math.floor(cols / 2);
        var sigma = 100-slider_value;

        const filteredResult = [];

        for (let i = 0; i < rows; i++) {
            filteredResult[i] = [];
            for (let j = 0; j < cols; j++) {
                const distance = Math.sqrt(Math.pow(i - middleRow, 2) + Math.pow(j - middleCol, 2));
                const filterValue = Math.exp(-(distance ** 2) / (2 * sigma ** 2));
                filteredResult[i][j] = [
                    result[i][j][0] * filterValue,
                    result[i][j][1] * filterValue
                ];
            }
        }

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                result[i][j][0] -= filteredResult[i][j][0];
                result[i][j][1] -= filteredResult[i][j][1];
            }
        }
        return result;
    }
    if(mode=="color_mode"){
        const rows = result.fftResultArrayRed.length;
        const cols = result.fftResultArrayRed[0].length;
        const middleRow = Math.floor(rows / 2);
        const middleCol = Math.floor(cols / 2);
        var sigma=100-slider_value;

        const filteredResultRed=[];
        const filteredResultGreen=[];
        const filteredResultBlue=[];
    
        for (let i = 0; i < rows; i++) {
            filteredResultRed[i]=[];
            filteredResultGreen[i]=[];
            filteredResultBlue[i]=[];
            for (let j = 0; j < cols; j++) {
                const distance=Math.sqrt(Math.pow(i-middleRow,2)+Math.pow(j-middleCol,2));
                const filterValue = Math.exp(-(distance ** 2) / (2 * sigma ** 2));
                filteredResultRed[i][j]=[
                    result.fftResultArrayRed[i][j][0] * filterValue,
                    result.fftResultArrayRed[i][j][1] * filterValue
                ];
                filteredResultGreen[i][j]=[
                    result.fftResultArrayGreen[i][j][0] * filterValue,
                    result.fftResultArrayGreen[i][j][1] * filterValue
                ];
                filteredResultBlue[i][j]=[
                    result.fftResultArrayBlue[i][j][0] * filterValue,
                    result.fftResultArrayBlue[i][j][1] * filterValue
                ];
            }
        }
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                   
                    result.fftResultArrayRed[i][j][0] -= filteredResultRed[i][j][0];
                    result.fftResultArrayRed[i][j][1] -= filteredResultRed[i][j][1];
                    result.fftResultArrayGreen[i][j][0] -= filteredResultGreen[i][j][0];
                    result.fftResultArrayGreen[i][j][1] -= filteredResultGreen[i][j][1];
                    result.fftResultArrayBlue[i][j][0] -= filteredResultBlue[i][j][0];
                    result.fftResultArrayBlue[i][j][1] -= filteredResultBlue[i][j][1];
                }
            }
    
        return result;
    }
}