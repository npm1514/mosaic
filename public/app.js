var colorList = [];
var uniqueColorList = [];
var divisiblesWidth = 20;
var divisiblesHeight = 20;
var canvasWidth = "";
var accuracy = 80;
var dblclickedId = "";

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
    div.ondblclick = doubleClick;
    div.id = "mosBlock" + i;
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
  restartBtn.style.display = "inline-block";
  printBtn.style.display = "inline-block";

}
function printImage(){
  if(document.getElementById('printCanvas')) document.getElementById('printCanvas').remove();
  var mosaic = document.querySelector("#mosaicOverlay");
  html2canvas(mosaic).then(canvas => {
    canvas.id = "printCanvas";
    document.body.appendChild(canvas)
    var printCanvas = document.getElementById('printCanvas');
    var orientation = mosaic.width > mosaic.height ? "l" : "p"
    var doc = new jsPDF(
      orientation,
      "px",
      [(printCanvas.width)*4/3 + 60, (printCanvas.height)*4/3 + 60]
    );
    doc.addImage(printCanvas, 'JPEG', 20, 20, printCanvas.width, printCanvas.height);
    doc.save('mosaic_'+new Date().toISOString()+'.pdf');
  });

}
function doubleClick(e){
  dblclickedId = e.target.id;
  document.getElementById(dblclickedId).style.opacity = 0.5;
  document.getElementById('mosaicOverlay').addEventListener('click', colorChanger)
}
function colorChanger(e){
  document.getElementById(dblclickedId).style.opacity = 1;
  document.getElementById(dblclickedId).style.backgroundColor = e.target.style.backgroundColor;
  document.getElementById(dblclickedId).innerText = e.target.innerText;
  document.getElementById('mosaicOverlay').removeEventListener('click', colorChanger)
}
