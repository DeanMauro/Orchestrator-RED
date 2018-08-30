const Api = require('../lib/api.js');

module.exports = function(RED) {
    function OrchestratorRequestNode(config) {
        RED.nodes.createNode(this,config);

        this.on('input', function(msg) {

            var node = this;
            var connection = RED.nodes.getNode(config.connection);
            var body;
            var callback = function(x, status) { 
                                        if (status < 300) node.send({payload: x});
                                        else node.error(x);
                                    };

            // Refresh token if needed. Error out if not found.
            if (!connection)
                throw "Please add Login credentials before making requests.";
            

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
                        body = convertParams(config.params, msg, node);
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
                    connection.request({ type: endpoint[0], 
                                         extension: extension,
                                         body: JSON.stringify(body),
                                         callback: callback });
                } catch(e) {
                    this.error(e);
                }
            }

            // JSON Input
            else if (msg.payload.action && msg.payload.extension) {
                
                connection.request({ type: msg.payload.action, 
                                     extension: msg.payload.extension,
                                     body: JSON.stringify(msg.payload.body) || "",
                                     callback: callback });
            } 

            // Bad Input
            else {
                this.error("Bad input. Please refer to the info tab for formatting.");
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
                    try {
                        var prep = RED.util.prepareJSONataExpression(p.value, msg);
                        val = RED.util.evaluateJSONataExpression(prep, msg);
                    } catch(err) {
                        throw "Invalid JSONata expression";
                    }
                    break;
            }

            body[p.key] = val;
        }

        return body;
    }

    
    
    
    RED.nodes.registerType("orchestrator request", OrchestratorRequestNode);
}