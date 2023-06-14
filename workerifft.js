importScripts('node_modules/mathjs/lib/browser/math.js');
// worker.js
self.onmessage = function(event) {
    const data=event.data;

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
    // Send the result back to the main thread
    self.postMessage(serializedResult);
  }