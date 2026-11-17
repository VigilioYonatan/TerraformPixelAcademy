package main_test

import data.main
import rego.v1

test_capstone_compliant_release_passes if {
	compliant := {
		"environment": "prod",
		"monolithic_state": false,
		"static_iam_keys": false,
		"destructive_approved": false,
		"resource_changes": [{
			"address": "module.workload[\"api\"].terraform_data.workload",
			"change": {"actions": ["create"]},
		}],
		"workloads": [
			{"name": "api", "tags": {"owner": "platform-team", "environment": "prod"}},
			{"name": "worker", "tags": {"owner": "platform-team", "environment": "prod"}},
		],
	}
	count(main.deny) == 0 with input as compliant
}

test_capstone_noncompliant_release_blocks_all_antipatterns if {
	noncompliant := {
		"environment": "shadow-prod",
		"monolithic_state": true,
		"static_iam_keys": true,
		"destructive_approved": false,
		"resource_changes": [{
			"address": "module.data.terraform_data.data",
			"change": {"actions": ["delete", "create"]},
		}],
		"workloads": [{"name": "api", "tags": {"owner": ""}}],
	}
	findings := main.deny with input as noncompliant
	count(findings) == 5
}
