require('../lib/orchestrator.js');
require('../lib/api.js');

module.exports = function(RED) {
    function RequestNode(config) {
        RED.nodes.createNode(this,config);

        this.on('input', function(msg) {

            var orch = this.context().flow.get("orch");
            var node = this;
            var body;
            var callback = function(x, status) { 
                                        if (status < 300) node.send(x);
                                        else errorOut(node, x);
                                    };

            // Refresh token if needed. Create anew if not found.
            if (orch) orch.refreshToken(node);
            else Orchestrator.refresh(node);

            // Properties Input
            if (config.category != "UseInput") {
                try {
                    // Convert params provided through msg variable
                    if (config.category.startsWith("Msg")) {
                        config.category = msg.payload.category;
                        config.action = msg.payload.action;
                        body = msg.payload.params;
                    } else {
                        body = Api.convertParams(config.params);
                    }

                    // Check that a category and action were specified
                    if (!config.category) throw "That request was rather vague. Please specify a category in the node's properties."
                    if (!config.action) throw "That request was rather vague. Please specify an action in the node's properties."

                    // Get endpoint info
                    var endpoint = Api[config.category](config.action);

                    // Add path & query params if needed
                    var extension = Api.fillPath(config.action, endpoint[1], body);

                    // Sanitize body
                    body = (body && Object.keys(body).length > 0) ? body : "";

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