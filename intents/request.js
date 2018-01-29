module.exports = function(RED) {
    function RequestNode(config) {
        RED.nodes.createNode(this,config);

        this.on('input', function(msg) {
        	// Orchestrator.refreshToken(this);

            // Put call here
            this.send("There is 1 Process");
        });
    }
    
    RED.nodes.registerType("request", RequestNode);
}