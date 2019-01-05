var colorList = [];
var uniqueColorList = [];
var divisibles = 15;

function placeImage(){
  var inputDivision = document.getElementById('inputDivision').value;
  if(inputDivision) divisibles = parseInt(inputDivision);
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
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
  document.getElementById('mosaicOverlay').style.height = img.height + "px";
  document.getElementById('mosaicOverlay').style.width = img.width + "px";

  for (var k = 0; k < divisibles; k++) {
    for (var j = 0; j < divisibles; j++){
      var xpos = j*img.width/divisibles;
      var ypos = k*img.height/divisibles;
      var xwide = img.width/divisibles;
      var yhigh = img.height/divisibles;
      var data = canvas.getContext('2d').getImageData(xpos, ypos, xwide, yhigh).data;
      var multiplier = xwide * yhigh;
      var totalr = 0;
      var totalg = 0;
      var totalb = 0;
      var totala = 0;
      for(var i = 0; i < data.length; i += 4){
        totalr += data[i];
        totalg += data[i+1];
        totalb += data[i+2];
        totala += data[i+3]/255;
      }
      colorList.push('rgb('+Math.round(totalr/multiplier)+','+Math.round(totalg/multiplier)+','+Math.round(totalb/multiplier)+')');
    }
  }

  uniqueColorList = colorList.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  }).sort();
  console.log(uniqueColorList)
  placeMosaic(img.height, img.width);
}



function placeMosaic(height, width){
  var mosOL = document.getElementById('mosaicOverlay');
  mosOL.innerHTML = "";
  for (var i = 0; i < (divisibles*divisibles); i++) {
    var div = document.createElement('div');
    div.className = "mosBlock";
    div.style.width = (width/divisibles) + "px";
    div.style.height = div.style.width;
    var colorNum = uniqueColorList.findIndex(function (color) {
      return color ==  colorList[i];
    }) + 1;
    div.innerText = colorNum;
    div.style.backgroundColor = colorList[i];
    mosOL.appendChild(div);
  }
  var imgForm = document.getElementById('imgForm');
  var imgVisual = document.getElementById('imgVisual');
  var restartBtn = document.getElementById('restartBtn');
  imgForm.style.display = "none";
  imgVisual.style.display = "none";
  restartBtn.style.display = "block"

}
