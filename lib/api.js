"use strict";

class Api {

	static convertParams(params) {
		var body = {};
		for (var p of params) body[p.key] = p.value;
		return body;
	}

	static fillPath(action, path, params) {
		/*Path Params*/
		for (var target of (path.match(/\{\w+\}/g) || [])) {
			var key = target.slice(1, -1);

			if (params[key])
				path = path.replace(target, params[key]);
			else
				throw "Path Parameter '" + key + "' is missing. Please add it and try again.";
		}

		/*Query Params*/
		if (/Get(All|One)/.test(action)) {
			var qString = "?";

			// Combine all query params, which start with $
			for (var key of Object.keys(params).filter((key) => /\$.*/.test(key)))
				qString += (key + "=" + params[key] + "&");

			// If query params existed, remove last '&'' and append to path
			if (qString != "?") 
				path += qString.slice(0, -1)
		}

		return path;
	}

	static Alerts(action) {
		return {
			GetAll: ["GET", "odata/Alerts"],
			GetUnreadCount: ["GET", "odata/Alerts/UiPath.Server.Configuration.OData.GetUnreadCount()"],
			MarkAsRead: ["POST", "odata/Alerts/UiPath.Server.Configuration.OData.MarkAsRead"]
		}[action]
	}

	static Assets(action) {
		return {
			GetAll: ["GET", "odata/Assets"],
			Create: ["POST", "odata/Assets"],
			Delete: ["DELETE", "odata/Assets({id})"],
			Edit: ["PUT", "odata/Assets({id})"],
			GetRobotAsset: ["GET", "odata/Assets/UiPath.Server.Configuration.OData.GetRobotAsset(robotId='{robotid}',assetName='{assetname}')"]
		}[action]
	}

	static AuditLogs(action) {
		return {
			GetAll: ["GET", "odata/AuditLogs"]
		}[action]
	}

	static Environments(action) {
		return {
			GetAll: ["GET", "odata/Environments"],
			GetOne: ["GET", "odata/Environments({id})"],
			Create: ["POST", "odata/Environments"],
			Delete: ["DELETE", "odata/Environments({id})"],
			Update: ["PUT", "odata/Environments({id})"],
			GetRobotsForEnvironment: ["GET", "odata/Environments/UiPath.Server.Configuration.OData.GetRobotsForEnvironment(key={key})"],
			AddRobot: ["POST", "odata/Environments({id})/UiPath.Server.Configuration.OData.AddRobot"],
			RemoveRobot: ["POST", "odata/Environments({id})/UiPath.Server.Configuration.OData.RemoveRobot"],
		}[action]
	}

	static Jobs(action) {
		return {
			GetAll: ["GET", "odata/Jobs"],
			GetOne: ["GET", "odata/Jobs({id})"],
			Create: ["POST", "odata/Jobs"],
			Update: ["PUT", "odata/Jobs({id})"],
			StartJobs: ["POST", "odata/Jobs/UiPath.Server.Configuration.OData.StartJobs"],
			StopJob: ["POST", "odata/Jobs({id})/UiPath.Server.Configuration.OData.StopJob"]
		}[action]
	}

	static OrganizationUnits(action) {
		return {
			GetAll: ["GET", "/odata/OrganizationUnits"],
			GetOne: ["GET", "/odata/OrganizationUnits({id})"],
			Create: ["POST", "/odata/OrganizationUnits"],
			Delete: ["DELETE", "/odata/OrganizationUnits({id})"],
			Edit: ["PUT", "/odata/OrganizationUnits({id})"],
			GetUsersForUnit: ["GET", "/odata/OrganizationUnits/UiPath.Server.Configuration.OData.GetUsersForUnit(key={key})"],
			GetUserIdsForUnit: ["GET", "/odata/OrganizationUnits/UiPath.Server.Configuration.OData.GetUserIdsForUnit(key={key})"],
			SetUsers: ["POST", "/odata/OrganizationUnits({id})/UiPath.Server.Configuration.OData.SetUsers"]
		}[action]
	}

	static Permissions(action) {
		return {
			GetAll: ["GET", "odata/Permissions"]
		}[action]
	}

	static Processes(action) {
		return {
			GetAll: ["GET", "odata/Processes"],
			Delete: ["DELETE", "odata/Processes('{id}')"],
			GetProcessVersions: ["GET", "odata/Processes/UiPath.Server.Configuration.OData.GetProcessVersions(processId='{processid}')"]
		}[action]
	}

	static ProcessSchedules(action) {
		return {
			GetAll: ["GET", "odata/ProcessSchedules"],
			GetOne: ["GET", "odata/ProcessSchedules({id})"],
			Create: ["POST", "odata/ProcessSchedules"],
			Delete: ["DELETE", "odata/ProcessSchedules({id})"],
			Edit: ["PUT", "odata/ProcessSchedules({id})"],
			SetEnabled: ["POST", "odata/ProcessSchedules/UiPath.Server.Configuration.OData.SetEnabled"],
			GetRobotIdsForSchedule: ["GET", "/odata/ProcessSchedules/UiPath.Server.Configuration.OData.GetRobotIdsForSchedule(key={key})"]
		}[action]
	}

	static QueueDefinitions(action) {
		return {
			GetAll: ["GET", "odata/QueueDefinitions"],
			Create: ["POST", "odata/QueueDefinitions"],
			Delete: ["DELETE", "odata/QueueDefinitions({id})"],
			Edit: ["PUT", "odata/QueueDefinitions({id})"]
		}[action]
	}

	static QueueItemComments(action) {
		return {
			GetAll: ["GET", "odata/QueueItemComments"],
			GetOne: ["GET", "odata/QueueItemComments({id})"],
			Create: ["POST", "odata/QueueItemComments"],
			Delete: ["DELETE", "odata/QueueItemComments({id})"],
			Update: ["PUT", "odata/QueueItemComments({id})"],
			GetQueueItemCommentsHistory: ["GET", "odata/QueueItemComments/UiPath.Server.Configuration.OData.GetQueueItemCommentsHistory(queueItemId={queueItemid})"]
		}[action]
	}

	static QueueItems(action) {
		return {
			GetAll: ["GET", "odata/QueueItems"],
			GetOne: ["GET", "odata/QueueItems({id})"],
			Delete: ["DELETE", "odata/QueueItems({id})"],
			Create: ["POST", "odata/QueueItems"],
			Replace: ["PUT", "odata/QueueItems({id})"],
			Update: ["PATCH", "odata/QueueItems({id})"],
			GetItemProcessingHistory: ["GET", "odata/QueueItems({id})/UiPathODataSvc.GetItemProcessingHistory()"],
			SetItemReviewStatus: ["POST", "odata/QueueItems/UiPathODataSvc.SetItemReviewStatus"],
			DeleteBulk: ["POST", "odata/QueueItems/UiPathODataSvc.DeleteBulk"],
			SetTransactionProgress: ["POST", "odata/QueueItems({id})/UiPathODataSvc.SetTransactionProgress"]
		}[action]
	}

	static QueueProcessingRecords(action) {
		return {
			GetAll: ["GET", "odata/QueueProcessingRecords"],
			GetOne: ["GET", "odata/QueueProcessingRecords({id})"],
			Create: ["POST", "odata/QueueProcessingRecords"],
			Delete: ["DELETE", "odata/QueueProcessingRecords({id})"],
			RetrieveLastDaysProcessingRecords: ["GET", "odata/QueueProcessingRecords/UiPathODataSvc.RetrieveLastDaysProcessingRecords(daysNo={daysno},queueDefinitionId={queuedefinitionid})"],
			RetrieveQueuesProcessingStatus: ["GET", "odata/QueueProcessingRecords/UiPathODataSvc.RetrieveQueuesProcessingStatus()"]
		}[action]
	}

	static Queues(action) {
		return {
			GetAll: ["GET", "odata/Queues"],
			GetOne: ["GET", "odata/Queues({id})"],
			AddQueueItem: ["POST", "odata/Queues/UiPathODataSvc.AddQueueItem"],
			StartTransaction: ["POST", "odata/Queues/UiPathODataSvc.StartTransaction"],
			SetTransactionResult: ["POST", "odata/Queues({id})/UiPathODataSvc.SetTransactionResult"]
		}[action]
	}

	static Releases(action) {
		return {
			GetAll: ["GET", "odata/Releases"],
			GetOne: ["GET", "odata/Releases({id})"],
			Create: ["POST", "odata/Releases"],
			Delete: ["DELETE", "odata/Releases({id})"],
			Edit: ["PUT", "odata/Releases({id})"],
			UpdateToSpecificPackageVersion: ["POST", "odata/Releases({id})/UiPath.Server.Configuration.OData.UpdateToSpecificPackageVersion"],
			UpdateToLatestPackageVersion: ["POST", "odata/Releases({id})/UiPath.Server.Configuration.OData.UpdateToLatestPackageVersion"],
			RollbackToPreviousReleaseVersion: ["POST", "odata/Releases({id})/UiPath.Server.Configuration.OData.RollbackToPreviousReleaseVersion"]
		}[action]
	}

	static RobotLogs(action) {
		return {
			GetAll: ["GET", "odata/RobotLogs"],
			Reports: ["GET", "odata/RobotLogs/UiPath.Server.Configuration.OData.Reports()"]
		}[action]
	}

	static Robots(action) {
		return {
			GetAll: ["GET", "odata/Robots"],
			GetOne: ["GET", "odata/Robots({id})"],
			Create: ["POST", "odata/Robots"],
			Delete: ["DELETE", "odata/Robots({id})"],
			Edit: ["PUT", "odata/Robots({id})"],
			GetMachineName: ["GET", "odata/Robots/UiPath.Server.Configuration.OData.GetMachineNameToLicenseKeyMappings()"]
		}[action]
	}

	static Roles(action) {
		return {
			GetAll: ["GET", "odata/Roles"],
			Create: ["POST", "odata/Roles"],
			Delete: ["DELETE", "odata/Roles({id})"],
			Edit: ["PUT", "odata/Roles({id})"]
		}[action]
	}

	static Sessions(action) {
		return {
			GetAll: ["GET", "odata/Sessions"]
		}[action]
	}

	static Stats(action) {
		return {
			GetCountStats: ["GET", "api/Stats/GetCountStats"],
			GetSessionsStats: ["GET", "api/Stats/GetSessionsStats"],
			GetJobsStats: ["GET", "api/Stats/GetJobsStats"]
		}[action]
	}

	static Tenants(action) {
		return {
			GetAll: ["GET", "odata/Tenants"],
			GetOne: ["GET", "/odata/Tenants({id})"],
			Create: ["POST", "odata/Tenants"],
			Delete: ["DELETE", "/odata/Tenants({id})"],
			Edit: ["PUT", "odata/Tenants({id})"]
		}[action]
	}

	static Users(action) {
		return {
			GetAll: ["GET", "odata/Users"],
			GetOne: ["GET", "odata/Users({id})"],
			Create: ["POST", "odata/Users"],
			Delete: ["DELETE", "odata/Users({id})"],
			Edit: ["PUT", "odata/Users({id})"],
			GetCurrentPermissions: ["GET", "odata/Users/UiPath.Server.Configuration.OData.GetCurrentPermissions()"],
			GetCurrentUser: ["GET", "odata/Users/UiPath.Server.Configuration.OData.GetCurrentUser()"],
			ToggleRole: ["POST", "odata/Users({id})/UiPath.Server.Configuration.OData.ToggleRole"],
			ImportUsers: ["POST", "odata/Users/UiPath.Server.Configuration.OData.ImportUsers"],
			ChangePassword: ["POST", "odata/Users({id})/UiPath.Server.Configuration.OData.ChangePassword"]
		}[action]
	}
}

global.Api = Api;