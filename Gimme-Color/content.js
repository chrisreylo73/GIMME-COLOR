//overlay to prevent clicking action
const overlay = document.createElement("div");
overlay.style.position = "fixed";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.width = "100%";
overlay.style.height = "100%";
overlay.style.zIndex = "9999";

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
