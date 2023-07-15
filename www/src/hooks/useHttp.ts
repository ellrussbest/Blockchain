import { useCallback, useRef, useState } from "react";
import { useEffectOnce } from "./useEffectOnce-hook";

type METHOD = "GET" | "PUT" | "PATCH" | "DELETE" | "POST";

export const useHttp = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<any>();

	const activeHttpRequest = useRef<AbortController[]>([]);

	const sendRequest = useCallback(
		async (
			url: string,
			method: METHOD = "GET",
			body: { [x: string]: any } | null = null,
			headers: { [x: string]: string } = {},
		) => {
			const _body: BodyInit | undefined | null =
				body === null ? body : JSON.stringify(body);

			setIsLoading(true);
			const httpAbortCtrl = new AbortController();

			activeHttpRequest.current.push(httpAbortCtrl);

			try {
				const response = await fetch(url, {
					method,
					body: _body,
					headers,
					signal: httpAbortCtrl.signal,
				});

				const responseData = await response.json();

				// after every request we want to make sure that we remove the current abort controller
				activeHttpRequest.current = activeHttpRequest.current.filter(
					(reqCtrl) => reqCtrl !== httpAbortCtrl,
				);

				if (!response.ok) {
					throw new Error(responseData.message);
				}
				setIsLoading(false);
				return responseData;
			} catch (error: any) {
				setError(error.message);
				setIsLoading(false);

				throw error;
			}
		},
		[],
	);

	const clearError = () => {
		setError(null);
	};

	useEffectOnce(() => {
		return () => {
			activeHttpRequest.current.forEach((abortCtrl) => abortCtrl.abort());
		};
	});

	return { isLoading, error, sendRequest, clearError };
};
