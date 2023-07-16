import { FC, ReactNode, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Toastify: FC<{
  message: string;
  children: ReactNode;
}> = ({ children, message }) => {
  useEffect(() => {
    message && toast(message);
  }, [message]);

  return (
    <div>
      {children}
      <ToastContainer theme="colored" autoClose={1000} />
    </div>
  );
};
