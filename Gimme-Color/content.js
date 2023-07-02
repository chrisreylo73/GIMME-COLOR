chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
   console.log('Message received in content:', request);
   console.log('heyyyy');
});
 