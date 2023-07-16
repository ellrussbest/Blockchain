import { useSelector } from "../hooks/useSelector";
import logo from "../logo.svg";
import { Link } from "react-router-dom";
import { useEffectOnce } from "../hooks/useEffectOnce-hook";
import { useActions } from "../hooks/useAction";
import { useState } from "react";

export const WalletInfo = () => {
  const { walletInfo, url } = useSelector((selector) => selector.blockchain);
  const { updateWalletInfo } = useActions();
  const [error, setError] = useState(false);

  useEffectOnce(() => {
    const source = new EventSource(`${url}/wallet-info`);

    const handleEvent = (e: MessageEvent<any>) => {
      setError(false);
      const data = JSON.parse(e.data);
      updateWalletInfo(data);
    };

    const errorEvent = (e: MessageEvent<any>) => {
      setError(true);
    };

    source.addEventListener("message", handleEvent);
    source.addEventListener("error", errorEvent);

    return () => {
      source.removeEventListener("error", errorEvent);
      source.removeEventListener("message", handleEvent);
    };
  });
  return (
    <div className="WalletInfo">
      <img className="logo" src={logo} alt="logo" />
      <br />
      <div>Welcome to the blockchain...</div>
      <div style={{ marginTop: 10 }}>
        <Link to="/blocks">Explore Blockchain</Link>{" "}
        <Link to="/conduct-transaction">Conduct a Transaction</Link>{" "}
        <Link to="/transaction-pool">Explore Transaction Pool</Link>
      </div>
      <br />

      <div>
        {!error && "Address:"} {walletInfo?.address}{" "}
        {error && "Connection Error!! Could not fetch Address Info"}
      </div>
      <div>
        {!error && "Balance:"} {walletInfo?.balance}{" "}
        {error && "Connection Error!! Could not fetch Balance Info"}
      </div>
    </div>
  );
};
