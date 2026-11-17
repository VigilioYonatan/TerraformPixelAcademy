package terrapixel.s13.exceptions_test

import data.terrapixel.s13.exceptions
import rego.v1

test_allows_compliant_resource_and_bounded_exception if {
	sample := {
		"resources": [{
			"address": "module.storage.terraform_data.archive",
			"public_access": false,
			"tags": {
				"Owner": "platform-security",
				"CostCenter": "CC-104",
				"Environment": "prod",
			},
		}],
		"exceptions": [{
			"id": "EXC-2026-014",
			"severity": "HIGH",
			"owner": "sec-lead",
			"ticket": "PLAT-442",
			"ttl_days": 14,
		}],
	}
	count(exceptions.deny) == 0 with input as sample
}

test_denies_critical_bypass_missing_owner_and_expired_ttl if {
	unsafe := {
		"resources": [{
			"address": "module.storage.terraform_data.raw_bucket",
			"public_access": true,
			"tags": {"Owner": "app-team"},
		}],
		"exceptions": [
			{
				"id": "EXC-CRIT",
				"severity": "CRITICAL",
				"owner": "sec-lead",
				"ticket": "PLAT-900",
				"ttl_days": 5,
			},
			{
				"id": "EXC-PERMANENT",
				"severity": "HIGH",
				"owner": "",
				"ticket": "",
				"ttl_days": 90,
			},
		],
	}
	violations := exceptions.deny with input as unsafe
	count(violations) >= 5
}
