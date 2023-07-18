import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useHttp } from "../hooks/useHttp";
import { useSelector } from "../hooks/useSelector";
import { Toastify } from "./Toastify";

export const ConductTransaction = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);
  const [data, setData] = useState<any>();
  const { sendRequest, isLoading, error, clearError } = useHttp();
  const { url } = useSelector((selector) => selector.blockchain);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const data = await sendRequest(
        `${url}/transact`,
        "POST",
        { amount, recipient },
        { "Content-Type": "application/json" }
      );
      setData(data);

      setTimeout(() => {
        navigate("/transaction-pool");
      }, 2000);
    } catch (error) {}
  };

  return (
    <div className="ConductTransaction">
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
            className="text-center"
            onChange={(e) => setRecipient(e.target.value)}
          />
          <br />
          <Form.Control
            size="lg"
            type="number"
            placeholder="Amount"
            className="text-center"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
          />
          <br />
          <Toastify
            data={data}
            clearError={clearError}
            isLoading={isLoading}
            error={error}
          >
            {(callback) => (
              <Button
                size="lg"
                variant="outline-danger"
                type="submit"
                disabled={
                  recipient.length === 0 || amount <= 0 || Number.isNaN(amount)
                }
                onClick={callback}
              >
                Submit
              </Button>
            )}
          </Toastify>
        </Form.Group>
      </Form>
    </div>
  );
};
