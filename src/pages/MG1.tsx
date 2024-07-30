import * as math from 'mathjs'
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Button, Divider, Input } from "@nextui-org/react";
import { CiCalculator1 } from "react-icons/ci";
import { useState } from "react";

export default function MG1() {
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

	const [valueRho, setvalueRho] = useState<number>();
	const [valueThetaC, setValueThetaC] = useState<number>();

	const [lengthSystem, setLengthSystem] = useState<number>();
	const [lengthQueue, setLengthQueue] = useState<number>();
	const [waitinSystem, setWaitinSystem] = useState<number>();
	const [waitinQueue, setWaitinQueue] = useState<number>();
	const [probZero, setProbZero] = useState<number>();

	const [valuePN, setValuePN] = useState("");
	const [probN, setProbN] = useState<number>();

	const [valueAM, setValueAM] = useState("");
	const [atLeastM, setAtLeastM] = useState<number>();

	//------------------------Display
	const [showData, setShowData] = useState(false);
	const [showPN, setShowPN] = useState(false);
	const [showAM, setShowAM] = useState(false);


	const validateNumber = (value: string) => value.match(regexNumbers);

	const isInvalid = (value: string) => {
		if (value === "") return false;

		return validateNumber(value) ? false : true;
	};

	function calcRho(lambda: number, mu: number) {
		const rho = Number(math.divide(lambda, mu));
		setvalueRho(math.round(rho, 2));
		return rho;
	}

	function calcThetaC(mu: number) {
		const thetaC = Number(math.divide(1, Number(math.pow(mu, 2))));
		console.log("teta calculado", thetaC);
		setValueThetaC(thetaC);
		return thetaC;
	}

	function calcLq(lambda: number, mu: number, thetaC: number, rho: number) {
		let Lq = mu;

		// if (0 <= (math.divide(1, mu)) && (math.divide(1, mu)) >= 0.5) {
		if (thetaC === 0) {
			Lq = Number(math
				.chain(Number(math.pow(rho, 2)))
				.divide(2 * (1 - rho))
				.done());
		}
		else {
			Lq = Number(math
				.chain((Number(math.pow(lambda, 2)) * thetaC) + Number(math.pow(rho, 2)))
				.divide(2 * (1 - rho))
				.done());
		}
		setLengthQueue(math.round(Lq, 2));
		return Lq;
	}
	function dummy(tc: number) {
		return tc;
	}

	function calcLs(rho: number, Lq: number) {
		const Ls = math.add(rho, Lq);
		setLengthSystem(math.round(Ls, 2));
	}

	function calcWq(Lq: number, lambda: number) {
		const Wq = math.divide(Lq, lambda);
		setWaitinQueue(math.round(Wq, 2));
		return Wq;
	}

	function calcWs(Wq: number, mu: number) {
		const Ws = math.add(Wq, (math.divide(1, mu)));
		setWaitinSystem(math.round(Ws, 2));
	}

	function calcPz(rho: number) {
		const Pz = (1 - rho);
		setProbZero(Pz);
		return Pz;
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

	const Calculate = (lambda: string, mu: string, thetaC: string) => {
		console.log(thetaC, typeof thetaC)
		const nLambda = Number(lambda);
		const nMu = Number(mu);

		let nThetaC;
		if (thetaC === "") {
			nThetaC = calcThetaC(nMu);
			console.log("theta vacio", nThetaC)
		}
		else {
			nThetaC = Number(thetaC);
			console.log("theta introducido", nThetaC)
		}

		const rho = calcRho(nLambda, nMu);
		const Lq = calcLq(nLambda, nMu, nThetaC, rho);
		calcLs(rho, Lq);

		const Wq = calcWq(Lq, nLambda);
		calcWs(Wq, nMu);

		calcPz(rho);

		setShowData(true);

		dummy(valueThetaC || 0);
	}
	return (
		<>
			<MathJaxContext config={config} >
				<div className="p-2 w-full flex flex-col items-center gap-2">
					<p>Introducir valores en hora:</p>
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
						<Input
							// className=""
							value={valueTheta}
							isClearable
							type="text"
							variant="faded"
							label={<MathJax>{"`sigma^2 :`"}</MathJax>}
							labelPlacement="outside-left"
							description="Varianza en tiempo cuadrado (opc)."
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
					<div>
						<div className="py-2 flex flex-col">
							<div className="flex flex-col items-center gap-5">

								<MathJax dynamic>{"`rho : \\ `" + `$${valueRho}$`}</MathJax>
							</div>

							<div>
								<div className="py-2 px-4 flex flex-row gap-5 justify-center">
									<div className="w-1/2 flex flex-col items-center gap-5">

										<MathJax dynamic>{"`L_s : \\ `" + `$${lengthSystem}$`}</MathJax>
										<MathJax dynamic>{"`L_q : \\ `" + `$${lengthQueue}$`}</MathJax>
										<MathJax dynamic>{"`W_s : \\ `" + `$${waitinSystem}$`}</MathJax>
										<MathJax dynamic>{"`W_q : \\ `" + `$${waitinQueue}$`}</MathJax>
									</div>

									<div className="w-1/2 flex flex-col items-start gap-5">
										<MathJax dynamic>{"`P_0 : \\ `" + `$${(probZero !== undefined) ? math.round(probZero * 100, 2) : NaN}$ %`}</MathJax>

										<div className="w-full flex flex-row justify-center items-center gap-5">
											<Input
												className="w-1/3 flex items-center justify-center content-center"
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
												className="max-w-1/3 flex items-center"
												color="primary"
												variant="ghost"
												startContent={<CiCalculator1 />}
												onPress={() => CalculateProbabilityN(valuePN, valueRho, false)}>
												Calcular
											</Button>

											{showPN && <MathJax
												dynamic
												className="w-1/3 flex items-center">
												{`$P_${valuePN}: \\ $` + `$${probN !== undefined ? math.round(probN * 100, 2) : NaN}$ %`}</MathJax>}
										</div>

										<div className="w-full flex flex-row justify-center items-center gap-5">
											<Input
												className="w-1/3 flex items-center justify-center content-center"
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
												className="max-w-1/3 flex items-center"
												color="primary"
												variant="ghost"
												startContent={<CiCalculator1 />}
												onPress={() => CalculateAtLeastM(valueAM, valueRho)}>
												Calcular
											</Button>

											{showAM && <MathJax
												dynamic
												className="w-1/3 flex items-center">
												{`$P_(A${valueAM}): \\ $` + `$${atLeastM !== undefined ? math.round(atLeastM * 100, 2) : NaN}$ %`}</MathJax>}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				}
			</MathJaxContext>
		</>
	)
}
