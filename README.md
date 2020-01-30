# Orchestrator-RED
A Node-RED wrapper for the UiPath Orchestrator API

## Release Notes

**v2.1.1**

- The Request node now wraps the 2019.12 API, which includes several new calls.

**v2.0.0**

- Now supports both Cloud and On-Premise Orchestrators, which use different authentication schemes. For more information, see the official [UiPath documentation here](https://docs.uipath.com/orchestrator/reference#consuming-cloud-api).
- BREAKING CHANGE: The URL field no longer defaults to https://platform.uipath.com. Connection nodes without a value in the URL field will fail.

## Next Version

- Add a **Folder** field to the Request and Start Job nodes for easier switching between folders/org units. Currently, users can specify a folder by putting *X-UIPATH-OrganizationUnitId* in the parameter list.

## Install

1. Install [Node.js](https://nodejs.org/en/download/) and [node-RED](https://nodered.org/docs/getting-started/installation).

2. Navigate to your node-RED directory and run `npm install @uipath/node-red-contrib-uipath-orchestrator` OR

3. Start node-RED, navigate to the hamburger menu in the top right corner, select *Manage Palette*, and add the UiPath Orchestrator nodes.

## Nodes

### Connection

A configuration node that authenticates all calls made to Orchestrator and automatically refreshes API tokens when needed.

**ON PREMISE**

* **URL**: The URL of your Orchestrator instance.
* **Tenant**: Your tenant
* **Username**: Your username
* **Password**: Your password. This value is encrypted when the flow is saved.

**CLOUD**

* **User Key**: The secret key that identifies your user.
* **Account**: The logical name of your account at https://platform.uipath.com.
* **Tenant**: The logical name of the tenant (AKA service) to which you want to connect. Each account may support multiple tenants
* **Client ID**: The unique identifier of https://platform.uipath.com.

### Request

A wrapper of the full Orchestrator API allowing any request to be made. Currently configured for v2018.4 and includes Organizational Units.

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