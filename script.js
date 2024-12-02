var version = '1.12.1';
var uid = 'a359419354f14b9c83c7e7660b8e9eb6';
var iframe = document.getElementById('api-frame');
var client = new window.Sketchfab(version, iframe);
var imgBLogo;

function error() {
  console.error('An error occurred while initializing the Sketchfab client.');
}

function actionSkfb() {
  var error = function error() {
    console.error('Sketchfab API error');
  };
  
  var success = function success(api) {

    api.start(function () {
      api.addEventListener('viewerready', function () {
        api.setHighlightOptions({
          outlineWidth: 4,
          outlineColor: [1, 1, 1],
          outlineDuration: 2,
          highlightColor: [0.0, 0.0, 1.0],
          highlightDuration: 2,
        });
        api.addEventListener('click', function (info) {
          var text = 'Clicked on ';
          if (info && info.material) {
            text += 'material "' + info.material.name + '"';
            api.highlightMaterial(info.material);
          } else {
            text += 'background';
            api.highlightMaterial();
          }
          updateText(text);
          console.log(text);
          setTimeout(function () {
            updateText('no click');
          }, 250);
        }, {
          pick: 'fast'
        });
        
      });
    });
  };
  
  client.init(uid, {
    success: success,
    error: error,
    autostart: 1,
    preload: 0,
    ui_infos: 0,
    //ui_inspector: 0,
    ui_settings: 0,
    ui_vr: 0
  });
}


actionSkfb();

function computePastilles(wCanvas, hCanvas, bgColor, bgBorderColor, fgColor, fgBorderColor, text, numHotspot, wPastille, hPastille) {
  var wSize = wPastille / 10.0;
  var col = wCanvas / wSize;
  var row = hCanvas / wSize;
  var padding = 2;
  var w = wSize - padding;
  var cx;
  var cy = w * 0.5;
  var ty = cy + 8;
  var pastille = '';
  var num = 0;

  for (var i = 0; i < row; i++) {
    cx = wSize * 0.5;
    for (var k = 0; k < col; k++) {
      num++;
      var letters = text === 0 ? num : text[num];
      var circle = "<circle cx=\"".concat(cx, "\"\n            cy=\"").concat(cy, "\"\n            r=\"20\"\n            fill=\"").concat(bgColor, "\"\n            stroke=\"").concat(bgBorderColor, "\"\n            stroke-width=\"2\"/>");
      var textVG = "<text font-size=\"26\"\n          stroke=\"".concat(fgBorderColor, "\"\n          fill=\"").concat(fgColor, "\"\n          font-family=\"sans-serif\"\n          text-anchor=\"middle\"\n          alignment-baseline=\"baseline\"\n          x=\"").concat(cx, "\"\n          y=\"").concat(ty, "\">").concat(letters, "</text>");
      pastille += circle + textVG;
      cx += wSize;
    }
    cy += wSize;
    ty += wSize;
  }

  var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('version', '1.1');
  s.setAttribute('baseProfile', 'full');
  s.setAttribute('width', wPastille);
  s.setAttribute('height', hPastille);
  s.setAttribute('viewBox', "0 0 ".concat(wPastille, " ").concat(hPastille));
  s.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  s.innerHTML = pastille;

  var svg64 = btoa(s.outerHTML);
  var b64Start = 'data:image/svg+xml;base64,';
  var image64 = b64Start + svg64;
  var textureOptions = {
    url: image64,
    colNumber: col,
    padding: padding,
    iconSize: w
  };

  return textureOptions;
}

function getNewPastilleURL(bgColor, bgBorderColor, fgColor, fgBorderColor, text, numHotspot, w, h) {
  var imageData;
  imageData = computePastilles(w, h, bgColor, bgBorderColor, fgColor, fgBorderColor, text, numHotspot, w, h);
  return imageData;
}

function initAnnotationGui() {
  document.getElementById('show').addEventListener('change', function () {
    if (this.checked) {
      var url = getNewPastilleURL('rgba(0,0,0,0.50)', 'white', 'white', 'none', 0, 50, 512, 256);
      api.setAnnotationsTexture(url, function () {});
    }
  });

  document.getElementById('hide').addEventListener('change', function () {
    if (this.checked) {
      var url = getNewPastilleURL('rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 0, 50, 512, 256);
      api.setAnnotationsTexture(url, function () {});
    }
  });
}

function initModelGui() {
  document.getElementById('model1').addEventListener('change', function () {
    if (this.checked) {
      uid = '20486ab494af4b328eb99cfaa8487354';
      client.init(uid, {
        success: function() {
          actionSkfb();
        },
        error: error,
        autostart: 1,
        preload: 1,
        ui_infos: 0,
        ui_inspector: 0,
        ui_settings: 0,
        ui_vr: 0
      });
    }
  });

  document.getElementById('model2').addEventListener('change', function () {
    if (this.checked) {
      uid = 'dd958716be0b4786b8700125eec618e5';
      client.init(uid, {
        success: function() {
          actionSkfb();
        },
        error: error,
        autostart: 1,
        preload: 1,
        ui_infos: 0,
        ui_inspector: 0,
        ui_settings: 0,
        ui_vr: 0
      });
    }
  });
}

initAnnotationGui();
initModelGui();

function openNav() {
  document.getElementById("mySidebar").classList.add("open");
  document.querySelector(".container").style.marginLeft = "250px";
}

function closeNav() {
  document.getElementById("mySidebar").classList.remove("open");
  document.querySelector(".container").style.marginLeft = "0";
}