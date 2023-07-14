import { useEffect } from "react";
import { useHttp } from "./hooks/useHttp";
import { useActions } from "./hooks/useAction";
import { WalletInfo } from "./components";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Blocks } from "./components";

const router = createBrowserRouter([
	{
		path: "/",
		element: <WalletInfo />,
		errorElement: <WalletInfo />,
	},
	{
		path: "/blocks",
		element: <Blocks />,
	},
]);

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
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
