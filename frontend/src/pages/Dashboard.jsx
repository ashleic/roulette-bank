import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

function Dashboard() {
  const navigate = useNavigate();

  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const SEPOLIA_RPC = "https://ethereum-sepolia-rpc.publicnode.com";
  const SEPOLIA_CHAIN_ID = "0xaa36a7";

  const getBalance = async (walletAddress) => {
    try {
      setError("");

      if (!walletAddress) return;

      const readProvider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
      const balanceWei = await readProvider.getBalance(walletAddress);
      const balanceEth = ethers.formatEther(balanceWei);

      console.log("Reading Sepolia balance for:", walletAddress);
      console.log("Balance:", balanceEth);

      setBalance(balanceEth);
    } catch (err) {
      console.error("Balance error:", err);
      setError("Could not load Sepolia balance.");
    }
  };

  const switchToSepolia = async () => {
    if (!window.ethereum) return;

    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_CHAIN_ID }],
    });
  };

  const connectWallet = async () => {
    try {
      setError("");
      setSuccess("");
      setTxHash("");

      if (!window.ethereum) {
        setError("MetaMask is not installed.");
        return;
      }

      await switchToSepolia();

      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const selectedAccount = accounts[0];

      setAccount(selectedAccount);
      await getBalance(selectedAccount);

      setSuccess("Wallet connected successfully.");
    } catch (err) {
      console.error("Connect error:", err);
      setError("Wallet connection failed.");
    }
  };

  const disconnectWallet = () => {
    setAccount("");
    setBalance("0");
    setRecipient("");
    setAmount("");
    setTxHash("");
    setSuccess("Wallet disconnected.");
    setError("");
  };

  const logout = () => {
    localStorage.removeItem("token");
    disconnectWallet();
    navigate("/");
  };

  const sendTransaction = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");
      setTxHash("");

      if (!window.ethereum) {
        setError("MetaMask is not installed.");
        return;
      }

      if (!account) {
        setError("Please connect your wallet first.");
        return;
      }

      if (!recipient || !amount) {
        setError("Please enter a recipient address and amount.");
        return;
      }

      if (!ethers.isAddress(recipient)) {
        setError("Invalid recipient wallet address.");
        return;
      }

      await switchToSepolia();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount),
      });

      setTxHash(tx.hash);
      setSuccess("Transaction sent. Waiting for confirmation...");

      await tx.wait();

      setSuccess("Transaction confirmed successfully.");
      await getBalance(account);
    } catch (err) {
      console.error("Transaction error:", err);
      setError(err.reason || err.message || "Transaction failed.");
    }
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        const newAccount = accounts[0];
        setAccount(newAccount);
        await getBalance(newAccount);
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-topbar">
        <div>
          <p className="eyebrow">Sepolia Test Network</p>
          <h1>Roulette Bank Dashboard</h1>
          <p className="dashboard-subtitle">
            Manage your wallet, balance, and test transactions.
          </p>
        </div>

        <button type="button" className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="card wallet-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Wallet Access</p>
              <h2>Wallet</h2>
            </div>
            <span className={account ? "status-pill active" : "status-pill"}>
              {account ? "Connected" : "Disconnected"}
            </span>
          </div>

          {!account ? (
            <button onClick={connectWallet}>Connect Wallet</button>
          ) : (
            <>
              <p className="label-text">Connected Wallet</p>
              <p className="wallet-address">{account}</p>

              <p className="label-text">Sepolia ETH Balance</p>
              <p className="balance-display">{balance}</p>

              <div className="button-row">
                <button type="button" onClick={() => getBalance(account)}>
                  Refresh Balance
                </button>

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={disconnectWallet}
                >
                  Disconnect Wallet
                </button>
              </div>
            </>
          )}
        </div>

        <div className="card send-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Transfer</p>
              <h2>Send Sepolia ETH</h2>
            </div>
            <span className="casino-icon">🎰</span>
          </div>

          <form onSubmit={sendTransaction}>
            <input
              type="text"
              placeholder="Recipient wallet address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />

            <input
              type="text"
              placeholder="Amount, example: 0.0001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <button type="submit">Send Transaction</button>
          </form>
        </div>
      </div>

      {txHash && (
        <div className="success-box">
          <p>
            <strong>Transaction Hash:</strong>
          </p>
          <p className="wallet-address">{txHash}</p>

          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
          >
            View on Sepolia Etherscan
          </a>
        </div>
      )}

      {success && <div className="success-box">{success}</div>}

      {error && <div className="error-box">{error}</div>}
    </div>
  );
}

export default Dashboard;