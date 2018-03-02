require('../lib/orchestrator.js');
require('../lib/api.js');

module.exports = function(RED) {
    function RequestNode(config) {
        RED.nodes.createNode(this,config);

        this.on('input', function(msg) {

            var refreshToken = this.context().flow.get("refreshToken");
            var node = this;
            var body;
            var callback = function(x, status) { 
                                        if (status < 300) node.send(x);
                                        else errorOut(node, x);
                                    };

            // Refresh token if needed. Error out if not found.
            if (refreshToken) refreshToken();
            else errorOut(node, "Please add a Login node to the flow before making requests.");
            
            // Use orch object to make calls
            var orch = this.context().flow.get("orch");

            // Properties Input
            if (config.category != "UseInput") {
                try {
                    // Convert fields provided through msg variable
                    if (config.category.startsWith("Msg")) {
                        config.category = msg.payload.category;
                        config.action = msg.payload.action;
                    }

                    // Select Params
                    if (config.params.length != 0)
                        body = Api.convertParams(config.params, msg);
                    else if (msg.payload.params)
                        body = msg.payload.params;
                    else
                        body = {};

                    // Check that a category and action were specified
                    if (!config.category) throw "That request was rather vague. Please specify a category in the node's properties."
                    if (!config.action) throw "That request was rather vague. Please specify an action in the node's properties."

                    // Get endpoint info
                    var endpoint = Api[config.category](config.action);

                    // Add path & query params if needed
                    var extension = Api.fillPath(endpoint[0], endpoint[1], body);

                    // Sanitize body
                    if (body && body["Id"]) body["Id"] = parseInt(body["Id"]);

                    // Fire!
                    orch.request({ type: endpoint[0], 
                                   extension: extension,
                                   body: JSON.stringify(body),
                                   callback: callback });
                } catch(e) {
                    errorOut(node, e);
                }
            }

            // JSON Input
            else if (msg.payload.action && msg.payload.extension) {
                
                orch.request({ type: msg.payload.action, 
                               extension: msg.payload.extension,
                               body: msg.payload.body || "",
                               callback: callback });
            } 

            // Bad Input
            else {
                errorOut(this, "Bad input. Please refer to the info tab for formatting.");
            }
        });
    }

    function errorOut(node, error) {
        node.error(error);
        node.send({ result: null,
                    success: false,
                    error: { message: "Error. Can't proceed." }
                 });
    }
    
    RED.nodes.registerType("request", RequestNode);
}