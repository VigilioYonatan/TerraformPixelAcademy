package main

import rego.v1

allowed_environments := {"dev", "staging", "prod"}

deny contains msg if {
	env := object.get(input, "environment", "")
	not allowed_environments[env]
	msg := sprintf("S18_INVALID_ENV: environment '%s' must be dev, staging, or prod", [env])
}

deny contains msg if {
	object.get(input, "monolithic_state", false) == true
	msg := "S18_MONOLITHIC_STATE_FORBIDDEN: states must be isolated per environment and layer"
}

deny contains msg if {
	object.get(input, "static_iam_keys", false) == true
	msg := "S18_STATIC_IAM_KEYS_FORBIDDEN: pipelines must federate via scoped OIDC"
}

deny contains msg if {
	some res in object.get(input, "resource_changes", [])
	actions := object.get(object.get(res, "change", {}), "actions", [])
	"delete" in actions
	object.get(input, "destructive_approved", false) != true
	msg := sprintf("S18_UNAPPROVED_DESTROY: destructive change on %s lacks explicit approval and backup", [res.address])
}

deny contains msg if {
	some workload in object.get(input, "workloads", [])
	tags := object.get(workload, "tags", {})
	trim_space(object.get(tags, "owner", "")) == ""
	msg := sprintf("S18_WORKLOAD_MISSING_OWNER: workload %s lacks mandatory owner tag", [workload.name])
}
