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
  const [transactionPoolMap, setTransactionPoolMap] = useState<undefined | {}>(
    undefined
  );
  const { url } = useSelector((selector) => selector.blockchain);
  const [start, setStart] = useState(false);
  const [error, setError] = useState(false);
  const { sendRequest } = useHttp();

  useEffectOnce(() => {
    const source = new EventSource(`${url}/transaction-pool-map`);

    const handleEvent = (e: MessageEvent<any>) => {
      setError(false);
      const data = JSON.parse(e.data);
      setTransactionPoolMap(data);
    };

    const errorEvent = (e: MessageEvent<any>) => {
      setError(true);
    };
    source.addEventListener("message", handleEvent);
    source.addEventListener("error", errorEvent);

    return () => {
      source.removeEventListener("error", errorEvent);
      source.removeEventListener("message", handleEvent);
    };
  });

  useEffect(() => {
    transactionPoolMap !== undefined &&
      Object.values(transactionPoolMap).length > 0 &&
      start &&
      mine(`${url}/mine-transactions`, sendRequest);

    if (!start) cancelAnimationFrame(animationFrameId);
  }, [start, transactionPoolMap, sendRequest, url]);

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <Link to="/">Back to Home</Link>
        {!error && transactionPoolMap !== undefined && (
          <Button
            size="lg"
            variant="outline-danger"
            style={{
              marginLeft: 10,
            }}
            onClick={() => setStart(!start)}
          >
            {`${start ? "Stop Mining" : "Start Mining"}`}
          </Button>
        )}
      </div>
      <h3>Transaction Pool</h3>
      {transactionPoolMap !== undefined &&
        Object.values(transactionPoolMap).length === 0 && (
          <div>No Transactions in the transaction Pool at the moment</div>
        )}
      {error && <div>Connection Error </div>}
      {!error && transactionPoolMap === undefined && <Spinner />}
      {transactionPoolMap !== undefined &&
        Object.values(transactionPoolMap).map((transaction, i) => (
          <div key={i}>
            <hr />
            <Transaction transaction={transaction} />
          </div>
        ))}
    </div>
  );
};
