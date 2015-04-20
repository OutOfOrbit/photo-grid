
var Controller = function () {

  this.imgOrientation = null;
  this.gotPhoto = false;

  this.container = $('#container');
  this.camerabutton = $('#cameraBtn');
  this.sendBtn = $('#sendBtn');
  this.inputControls = $('#inputControls');
  this.instructions = $('#instructions');

  var self = this;
  var socket = io();

  this.init = function(e){
    console.log('init()');

    this.camerabutton.on('tap', function() {
      return self.inputControls.trigger('click');
    });

    this.sendBtn.on('tap', function() {
      self.sendImage();
      self.gotPhoto = false;
    });

    self.inputControls.on('change', this.gotPic);
  };
  
  this.sendImage = function(){
    
    var canvas = self.canvas.get(0);
    console.log(canvas);
    base64data = canvas.toDataURL('image/jpeg', 1.0);
    var context = canvas.getContext('2d');

    self.canvasWrapper.animate({
      "margin-top": '-350px'
    }, 450).delay(600, function() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      canvas.remove();
      canvasWrapper.remove();
    });

    //Send image data to server
    socket.emit('controller_data', base64data);

    self.instructions.css({
      'visibility': 'hidden'
    });

    self.camerabutton.delay(1500).animate({
      'opacity': '1'
    }, 1000);

  };

  this.addCanvas = function(){
    console.log('addCanvas()');

    this.canvas = null;
    this.canvasWrapper = null;
    this.canvasWrapper = $('<div id="canvasWrapper"></div>');
    this.canvas = $('<canvas id="canvas"></canvas>');

    this.canvasWrapper.css({
      'width': '510px',
      'height': '510px',
      'margin-left': 'auto',
      'margin-right': 'auto',
      'margin-top': '10px',
      'background-color': '#fff',
      'opacity': '0'
    }).appendTo(this.container);

    this.canvasWrapper.animate({
      "opacity": '1'
    }, 1000);

    this.canvas.css({
      'width': '500px',
      'height': '500px',
      'margin-left': '5px',
      'margin-right': '5px',
      'margin-top': '5px',
      'margin-bottom': '5px',
      'background-color': 'transparent'
    }).appendTo(this.canvasWrapper);

    this.instructions.css({
      'visibility': 'visible'
    });
  };

  this.gotPic = function(event){
    console.log('gotPic()');
    console.log(this);
    console.log(event);
    self.camerabutton.animate({
      'opacity': '0'
    }, 0);

    console.log('self.gotPhoto: '+self.gotPhoto);
    if (self.gotPhoto === false) {
      console.log('self.gotPhoto === false');
      self.addCanvas();
    }

    if (event.target.files.length === 1 && event.target.files[0].type.indexOf('image/') === 0) {
      self.gotPhoto = true;

      EXIF.getData(event.target.files[0], function() {
        var o = EXIF.getTag(this, 'Orientation').valueOf();
        console.log(o);
        self.imgOrientation = o; 
        //return imgOrientation;
      });

      var canvas = self.canvas.get(0);
      var context = canvas.getContext('2d');
      var img = new Image();
      img.src = URL.createObjectURL(event.target.files[0]);

      canvas.width = 700;
      canvas.height = 700;

      img.onload = function() {
        var imgWidth = img.width;
        var imgHeight = img.height;
        var size = Math.min(imgWidth, imgHeight);
        var sourceWidth = size;
        var sourceHeight = size;
        var destWidth = 700;
        var destHeight = 700;
        var destX = 0;
        var destY = 0;
        var sourceY = 0;
        var sourceX = img.width / 2 - (sourceWidth / 2);
        var rotation = 0;
        var rotation_width = 0;
        var rotation_height = 0;
        switch (self.imgOrientation) {
          case 1:
            rotation = 0;
            break;
          case 2:
            rotation = 0;
            break;
          case 3:
            rotation = 180;
            rotation_width = destWidth;
            rotation_height = destHeight;
            break;
          case 4:
            rotation = 0;
            break;
          case 5:
            rotation = 0;
            break;
          case 6:
            rotation = 90;
            rotation_width = destWidth;
            rotation_height = 0;
            break;
          case 7:
            rotation = 0;
            break;
          case 8:
            rotation = 270;
            rotation_width = 0;
            rotation_height = destHeight;
        }
        if (rotation !== 0) {
          context.save();
          context.translate(rotation_width, rotation_height);
          context.rotate(rotation * (Math.PI / 180));
        }
        context.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
      };

    }

  };

};


$(document).ready(function() {

  var controller = new Controller();
  controller.init();


}); 