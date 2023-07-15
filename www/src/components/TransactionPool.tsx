import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "../hooks/useSelector";
import { Transaction } from "./Transaction";
import { useEffectOnce } from "../hooks/useEffectOnce-hook";
import { Spinner } from "./Spinner";
import { Button } from "react-bootstrap";
import { useHttp } from "../hooks/useHttp";

let animationFrameId: number;

const mine = async (url: string, mineCallback: Function) => {
	try {
		await mineCallback(url);
	} catch (error) {}
	animationFrameId = requestAnimationFrame(() => mine(url, mineCallback));
};

export const TransactionPool = () => {
	const [transactionPoolMap, setTransactionPoolMap] = useState<
		undefined | {}
	>(undefined);
	const { url } = useSelector((selector) => selector.blockchain);
	const [start, setStart] = useState(false);
	const { sendRequest } = useHttp();

	useEffectOnce(() => {
		const source = new EventSource(`${url}/transaction-pool-map`);

		const handleEvent = (e: MessageEvent<any>) => {
			const data = JSON.parse(e.data);
			setTransactionPoolMap(data);
		};
		source.addEventListener("message", handleEvent);

		return () => source.removeEventListener("message", handleEvent);
	});

	useEffect(() => {
		transactionPoolMap !== undefined &&
			Object.values(transactionPoolMap).length > 0 &&
			start &&
			mine(`${url}/mine-transactions`, sendRequest);

		if (!start) cancelAnimationFrame(animationFrameId);
	}, [start, transactionPoolMap]);

	return (
		<div>
			<div style={{ marginBottom: 10 }}>
				<Link to="/">Back to Home</Link>
			</div>
			<h3>Transaction Pool</h3>
			{transactionPoolMap !== undefined &&
				Object.values(transactionPoolMap).length === 0 && (
					<div>
						No Transactions in the transaction Pool at the moment
					</div>
				)}
			{transactionPoolMap === undefined && <Spinner />}
			{transactionPoolMap !== undefined &&
				Object.values(transactionPoolMap).map((transaction, i) => (
					<div key={i}>
						<hr />
						<Transaction transaction={transaction} />
					</div>
				))}

			<Button
				size="sm"
				variant="outline-danger"
				onClick={() => setStart(!start)}
			>
				{`${start ? "Stop Mining" : "Start Mining"}`}
			</Button>
		</div>
	);
};
