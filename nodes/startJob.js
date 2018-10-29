const Api = require('../lib/api.js');
const Utilities = require('../lib/utilities.js');

module.exports = function(RED) {
    function OrchestratorStartJobNode(config) {
        RED.nodes.createNode(this,config);

        this.on('input', async function(msg) {

            var node = this;
            var connection = RED.nodes.getNode(config.connection);
            var proc = "";
            var environment = "";
            var params = {};
            var headers = {};
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

                // Parse Process & Environment
                proc = Utilities.convert({value: config.process, type: config.processType}, msg, node, RED);
                environment = Utilities.convert({value: config.environment, type: config.environmentType}, msg, node, RED);

                // Parse Parameters
                if (config.params.length != 0)
                    params = Utilities.convertParams(config.params, msg, node, RED);
                if (params && params["Id"]) 
                    params["Id"] = parseInt(params["Id"]);
                if (Object.keys(params).length) 
                    jobParams['startInfo']['InputArguments'] = JSON.stringify(params);

                // Get headers
                [params, headers] = Utilities.pullHeaders(params);

            //<<<<<<<<<<<<RELEASE KEY>>>>>>>>>>>>
                try {
                    var res = await connection.request({ method: apiRelease[0], headers: headers, url: apiRelease[1] + `?$select=Key&$filter=(Name eq '${proc}_${environment}')`});
                    jobParams['startInfo']['ReleaseKey'] = res['data']['value'][0]['Key'];
                } catch(e) {
                    throw (e instanceof TypeError) ? `Could not find a process named ${proc} in ${environment || "any environment"}` : e;
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
                    res = await connection.request({ method: apiRobots[0], headers: headers, url: apiRobots[1] + queries});
                    if (res['data']['value'].length == 0) throw "Could not find your robot(s)."
                    for(var id of res['data']['value'])
                        jobParams['startInfo']['RobotIds'].push(id['Id']);
                }
                else if (config.policy == 1) {
                    config.number = Utilities.convert({value: config.number, type: config.numberType}, msg, node, RED);
                    if (isNaN(config.number)) throw "Please specify a valid number of robots.";
                }

            //<<<<<<<<<<<<START JOB>>>>>>>>>>>>
                // Fill remaining params
                jobParams['startInfo']['Strategy'] = jobStrat[config.policy];
                jobParams['startInfo']['NoOfRobots'] = (config.policy == 1) ? config.number : 0;

                // Start job
                res = await connection.request({ method: apiJobs[0], headers: headers, url: apiJobs[1], data: jobParams});
                msg.payload = res;
                node.send(msg);
            
            } catch(e) {
                if (e.response) ['request','config','headers'].forEach(k => {delete e.response[k]});
                this.error(e.response || e.message || e);
            }
        });
    }
    
    RED.nodes.registerType("orchestrator start job", OrchestratorStartJobNode);
}