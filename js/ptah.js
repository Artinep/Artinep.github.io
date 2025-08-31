self.onmessage = async (event) => {
	if ( typeof event.data.canvas != undefined ) {

		self.canvas = event.data.canvas;
		self.canvas.width = event.data.context.w;
		self.canvas.height = event.data.context.h;	
		self.gl = canvas.getContext("2d");
	
		try {
			const { id, python, context, dadanlah } = event.data;
			self.dadanlah = dadanlah;
			await self.dadanlah.loadPackagesFromImports(python);
			const dict = self.dadanlah.globals.get("dict");
			const globals = dict(Object.entries(context));	

			await self.dadanlah.runPythonAsync(python, { globals });
			self.dadanlah.setStdout({ batched: (str) => console.log(str) });
			let result = "mandeha ledala";
			self.postMessage({ result: result, id: event.data.id });

			function render(time) {
    			// Perform some drawing using the gl context
    			console.log(self.dadanlah.globals.get("sary"));
    			//let sbf = new ImageData(self.dadanlah.globals.get("sary"), event.data.context.w, event.data.context.h);
    			//self.gl.putImageData(sbf, 0, 0);
    			//sbf.destroy();
    			requestAnimationFrame(render);
  			}
  			requestAnimationFrame(render);

		} catch(e) {
			self.postMessage({ result: e.message, id: event.data.id });
		}
	} else {
		//
	}
}