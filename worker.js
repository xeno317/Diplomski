importScripts('node_modules/mathjs/lib/browser/math.js');

self.onmessage = function(event) {
    const data=event.data.data;
    var type=event.data.type;
    var mode=event.data.mode;
    var result=event.data.result;
    var typeNow=event.data.typeNow;
    if(mode=="greyscale_mode"){
       if(result==undefined){
          var fftResult=math.fft(data);
        }
        if(result){
          var fftResult=result;
        }
      if(type=="standard"){ 
        if(typeNow=="inverted"){
          const numRows=fftResult.length;
          const numCols=fftResult[0].length;
      
          const halfNumRows = Math.floor(numRows / 2);
          const halfNumCols = Math.floor(numCols / 2);
      
          const shiftedFFT = math.zeros([numRows, numCols]);
          for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
              const newRow = (i + halfNumRows) % numRows;
              const newCol = (j + halfNumCols) % numCols;
              shiftedFFT[newRow][newCol] = fftResult[i][j];
            }
          }
          const serializedResult = shiftedFFT.map((row) =>
          row.map((complex) => ({
            re: complex.re,
            im: complex.im,
            }))
          );
      
          self.postMessage(serializedResult);
        }
        else{
          const serializedResult = fftResult.map((row) =>
          row.map((complex) => ({
            re: complex.re,
            im: complex.im,
          }))
          );
    
          self.postMessage(serializedResult);
        }
        
      }
  
      if(type=="inverted"){
        if(typeNow=="standard"){
          const numRows=fftResult.length;
          const numCols=fftResult[0].length;
      
          const halfNumRows = Math.floor(numRows / 2);
          const halfNumCols = Math.floor(numCols / 2);
      
          const shiftedFFT = math.zeros([numRows, numCols]);
          for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
              const newRow = (i + halfNumRows) % numRows;
              const newCol = (j + halfNumCols) % numCols;
              shiftedFFT[newRow][newCol] = fftResult[i][j];
            }
          }
          const serializedResult = shiftedFFT.map((row) =>
          row.map((complex) => ({
            re: complex.re,
            im: complex.im,
            }))
          );
      
          self.postMessage(serializedResult);
        }
        else{
          const serializedResult = fftResult.map((row) =>
          row.map((complex) => ({
            re: complex.re,
            im: complex.im,
          }))
          );
    
          self.postMessage(serializedResult);
        }    
      }
    }
    if(mode=="color_mode"){
      if(result==undefined){
        const redChannel = data.map(row =>
          row.filter((_, index) => index % 4 === 0)
        );
        
        const greenChannel = data.map(row =>
          row.filter((_, index) => index % 4 === 1)
        );
        
        const blueChannel = data.map(row =>
          row.filter((_, index) => index % 4 === 2)
        );
        var redfftResult=math.fft(redChannel);
        var greenfftResult=math.fft(greenChannel);
        var bluefftResult=math.fft(blueChannel);
      }
      if(result){
        var redfftResult=result.red;
        var greenfftResult=result.green;
        var bluefftResult=result.blue;
      }
      if(type=="standard"){
        if(typeNow=="inverted"){
          const numRows=redfftResult.length;
          const numCols=redfftResult[0].length;
    
          const halfNumRows = Math.floor(numRows / 2);
          const halfNumCols = Math.floor(numCols / 2);
    
          const shiftedFFTR = math.zeros([numRows, numCols]);
          const shiftedFFTG = math.zeros([numRows, numCols]);
          const shiftedFFTB = math.zeros([numRows, numCols]);
          for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
              const newRow = (i + halfNumRows) % numRows;
              const newCol = (j + halfNumCols) % numCols;
              shiftedFFTR[newRow][newCol] = redfftResult[i][j];
              shiftedFFTG[newRow][newCol] = greenfftResult[i][j];
              shiftedFFTB[newRow][newCol] = bluefftResult[i][j];
            }
          }
  
          const serializedResult = {
            red: shiftedFFTR.map(row =>
              row.map(complex => ({
                re: complex.re,
                im: complex.im
              }))
            ),
            green: shiftedFFTG.map(row =>
              row.map(complex => ({
                re: complex.re,
                im: complex.im
              }))
            ),
            blue: shiftedFFTB.map(row =>
              row.map(complex => ({
                re: complex.re,
                im: complex.im
              }))
            )
          };
          
          self.postMessage(serializedResult);
        }
        else{
          const serializedResult = {
            red: redfftResult.map(row =>
              row.map(complex => ({
                re: complex.re,
                im: complex.im
              }))
            ),
            green: greenfftResult.map(row =>
              row.map(complex => ({
                re: complex.re,
                im: complex.im
              }))
            ),
            blue: bluefftResult.map(row =>
              row.map(complex => ({
                re: complex.re,
                im: complex.im
              }))
            )
          };
          
          self.postMessage(serializedResult);
        }
      }
      if(type=="inverted"){
        if(typeNow=="standard"){
          const numRows=redfftResult.length;
        const numCols=redfftResult[0].length;
  
        const halfNumRows = Math.floor(numRows / 2);
        const halfNumCols = Math.floor(numCols / 2);
  
        const shiftedFFTR = math.zeros([numRows, numCols]);
        const shiftedFFTG = math.zeros([numRows, numCols]);
        const shiftedFFTB = math.zeros([numRows, numCols]);
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            const newRow = (i + halfNumRows) % numRows;
            const newCol = (j + halfNumCols) % numCols;
            shiftedFFTR[newRow][newCol] = redfftResult[i][j];
            shiftedFFTG[newRow][newCol] = greenfftResult[i][j];
            shiftedFFTB[newRow][newCol] = bluefftResult[i][j];
          }
        }

        const serializedResult = {
          red: shiftedFFTR.map(row =>
            row.map(complex => ({
              re: complex.re,
              im: complex.im
            }))
          ),
          green: shiftedFFTG.map(row =>
            row.map(complex => ({
              re: complex.re,
              im: complex.im
            }))
          ),
          blue: shiftedFFTB.map(row =>
            row.map(complex => ({
              re: complex.re,
              im: complex.im
            }))
          )
        };
        
        self.postMessage(serializedResult);
        }
        else{
          const serializedResult = {
            red: redfftResult.map(row =>
              row.map(complex => ({
                re: complex.re,
                im: complex.im
              }))
            ),
            green: greenfftResult.map(row =>
              row.map(complex => ({
                re: complex.re,
                im: complex.im
              }))
            ),
            blue: bluefftResult.map(row =>
              row.map(complex => ({
                re: complex.re,
                im: complex.im
              }))
            )
          };
          
          self.postMessage(serializedResult);
        }
      }
    }
  };

  function copyArray(array){
    if(!Array.isArray(array)){
      return array;
    }
    return array.map(copyArray);
  }

  