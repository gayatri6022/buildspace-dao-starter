import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
  "0x3ac6Fa8eEEE22821DfcE1b21c24fcCcBeb45cfDb",
);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "ZZZ Token",
        description: "This NFT will give you access to zzzDAO!",
        image: readFileSync("scripts/assets/zzztoken.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})()
