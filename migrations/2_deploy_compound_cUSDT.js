const BigNumber = web3.utils.BN
const FakeUSDT = artifacts.require("./TetherUSDT");
const FakeCUSDTImpl = artifacts.require("./CErc20Delegate");
const FakeCUSDT = artifacts.require("./CErc20Delegator");
const FakeCEther = artifacts.require("./CEther");
const FakeComptroller = artifacts.require("./Comptroller");
const FakeCUSDTInterestRateModel = artifacts.require("./WhitePaperInterestRateModel");
const FakeCEtherInterestRateModel = artifacts.require("./WhitePaperInterestRateModel");

module.exports = async (deployer, network) => {
  // Only setup Compound on local blockchain
  if (network !== 'development') return;

  // 1. Deploy DAI token contract
  deployer.deploy(FakeUSDT)

    // 2. Deploy Interest Model contracts for cDAI and cETH
    .then(() => deployer.deploy(FakeCUSDTInterestRateModel, web3.utils.toWei('0.02'), web3.utils.toWei('0.3')))
    .then(() => deployer.deploy(FakeCEtherInterestRateModel, web3.utils.toWei('0.02'), web3.utils.toWei('0.3')))

    // 3. Deploy Comptroller contract
    .then(() => deployer.deploy(FakeComptroller))

    // 4. Deploy cUSDT contract
    .then(() => deployer.deploy(FakeCUSDTImpl))
    .then(() => deployer.deploy(FakeCUSDT, FakeUSDT.address, FakeComptroller.address, FakeCUSDTInterestRateModel.address, web3.utils.toWei('0.02'), "Compound USDT", "cUSDT", 8, "0x814370Af194c40c6f2A582EE29592D8cdB48523C", FakeCUSDTImpl.address, "0x0001"))

    // 5. Deploy cEther contract
    .then(() => deployer.deploy(FakeCEther, FakeComptroller.address, FakeCEtherInterestRateModel.address, web3.utils.toWei('200000000'), "Compound Ether", "cETH", 8, "0x814370Af194c40c6f2A582EE29592D8cdB48523C"))

    // 6. Activate cToken markets
    .then(() => FakeComptroller.deployed())
    .then(instance => {
      instance._supportMarket(FakeCUSDT.address)
      instance._supportMarket(FakeCEther.address)
    })
};
