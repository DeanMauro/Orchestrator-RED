require('./orchestrator.js');
module.exports = function(RED) {
    function LoginNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        node.on('input', function(msg) {
        	var tenant = node.credentials.tenant;
            var user = node.credentials.username;
            var pass = node.credentials.password;

            var orch = new Orchestrator(tenant, user, pass);

            this.context().flow.set("orch", orch);
            
            if(Orchestrator.token)
            	this.status({fill:"green",shape:"dot",text:"connected"});
            else {
            	this.status({fill:"red",shape:"ring",text:"unsuccessful"});
            	this.error("Login Unsuccessful");
            }

            this.send(Orchestrator.token != undefined);
        });
    }
    RED.nodes.registerType("login",LoginNode, {
    	credentials: {
         username: {type:"text"},
         password: {type:"password"}
     }
    });
}