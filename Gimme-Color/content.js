//overlay to prevent clicking action
const css = document.createElement("style");
css.innerHTML = `
   .overlay-gc {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
   }

   .feedback-gc {
      top: 0;
      right: 0;
      position: absolute;
		z-index: 9999999;
      display: flex;
		justify-content: center;
		align-items: center;
      background-color: #272c42;
      color: white;
		border-radius: 8px;
		padding: 2px;
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.9);
      height: 30px;
      width: 180px;
      text-align: center;
      margin: 20px auto;
    }
    
`;
// creates the ccm element
document.head.appendChild(css);

// Creates Overlay
const overlay = document.createElement("div");
overlay.className = "overlay-gc";

// const feedback = document.createElement("div");
// feedback.className = "feedback";
// feedback.textContent = `: Added to Clipboard`;
// document.body.appendChild(feedback);

// Listens for messages from background
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	switch (request.message) {
		case "iconClicked":
			console.log("Message received in content:", request.message);
			document.body.style.cursor = "crosshair";
			document.body.appendChild(overlay);
			document.addEventListener("click", clickHandler);
			break;
		default:
			break;
	}
});

function clickHandler(event) {
	console.log("Click event!");
	document.body.style.cursor = "default";
	const x = event.clientX;
	const y = event.clientY;
	getPixelColor(x, y);
	document.body.removeChild(overlay);
	document.removeEventListener("click", clickHandler);
}

function getPixelColor(x, y) {
	chrome.runtime.sendMessage({ message: "getScreenshot" }, function (response) {
		const screenshot = response.screenshot;
		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");
		var img = new Image();
		img.src = screenshot;
		// Wait for the image to load before cropping it
		img.onload = function () {
			try {
				canvas.width = img.width;
				canvas.height = img.height;
				let xScale = img.width / window.innerWidth;
				let yScale = img.height / window.innerHeight;
				context.drawImage(img, 0, 0);
				x = x * xScale;
				y = y * yScale;
				const pixelData = context.getImageData(x, y, 1, 1).data;
				const rgbaColor = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3]})`;
				const hexColor = getHexValue(rgbaColor);
				console.log(rgbaColor);
				console.log(hexColor);
				saveToClipboard(hexColor);
				chrome.runtime.sendMessage({ message: "updateBadge", color: hexColor });
			} catch (error) {
				console.log(error, "error occurred!");
			}
		};
	});
}

function getHexValue(rgbaColor) {
	const rgbaValues = rgbaColor.slice(5, -1).split(",");
	const red = parseInt(rgbaValues[0].trim());
	const green = parseInt(rgbaValues[1].trim());
	const blue = parseInt(rgbaValues[2].trim());

	const hexRed = red.toString(16).padStart(2, "0");
	const hexGreen = green.toString(16).padStart(2, "0");
	const hexBlue = blue.toString(16).padStart(2, "0");
	const hexColor = `#${hexRed}${hexGreen}${hexBlue}`;
	return hexColor;
}

function saveToClipboard(text) {
	navigator.clipboard.writeText(text);
}
