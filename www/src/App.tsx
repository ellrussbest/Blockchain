import "./App.css";
import { useEffect } from "react";
import { useHttp } from "./hooks/useHttp";
import { useActions } from "./hooks/useAction";
import { WalletInfo, Blocks } from "./components";

function App() {
	const { /*isLoading, error, clearError,*/ sendRequest } = useHttp();
	const { updateWalletInfo, updateBlocks } = useActions();

	useEffect(() => {
		const fetchWalletInfo = async () => {
			try {
				const data = await sendRequest(
					"http://localhost:5000/api/wallet-info",
				);

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

				updateBlocks(data.chain);
			} catch (error) {}
		};

		fetchBlocks();
	}, [sendRequest]);

	return (
		<div className="App">
			<div>Welcome to the blockchain...</div>
			<WalletInfo />
			<br />
			<Blocks />
		</div>
	);
}

export default App;
