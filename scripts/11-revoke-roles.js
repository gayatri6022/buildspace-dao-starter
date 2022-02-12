import sdk from "./1-initialize-sdk.js";

const tokenModule = sdk.getTokenModule(
  "0xAAABA73294068C7Bd08FcFFB9c781bE65A542eA6",
);

(async () => {
  try {
    // Log the current roles.
    console.log(
      "😼 Roles that exist right now:",
      await tokenModule.getAllRoleMembers()
    );

    // Revoke all the superpowers your wallet had over the ERC-20 contract.
    await tokenModule.revokeAllRolesFromAddress(process.env.WALLET_ADDRESS);
    console.log(
      "🎉 Roles after revoking ourselves",
      await tokenModule.getAllRoleMembers()
    );
    console.log("✅ Successfully revoked our superpowers from the ERC-20 contract");

  } catch (error) {
    console.error("Failed to revoke ourselves from the DAO treasury", error);
  }
})();