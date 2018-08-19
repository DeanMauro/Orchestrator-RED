const Events = require('../lib/events.js');

module.exports = function(RED) {

    /*Events Node functionality*/
    function EventsNode(config) {
        RED.nodes.createNode(this,config);

        this.on('input', function(msg) {
            this.send({payload: "hi"}); 
        });
    }
}