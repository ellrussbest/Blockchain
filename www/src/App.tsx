import { useEffect } from "react";
import { useHttp } from "./hooks/useHttp";
import { useSelector } from "./hooks/useSelector";
import { useActions } from "./hooks/useAction";

function App() {
	const { /*isLoading, error, clearError,*/ sendRequest } = useHttp();
	const { walletInfo: info, blocks } = useSelector(
		(state) => state.blockchain,
	);
	const { updateWalletInfo, updateBlocks } = useActions();

	console.log(info);
	console.log(blocks);

	useEffect(() => {
		const fetchWalletInfo = async () => {
			try {
				const data = (await sendRequest(
					"http://localhost:5000/api/wallet-info",
				)) as {
					balance: number;
					address: string;
				};

				updateWalletInfo(data);
			} catch (error) {}
		};

		fetchWalletInfo();
	}, [sendRequest]);

	useEffect(() => {
		const fetchBlocks = async () => {
			try {
				const data = await sendRequest(
					"http://localhost:5000/api/blocks",
				);

				const chain = data.chain as {
					timestamp: string;
					previousBlockHash: string;
					hash: string;
					data: any[];
					nonce: number;
					difficulty: number;
				}[];

				updateBlocks(chain);
			} catch (error) {}
		};

		fetchBlocks();
	}, [sendRequest]);

	return <div>Hello world</div>;
}

export default App;
