importScripts('node_modules/mathjs/lib/browser/math.js');
// worker.js
self.onmessage = function(event) {
    const data=event.data.data;
    var type=event.data.type;
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
    //const shiftedFFT=copyArray(fftResult);
/*
    for(let row=0;row<rows;row++){
      for(let col=0;col<columns;col++){

        const dx = col - centerX;
        const dy = row - centerY;

        const invertedRow = centerY - dy;
        const invertedCol = centerX - dx;

       // const newRow=Math.abs(row-Math.floor(rows/2));
       //const newCol=Math.abs(col-Math.floor(columns/2));
       //console.log(invertedRow,invertedCol,row,col);
        shiftedFFT[invertedRow][invertedCol]=fftResult[row][col];
      }
    } */  
/*
    const numRows = fftResult.length;
    const numCols = fftResult[0].length;

    const shiftedFFT = math.zeros([numRows, numCols]);
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        const shiftFactor = Math.pow(-1, i + j);
        shiftedFFT.slice(math.index(i, j), math.multiply(fftResult.slice(math.index(i, j)), shiftFactor));
      }
    }
    */
    const serializedResult = shiftedFFT.map((row) =>
    row.map((complex) => ({
      re: complex.re,
      im: complex.im,
    }))
    );

    self.postMessage(serializedResult);
    }
  };

  function copyArray(array){
    if(!Array.isArray(array)){
      return array;
    }
    return array.map(copyArray);
  }

  