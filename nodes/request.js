const Api = require('../lib/api.js');
const Utilities = require('../lib/utilities.js');

module.exports = function(RED) {
    function OrchestratorRequestNode(config) {
        RED.nodes.createNode(this,config);

        this.on('input', function(msg) {

            var node = this;
            var connection = RED.nodes.getNode(config.connection);
            var body = {};
            var callback = function(x, status) { 
                                        if (status < 300) node.send({payload: x});
                                        else node.error(x);
                                    };

            // Ensure node has connection
            Utilities.checkConnection(connection);

            // Properties Input
            try {
                // Convert fields provided through msg variable
                if (config.category.startsWith("Msg")) {
                    config.category = msg.payload.category;
                    config.action = msg.payload.action;
                }

                // Select Params
                if (config.params.length != 0)
                    body = Utilities.convertParams(config.params, msg, node);
                else if (msg.payload.params)
                    body = msg.payload.params;

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

        });
    }

    RED.nodes.registerType("orchestrator request", OrchestratorRequestNode);
}