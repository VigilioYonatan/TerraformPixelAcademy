terraform { required_version = ">= 1.6.0" }
module "network" {
  source = "../../modules/network"
  environment = "dev"
}
module "service" {
  source = "../../modules/service"
  environment = "dev"
}
module "data" {
  source = "../../modules/data"
  environment = "dev"
}
output "network_id" { value = module.network.id }
output "service_id" { value = module.service.id }
output "data_id" { value = module.data.id }
