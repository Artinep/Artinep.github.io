/** -------------------------------------------------------------------------------------------------------------
 * 	Author: Artinep
 * 	Email: randriampenitra@gmail.com
 * 	Version: ES6 compatible
 *  -------------------------------------------------------------------------------------------------------------
 **/

class Navigation {
	constructor(x,y) {
		this.dom = x;
		this.popup = y;
		this.locked = true;
		this.humanClick = window.humanClick;
		this.escapeUrl = "https://www.google.com";
		this.menu = '<button class="largebutton" id="setMainPage">Main page</button><button class="largebutton" id="setPassword">Update password</button><button class="largebutton" id="setWallet">Wallet</button><button class="largebutton" id="setHistory">History</button><button class="largebutton" id="setPool">Pool</button><button class="largebutton" id="setHelp">Help</button><button class="largebutton" id="setAbout">About</button>';
		this.key = undefined;
		this.dontBurteforceUrMama = 0;
	}

	get isLocked() { return this.locked; }
	set isLocked(lk) { this.locked = lk; }
	get navigationKey() { return this.key; }
	set navigationKey(ky) {
		let encrypted = CryptoJS.AES.encrypt(JSON.stringify({ ky }), ky);
		let notAFuckingCircularType = encrypted.toString();
		this.key = notAFuckingCircularType; 
	}

	getClearKey(key) {
		try {
			if ( this.key != undefined ) {
				let decrypted = CryptoJS.AES.decrypt(this.key, key);
				let cleartext = decrypted.toString(CryptoJS.enc.Utf8);
				return cleartext;
			} else return undefined;
		} catch (e) { return undefined; }
	}

	isCompatible() {
		if ("WebAssembly" in window && typeof WebAssembly === "object" && typeof WebAssembly.instantiate === "function") { console.log('[test] wasm compatibility: OK'); }
		else {throw new Error('Your browser is not compatible WASM!');alert('Your browser is not compatible WASM!');}
	}

	isWebDrived() {
		if ( navigator.webdriver === true ) {
		    window.location.replace(this.escapeUrl);throw new Error('Error!');
		} else if ( typeof navigator.webdriver === 'undefined' ) {
		    window.location.replace(this.escapeUrl);throw new Error('Error!');
		} else if ( Object.getOwnPropertyNames(navigator).length !== 0 ) {
		    window.location.replace(this.escapeUrl);throw new Error('Error!');
		} else if ( Object.getOwnPropertyDescriptor( navigator, 'webdriver' ) !== undefined ) {
		    window.location.replace(this.escapeUrl);throw new Error('Error!');
		}
	}

	async detectDivClassSearch() {
		document.getElementsByClassName = (function (original) {
		    return function () {                 
		        window.location.replace(this.escapeUrl);
		        throw new Error('Error!');
		        return original.apply(this, arguments);
		    }
		}(document.getElementsByClassName));
	}

	async detectDivIdSearch() {
		document.getElementById = (function (original) {
		    return function () {
		        if ( this.humanClick == false ) {
		            window.location.replace(this.escapeUrl);
		            throw new Error('Error!');
		        }
		        return original.apply(this, arguments);
		    }
		})(document.getElementById);
	}

	async headLessTest() {
		navigator.permissions.query({name:'notifications'}).then(function(permissionStatus) {
		    if( Notification.permission === 'denied' && permissionStatus.state === 'prompt' ) {
		        window.location.replace(this.escapeUrl);
		        throw new Error('Error!');
		    }
		});
	}

	showMenu(ctn) {
		this.humanClick = true;
		const modal = document.getElementById(this.popup);
		if (modal.style.display == "block") {
			modal.innerHTML = '';
			modal.style.display = "none";
		} else {
			modal.innerHTML = ctn+'<button class="largebutton" id="setCancel">Close</button>';
			modal.style.display = "block";
		}
		this.humanClick = false;
	}

	updateMainPage(page) {
		this.humanClick = true;
		const mn = document.getElementById(this.dom);
		const pop = document.getElementById(this.popup);
		if (this.locked) {
			// verouiller
			pop.innerHTML = '';
			  	pop.style.display = "none";
			  	this.showMenu('<h4>Please unlock main page to access menu.</h4>');
		} else {
			mn.innerHTML = '<div class="space"></div>'+page;
			if (pop.style.display == "block") {
		    	pop.innerHTML = '';
		    	pop.style.display = "none";
		    }
		}
		this.humanClick = false;
	}

	storageAvailable(type) {
		// https://developer.mozilla.org/
		let storage;
		try {
		    storage = window[type];
		    const x = "__storage_test__";
		    storage.setItem(x, x);
		    storage.removeItem(x);
		    return true;
		} catch (e) {
		   	return (
		    	e instanceof DOMException && e.name === "QuotaExceededError" && storage && storage.length !== 0
		   	);
		}
	}

	checkStorage() {
		if (this.storageAvailable("localStorage")) {
			console.log("[test] access data storage: OK");
		} else {
			alert("ACCESS DATA STORAGE FAIL: You may be in private browsing mode or data storage doesn't exist on your browser or it may be blocked. Sorry! this page will not work on your browser.");
		}
	}

	isDataExist() {
		try {
			let data = window.storage.getItem("defaultUser");
			if ( data.length > 0 ) { 
				return true; 
			} else return false;			
		} catch (er) { return false; }
	}

	getData() {
		try {
			let data = window.storage.getItem("defaultUser");
			let decrypted = window.encryption.decrypt(this.cutString(this.sliceString(data), data), this.sliceString(data));
			let dataObject = JSON.parse(JSON.parse(JSON.stringify(decrypted)));
			Object.keys(dataObject).forEach(key => { window.userData[key] = dataObject[key]; });
			return true;			
		} catch (e) {
			return false;
		}
	}

	updateData(data) {
		// need to update user data first, this will encrypts it to storage:
		if ( this.key != undefined ) {
			let encrypted = window.encryption.encrypt(JSON.stringify(data), this.key);
			let ojbect = this.key.concat(encrypted);
			console.log("key: "+this.key);
			console.log("data: "+ojbect);
			window.storage.setItem("defaultUser", ojbect);
		}
	}

	unlockData(userkey) {
		if ( this.dontBurteforceUrMama < 30 ) {
			try {
				let encrypted = CryptoJS.AES.encrypt(JSON.stringify({ userkey }), userkey);
				let ukey = encrypted.toString();
				let data = window.storage.getItem("defaultUser");
				let decrypted = window.encryption.decrypt(this.cutString(ukey, data), ukey);
				let dataObject = JSON.parse(JSON.parse(JSON.stringify(decrypted)));
				Object.keys(dataObject).forEach(key => { window.userData[key] = dataObject[key]; });
				if ( window.userData["default"] == ukey ) this.key = ukey;
			} catch (err) { this.dontBurteforceUrMama++;console.log(err); }
		} else this.dontBurteforceUrMama++;
	}

	sliceString(strng) {
		let len = this.key.length;
		return strng.slice(0, len);
	}

	cutString(rmv, strng) {
		return strng.replace(rmv, "");
	}

	checkLockTimeout(page) {
		if ( this.getData() ) {
			let timeout = window.userData["lock"];
			let lastlog = window.userData["time"];
			if ( lastlog != 0 ) {
				let second = timeout * 60;
				let now = Math.round(Date.now() / 1000);
				let elapsed = lastlog + second;
				if ( elapsed > now ) {
					this.locked = false;
					window.userData["time"] = now;
					this.updateData(window.userData);
					this.updateMainPage(page);
				}
			}
		}
	}

	setLockTimeout() {
		let timeout = window.userData["lock"];
		let lastlog = window.userData["time"];
		let second = timeout * 60;
		let now = Math.round(Date.now() / 1000);
		window.userData["time"] = now;
		this.updateData(window.userData);
	}

	generateRandomString(length) {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		let result = '';
		const randomValues = new Uint32Array(length);
		window.crypto.getRandomValues(randomValues);
		randomValues.forEach((value) => {
			result += characters.charAt(value % charactersLength);
		});
		return result;
	}

}

export { Navigation };