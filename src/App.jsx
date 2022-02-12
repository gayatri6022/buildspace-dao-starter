import { ThirdwebSDK } from "@3rdweb/sdk";
import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
// import thirdweb
import { useWeb3 } from "@3rdweb/hooks";
// We instantiate the sdk on Rinkeby.
const sdk = new ThirdwebSDK("rinkeby");
// We can grab a reference to our ERC-1155 contract.
const bundleDropModule = sdk.getBundleDropModule(
  "0x3ac6Fa8eEEE22821DfcE1b21c24fcCcBeb45cfDb",
);
const App = () => {
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address)
const signer = provider ? provider.getSigner() : undefined;
  // State variable for us to know if user has our NFT.
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  // isClaiming lets us easily keep a loading state while the NFT is minting.
  const [isClaiming, setIsClaiming] = useState(false);
  // Holds the amount of token each member has in state.
const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
// The array holding all of our members addresses.
const [memberAddresses, setMemberAddresses] = useState([]);

// A fancy function to shorten someones wallet address, no need to show the whole thing.
const shortenAddress = (str) => {
  return str.substring(0, 6) + "..." + str.substring(str.length - 4);
};

// This useEffect grabs all the addresses of our members holding our NFT.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  // Just like we did in the 7-airdrop-token.js file! Grab the users who hold our NFT
  // with tokenId 0.
  bundleDropModule
    .getAllClaimerAddresses("0")
    .then((addresses) => {
      console.log("🛏 Members addresses", addresses)
      setMemberAddresses(addresses);
    })
    .catch((err) => {
      console.error("failed to get member list", err);
    });
}, [hasClaimedNFT]);

// This useEffect grabs the # of token each member holds.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  // Grab all the balances.
  tokenModule
    .getAllHolderBalances()
    .then((amounts) => {
      console.log("👜 Amounts", amounts)
      setMemberTokenAmounts(amounts);
    })
    .catch((err) => {
      console.error("failed to get token amounts", err);
    });
}, [hasClaimedNFT]);

// Now, we combine the memberAddresses and memberTokenAmounts into a single array
const memberList = useMemo(() => {
  return memberAddresses.map((address) => {
    return {
      address,
      tokenAmount: ethers.utils.formatUnits(
        // If the address isn't in memberTokenAmounts, it means they don't
        // hold any of our token.
        memberTokenAmounts[address] || 0,
        18,
      ),
    };
  });
}, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
     // We pass the signer to the sdk, which enables us to interact with
     // our deployed contract!
     sdk.setProviderOrSigner(signer);
   }, [signer]);

  useEffect(() => {
    // If they don't have an connected wallet, exit!
    if (!address) {
      return;
    }

    // Check if the user has the NFT by using bundleDropModule.balanceOf
    return bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        // If balance is greater than 0, they have our NFT!
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!")
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.")
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false);
        console.error("failed to nft balance", error);
      });
      const tokenModule = sdk.getTokenModule(
  "0xAAABA73294068C7Bd08FcFFB9c781bE65A542eA6"
);
  }, [address]);

  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet.
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to 💤DAO</h1>
        <h2>a DAO for sleepyheads</h2>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>💤DAO Member Page</h1>
        <p>Congratulations on being a member 🛏</p>
      </div>
    );
  };

const mintNft = () => {
  setIsClaiming(true);
  // Call bundleDropModule.claim("0", 1) to mint nft to user's wallet.
  bundleDropModule
  .claim("0", 1)
  .then(() => {
    // Set claim state.
    setHasClaimedNFT(true);
    // Show user their fancy new NFT!
    console.log(
      `🌊 Successfully Minted! Check it our on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address.toLowerCase()}/0`
    );
  })
  .catch((err) => {
    console.error("failed to claim", err);
  })
  .finally(() => {
    // Stop loading state.
    setIsClaiming(false);
  });
}

// Render mint nft screen.
return (
  <div className="mint-nft">
    <h1>Mint your free 💤DAO Membership NFT</h1>
    <button
      disabled={isClaiming}
      onClick={() => mintNft()}
    >
      {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
    </button>
  </div>
);
};
export default App;
