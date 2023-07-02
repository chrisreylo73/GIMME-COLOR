

const overlay = document.createElement("div");
overlay.style.position = "fixed";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.width = "100%";
overlay.style.height = "100%";
overlay.style.zIndex = "9999";

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
   switch (request.message) {
      case "iconClicked":
         console.log('Message received in content:', request.message);
         document.body.style.cursor = "crosshair";
         // document.body.appendChild(overlay);
         break;
      default:
         break;
   }
});




document.addEventListener("click", function (event) {
   console.log("Click event!");
   document.body.style.cursor = "default";
   const x = event.clientX;
   const y = event.clientY;
   const pixelColor = getPixelColor(x, y);
   console.log('Pixel color:', pixelColor);
   // document.body.removeChild(overlay);
})

 
 function getPixelColor(x, y) {
   const canvas = document.createElement('canvas');
   const context = canvas.getContext('2d');
   const pixelData = new Uint8Array(4);
 
   canvas.width = 1;
   canvas.height = 1;
   context.drawImage(document.documentElement, -x, -y, 1, 1, 0, 0, 1, 1);
   context.getImageData(0, 0, 1, 1).data.set(pixelData);
 
   const rgbaColor = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3]})`;
   return rgbaColor;
 }






// const cursor = () => {

// };

// const clipboard = () => {

// };

// const hexValue = () => {

// };