# Orchestrator-RED
A Node-RED wrapper for the UiPath Orchestrator API

## Install

1. Install `Node.js`, `npm`, and `node-RED`.

2. (a) Navigate to your node-RED directory and run `npm install node-red-contrib-uipath-orchestrator`

OR

2 (b) Start node-RED, navigate to the hamburger menu in the top right corner, select *Manage Palette*, and add the UiPath Orchestrator nodes.

## Nodes

### Connection

A configuration node that authenticates all calls made to Orchestrator and automatically refreshes API tokens when needed.

* **URL**: *optional* The URL of your Orchestrator instance. Defaults to https://platform.uipath.com is left blank.
* **Tenant**: Your tenant
* **Username**: Your username
* **Password**: Your password. This value is encrypted when the flow is saved.

### Request

A wrapper of the full Orchestrator API allowing any request to be made. Currently configured for v2018.3 and includes Organizational Units.

* **Login**: The connection node used to authenticate all calls.
* **Category**: The targeted Orchestrator element *(e.g. robots, queues, assets)*
* **Action**: The list of actions available in the selected category *(e.g. Get All, Add to queue, Delete Asset)*
* **Parameters**: *optional* Input parameters for the specified action. Formatted as per the Swagger guidelines

### Start Job

A convenience node that starts a Job.

* **Login**: The connection node used to authenticate.
* **Process**: The name and environment of the process to be run. If no environment is provided, the first one found to contain the selected process will be used. As of 2018.3, input parameters are available when starting a Job.
* **Robot(s)**: The robot scheme used to run the job. You may specify robots by name, quantity, or run on all robots. If an incorrect robot name is specified, no jobs will run. If a larger number of robots than are available is specified to run, the job will proceed on all robots.

## Output Messages

The raw JSON output of each API call is included in the msg.payload in order to expose all details.
