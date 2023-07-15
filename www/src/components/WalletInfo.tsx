import { FC, ReactNode } from "react";
import { useSelector } from "../hooks/useSelector";
import logo from "../logo.svg";
import { Link } from "react-router-dom";
import { useEffectOnce } from "../hooks/useEffectOnce-hook";
import { useActions } from "../hooks/useAction";

export const WalletInfo: FC<{
	/*children: ReactNode*/
}> = () => {
	const { walletInfo, url } = useSelector((selector) => selector.blockchain);
	const {updateWalletInfo} = useActions()

	useEffectOnce(() => {
		const source = new EventSource(`${url}/wallet-info`);

		const handleEvent = (e: MessageEvent<any>) => {
			const data = JSON.parse(e.data);
			updateWalletInfo(data);
		};
		source.addEventListener("message", handleEvent);

		return () => source.removeEventListener("message", handleEvent);
	});
	return (
		<div className="WalletInfo">
			<img className="logo" src={logo} />
			<br />
			<div>Welcome to the blockchain...</div>
			<div style={{ marginTop: 10 }}>
				<Link to="/blocks">Explore Blockchain</Link>{" "}
				<Link to="/conduct-transaction">Conduct a Transaction</Link>{" "}
				<Link to="/transaction-pool">Explore Transaction Pool</Link>
			</div>
			<br />

			<div>Address: {walletInfo?.address}</div>
			<div>Balance: {walletInfo?.balance}</div>
		</div>
	);
};
