/* This is a sample config json to configurate the modules
 * such as buttons, slider, and touch-areas.
 * This file is used for development and documentation
 */

{

  "name" : "sample module mapping",
  "type" : "slider", //this can be any type of module such as button, slider, etc...

  "mappings" : [   //Array containing all the mappings for this module

    { //MIDI
      "type" : "midi",
      //the midi protocoll is made of 3 byte, for example: 1: message and channel, 2: key and 3: value
      "message" : "Controller Change", //Programm Change, Note On, Note Off, etc...
      "channel" : { //last 4 bit of first byte
        "mapping" : false,
        "value" : 15 //max value = 4bit (1111) = 15
      },
      "byte_2" : { //max value = 7 bit (1111111) = 127
        "mapping" : true,
        "minValue" : 0,
        "maxValue" : 127,
        "value" : 64
      },
      "byte_3" : { //max value = 7 bit (1111111) = 127
        "mapping" : false,
        "value" : "Name of other module"
      }
    },

    { //OSC
      "type" : "osc",
      "channel" : "127.0.0.1:3000/some/channel/",
      "datatype" : "float",
      "minValue" : "0",
      "maxValue" : "100",
      "value" : "55.55"
    },

    { //DMX
      "type" : "dmx",
      "channel" : "127",
      "minValue" : "0",
      "maxValue" : "100",
      "value" : "50"
    }

  ],

  "view" : {
    "x" : 0,
    "y" : 0,
    "height" : 0.5,
    "width" : 0.5,
    "orientation" : "horizontal"
  }
}