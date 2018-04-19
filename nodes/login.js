const Orchestrator = require('../lib/orchestrator.js');

module.exports = function(RED) {

    /*Login Node functionality*/
    function LoginNode(config) {
        RED.nodes.createNode(this,config);

        this.on('input', function(msg) {
        	Orchestrator.refresh(this);    // Authenticate session using provided credentials

            // Provide orchestrator object & token-refresh function to flow
            var orch = this.context().flow.get("orch");
            var node = this;
            this.context().flow.set('refreshToken', function() { orch.refreshToken(node); });

            // Display connection status
            if (orch.token) {
            	this.status({fill:"green",shape:"dot",text:"connected"});
            } else {
            	this.status({fill:"red",shape:"ring",text:"unsuccessful"});
            	this.error("Login Unsuccessful");
            }

            this.send({payload: orch.token});  // Output status
        });
    }
    
    /*Store credentials*/
    RED.nodes.registerType("login",LoginNode, {
    	credentials: {
         url: {type: "text"},
    	 tenant: {type: "text"},
         username: {type:"text"},
         password: {type:"password"}
     }
    });
}