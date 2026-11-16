terraform { required_version = ">= 1.6.0" }
module "network" {
  source = "../../modules/network"
  environment = "staging"
}
module "service" {
  source = "../../modules/service"
  environment = "staging"
}
module "data" {
  source = "../../modules/data"
  environment = "staging"
}
output "network_id" { value = module.network.id }
output "service_id" { value = module.service.id }
output "data_id" { value = module.data.id }
