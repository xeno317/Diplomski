importScripts('node_modules/mathjs/lib/browser/math.js');

self.onmessage = function(event) {
    const data=event.data.data;
    const mode=event.data.mode;
    if(mode=="greyscale_mode"){
      const datas = data.map((row) =>
    row.map((serializedComplex) => math.complex(serializedComplex.re, serializedComplex.im))
  );

    const fftResult=math.ifft(datas);

    const serializedResult = fftResult.map((row) =>
    row.map((complex) => ({
      re: complex.re,
      im: complex.im,
    }))
  );

    self.postMessage(serializedResult);
    }
    if(mode=="color_mode"){
      const dataRed=data.red;
      const dataGreen=data.green;
      const dataBlue=data.blue;

      const datar = dataRed.map((row) =>
      row.map((serializedComplex) => math.complex(serializedComplex.re, serializedComplex.im))
      );
      const datag = dataGreen.map((row) =>
      row.map((serializedComplex) => math.complex(serializedComplex.re, serializedComplex.im))
      );
      const datab = dataBlue.map((row) =>
      row.map((serializedComplex) => math.complex(serializedComplex.re, serializedComplex.im))
      );

      const fftResultR=math.ifft(datar);
      const fftResultG=math.ifft(datag);
      const fftResultB=math.ifft(datab);

      const serializedResult = {
        red: fftResultR.map(row =>
          row.map(complex => ({
            re: complex.re,
            im: complex.im
          }))
        ),
        green: fftResultG.map(row =>
          row.map(complex => ({
            re: complex.re,
            im: complex.im
          }))
        ),
        blue: fftResultB.map(row =>
          row.map(complex => ({
            re: complex.re,
            im: complex.im
          }))
        )
      };
      
      self.postMessage(serializedResult);

    }
    
  }