import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, log } = hre.deployments;

  const confidentialUSDC = await deploy("ConfidentialUSDC", {
    from: deployer,
    log: true,
  });
  log(`ConfidentialUSDC deployed at: ${confidentialUSDC.address}`);

  const payroll = await deploy("ConfidentialPayroll", {
    from: deployer,
    log: true,
  });
  log(`ConfidentialPayroll deployed at: ${payroll.address}`);
};
export default func;
func.id = "deploy_confidential_payroll"; // id required to prevent reexecution
func.tags = ["ConfidentialUSDC", "ConfidentialPayroll"];
