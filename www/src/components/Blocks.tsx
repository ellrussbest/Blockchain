import { useState } from "react";
import { useSelector } from "../hooks/useSelector";
import { Button } from "react-bootstrap";
import { Transaction } from "./Transaction";
import { Link } from "react-router-dom";

export const Blocks = () => {
	const [toggleDisplay, setToggleDisplay] = useState(false);
	const [divHash, setDivHash] = useState("");
	const { blocks } = useSelector((selector) => selector.blockchain);

	return (
		<>
			<div>
				<div style={{ margin: 10 }}>
					<Link to="/">Back to Home</Link>
				</div>
				<h3>Blocks</h3>
				{blocks.length !== 0 &&
					blocks.map((block, i) => {
						const { timestamp, hash, data } = block;
						const stringifiedData = JSON.stringify(data);
						const dataDisplay =
							stringifiedData.length > 35
								? `${stringifiedData.substring(0, 35)}`
								: stringifiedData;
						const hashDisplay = hash.substring(0, 15);

						// display data divs conditionally
						const dataDiv =
							toggleDisplay && divHash === hash ? (
								<div>
									{data.map((transaction) => (
										<div key={transaction.id}>
											<hr />
											<Transaction
												transaction={transaction}
											/>
										</div>
									))}
									<br />
									<Button
										size="sm"
										variant="outline-danger"
										onClick={() => {
											setToggleDisplay(false);
											setDivHash("");
										}}
									>
										Show Less
									</Button>
								</div>
							) : (
								<div>
									<div>Data: {dataDisplay}</div>
									<Button
										size="sm"
										variant="outline-danger"
										onClick={() => {
											setToggleDisplay(true);
											setDivHash(hash);
										}}
									>
										Show more
									</Button>
								</div>
							);

						return (
							<div key={block.hash} className="Block">
								<div>
									Hash: {hashDisplay}
									{hashDisplay.length > 15 && "..."}
								</div>
								<div>
									Timestamp:{" "}
									{new Date(timestamp).toLocaleString()}
								</div>
								{dataDiv}
							</div>
						);
					})}
			</div>
		</>
	);
};
