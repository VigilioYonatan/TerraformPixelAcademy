package terrapixel.s13.exceptions

import rego.v1

required_tags := {"Owner", "CostCenter", "Environment"}

deny contains msg if {
	some res in input.resources
	missing := required_tags - {k | some k, _ in res.tags}
	count(missing) > 0
	msg := sprintf("S13_MISSING_TAGS: resource %s lacks required FinOps/governance tags: %v", [res.address, missing])
}

deny contains msg if {
	some res in input.resources
	res.public_access == true
	msg := sprintf("S13_PUBLIC_DATA_EXPOSURE: resource %s enables public access without edge/WAF exception", [res.address])
}

deny contains msg if {
	some exc in object.get(input, "exceptions", [])
	exc.severity == "CRITICAL"
	msg := sprintf("S13_CRITICAL_BYPASS_FORBIDDEN: exception %s attempts to bypass CRITICAL finding", [exc.id])
}

deny contains msg if {
	some exc in object.get(input, "exceptions", [])
	trim_space(object.get(exc, "owner", "")) == ""
	msg := sprintf("S13_EXCEPTION_MISSING_OWNER: exception %s lacks risk owner", [exc.id])
}

deny contains msg if {
	some exc in object.get(input, "exceptions", [])
	trim_space(object.get(exc, "ticket", "")) == ""
	msg := sprintf("S13_EXCEPTION_MISSING_TICKET: exception %s lacks auditable ticket reference", [exc.id])
}

deny contains msg if {
	some exc in object.get(input, "exceptions", [])
	ttl := object.get(exc, "ttl_days", 0)
	not valid_ttl(ttl)
	msg := sprintf("S13_EXCEPTION_TTL_EXCEEDED: exception %s ttl_days (%v) must be between 1 and 14 days", [exc.id, ttl])
}

valid_ttl(days) if {
	is_number(days)
	days >= 1
	days <= 14
}
