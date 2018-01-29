module.exports = function(RED) {
    function RequestNode(config) {
        RED.nodes.createNode(this,config);

        this.on('input', function(msg) {
        	Orchestrator.refreshToken();
            var orch = this.context().flow.get("orch");
            var node = this;

            // Standard request
            if (msg.payload.action && msg.payload.extension) {

                var callBack = function(x) { node.send(x); };
                
                orch.request({ type: msg.payload.action, 
                               extension: msg.payload.extension,
                               body: msg.payload.body || "",
                               callback: callBack });

            // Bad input
            } else {
                this.error("Bad input. Please refer to the info tab for formatting.", msg);
                this.send({ result: null,
                            success: false,
                            error: {
                                message: "Bad Input."
                            }});
            }
        });


    }
    
    RED.nodes.registerType("request", RequestNode);
}