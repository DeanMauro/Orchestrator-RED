const Api = require('../lib/api.js');
const Utilities = require('../lib/utilities.js');

module.exports = function(RED) {
    function OrchestratorStartJobNode(config) {
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
                // Select Params
                if (config.params.length != 0)
                    body = Utilities.convertParams(config.params, msg, node);

                // Get endpoint info
                var endpoint = Api["Jobs"]("StartJobs");

                // Fire!
                connection.request({ type: endpoint[0], 
                                     extension: extension,
                                     body: JSON.stringify(body),
                                     callback: callback });
            } catch(e) {
                errorOut(node, e);
            }
        });
    }
    
    RED.nodes.registerType("orchestrator start job", OrchestratorStartJobNode);
}