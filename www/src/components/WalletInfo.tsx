import { FC, ReactNode } from "react";
import { useSelector } from "../hooks/useSelector";
import logo from "../logo.svg"
import { Link } from "react-router-dom";


export const WalletInfo: FC<{
	/*children: ReactNode*/
}> = () => {
	const { walletInfo } = useSelector((selector) => selector.blockchain);
	return (
		<div className="WalletInfo">
			<img className="logo" src={logo} />
			<br />
			<div>Welcome to the blockchain...</div>
			<div style={{ marginTop: 10 }}>
				<Link to="/blocks">Explore Blocks</Link>
			</div>
			<br />

			<div>Address: {walletInfo?.address}</div>
			<div>Balance: {walletInfo?.balance}</div>
		</div>
	);
};
