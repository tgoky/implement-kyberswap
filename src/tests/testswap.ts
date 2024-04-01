import { V1Swap } from "../../src/operations/V1Swap";
import { postSwapRouteV1 } from "../apis/V1Post";
import { getTokenApproval } from "../libs/approval";
import { getSigner } from "../libs/signer";
import { Signer } from "ethers";

// Mocking the APIs and libraries
jest.mock("../apis/V1Post");
jest.mock("../libs/approval");
jest.mock("../libs/signer");

describe("V1Swap", () => {
  it("should execute the swap transaction on-chain", async () => {
    // Mocked data
    const swapData = {
      data: "encodedSwapData",
      routerAddress: "routerContractAddress",
      amountIn: "100",
    };
    const signerAddress = "signerAddress";
    const executeSwapTxReceipt = { hash: "transactionHash" };
    
    // Mocking API and library functions
    (postSwapRouteV1 as jest.MockedFunction<typeof postSwapRouteV1>).mockResolvedValue(swapData);
    (getTokenApproval as jest.MockedFunction<typeof getTokenApproval>).mockResolvedValue(undefined);
    
    // Mocking the signer object
    const mockedSigner: Signer = {
      getAddress: async () => signerAddress,
      sendTransaction: async () => executeSwapTxReceipt,
    };
    (getSigner as jest.MockedFunction<typeof getSigner>).mockReturnValue(mockedSigner);
    
    // Calling the function to test
    await V1Swap();
    
    // Assertions
    expect(postSwapRouteV1).toHaveBeenCalled();
    expect(getSigner).toHaveBeenCalled();
    expect(getTokenApproval).toHaveBeenCalledWith("tokenInAddress", "routerContractAddress", "100");
    // Access mockedSigner directly for assertion
    expect(mockedSigner.sendTransaction).toHaveBeenCalledWith({
      data: "encodedSwapData",
      from: "signerAddress",
      to: "routerContractAddress",
      maxFeePerGas: 1000000000000,
      maxPriorityFeePerGas: 1000000000000
    });
  });
});
