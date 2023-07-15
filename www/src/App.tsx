import { TransactionPool, WalletInfo } from "./components";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Blocks, ConductTransaction } from "./components";

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
	{
		path: "/conduct-transaction",
		element: <ConductTransaction />,
	},
	{
		path: "/transaction-pool",
		element: <TransactionPool />,
	},
]);

function App() {
	return (
		<div className="App">
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
