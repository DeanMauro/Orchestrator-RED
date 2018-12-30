"use strict";

class Api {

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
		if (action == "get") {
			var qString = "?";

			// Combine all query params, which start with $
			for (var key of Object.keys(params).filter((key) => /\$.*/.test(key)))
				qString += (key + "=" + params[key] + "&");

			// If query params existed, remove last '&' and append to path
			if (qString != "?") 
				path += qString.slice(0, -1)
		}

		return path;
	}

	static Alerts(action) {
		return {
			GetAll: ["get", "/odata/Alerts"],
			GetUnreadCount: ["get", "/odata/Alerts/UiPath.Server.Configuration.OData.GetUnreadCount()"],
			MarkAsRead: ["post", "/odata/Alerts/UiPath.Server.Configuration.OData.MarkAsRead"],
			RaiseProcessAlert: ["post", "/odata/Alerts/UiPath.Server.Configuration.OData.RaiseProcessAlert"]
		}[action]
	}

	static Assets(action) {
		return {
			GetAll: ["get", "/odata/Assets"],
			Create: ["post", "/odata/Assets"],
			Edit: ["put", "/odata/Assets({Id})"],
			Delete: ["delete", "/odata/Assets({Id})"],
			GetRobotAssetByNameForRobotKey: ["post", "/odata/Assets/UiPath.Server.Configuration.OData.GetRobotAssetByNameForRobotKey"],
			GetRobotAssetByRobotId: ["get", "/odata/Assets/UiPath.Server.Configuration.OData.GetRobotAssetByRobotId(robotId={robotId},assetName='{assetName}')"],
			GetRobotAssetByRobotidAndAssetname: ["get", "/odata/Assets/UiPath.Server.Configuration.OData.GetRobotAsset(robotId='{robotId}',assetName='{assetName}')"]
		}[action]
	}

	static AuditLogs(action) {
		return {
			GetAll: ["get", "/odata/AuditLogs"],
			GetAuditLogDetailsByAuditlogid: ["get", "/odata/AuditLogs/UiPath.Server.Configuration.OData.GetAuditLogDetails(auditLogId={auditLogId})"],
			Reports: ["get", "/odata/AuditLogs/UiPath.Server.Configuration.OData.Reports()"]
		}[action]
	}

	static Environments(action) {
		return {
			GetAll: ["get", "/odata/Environments"],
			Create: ["post", "/odata/Environments"],
			GetById: ["get", "/odata/Environments({Id})"],
			Edit: ["put", "/odata/Environments({Id})"],
			Delete: ["delete", "/odata/Environments({Id})"],
			GetRobotsForEnvironmentByKey: ["get", "/odata/Environments/UiPath.Server.Configuration.OData.GetRobotsForEnvironment(key={key})"],
			GetRobotIdsForEnvironmentByKey: ["get", "/odata/Environments/UiPath.Server.Configuration.OData.GetRobotIdsForEnvironment(key={key})"],
			AddRobot: ["post", "/odata/Environments({Id})/UiPath.Server.Configuration.OData.AddRobot"],
			RemoveRobot: ["post", "/odata/Environments({Id})/UiPath.Server.Configuration.OData.RemoveRobot"],
			SetRobots: ["post", "/odata/Environments({Id})/UiPath.Server.Configuration.OData.SetRobots"]
		}[action]
	}

	static Jobs(action) {
		return {
			GetAll: ["get", "/odata/Jobs"],
			GetById: ["get", "/odata/Jobs({Id})"],
			StartJobs: ["post", "/odata/Jobs/UiPath.Server.Configuration.OData.StartJobs"],
			StopJob: ["post", "/odata/Jobs({Id})/UiPath.Server.Configuration.OData.StopJob"],
			StopJobs: ["post", "/odata/Jobs/UiPath.Server.Configuration.OData.StopJobs"]
		}[action]
	}

	static Libraries(action) {
		return {
			GetAll: ["get", "/odata/Libraries"],
			Delete: ["delete", "/odata/Libraries('{Id}')"],
			GetVersionsByPackageid: ["get", "/odata/Libraries/UiPath.Server.Configuration.OData.GetVersions(packageId='{packageId}')"],
			DownloadPackageByKey: ["get", "/odata/Libraries/UiPath.Server.Configuration.OData.DownloadPackage(key='{key}')"],
			UploadPackage: ["post", "/odata/Libraries/UiPath.Server.Configuration.OData.UploadPackage"]
		}[action]
	}

	static LicensesNamedUser(action) {
		return {
			GetLicensesNamedUserByRobottype: ["get", "/odata/LicensesNamedUser/UiPath.Server.Configuration.OData.GetLicensesNamedUser(robotType='{robotType}')"]
		}[action]
	}

	static LicensesRuntime(action) {
		return {
			GetLicensesRuntimeByRobottype: ["get", "/odata/LicensesRuntime/UiPath.Server.Configuration.OData.GetLicensesRuntime(robotType='{robotType}')"],
			ToggleEnabledByKey: ["post", "/odata/LicensesRuntime('{Key}')/UiPath.Server.Configuration.OData.ToggleEnabled"]
		}[action]
	}

	static Logs(action) {
		return {
			Create: ["post", "/api/logs"],
			SubmitLogs: ["post", "/api/Logs/SubmitLogs"]
		}[action]
	}

	static Machines(action) {
		return {
			GetAll: ["get", "/odata/Machines"],
			Create: ["post", "/odata/Machines"],
			GetById: ["get", "/odata/Machines({Id})"],
			Edit: ["put", "/odata/Machines({Id})"],
			Delete: ["delete", "/odata/Machines({Id})"],
			PartiallyUpdate: ["patch", "/odata/Machines({Id})"],
			DeleteBulk: ["post", "/odata/Machines/UiPath.Server.Configuration.OData.DeleteBulk"]
		}[action]
	}

	static MessageTemplates(action) {
		return {
			GetAll: ["get", "/odata/MessageTemplates"],
			Edit: ["put", "/odata/MessageTemplates('{Id}')"]
		}[action]
	}

	static OrganizationUnits(action) {
		return {
			GetAll: ["get", "/odata/OrganizationUnits"],
			Create: ["post", "/odata/OrganizationUnits"],
			GetById: ["get", "/odata/OrganizationUnits({Id})"],
			Edit: ["put", "/odata/OrganizationUnits({Id})"],
			Delete: ["delete", "/odata/OrganizationUnits({Id})"],
			GetUsersForUnitByKey: ["get", "/odata/OrganizationUnits/UiPath.Server.Configuration.OData.GetUsersForUnit(key={key})"],
			GetUserIdsForUnitByKey: ["get", "/odata/OrganizationUnits/UiPath.Server.Configuration.OData.GetUserIdsForUnit(key={key})"],
			SetUsers: ["post", "/odata/OrganizationUnits({Id})/UiPath.Server.Configuration.OData.SetUsers"]
		}[action]
	}

	static Permissions(action) {
		return {
			GetAll: ["get", "/odata/Permissions"]
		}[action]
	}

	static ProcessSchedules(action) {
		return {
			GetAll: ["get", "/odata/ProcessSchedules"],
			Create: ["post", "/odata/ProcessSchedules"],
			GetById: ["get", "/odata/ProcessSchedules({Id})"],
			Edit: ["put", "/odata/ProcessSchedules({Id})"],
			Delete: ["delete", "/odata/ProcessSchedules({Id})"],
			SetEnabled: ["post", "/odata/ProcessSchedules/UiPath.Server.Configuration.OData.SetEnabled"],
			GetRobotIdsForScheduleByKey: ["get", "/odata/ProcessSchedules/UiPath.Server.Configuration.OData.GetRobotIdsForSchedule(key={key})"]
		}[action]
	}

	static Processes(action) {
		return {
			GetAll: ["get", "/odata/Processes"],
			Delete: ["delete", "/odata/Processes('{Id}')"],
			GetProcessVersionsByProcessid: ["get", "/odata/Processes/UiPath.Server.Configuration.OData.GetProcessVersions(processId='{processId}')"],
			DownloadPackageByKey: ["get", "/odata/Processes/UiPath.Server.Configuration.OData.DownloadPackage(key='{key}')"],
			UploadPackage: ["post", "/odata/Processes/UiPath.Server.Configuration.OData.UploadPackage"],
			GetArgumentsByKey: ["get", "/odata/Processes/UiPath.Server.Configuration.OData.GetArguments(key='{key}')"],
			SetArguments: ["post", "/odata/Processes/UiPath.Server.Configuration.OData.SetArguments"]
		}[action]
	}

	static QueueDefinitions(action) {
		return {
			GetAll: ["get", "/odata/QueueDefinitions"],
			Create: ["post", "/odata/QueueDefinitions"],
			GetById: ["get", "/odata/QueueDefinitions({Id})"],
			Edit: ["put", "/odata/QueueDefinitions({Id})"],
			Delete: ["delete", "/odata/QueueDefinitions({Id})"],
			Reports: ["get", "/odata/QueueDefinitions({Id})/UiPathODataSvc.Reports()"]
		}[action]
	}

	static QueueItemComments(action) {
		return {
			GetAll: ["get", "/odata/QueueItemComments"],
			Create: ["post", "/odata/QueueItemComments"],
			GetById: ["get", "/odata/QueueItemComments({Id})"],
			Edit: ["put", "/odata/QueueItemComments({Id})"],
			Delete: ["delete", "/odata/QueueItemComments({Id})"],
			GetQueueItemCommentsHistoryByQueueitemid: ["get", "/odata/QueueItemComments/UiPath.Server.Configuration.OData.GetQueueItemCommentsHistory(queueItemId={queueItemId})"]
		}[action]
	}

	static QueueItemEvents(action) {
		return {
			GetAll: ["get", "/odata/QueueItemEvents"],
			GetById: ["get", "/odata/QueueItemEvents({Id})"],
			GetQueueItemEventsHistoryByQueueitemid: ["get", "/odata/QueueItemEvents/UiPath.Server.Configuration.OData.GetQueueItemEventsHistory(queueItemId={queueItemId})"]
		}[action]
	}

	static QueueItems(action) {
		return {
			GetAll: ["get", "/odata/QueueItems"],
			GetById: ["get", "/odata/QueueItems({Id})"],
			Delete: ["delete", "/odata/QueueItems({Id})"],
			GetItemProcessingHistory: ["get", "/odata/QueueItems({Id})/UiPathODataSvc.GetItemProcessingHistory()"],
			SetItemReviewStatus: ["post", "/odata/QueueItems/UiPathODataSvc.SetItemReviewStatus"],
			DeleteBulk: ["post", "/odata/QueueItems/UiPathODataSvc.DeleteBulk"],
			SetTransactionProgress: ["post", "/odata/QueueItems({Id})/UiPathODataSvc.SetTransactionProgress"],
			SetItemReviewer: ["post", "/odata/QueueItems/UiPathODataSvc.SetItemReviewer"],
			UnsetItemReviewer: ["post", "/odata/QueueItems/UiPathODataSvc.UnsetItemReviewer"],
			GetReviewers: ["get", "/odata/QueueItems/UiPath.Server.Configuration.OData.GetReviewers()"]
		}[action]
	}

	static QueueProcessingRecords(action) {
		return {
			RetrieveLastDaysProcessingRecordsByDaysnoAndQueuedefinitionid: ["get", "/odata/QueueProcessingRecords/UiPathODataSvc.RetrieveLastDaysProcessingRecords(daysNo={daysNo},queueDefinitionId={queueDefinitionId})"],
			RetrieveQueuesProcessingStatus: ["get", "/odata/QueueProcessingRecords/UiPathODataSvc.RetrieveQueuesProcessingStatus()"]
		}[action]
	}

	static Queues(action) {
		return {
			StartTransaction: ["post", "/odata/Queues/UiPathODataSvc.StartTransaction"],
			AddQueueItem: ["post", "/odata/Queues/UiPathODataSvc.AddQueueItem"],
			SetTransactionResult: ["post", "/odata/Queues({Id})/UiPathODataSvc.SetTransactionResult"]
		}[action]
	}

	static Releases(action) {
		return {
			GetAll: ["get", "/odata/Releases"],
			Create: ["post", "/odata/Releases"],
			GetById: ["get", "/odata/Releases({Id})"],
			Edit: ["put", "/odata/Releases({Id})"],
			Delete: ["delete", "/odata/Releases({Id})"],
			PartiallyUpdate: ["patch", "/odata/Releases({Id})"],
			UpdateToSpecificPackageVersion: ["post", "/odata/Releases({Id})/UiPath.Server.Configuration.OData.UpdateToSpecificPackageVersion"],
			UpdateToLatestPackageVersion: ["post", "/odata/Releases({Id})/UiPath.Server.Configuration.OData.UpdateToLatestPackageVersion"],
			RollbackToPreviousReleaseVersion: ["post", "/odata/Releases({Id})/UiPath.Server.Configuration.OData.RollbackToPreviousReleaseVersion"]
		}[action]
	}

	static RobotLogs(action) {
		return {
			GetAll: ["get", "/odata/RobotLogs"],
			GetTotalCount: ["get", "/odata/RobotLogs/UiPath.Server.Configuration.OData.GetTotalCount()"],
			Reports: ["get", "/odata/RobotLogs/UiPath.Server.Configuration.OData.Reports()"]
		}[action]
	}

	static Robots(action) {
		return {
			GetAll: ["get", "/odata/Robots"],
			Create: ["post", "/odata/Robots"],
			GetById: ["get", "/odata/Robots({Id})"],
			Edit: ["put", "/odata/Robots({Id})"],
			Delete: ["delete", "/odata/Robots({Id})"],
			GetMachineNameToLicenseKeyMappings: ["get", "/odata/Robots/UiPath.Server.Configuration.OData.GetMachineNameToLicenseKeyMappings()"],
			GetUsernames: ["get", "/odata/Robots/UiPath.Server.Configuration.OData.GetUsernames()"],
			GetRobotsForProcessByProcessid: ["get", "/odata/Robots/UiPath.Server.Configuration.OData.GetRobotsForProcess(processId='{processId}')"],
			DeleteBulk: ["post", "/odata/Robots/UiPath.Server.Configuration.OData.DeleteBulk"],
			ConvertToFloating: ["post", "/odata/Robots/UiPath.Server.Configuration.OData.ConvertToFloating"]
		}[action]
	}

	static Roles(action) {
		return {
			GetAll: ["get", "/odata/Roles"],
			Create: ["post", "/odata/Roles"],
			GetById: ["get", "/odata/Roles({Id})"],
			Edit: ["put", "/odata/Roles({Id})"],
			Delete: ["delete", "/odata/Roles({Id})"],
			GetUsersForRoleByKey: ["get", "/odata/Roles/UiPath.Server.Configuration.OData.GetUsersForRole(key={key})"],
			GetUserIdsForRoleByKey: ["get", "/odata/Roles/UiPath.Server.Configuration.OData.GetUserIdsForRole(key={key})"],
			SetUsers: ["post", "/odata/Roles({Id})/UiPath.Server.Configuration.OData.SetUsers"]
		}[action]
	}

	static Sessions(action) {
		return {
			GetAll: ["get", "/odata/Sessions"]
		}[action]
	}

	static Stats(action) {
		return {
			GetCountStats: ["get", "/api/Stats/GetCountStats"],
			GetSessionsStats: ["get", "/api/Stats/GetSessionsStats"],
			GetJobsStats: ["get", "/api/Stats/GetJobsStats"],
			GetLicenseStats: ["get", "/api/Stats/GetLicenseStats"]
		}[action]
	}

	static Tenants(action) {
		return {
			GetAll: ["get", "/odata/Tenants"],
			Create: ["post", "/odata/Tenants"],
			GetById: ["get", "/odata/Tenants({Id})"],
			Delete: ["delete", "/odata/Tenants({Id})"],
			SetActive: ["post", "/odata/Tenants/UiPath.Server.Configuration.OData.SetActive"]
		}[action]
	}

	static Users(action) {
		return {
			GetAll: ["get", "/odata/Users"],
			Create: ["post", "/odata/Users"],
			GetById: ["get", "/odata/Users({Id})"],
			Edit: ["put", "/odata/Users({Id})"],
			Delete: ["delete", "/odata/Users({Id})"],
			PartiallyUpdate: ["patch", "/odata/Users({Id})"],
			GetCurrentPermissions: ["get", "/odata/Users/UiPath.Server.Configuration.OData.GetCurrentPermissions()"],
			GetCurrentUser: ["get", "/odata/Users/UiPath.Server.Configuration.OData.GetCurrentUser()"],
			ToggleRole: ["post", "/odata/Users({Id})/UiPath.Server.Configuration.OData.ToggleRole"],
			ImportUsers: ["post", "/odata/Users/UiPath.Server.Configuration.OData.ImportUsers"],
			ToggleOrganizationUnit: ["post", "/odata/Users({Id})/UiPath.Server.Configuration.OData.ToggleOrganizationUnit"],
			ChangePassword: ["post", "/odata/Users({Id})/UiPath.Server.Configuration.OData.ChangePassword"],
			SetActive: ["post", "/odata/Users({Id})/UiPath.Server.Configuration.OData.SetActive"],
			ChangeCulture: ["post", "/odata/Users/UiPath.Server.Configuration.OData.ChangeCulture"],
			UpdatePassword: ["post", "/odata/Users/UiPath.Server.Configuration.OData.UpdatePassword"]
		}[action]
	}

	static Webhooks(action) {
		return {
			GetAll: ["get", "/odata/Webhooks"],
			Create: ["post", "/odata/Webhooks"],
			GetById: ["get", "/odata/Webhooks({Id})"],
			Edit: ["put", "/odata/Webhooks({Id})"],
			Delete: ["delete", "/odata/Webhooks({Id})"],
			PartiallyUpdate: ["patch", "/odata/Webhooks({Id})"],
			Ping: ["post", "/odata/Webhooks({Id})/UiPath.Server.Configuration.OData.Ping"],
			GetEventTypes: ["get", "/odata/Webhooks/UiPath.Server.Configuration.OData.GetEventTypes()"],
			TriggerCustom: ["post", "/odata/Webhooks/UiPath.Server.Configuration.OData.TriggerCustom"]
		}[action]
	}
}

module.exports = Api;