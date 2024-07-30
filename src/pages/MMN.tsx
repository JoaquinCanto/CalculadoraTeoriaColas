import * as math from 'mathjs'
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Button, Divider, Input } from "@nextui-org/react";
import { CiCalculator1 } from "react-icons/ci";
import { useState } from "react";

export default function MMP() {
	const config = {
		loader: { load: ["input/asciimath"] },
		asciimath: {
			displaystyle: true,
			delimiters: [
				["$", "$"],
				["`", "`"]
			]
		}
	};

	const regexNumbers = /^[+-]?(\d+(\.\d*)?|\.\d+)$/;

	const [valueLambda, setValueLambda] = useState("");
	const [valueMu, setValueMu] = useState("");
	const [valueTheta, setValueTheta] = useState("");

	const [waitinSystem, setWaitinSystem] = useState<number>();
	const [waitinQueue, setWaitinQueue] = useState<number>();

	//------------------------Display
	const [showData, setShowData] = useState(false);

	const validateNumber = (value: string) => value.match(regexNumbers);

	const isInvalid = (value: string) => {
		if (value === "") return false;

		return validateNumber(value) ? false : true;
	};

	function calcWq(w: number, q: number, ts: number) {
		const Wq = w + (q * ts) + ts;
		setWaitinQueue(math.round(Wq, 2));
	}

	function calcWs(w: number, q: number, ts: number) {
		const Ws = math.add(w, q * ts);
		setWaitinSystem(math.round(Ws, 2));
	}

	const Calculate = (w: string, q: string, ts: string) => {

		const nW = Number(w);
		const nQ = Number(q);

		const nTS = Number(ts);

		calcWs(nW, nQ, nTS);
		calcWq(nW, nQ, nTS);

		setShowData(true);
	}
	return (
		<>
			<MathJaxContext config={config} >
				<div className="my-5 w-full flex flex-col items-center gap-4">
					<p>Introducir valores en un mismo tiempo:</p>
					<div className="flex flex-row items-center gap-5">
						<Input
							// className="w-full flex  "
							value={valueLambda}
							isClearable
							type="text"
							variant="faded"
							label={<MathJax>{"`W_0 :`"}</MathJax>}
							labelPlacement="outside-left"
							description="Tiempo de persona atendida."
							isInvalid={isInvalid(valueLambda)}
							color={isInvalid(valueLambda) ? "danger" : "primary"}
							errorMessage="Introduzca un formato válido."
							onValueChange={setValueLambda}
						/>

						<Input
							// className=""
							value={valueMu}
							isClearable
							type="text"
							variant="faded"
							label={<MathJax>{"`Q :`"}</MathJax>}
							labelPlacement="outside-left"
							description="Cantidad de clientes."
							isInvalid={isInvalid(valueMu)}
							color={isInvalid(valueMu) ? "danger" : "primary"}
							errorMessage="Introduzca un formato válido."
							onValueChange={setValueMu}
						/>
						<Input
							// className=""
							value={valueTheta}
							isClearable
							type="text"
							variant="faded"
							label={<MathJax>{"`T_s :`"}</MathJax>}
							labelPlacement="outside-left"
							description="Tiempo medio de servicio."
							isInvalid={isInvalid(valueTheta)}
							color={isInvalid(valueTheta) ? "danger" : "primary"}
							errorMessage="Introduzca un formato válido."
							onValueChange={setValueTheta}
						/>
					</div>
					<Button
						color="primary"
						variant="ghost"
						startContent={<CiCalculator1 />}
						onPress={() => Calculate(valueLambda, valueMu, valueTheta)}>
						Calcular
					</Button>
				</div>

				<Divider />
				{showData &&
					<div className="my-5 px-4 w-full flex flex-col items-center gap-5">
						<MathJax dynamic>{"`W_s1 : \\ `" + `$${waitinQueue}$`}</MathJax>
						<MathJax dynamic>{"`W_q1 : \\ `" + `$${waitinSystem}$`}</MathJax>
					</div>
				}
			</MathJaxContext>
		</>
	)
}
