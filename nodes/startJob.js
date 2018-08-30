const Api = require('../lib/api.js');

module.exports = function(RED) {
    function OrchestratorStartJobNode(config) {
        RED.nodes.createNode(this,config);

        this.on('input', function(msg) {

            var refreshToken = this.context().flow.get("refreshToken");
            var node = this;
            var body;
            var callback = function(x, status) { 
                                        if (status < 300) node.send({payload: x});
                                        else errorOut(node, x);
                                    };

            // Refresh token if needed. Error out if not found.
            if (refreshToken) refreshToken();
            else errorOut(node, "Please add a Login node to the flow before making requests.");
            
            // Use orch object to make calls
            var orch = this.context().flow.get("orch");

            // Properties Input
            try {
                // Select Params
                if (config.params.length != 0)
                    body = convertParams(config.params, msg, node);
                else if (msg.payload.params)
                    body = msg.payload.params;
                else
                    body = {};

                // Get endpoint info
                var endpoint = Api["Jobs"]("StartJobs");

                // Fire!
                orch.request({ type: endpoint[0], 
                               extension: extension,
                               body: JSON.stringify(body),
                               callback: callback });
            } catch(e) {
                errorOut(node, e);
            }
        });
    }


    function convertParams(params, msg, node) {
        var body = {};
        
        for (var p of params) {
            var val = p.value;

            switch(p.type) {
                case 'msg':
                    val = RED.util.getMessageProperty(msg, "msg." + p.value); break;
                case 'json':
                    val = JSON.parse(p.value); break;
                case 'flow':
                    val = node.context().flow.get(p.value); break;
                case 'global':
                    val = node.context().global.get(p.value); break;
                case 'date':
                    val = Date.now(); break;
                case 'jsonata':
                    try{
                        var prep = RED.util.prepareJSONataExpression(p.value, msg);
                        val = RED.util.evaluateJSONataExpression(prep, msg);
                    } catch(err) {
                        errorOut(node, "Invalid JSONata expression");
                        return;
                    }
                    break;
            }

            body[p.key] = val;
        }

        return body;
    }

    
    function errorOut(node, error) {
        node.error(error);
        node.send({ result: null,
                    success: false,
                    error: { message: "Error. Can't proceed." }
                 });
    }
    
    RED.nodes.registerType("orchestrator start job", OrchestratorStartJobNode);
}