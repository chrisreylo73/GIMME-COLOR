chrome.action.onClicked.addListener(function () {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { message: "iconClicked" });
	});
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	switch (request.message) {
		case "getScreenshot":
			chrome.tabs.captureVisibleTab(null, { format: "png" }, function (dataUrl) {
				console.log(dataUrl);
				sendResponse({ screenshot: dataUrl });
			});
			return true; // Ensure that sendResponse() is called asynchronously
		default:
			break;
	}
});
