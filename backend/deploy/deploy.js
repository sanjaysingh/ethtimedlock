module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("TimedLockerV5", {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: true,
  });
};

module.exports.tags = ["TimedLockerV5"]; 