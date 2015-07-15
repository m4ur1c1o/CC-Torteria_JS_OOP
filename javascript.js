$( document ).ready(function() {
  $( 'form' ).on("submit", function( event ){
    event.preventDefault();
    var type = $("input[name='type']").val();
    var time = $("input[name='time']").val();


    var new_torta = new Torta(type);
    var result = new_torta.bake_time();
    var batch = new TortaBatch(5, type);
    var oven = new Oven();
    oven.getin_batch(batch, time);

    var countdown = function(){
      $("#countdown").text(time);
      $("#status").text(batch.status());
      oven.update();
      time -= 1;
      if (time >= 0) {
        setTimeout( function(){ countdown() }, 1000 );
      } else {
        return "";
      }
    };

    setTimeout( countdown, 1000 );
  });
});

// Class Torta
var Torta = function(type){
	var self = this;
	function initialize(){
		self.type = type;
	};
	initialize();
};

// bake_time method for Torta
Torta.prototype.bake_time = function(){
	var bake_time = {"jamon": 3, "queso": 8, "milanesa": 10};
	return bake_time[this.type];
};
///////////////////////////////////////////////////////////////////////////////

// Class TortaBatch
var TortaBatch = function(batch_size, type){
  var self = this;
  function initialize(){
    self.batch_size = batch_size;
    self.type = type;
    self.cook_time = 0;
    var tortas = [];
    // console.log(tortas);
    for (var i = 0; i < batch_size; i++) {
      tortas.push(new Torta(type));
    };
    // console.log(tortas);
    self.ready_time = tortas[0].bake_time();
  };
  initialize();
};

// status method for TortaBatch
TortaBatch.prototype.status = function(){
  var self = this;
  if (self.cook_time > self.ready_time) {
    return "QUEMADO";
  } else if (self.cook_time == self.ready_time) {
    return "LISTO";
  } else if (self.cook_time == 0) {
    return "Crudo";
  } else if (self.cook_time > 0 && self.cook_time < self.ready_time) {
    return "Casi listo";
  }
};
///////////////////////////////////////////////////////////////////////////////

// Class Oven
var Oven = function(){
  var self = this;
  function initialize(){
    self.batch_inside = false;
    self.oven_cook_time = 0;
  };
  initialize();
};

Oven.prototype.getin_batch = function(batch, cook_time){
  var self = this;
  if (self.batch_inside == false) {
    self.batch_inside = true;
    self.batch = batch;
    self.oven_cook_time = cook_time;
    return "Getting batch in";
  } else {
    return "There's no space inside the oven";
  }
};

Oven.prototype.update = function(){
  var self = this;
  if (self.oven_cook_time > 0) {
    self.oven_cook_time -= 1;
    self.batch.cook_time += 1;
  } else {
    return "Add more time to the oven";
  }
};
///////////////////////////////////////////////////////////////////////////////
