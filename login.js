require('./orchestrator.js');

module.exports = function(RED) {
    function LoginNode(config) {
        RED.nodes.createNode(this,config);

        this.on('input', function(msg) {
        	// Get credentials
        	var tenant = this.credentials.tenant;
            var user = this.credentials.username;
            var pass = this.credentials.password;

            // Login and persist Orchestrator session
            var orch = new Orchestrator(tenant, user, pass);
            this.context().flow.set("orch", orch);

            // Display connection status
            if (Orchestrator.token) {
            	this.status({fill:"green",shape:"dot",text:"connected"});
            } else {
            	this.status({fill:"red",shape:"ring",text:"unsuccessful"});
            	this.error("Login Unsuccessful");
            }

            // Output status
            this.send(Orchestrator.token != null);
        });
    }
    
    RED.nodes.registerType("login",LoginNode, {
    	credentials: {
    	 tenant: {type: "text"},
         username: {type:"text"},
         password: {type:"password"}
     }
    });
}