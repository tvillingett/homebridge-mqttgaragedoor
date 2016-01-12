var request = require("request");
var mqtt

var Service, Characteristic;

module.exports = function(homebridge){
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-mqtt-garage-door", "MQTTGarageDoor", GarageDoorAccessory);
}

function GarageDoorAccessory(log, config) {
  this.log = log;

  // url info
  this.url         = config["url"];
  this.ip_address  = config["ip_address"];
  this.api_key     = config["api_key"];
  this.password    = config["password"];
  this.name        = config["name"];
  this.zway_device_id = config["zway_device_id"]; //For the status
  this.session_cookie = config["session_cookie"]; //For the status
}

GarageDoorAccessory.prototype = {
  getDoorTargetPositionState: function(callback) {
    this.log("getDoorTargetPositionState");

    local_callback( null, Characteristic.CurrentDoorState.CLOSED );
  },

// DO callback here when the MQTT value changes

  getDoorPositionState: function(callback) {
    this.log("getDoorPositionState");

        level = "on"; // REPLACE with correct MQTT

        if (level == "on") {
          local_callback( null, Characteristic.CurrentDoorState.OPEN );
        }else{
          local_callback( null, Characteristic.CurrentDoorState.CLOSED );
        }
      });
    });
  },

  getObstructionDetected: function(callback){
    this.log("getObstructionDetected");

    //Do something
    callback(null, false); //Not possible with my setup
  },

  setDoorTargetPosition: function( state, callback ){
    this.log("setDoorTargetPosition");
    // Set MQTT variable
    callback( null); // all ok
  },

  getName: function(callback) {
    this.log("getName");

    callback(null, this.name);
  },

  identify: function(callback) {
    this.log("Identify requested!");
    callback(); // success
  },

  getServices: function() {

    // you can OPTIONALLY create an information service if you wish to override
    // the default values for things like serial number, model, etc.
    var informationService = new Service.AccessoryInformation();

    informationService
      .setCharacteristic(Characteristic.Manufacturer, "Jeff McFadden")
      .setCharacteristic(Characteristic.Model, "Garage Door Opener")
      .setCharacteristic(Characteristic.SerialNumber, "GDO-1");

    var garageDoorService = new Service.GarageDoorOpener(this.name);

    garageDoorService.getCharacteristic( Characteristic.CurrentDoorState ).on(    'get', this.getDoorPositionState.bind(this) );
    garageDoorService.getCharacteristic( Characteristic.TargetDoorState ).on(     'get', this.getDoorPositionState.bind(this) );
    garageDoorService.getCharacteristic( Characteristic.ObstructionDetected ).on( 'get', this.getObstructionDetected.bind(this) );
    garageDoorService.getCharacteristic( Characteristic.TargetDoorState ).on(     'set', this.setDoorTargetPosition.bind(this) );

    return [informationService, garageDoorService];
  }
};
