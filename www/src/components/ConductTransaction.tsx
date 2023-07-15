import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useHttp } from "../hooks/useHttp";
import { useSelector } from "../hooks/useSelector";

export const ConductTransaction = () => {
	const [recipient, setRecipient] = useState("");
	const [amount, setAmount] = useState(0);
	const { sendRequest } = useHttp();
	const { url } = useSelector((selector) => selector.blockchain);
	const navigate = useNavigate();

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const data = await sendRequest(
				`${url}/transact`,
				"POST",
				{ amount, recipient },
				{ "Content-Type": "application/json" },
			);

			navigate("/transaction-pool");
		} catch (error) {}
	};

	return (
		<div>
			<div style={{ marginBottom: 10 }}>
				<Link to="/">Back to Home</Link>
			</div>

			<h3>Conduct a Transaction</h3>
			<Form onSubmit={onSubmit}>
				<Form.Group>
					<Form.Control
						size="lg"
						type="text"
						placeholder="Recipient"
						value={recipient}
						onChange={(e) => setRecipient(e.target.value)}
					/>
					<br />
					<Form.Control
						size="lg"
						type="number"
						placeholder="Amount"
						value={amount}
						onChange={(e) => setAmount(parseInt(e.target.value))}
					/>
					<br />
					<Button size="sm" variant="outline-danger" type="submit">
						Submit
					</Button>
				</Form.Group>
			</Form>
		</div>
	);
};
