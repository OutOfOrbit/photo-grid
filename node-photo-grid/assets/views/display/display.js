var Display = function () {

    this.photoArray = [];
    this.gridItemsArray = [];
    this.container = $('#photo-grid-container');

    var self = this;
    var socket = io();

    this.init = function (){
      console.log('init()');
      
      socket.on('image_data', function(data){
        self.didReceiveImageData(data);
      });

      //localStorage.clear();
      this.gridItemsArray = (function() {
        results = [];
        for (i = 1; i < 51; i++){ results.push(i); }
        return results;
      }).apply(this);

      console.log(this.gridItemsArray);
      this.setGridImages();
    };

    this.getGridItemNumber = function(){

      var gridNumber = this.gridItemsArray[Math.floor(Math.random() * this.gridItemsArray.length)];
      var i = this.gridItemsArray.indexOf(gridNumber);

      if (i !== -1) {
        this.gridItemsArray.splice(i, 1);
      }

      return gridNumber;
    };

    this.setGridImages = function(){

      var numberOfStockImagesToSet = null;
      if (localStorage.getItem("photos")){
        console.log('localStorage.getItem("photos") EXISTS');
        var tempArray = JSON.parse(localStorage.getItem('photos'));
        numberOfStockImagesToSet = 50 - tempArray.length;
      }else{
        console.log('no images in localStorage');
        numberOfStockImagesToSet = 50;
      }
      
      
      var i = 0;
      while (i < numberOfStockImagesToSet) {
        i++;
        var gridNumber = this.getGridItemNumber();
        var gridItem = '#grid-photo-' + gridNumber;
        var image = $(gridItem);
        image.get(0).src = '/views/display/grid-images/image-' + i + '.png';
      }
      if(numberOfStockImagesToSet < 50){
        this.setPhotosFromLocalStorage();
      }
    };

    this.setPhotosFromLocalStorage = function(){
      if(localStorage.getItem("photos")){
        var tempArray = JSON.parse(localStorage.getItem('photos'));
      }
      var i = 0;
      while (i < tempArray.length){
        var gridNumber = this.getGridItemNumber();
        var gridItem = '#grid-photo-' + gridNumber;
        var image = $(gridItem);
        image.get(0).src = tempArray[i];
        i++;
      }
    };

    this.showPhotoLarge = function(imageData){
      this.photoContainerLarge = $('<div id="photo-container-large"></div>');
      this.photoContainerLarge.css({
        'width': '810px',
        'height': '810px',
        'margin-left': '555px',
        'margin-right': '555px',
        'margin-top': '135px',
        'margin-bottom': '135px',
        'background-color': '#fff',
        'z-index': '999',
        'position': 'absolute'
      }).appendTo(this.container);

      this.photoLarge = $('<img id="photoLarge"></img>');
      this.photoLarge.css({
        'width': '800px',
        'height': '800px',
        'margin-left': '5px',
        'margin-right': '5px',
        'margin-top': '5px',
        'margin-bottom': '5px'
      });
      this.photoLarge.get(0).src = imageData;
      this.photoLarge.appendTo(this.photoContainerLarge);
      this.photoContainerLarge.hide().fadeIn(1000);
      this.photoContainerLarge.delay(5000).fadeOut(1000, function() {
        return this.remove();
      });

    };

    this.savePhotoToLocalStorage = function(imageData){
      if (!localStorage.getItem("photos")) {
        localStorage.setItem('photos', JSON.stringify([imageData]));
      } else if (localStorage.getItem("photos")) {
        this.tempArray = JSON.parse(localStorage.getItem('photos'));
        this.tempArray.push(imageData);
        localStorage.setItem('photos', JSON.stringify(this.tempArray));
      }
    };

    this.scalePhotoforStorage = function(imageData){

      var canvas = $('<canvas id="canvas"></canvas>');
      canvas.css({
        'position': 'absolute',
        'display': 'none',
        'width': '200px',
        'height': '200px',
        'background-color': '#ffffff'
      }).appendTo($('#photo-grid-container'));

      canvas.attr('width', 200);
      canvas.attr('height', 200);
      var context = canvas.get(0).getContext('2d');

      var onDrawImagedDone = function() {
        var compressedImageData;
        compressedImageData = canvas.get(0).toDataURL('image/jpeg', 0.7);
        return self.savePhotoToLocalStorage(compressedImageData);
      };

      var img = new Image();

      img.onload = function() {
        var destHeight, destWidth, imgHeight, imgWidth, size;
        imgWidth = img.width;
        imgHeight = img.height;
        size = Math.min(imgWidth, imgHeight);
        destWidth = 200;
        destHeight = 200;
        context.drawImage(img, 0, 0, size, size, 0, 0, destWidth, destHeight);
        onDrawImagedDone();
      };

      img.src = imageData;
    };

    this.didReceiveImageData = function(imageData){
      //console.log(imageData);
      this.showPhotoLarge(imageData);
      var generateImageNumber;
      var checkImageNumber;

      generateImageNumber = function() {
        var imageNumber = Math.floor(Math.random() * 50) + 1;
        return checkImageNumber(imageNumber);
      };

      checkImageNumber = function(imageNumber) {
        //If photoArray length is 50, empty array to reset the priority order 
        if (self.photoArray.length == 50){
          self.photoArray = [];
        }
        if (self.photoArray.indexOf(imageNumber) != -1){
          //Number taken, run generatImageNumber again to get a new number
          return generateImageNumber();
        }else{
          var imagePath = '#grid-photo-' + imageNumber;
          var image = $(imagePath);
          image.fadeOut(700);
          image.get(0).src = imageData;
          image.fadeIn(700);
          self.photoArray.push(imageNumber);
          return;
        }
      };

      generateImageNumber();
      this.scalePhotoforStorage(imageData);

    };
};


$(document).ready(function() {

  var display = new Display();
  display.init();

}); 