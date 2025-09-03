import { loadPyodide } from "https://artinep.github.io/js/pyodide.mjs";
import { ethers } from "https://artinep.github.io/js/mamanlisany.js";


self.sary = null;
let lp = null;
let loaded = false;


self.onmessage = (event) => {
	if ( typeof event.data.canvas != undefined ) {
		self.canvas = event.data.canvas;
		self.canvas.width = event.data.context.w;
		self.canvas.height = event.data.context.h;	
		self.gl = canvas.getContext("2d");
		loading(self.gl);
		init(event);
	} else {
		//
	}
}

async function init(event) {
	self.dadanlah = await loadPyodide();
	await self.dadanlah.loadPackage("matplotlib");
	const { id, python, context } = event.data;
	await self.dadanlah.loadPackagesFromImports(python);
	const dict = self.dadanlah.globals.get("dict");
	const globals = dict(Object.entries(context));		
	try {
		self.dadanlah.runPythonAsync(python, { globals }).then(() => {			
			self.dadanlah.setStdout({ batched: (str) => console.log(str) });
			clearInterval(lp);
			let result = "mandeha ledala";
			function render(time) {
	    		// Perform some drawing using the gl context
	    		if ( self.sary != undefined ) {
	    			const imageArray = self.sary != undefined ? self.sary.getBuffer(): null;
					const [height, width, channels] = imageArray.shape;
					self.gl.clearRect(0, 0, width, height);			        
				    const rgbaData = new Uint8ClampedArray(width * height * 4);				        
				    for (let y = 0; y < height; y++) {
				        for (let x = 0; x < width; x++) {
				            const rgbaIndex = (y * width + x) * 4;
				            const numpyIndex = (y * width * channels) + (x * channels);				                
				            // Access using regular array syntax
				            rgbaData[rgbaIndex] = imageArray.data[numpyIndex];         // R
				            rgbaData[rgbaIndex + 1] = imageArray.data[numpyIndex + 1]; // G
				            rgbaData[rgbaIndex + 2] = imageArray.data[numpyIndex + 2]; // B
				            rgbaData[rgbaIndex + 3] = channels === 4 ? imageArray.data[numpyIndex + 3] : 255; // A
				        }
				    }				        
				    const imageDataObj = new ImageData(rgbaData, width, height);
				    self.canvas.width = width;
				    self.canvas.height = height;
				    self.gl.putImageData(imageDataObj, 0, 0);				        
	    		}
	    		requestAnimationFrame(render);
  			}
  			requestAnimationFrame(render);
		});
	} catch(e) {
		self.postMessage({ action: "error", result: e.message, id: event.data.id });
		console.log(e);
	}
}

async function loading(ctx) {
	let counter = 0;
	const text = ["Loading ⢿", "Loading ⣻", "Loading ⣽", "Loading ⣾", "Loading ⣷", "Loading ⣯", "Loading ⣟", "Loading ⡿"];
	const top = (self.canvas.height/2) - 12;
	const left = (self.canvas.width/2) - 52;
    lp = setInterval(function() {
		if (counter == (text.length - 1) ) {
			ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
		    ctx.fillStyle = 'black';
		    ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);		    
		    ctx.fillStyle = 'white';
		    ctx.font = '24px Arial';
		    ctx.fillText(text[counter], left, top);
			counter = 0;
		} else {
			ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
		    ctx.fillStyle = 'black';
		    ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);		    
		    ctx.fillStyle = 'white';
		    ctx.font = '24px Arial';
		    ctx.fillText(text[counter], left, top);
			counter++;
		}
		if ( loaded ) clearInterval(lp);
	}, 1000);
}