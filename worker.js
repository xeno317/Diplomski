self.onmessage = function(event) {
    const data=event.data.data;
    var type=event.data.type;
    var mode=event.data.mode;
   
    transform2D(data);
    
    function transform2D(array) {
      if(mode=="greyscale_mode"){
        if(array.length%2!=0 && type=="inverted"){
          array.push(new Array(array[0].length).fill(0));
        }
        if(array[0].length%2!=0 && type=="inverted"){
          for(let i=0;i<array.length;i++){
            array[i].push(0);
          }
        }
        const numRows = array.length;
        const numCols = array[0].length;
        const fftResultArray = new Array(numRows);
        for (let i = 0; i < numRows; i++) {
          fftResultArray[i] = new Array(numCols);
        }

        for (let i = 0; i < numRows; i++) {
          const row = array[i];
          const realPart = row;
          const imagPart = newArrayOfZeros(numCols);
          transform(realPart, imagPart);
          fftResultArray[i] = row.map((_, j) => [realPart[j], imagPart[j]]);
        }
        array=null;
        let transposedResult = new Array(numCols);
        for (let i = 0; i < numCols; i++) {
          transposedResult[i] = new Array(numRows);
        }

        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            transposedResult[j][i] = fftResultArray[i][j];
          }
        }

        for (let i = 0; i < numCols; i++) {
          const col = transposedResult[i];
          const realPart = col.map((row) => row[0]);
          const imagPart = col.map((row) => row[1]);
          transform(realPart, imagPart);
          for (let j = 0; j < numRows; j++) {
            fftResultArray[j][i] = [realPart[j], imagPart[j]];
          }
        }
        transposedResult=null;
        if(type=="inverted"){
          let shiftedFFT = new Array(numRows).fill(0).map(() => new Array(numCols).fill(0));
          const halfNumRows = Math.floor(numRows / 2);
          const halfNumCols = Math.floor(numCols / 2);
          for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
              let newRow = (i + halfNumRows) % numRows;
              let newCol = (j + halfNumCols) % numCols;
              shiftedFFT[newRow][newCol] = fftResultArray[i][j];
            }
          }
          self.postMessage(shiftedFFT);
        }
        self.postMessage(fftResultArray);
      }
      if(mode=="color_mode"){
        const redChannel = array.map(row =>
          row.filter((_, index) => index % 4 === 0)
        );

        const greenChannel = array.map(row =>
          row.filter((_, index) => index % 4 === 1)
        );
        
        const blueChannel = array.map(row =>
          row.filter((_, index) => index % 4 === 2)
        );
        if(redChannel.length%2!=0 && type=="inverted"){
          redChannel.push(new Array(redChannel[0].length).fill(0));
          blueChannel.push(new Array(greenChannel[0].length).fill(0));
          greenChannel.push(new Array(blueChannel[0].length).fill(0));
        }
        if(redChannel[0].length%2!=0 && type=="inverted"){
          for(let i=0;i<redChannel.length;i++){
            redChannel[i].push(0);
            greenChannel[i].push(0);
            blueChannel[i].push(0);
          }
        }
        const numRows = redChannel.length;
        const numCols = redChannel[0].length;

        var fftResultArrayRed = new Array(numRows);
        var fftResultArrayGreen = new Array(numRows);
        var fftResultArrayBlue = new Array(numRows);

        for (let i = 0; i < numRows; i++) {
          fftResultArrayRed[i] = new Array(numCols);
          fftResultArrayGreen[i] = new Array(numCols);
          fftResultArrayBlue[i] = new Array(numCols);
        }
       
        for (let i = 0; i < numRows; i++) {
          let rowRed = redChannel[i];
          let realPartRed = rowRed;
          let imagPartRed = newArrayOfZeros(numCols);
          let rowGreen = greenChannel[i];
          let realPartGreen = rowGreen;
          let imagPartGreen = newArrayOfZeros(numCols);
          let rowBlue = blueChannel[i];
          let realPartBlue = rowBlue;
          let imagPartBlue = newArrayOfZeros(numCols);

          transform(realPartRed, imagPartRed);
          transform(realPartGreen, imagPartGreen);
          transform(realPartBlue, imagPartBlue);

          fftResultArrayRed[i] = rowRed.map((_, j) => [realPartRed[j], imagPartRed[j]]);
          fftResultArrayGreen[i] = rowGreen.map((_, j) => [realPartGreen[j], imagPartGreen[j]]);
          fftResultArrayBlue[i] = rowBlue.map((_, j) => [realPartBlue[j], imagPartBlue[j]]);
        }

        const transposedResultRed = new Array(numCols);
        const transposedResultGreen = new Array(numCols);
        const transposedResultBlue = new Array(numCols);
        for (let i = 0; i < numCols; i++) {
          transposedResultRed[i] = new Array(numRows);
          transposedResultGreen[i] = new Array(numRows);
          transposedResultBlue[i] = new Array(numRows);
        }

        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            transposedResultRed[j][i] = fftResultArrayRed[i][j];
            transposedResultGreen[j][i] = fftResultArrayGreen[i][j];
            transposedResultBlue[j][i] = fftResultArrayBlue[i][j];
          }
        }

        for (let i = 0; i < numCols; i++) {
          let colRed = transposedResultRed[i];
          let colGreen = transposedResultGreen[i];
          let colBlue = transposedResultBlue[i];

          let realPartRed = colRed.map((row) => row[0]);
          let imagPartRed = colRed.map((row) => row[1]);
          let realPartGreen = colGreen.map((row) => row[0]);
          let imagPartGreen = colGreen.map((row) => row[1]);
          let realPartBlue = colBlue.map((row) => row[0]);
          let imagPartBlue = colBlue.map((row) => row[1]);

          transform(realPartRed, imagPartRed);
          transform(realPartGreen, imagPartGreen);
          transform(realPartBlue, imagPartBlue);
          for (let j = 0; j < numRows; j++) {
            fftResultArrayRed[j][i] = [realPartRed[j], imagPartRed[j]];
            fftResultArrayGreen[j][i] = [realPartGreen[j], imagPartGreen[j]];
            fftResultArrayBlue[j][i] = [realPartBlue[j], imagPartBlue[j]];
          }
        }

        if(type=="inverted"){
          let shiftedFFTRed = new Array(numRows).fill(0).map(() => new Array(numCols).fill(0));
          let shiftedFFTGreen = new Array(numRows).fill(0).map(() => new Array(numCols).fill(0));
          let shiftedFFTBlue = new Array(numRows).fill(0).map(() => new Array(numCols).fill(0));
          const halfNumRows = Math.floor(numRows / 2);
          const halfNumCols = Math.floor(numCols / 2);
            for (let i = 0; i < numRows; i++) {
              for (let j = 0; j < numCols; j++) {
                let newRow = (i + halfNumRows) % numRows;
                let newCol = (j + halfNumCols) % numCols;
                shiftedFFTRed[newRow][newCol] = fftResultArrayRed[i][j];
                shiftedFFTGreen[newRow][newCol] = fftResultArrayGreen[i][j];
                shiftedFFTBlue[newRow][newCol] = fftResultArrayBlue[i][j];
              }
            }
            fftResultArrayRed=shiftedFFTRed;
            fftResultArrayGreen=shiftedFFTGreen;
            fftResultArrayBlue=shiftedFFTBlue;
            let serializedResult = {fftResultArrayRed,fftResultArrayGreen,fftResultArrayBlue};
            self.postMessage(serializedResult);
        }
        let serializedResult = {fftResultArrayRed,fftResultArrayGreen,fftResultArrayBlue};
        self.postMessage(serializedResult);
      }
  }

  /*
  * Free FFT and convolution (compiled from TypeScript)
  *
  * Copyright (c) 2022 Project Nayuki. (MIT License)
  * https://www.nayuki.io/page/free-small-fft-in-multiple-languages
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy of
  * this software and associated documentation files (the "Software"), to deal in
  * the Software without restriction, including without limitation the rights to
  * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
  * the Software, and to permit persons to whom the Software is furnished to do so,
  * subject to the following conditions:
  * - The above copyright notice and this permission notice shall be included in
  *   all copies or substantial portions of the Software.
  * - The Software is provided "as is", without warranty of any kind, express or
  *   implied, including but not limited to the warranties of merchantability,
  *   fitness for a particular purpose and noninfringement. In no event shall the
  *   authors or copyright holders be liable for any claim, damages or other
  *   liability, whether in an action of contract, tort or otherwise, arising from,
  *   out of or in connection with the Software or the use or other dealings in the
  *   Software.
  */
  "use strict";
  /*
  * Computes the discrete Fourier transform (DFT) of the given complex vector, storing the result back into the vector.
  * The vector can have any length. This is a wrapper function.
  */
  function transform(real, imag) {
      const n = real.length;
      if (n != imag.length)
          throw new RangeError("Mismatched lengths");
      if (n == 0)
          return;
      else if ((n & (n - 1)) == 0) // Is power of 2
          transformRadix2(real, imag);
      else // More complicated algorithm for arbitrary sizes
          transformBluestein(real, imag);
  }
  /*
  * Computes the inverse discrete Fourier transform (IDFT) of the given complex vector, storing the result back into the vector.
  * The vector can have any length. This is a wrapper function. This transform does not perform scaling, so the inverse is not a true inverse.
  */
  function inverseTransform(real, imag) {
      transform(imag, real);
  }
  /*
  * Computes the discrete Fourier transform (DFT) of the given complex vector, storing the result back into the vector.
  * The vector's length must be a power of 2. Uses the Cooley-Tukey decimation-in-time radix-2 algorithm.
  */
  function transformRadix2(real, imag) {
      // Length variables
      const n = real.length;
      if (n != imag.length)
          throw new RangeError("Mismatched lengths");
      if (n == 1) // Trivial transform
          return;
      let levels = -1;
      for (let i = 0; i < 32; i++) {
          if (1 << i == n)
              levels = i; // Equal to log2(n)
      }
      if (levels == -1)
          throw new RangeError("Length is not a power of 2");
      // Trigonometric tables
      let cosTable = new Array(n / 2);
      let sinTable = new Array(n / 2);
      for (let i = 0; i < n / 2; i++) {
          cosTable[i] = Math.cos(2 * Math.PI * i / n);
          sinTable[i] = Math.sin(2 * Math.PI * i / n);
      }
      // Bit-reversed addressing permutation
      for (let i = 0; i < n; i++) {
          const j = reverseBits(i, levels);
          if (j > i) {
              let temp = real[i];
              real[i] = real[j];
              real[j] = temp;
              temp = imag[i];
              imag[i] = imag[j];
              imag[j] = temp;
          }
      }
      // Cooley-Tukey decimation-in-time radix-2 FFT
      for (let size = 2; size <= n; size *= 2) {
          const halfsize = size / 2;
          const tablestep = n / size;
          for (let i = 0; i < n; i += size) {
              for (let j = i, k = 0; j < i + halfsize; j++, k += tablestep) {
                  const l = j + halfsize;
                  const tpre = real[l] * cosTable[k] + imag[l] * sinTable[k];
                  const tpim = -real[l] * sinTable[k] + imag[l] * cosTable[k];
                  real[l] = real[j] - tpre;
                  imag[l] = imag[j] - tpim;
                  real[j] += tpre;
                  imag[j] += tpim;
              }
          }
      }
      // Returns the integer whose value is the reverse of the lowest 'width' bits of the integer 'val'.
      function reverseBits(val, width) {
          let result = 0;
          for (let i = 0; i < width; i++) {
              result = (result << 1) | (val & 1);
              val >>>= 1;
          }
          return result;
      }
  }
  /*
  * Computes the discrete Fourier transform (DFT) of the given complex vector, storing the result back into the vector.
  * The vector can have any length. This requires the convolution function, which in turn requires the radix-2 FFT function.
  * Uses Bluestein's chirp z-transform algorithm.
  */
  function transformBluestein(real, imag) {
      // Find a power-of-2 convolution length m such that m >= n * 2 + 1
      const n = real.length;
      if (n != imag.length)
          throw new RangeError("Mismatched lengths");
      let m = 1;
      while (m < n * 2 + 1)
          m *= 2;
      // Trigonometric tables
      let cosTable = new Array(n);
      let sinTable = new Array(n);
      for (let i = 0; i < n; i++) {
          const j = i * i % (n * 2); // This is more accurate than j = i * i
          cosTable[i] = Math.cos(Math.PI * j / n);
          sinTable[i] = Math.sin(Math.PI * j / n);
      }
      // Temporary vectors and preprocessing
      let areal = newArrayOfZeros(m);
      let aimag = newArrayOfZeros(m);
      for (let i = 0; i < n; i++) {
          areal[i] = real[i] * cosTable[i] + imag[i] * sinTable[i];
          aimag[i] = -real[i] * sinTable[i] + imag[i] * cosTable[i];
      }
      let breal = newArrayOfZeros(m);
      let bimag = newArrayOfZeros(m);
      breal[0] = cosTable[0];
      bimag[0] = sinTable[0];
      for (let i = 1; i < n; i++) {
          breal[i] = breal[m - i] = cosTable[i];
          bimag[i] = bimag[m - i] = sinTable[i];
      }
      // Convolution
      let creal = new Array(m);
      let cimag = new Array(m);
      convolveComplex(areal, aimag, breal, bimag, creal, cimag);
      // Postprocessing
      for (let i = 0; i < n; i++) {
          real[i] = creal[i] * cosTable[i] + cimag[i] * sinTable[i];
          imag[i] = -creal[i] * sinTable[i] + cimag[i] * cosTable[i];
      }
  }
  /*
  * Computes the circular convolution of the given real vectors. Each vector's length must be the same.
  */
  /*
  * Computes the circular convolution of the given complex vectors. Each vector's length must be the same.
  */
  function convolveComplex(xreal, ximag, yreal, yimag, outreal, outimag) {
      const n = xreal.length;
      if (n != ximag.length || n != yreal.length || n != yimag.length
          || n != outreal.length || n != outimag.length)
          throw new RangeError("Mismatched lengths");
      xreal = xreal.slice();
      ximag = ximag.slice();
      yreal = yreal.slice();
      yimag = yimag.slice();
      transform(xreal, ximag);
      transform(yreal, yimag);
      for (let i = 0; i < n; i++) {
          const temp = xreal[i] * yreal[i] - ximag[i] * yimag[i];
          ximag[i] = ximag[i] * yreal[i] + xreal[i] * yimag[i];
          xreal[i] = temp;
      }
      inverseTransform(xreal, ximag);
      for (let i = 0; i < n; i++) { // Scaling (because this FFT implementation omits it)
          outreal[i] = xreal[i] / n;
          outimag[i] = ximag[i] / n;
      }
  }
  function newArrayOfZeros(n) {
    let result = [];
    for (let i = 0; i < n; i++)
        result.push(0);
    return result;
  }
}

  