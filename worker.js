importScripts('node_modules/mathjs/lib/browser/math.js');

self.onmessage = function(event) {
    const data=event.data.data;
    var type=event.data.type;
    var mode=event.data.mode;
    if(mode=="greyscale_mode"){
      if(type=="standard"){
        const fftResult=math.fft(data);
  
        const serializedResult = fftResult.map((row) =>
        row.map((complex) => ({
          re: complex.re,
          im: complex.im,
        }))
        );
  
        self.postMessage(serializedResult);
      }
  
      if(type=="inverted"){
    
      const fftResult=math.fft(data);
  
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

    }
    if(mode=="color_mode"){
      if(type=="standard"){
        const redChannel = data.map(row =>
          row.filter((_, index) => index % 4 === 0)
        );
        
        const greenChannel = data.map(row =>
          row.filter((_, index) => index % 4 === 1)
        );
        
        const blueChannel = data.map(row =>
          row.filter((_, index) => index % 4 === 2)
        );
        
        const redfftResult=math.fft(redChannel);
        const greenfftResult=math.fft(greenChannel);
        const bluefftResult=math.fft(blueChannel);

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
      if(type=="inverted"){
        const redChannel = data.map(row =>
          row.filter((_, index) => index % 4 === 0)
        );
        
        const greenChannel = data.map(row =>
          row.filter((_, index) => index % 4 === 1)
        );
        
        const blueChannel = data.map(row =>
          row.filter((_, index) => index % 4 === 2)
        );
        
        const redfftResult=math.fft(redChannel);
        const greenfftResult=math.fft(greenChannel);
        const bluefftResult=math.fft(blueChannel);

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
    }
  };

  function copyArray(array){
    if(!Array.isArray(array)){
      return array;
    }
    return array.map(copyArray);
  }

  