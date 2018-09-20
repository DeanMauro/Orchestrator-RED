const Api = require('../lib/api.js');
const Utilities = require('../lib/utilities.js');

module.exports = function(RED) {
    function OrchestratorStartJobNode(config) {
        RED.nodes.createNode(this,config);

        this.on('input', async function(msg) {

            var node = this;
            var connection = RED.nodes.getNode(config.connection);
            var params = {};
            var names = {};
            var apiRelease = Api["Releases"]("GetAll"),
                apiRobots  = Api["Robots"]("GetAll"),
                apiJobs    = Api["Jobs"]("StartJobs");
            var jobStrat   = ["Specific", "RobotCount", "All"];
            var jobParams  = { startInfo:
                               { ReleaseKey: "",
                                 Strategy: "",
                                 RobotIds: [],
                                 NoOfRobots: 0,
                                 Source: "Manual" 
                               } 
                            }

            try {
                // Ensure node has connection
                Utilities.checkConnection(connection);

            //<<<<<<<<<<<<RELEASE KEY>>>>>>>>>>>>
                try {
                    var res = await connection.request({ method: apiRelease[0], url: apiRelease[1] + `?$select=Key&$filter=(Name eq '${config.process}_${config.environment}')`});
                    jobParams['startInfo']['ReleaseKey'] = res['data']['value'][0]['Key'];
                } catch(e) {
                    throw (e instanceof TypeError) ? `Could not find a process named ${config.process} in ${config.environment || "any environment"}` : e;
                }

            //<<<<<<<<<<<<ROBOT IDS>>>>>>>>>>>>
                // If NAMED POLICY
                if (config.policy == 0) {
                    if (!config.names) throw "Please specify some robots to run this job.";

                    // Select robot IDs to use
                    names = Utilities.convertParams(config.names, msg, node, RED);
                    var queries = Object.values(names)
                                        .reduce((q, n) => q += ` or Name eq '${n}'`, '?$select=Id&$filter=(')
                                        .replace(' or ', '') + ')';

                    // Get Robot IDs
                    res = await connection.request({ method: apiRobots[0], url: apiRobots[1] + queries});
                    if (res['data']['value'].length == 0) throw "Could not find your robot(s)."
                    for(var id of res['data']['value'])
                        jobParams['startInfo']['RobotIds'].push(id['Id']);
                }

            //<<<<<<<<<<<<START JOB>>>>>>>>>>>>
                // Add Job Inputs
                if (config.params.length != 0)
                    params = Utilities.convertParams(config.params, msg, node, RED);
                if (params && params["Id"]) 
                    params["Id"] = parseInt(params["Id"]);
                if (Object.keys(params).length) 
                    jobParams['startInfo']['InputArguments'] = JSON.stringify(params);

                // Fill remaining params
                jobParams['startInfo']['Strategy'] = jobStrat[config.policy];
                jobParams['startInfo']['NoOfRobots'] = (config.policy == 1) ? config.number : 0;

                // Start job
                res = await connection.request({ method: apiJobs[0], url: apiJobs[1], data: jobParams});
                msg.payload = res;
                node.send(msg);
            
            } catch(e) {
                this.error(e.response || e.message || e);
            }
        });
    }
    
    RED.nodes.registerType("orchestrator start job", OrchestratorStartJobNode);
}