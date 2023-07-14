import { FC, ReactNode } from "react";
import { useSelector } from "../hooks/useSelector";

export const WalletInfo: FC<{
	/*children: ReactNode*/
}> = () => {
	const { walletInfo } = useSelector((selector) => selector.blockchain);
	return (
		<>
			<div>Address: {walletInfo?.address}</div>
			<div>Balance: {walletInfo?.balance}</div>
		</>
	);
};
