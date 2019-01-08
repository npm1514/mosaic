var colorList = [];
var uniqueColorList = [];
var divisiblesWidth = 15;
var divisiblesHeight = 15;
var canvasWidth = "";
var accuracy = 50;

function placeImage(){
  var inputDivision = document.getElementById('inputDivision').value;
  if(inputDivision){
    divisiblesWidth = parseInt(inputDivision);
    divisiblesHeight = parseInt(inputDivision);
  }
  var colorAccuracy = document.getElementById('colorAccuracy').value;
  if(colorAccuracy) accuracy = parseInt(colorAccuracy);
  var fileImg = document.getElementById('imgFile').files[0];
  var reader  = new FileReader();
  reader.onloadend = function () {
    var img = document.getElementById('imgVisual');
    img.onload = getCanvasData;
    img.src = reader.result;
  }
  reader.readAsDataURL(fileImg);
}

function getCanvasData(){
  var img = document.getElementById('imgVisual');
  var canvas = document.createElement('canvas');
  if(img.width != img.height) divisiblesHeight = parseInt(img.height*divisiblesWidth/img.width);
  canvas.width = img.width;
  canvas.height = img.height;
  canvasWidth = img.width;
  canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
  document.getElementById('mosaicOverlay').style.height = img.height + "px";
  document.getElementById('mosaicOverlay').style.width = img.width + "px";

  for (var k = 0; k < divisiblesHeight; k++) {
    for (var j = 0; j < divisiblesWidth; j++){
      var xpos = j*img.width/divisiblesWidth;
      var ypos = k*img.height/divisiblesHeight;
      var xwide = img.width/divisiblesWidth;
      var yhigh = img.height/divisiblesHeight;
      var data = canvas.getContext('2d').getImageData(xpos, ypos, xwide, yhigh).data;
      var multiplier = xwide * yhigh;
      var totalr = 0;
      var totalg = 0;
      var totalb = 0;
      var totala = 0;

      var accuracyNum = Math.floor(accuracy*-2.54 + 255)
      for(var i = 0; i < data.length; i += 4){
        totalr += data[i];
        totalg += data[i+1];
        totalb += data[i+2];
        // totala += data[i+3]/255;
      }
      colorList.push(
          Math.ceil(totalr/accuracyNum/multiplier)*accuracyNum
        + ','
        + Math.ceil(totalg/accuracyNum/multiplier)*accuracyNum
        + ','
        + Math.ceil(totalb/accuracyNum/multiplier)*accuracyNum
      );
    }
  }

  uniqueColorList = colorList.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
  console.log(uniqueColorList.length);
  placeMosaic(img.height, img.width);
}



function placeMosaic(height, width){
  var mosOL = document.getElementById('mosaicOverlay');
  mosOL.innerHTML = "";
  for (var i = 0; i < (divisiblesWidth*divisiblesHeight); i++) {
    var div = document.createElement('div');
    div.className = "mosBlock";
    div.style.width = (width/divisiblesWidth) + "px";
    div.style.height = (height/divisiblesHeight) + "px";
    var colorNum = uniqueColorList.findIndex(function (color) {
      return color ==  colorList[i];
    }) + 1;
    div.innerText = colorNum;
    div.style.backgroundColor = "rgb("+colorList[i]+")";
    mosOL.appendChild(div);
  }
  var imgForm = document.getElementById('imgForm');
  var imgVisual = document.getElementById('imgVisual');
  var restartBtn = document.getElementById('restartBtn');
  var printBtn = document.getElementById('printBtn');
  imgForm.style.display = "none";
  imgVisual.style.display = "none";
  restartBtn.style.display = "block";
  printBtn.style.display = "block";

}
function printImage(){
  var doc = new jsPDF('p', 'mm', 'a4');
      doc.fromHTML(document.getElementById('mosaicOverlay').innerHTML, 15, 15, {
          'width': 170,
          'height': 170
      });
      doc.save('~/Desktop/sample-file.pdf');
}
