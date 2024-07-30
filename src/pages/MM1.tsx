import * as math from 'mathjs'
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Button, Divider, Input } from "@nextui-org/react";
import { CiCalculator1 } from "react-icons/ci";
import { useState } from "react";


export default function MM1() {
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

	const [valueRho, setvalueRho] = useState<number>();

	const [lengthSystem, setLengthSystem] = useState<number>();
	const [lengthQueue, setLengthQueue] = useState<number>();
	const [waitinSystem, setWaitinSystem] = useState<number>();
	const [waitinQueue, setWaitinQueue] = useState<number>();
	const [probZero, setProbZero] = useState<number>();

	const [valuePN, setValuePN] = useState("");
	const [probN, setProbN] = useState<number>();

	const [valueAM, setValueAM] = useState("");
	const [atLeastM, setAtLeastM] = useState<number>();

	const [showData, setShowData] = useState(false);
	const [showPN, setShowPN] = useState(false);
	const [showAM, setShowAM] = useState(false);

	const validateNumber = (value: string) => value.match(regexNumbers);

	const isInvalid = (value: string) => {
		if (value === "") return false;

		return validateNumber(value) ? false : true;
	};

	function calcRho(lambda: number, mu: number) {
		setvalueRho(math.round(lambda / mu, 2));
	}

	function calcLs(lambda: number, mu: number) {
		const Ls = lambda / (mu - lambda)
		setLengthSystem(math.round(Ls, 2));
	}

	function calcLq(lambda: number, mu: number) {
		const Lq = Number(math
			.chain(math
				.pow(lambda, 2))
			.divide(math
				.multiply(mu, (mu - lambda)))
			.done());
		setLengthQueue(math.round(Lq, 2));
	}

	function calcWs(lambda: number, mu: number) {
		const Ws = (1 / (mu - lambda));
		setWaitinSystem(math.round(Ws, 2));
	}

	function calcWq(lambda: number, mu: number) {
		const Wq = (lambda / (mu * (mu - lambda)));
		setWaitinQueue(math.round(Wq, 2));
	}

	function calcPz(lambda: number, mu: number) {
		const Pz = (1 - (lambda / mu));
		setProbZero(Pz);
	}

	function CalculateProbabilityN(valueN: string, valueRho: number | undefined, fromCalc: boolean) {
		const n = Number(valueN);
		const rho = valueRho || 0;

		const Pn = Number(math.chain(1 - rho).multiply(math.pow(rho, n)).done());
		if (!fromCalc) {
			setProbN(Pn);
			setShowPN(true);
		}

		return Pn;
	}

	function CalculateAtLeastM(valueM: string, valueRho: number | undefined) {
		const m = Number(valueM) - 1;
		let atleast = 1;

		for (let i = m; i > 0; i--) {
			atleast -= CalculateProbabilityN(i.toString(), valueRho, true);
		}

		atleast -= probZero || 0;
		setAtLeastM(atleast);
		setShowAM(true);
	}

	const Calculate = (lambda: string, mu: string) => {
		const nLambda = Number(lambda);
		const nMu = Number(mu);

		calcRho(nLambda, nMu);
		calcLs(nLambda, nMu);
		calcLq(nLambda, nMu);
		calcWs(nLambda, nMu);
		calcWq(nLambda, nMu);

		calcPz(nLambda, nMu);

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
							label={<MathJax>{"`lambda :`"}</MathJax>}
							labelPlacement="outside-left"
							description="Velocidad de Llegada."
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
							label={<MathJax>{"`mu :`"}</MathJax>}
							labelPlacement="outside-left"
							description="Velocidad del Servicio."
							isInvalid={isInvalid(valueMu)}
							color={isInvalid(valueMu) ? "danger" : "primary"}
							errorMessage="Introduzca un formato válido."
							onValueChange={setValueMu}
						/>
					</div>
					<Button
						color="primary"
						variant="ghost"
						startContent={<CiCalculator1 />}
						onPress={() => Calculate(valueLambda, valueMu)}>
						Calcular
					</Button>
				</div>

				<Divider />
				{showData &&
					<div className="my-5 px-4 flex flex-row justify-center gap-5">
						<div className="w-1/2 flex flex-col items-center gap-5">
							<MathJax dynamic>{"`rho : \\ `" + `$${valueRho === Infinity ? "∄" : valueRho}$`}</MathJax>
							<MathJax dynamic>{"`L_s : \\ `" + `$${lengthSystem === Infinity ? "∄" : lengthSystem} $`}</MathJax>
							<MathJax dynamic>{"`L_q : \\ `" + `$${lengthQueue === Infinity ? "∄" : lengthQueue}$`}</MathJax>
							<MathJax dynamic>{"`W_s : \\ `" + `$${waitinSystem === Infinity ? "∄" : waitinSystem}$`}</MathJax>
							<MathJax dynamic>{"`W_q : \\ `" + `$${waitinQueue === Infinity ? "∄" : waitinQueue}$`}</MathJax>
						</div>

						<div className="w-1/2 flex flex-col items-start gap-5">
							<MathJax dynamic>{"`P_0 : \\ `" + `$${(probZero !== undefined) ? math.round(probZero * 100, 2) : NaN}$ %`}</MathJax>

							<div className="w-full flex flex-row items-center gap-5">
								<Input
									className="w-1/3 flex"
									value={valuePN}
									isClearable
									type="text"
									variant="faded"
									label={<MathJax>{"`n :`"}</MathJax>}
									labelPlacement="outside-left"
									description="Probabilidad de n en sistema."
									isInvalid={isInvalid(valuePN)}
									color={isInvalid(valuePN) ? "danger" : "primary"}
									errorMessage="Introduzca un formato válido."
									onValueChange={setValuePN}
								/>
								<Button
									className="max-w-1/3 flex mb-5"
									color="primary"
									variant="ghost"
									startContent={<CiCalculator1 />}
									onPress={() => CalculateProbabilityN(valuePN, valueRho, false)}>
									Calcular
								</Button>

								{showPN && <MathJax
									dynamic
									className="w-1/3 flex mb-5">
									{`$P_${valuePN}: \\ $` + `$${probN !== undefined ? math.round(probN * 100, 2) : NaN}$ %`}</MathJax>}
							</div>

							<div className="w-full flex flex-row items-center gap-5">
								<Input
									className="w-1/3 flex"
									value={valueAM}
									isClearable
									type="text"
									variant="faded"
									label={<MathJax>{"`m :`"}</MathJax>}
									labelPlacement="outside-left"
									description="Probabilidad de almenos m en sistema."
									isInvalid={isInvalid(valueAM)}
									color={isInvalid(valueAM) ? "danger" : "primary"}
									errorMessage="Introduzca un formato válido."
									onValueChange={setValueAM}
								/>
								<Button
									className="max-w-1/3 flex mb-5"
									color="primary"
									variant="ghost"
									startContent={<CiCalculator1 />}
									onPress={() => CalculateAtLeastM(valueAM, valueRho)}>
									Calcular
								</Button>

								{showAM && <MathJax
									dynamic
									className="w-1/3 flex mb-5">
									{`$P_(A${valueAM}): \\ $` + `$${atLeastM !== undefined ? math.round(atLeastM * 100, 2) : NaN}$ %`}</MathJax>}
							</div>
						</div>
					</div>
				}
			</MathJaxContext>
		</>
	)
}
