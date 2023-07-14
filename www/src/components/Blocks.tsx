import { useSelector } from "../hooks/useSelector";

export const Blocks = () => {
	const { blocks } = useSelector((selector) => selector.blockchain);

	console.log(blocks);
	return (
		<>
			<div>
				<h3>Blocks</h3>
				{blocks.length !== 0 &&
					blocks.map((block) => (
						<div key={block.hash}>{block.hash}</div>
					))}
			</div>
		</>
	);
};
