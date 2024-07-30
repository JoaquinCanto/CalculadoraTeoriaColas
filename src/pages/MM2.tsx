import * as math from 'mathjs'
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Button, Divider, Input } from "@nextui-org/react";
import { CiCalculator1 } from "react-icons/ci";
import { useState } from "react";


export default function MM2() {
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
	const [valueMu1, setValueMu1] = useState("");
	const [valueMu2, setValueMu2] = useState("");
	const [valueMuS, setValueMuS] = useState<number>();

	const [valueRho, setvalueRho] = useState<number>();

	//------------------------Misma Velocidad
	const [lengthSystem, setLengthSystem] = useState<number>();
	const [lengthQueue, setLengthQueue] = useState<number>();
	const [waitinSystem, setWaitinSystem] = useState<number>();
	const [waitinQueue, setWaitinQueue] = useState<number>();
	const [probZero, setProbZero] = useState<number>();

	const [valuePN, setValuePN] = useState("");
	const [probN, setProbN] = useState<number>();

	const [valueAM, setValueAM] = useState("");
	const [atLeastM, setAtLeastM] = useState<number>();

	//------------------------Diferente Velocidad

	// const [valueR, setValueR] = useState<number>();

	//------Con Selección
	const [lengthSystemCS, setLengthSystemCS] = useState<number>();
	const [waitinSystemCS, setWaitinSystemCS] = useState<number>();
	const [probZeroCS, setProbZeroCS] = useState<number>();

	const [valuePNCS, setValuePNCS] = useState("");
	const [probNCS, setProbNCS] = useState<number>();

	const [valueAMCS, setValueAMCS] = useState("");
	const [atLeastMCS, setAtLeastMCS] = useState<number>()

	//------Sin Selección
	const [lengthSystemSS, setLengthSystemSS] = useState<number>();
	const [waitinSystemSS, setWaitinSystemSS] = useState<number>();
	const [probZeroSS, setProbZeroSS] = useState<number>();

	const [valuePNSS, setValuePNSS] = useState("");
	const [probNSS, setProbNSS] = useState<number>();

	const [valueAMSS, setValueAMSS] = useState("");
	const [atLeastMSS, setAtLeastMSS] = useState<number>()

	//------------------------Display
	const [showData, setShowData] = useState(false);
	const [showSameSpeed, setShowSameSpeed] = useState(false);
	const [showDiffSpeed, setShowDiffSpeed] = useState(false);
	const [showPN, setShowPN] = useState(false);
	const [showAM, setShowAM] = useState(false);

	const [showPNCS, setShowPNCS] = useState(false);
	const [showAMCS, setShowAMCS] = useState(false);

	const [showPNSS, setShowPNSS] = useState(false);
	const [showAMSS, setShowAMSS] = useState(false);

	const validateNumber = (value: string) => value.match(regexNumbers);

	const isInvalid = (value: string) => {
		if (value === "") return false;

		return validateNumber(value) ? false : true;
	};

	function calcMuS(mu1: number, mu2: number) {
		const MuS = math.add(mu1, mu2);
		setValueMuS(MuS);
		return MuS;
	}

	function calcRho(lambda: number, mu: number) {
		const rho = Number(math.divide(lambda, mu));
		setvalueRho(math.round(rho, 2));
		return rho;
	}

	// function calcR(mu1: number, mu2: number) {
	// 	const r = math.divide(mu2, mu1);
	// 	setValueR(math.round(r, 2));
	// 	// return r;
	// }

	function calcLs(rho: number) {
		const Ls = math.divide(rho, (1 - rho));
		setLengthSystem(math.round(Ls, 2));
		return Ls;
	}

	function calcLq(rho: number) {
		const Lq = math.divide(Number(math.pow(rho, 2)), (1 - rho));
		setLengthQueue(math.round(Lq, 2));
		return Lq;
	}

	function calcWs(Ls: number, lambda: number) {
		const Ws = math.divide(Ls, lambda);
		setWaitinSystem(math.round(Ws, 2));
	}

	function calcWq(Lq: number, lambda: number) {
		const Wq = math.divide(Lq, lambda);
		setWaitinQueue(math.round(Wq, 2));
	}

	function calcPz(rho: number) {
		const Pz = (1 - rho);
		setProbZero(Pz);
		return Pz;
	}

	function CalculateProbabilityN(valuePN: string, valueRho: number | undefined, version: number, fromCalc: boolean) {
		let Pn = NaN;
		const n = Number(valuePN);
		const rho = valueRho || NaN;

		Pn = math.multiply((1 - n), Number(math.pow(rho, n)));
		if (!fromCalc) {
			switch (version) {
				case 1:
					setProbN(Pn);
					setShowPN(true);
					break;
				case 2:
					setProbNCS(Pn);
					setShowPNCS(true);
					break;
				case 3:
					setProbNSS(Pn);
					setShowPNSS(true);
					break;
			}
		}
		return Pn;
	}

	function CalculateAtLeastM(valueM: string, valueRho: number | undefined, version: number) {
		const m = Number(valueM) - 1;
		var atleast = 1;

		for (let i = m; i > 0; i--) {
			atleast -= CalculateProbabilityN(i.toString(), valueRho, version, true);
		}
		switch (version) {
			case 1:
				atleast -= probZero || 0;
				setAtLeastM(atleast);
				setShowAM(true);
				break;
			case 2:
				atleast -= probZeroCS || 0;
				setAtLeastMCS(atleast);
				setShowAMCS(true);
				break;
			case 3:
				atleast -= probZeroSS || 0;
				setAtLeastMSS(atleast);
				setShowAMSS(true);
				break;
		}
	}

	function calcAlphaPrima(lambda: number, mu1: number, mu2: number) {
		const aP = math.divide((Number(math.chain((2 * lambda) + mu1 + mu2).multiply(mu1 * mu2).done())), (mu1 + mu2) * (lambda + mu2));
		return aP;
	}

	function calcAlpha(mu1: number, mu2: number) {
		const a = math.divide(2 * mu1 * mu2, mu1 + mu2);
		return a;
	}

	function calcLsCS(lambda: number, alphaPrima: number, rho: number) {
		const LsCS = Number(math.chain(lambda)
			.divide((math
				.chain(1 - rho)
				.multiply(lambda + ((1 - rho) * alphaPrima))
				.done()))
			.done());
		setLengthSystemCS(math.round(LsCS, 2));
		return LsCS;
	}

	function calcWsCS(LsCS: number, lambda: number) {
		const WsCS = math.divide(LsCS, lambda);
		setWaitinSystemCS(math.round(WsCS, 2));
	}

	function calcLsSS(lambda: number, alpha: number, rho: number) {
		const LsSS = Number(math.chain(lambda)
			.divide((math
				.chain(1 - rho)
				.multiply(lambda + ((1 - rho) * alpha))
				.done()))
			.done());
		setLengthSystemSS(math.round(LsSS, 2));
		return LsSS;
	}

	function calcWsSS(LsSS: number, lambda: number) {
		const WsSS = math.divide(LsSS, lambda);
		setWaitinSystemSS(math.round(WsSS, 2));
	}

	function calcPzCS(lambda: number, alphaPrima: number, rho: number) {
		const PzCS = Number(math
			.chain(1 - rho)
			.divide((1 - rho) + (math.divide(lambda, alphaPrima)))
			.done());
		setProbZeroCS(PzCS);
		return PzCS;
	}

	function calcPzSS(lambda: number, alpha: number, rho: number) {
		const PzSS = Number(math
			.chain(1 - rho)
			.divide((1 - rho) + (math.divide(lambda, alpha)))
			.done());
		setProbZeroSS(PzSS);
		return PzSS;
	}

	const Calculate = (lambda: string, mu1: string, mu2: string) => {
		const nLambda = Number(lambda);
		const nMu1 = Number(mu1);
		const nMu2 = Number(mu2);

		const mus = calcMuS(nMu1, nMu2);
		const rho = calcRho(nLambda, mus);
		const Lq = calcLq(rho);
		calcWq(Lq, nLambda);

		if (nMu1 === nMu2) {
			setShowSameSpeed(true);
			setShowDiffSpeed(false);

			const Ls = calcLs(rho);
			calcWs(Ls, nLambda);

			calcPz(rho);
		}
		else {
			setShowDiffSpeed(true);
			setShowSameSpeed(false);

			// calcR(nMu1, nMu2);
			const alphaPrima = calcAlphaPrima(nLambda, nMu1, nMu2);
			const alpha = calcAlpha(nMu1, nMu2)

			const LsCS = calcLsCS(nLambda, alphaPrima, rho);
			calcWsCS(LsCS, nLambda);

			const LsSS = calcLsSS(nLambda, alpha, rho);
			calcWsSS(LsSS, nLambda);

			calcPzCS(nLambda, alphaPrima, rho);
			calcPzSS(nLambda, alpha, rho);
		}
		setShowData(true);
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
							value={valueMu1}
							isClearable
							type="text"
							variant="faded"
							label={<MathJax>{"`mu_1 :`"}</MathJax>}
							labelPlacement="outside-left"
							description="Velocidad del Servidor 1."
							isInvalid={isInvalid(valueMu1)}
							color={isInvalid(valueMu1) ? "danger" : "primary"}
							errorMessage="Introduzca un formato válido."
							onValueChange={setValueMu1}
						/>
						<Input
							// className=""
							value={valueMu2}
							isClearable
							type="text"
							variant="faded"
							label={<MathJax>{"`mu_2 :`"}</MathJax>}
							labelPlacement="outside-left"
							description="Velocidad del Servidor 2."
							isInvalid={isInvalid(valueMu2)}
							color={isInvalid(valueMu2) ? "danger" : "primary"}
							errorMessage="Introduzca un formato válido."
							onValueChange={setValueMu2}
						/>
					</div>
					<Button
						color="primary"
						variant="ghost"
						startContent={<CiCalculator1 />}
						onPress={() => Calculate(valueLambda, valueMu1, valueMu2)}>
						Calcular
					</Button>
				</div>

				<Divider />
				{showData &&
					<div>
						<div className="py-2 flex flex-col">
							<div className="flex flex-col items-center gap-5">
								<MathJax dynamic>{"`mu_s : \\ `" + `$${valueMuS}$`}</MathJax>
								<MathJax dynamic>{"`rho : \\ `" + `$${valueRho === Infinity ? "∄" : valueRho}$`}</MathJax>
							</div>
							{showSameSpeed &&
								<div>
									<p className="py-2 flex justify-center">Servidores con misma velocidad:</p>
									<div className="py-2 px-4 flex flex-row gap-5 justify-center">
										<div className="w-1/2 flex flex-col items-center gap-5">

											<MathJax dynamic>{"`L_s : \\ `" + `$${lengthSystem === Infinity ? "∄" : lengthSystem}$`}</MathJax>
											<MathJax dynamic>{"`L_q : \\ `" + `$${lengthQueue === Infinity ? "∄" : lengthQueue}$`}</MathJax>
											<MathJax dynamic>{"`W_s : \\ `" + `$${waitinSystem === Infinity ? "∄" : waitinSystem}$`}</MathJax>
											<MathJax dynamic>{"`W_q : \\ `" + `$${waitinQueue === Infinity ? "∄" : waitinQueue}$`}</MathJax>
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
													onPress={() => CalculateProbabilityN(valuePN, valueRho, 1, false)}>
													Calcular
												</Button>

												{showPN && <MathJax
													dynamic
													className="w-1/3 flex items-center">
													{`$P_${valuePN}: \\ $` + `$${probN !== undefined ? probN * 100 : probN}$ %`}</MathJax>}
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
													onPress={() => CalculateAtLeastM(valueAM, valueRho, 1)}>
													Calcular
												</Button>

												{showAM && <MathJax
													dynamic
													className="w-1/3 flex items-center">
													{`$P_(A${valueAM}): \\ $` + `$${atLeastM !== undefined ? atLeastM * 100 : atLeastM}$ %`}</MathJax>}
											</div>
										</div>
									</div>
								</div>
							}
						</div>
						<div>
							{showDiffSpeed &&
								<div className="py-2 flex flex-col items-center gap-5">
									<p className="">Servidores con distinta velocidad:</p>
									{/* <MathJax dynamic>{"`r : \\ `" + `$${valueR}$`}</MathJax> */}
									<div className="w-full py-2 px-4 flex flex-row gap-5 items-center">
										<div className="w-1/2 flex flex-col justify-around gap-5">
											<p>Con Selección:</p>
											<MathJax dynamic>{"`L_s : \\ `" + `$${lengthSystemCS === Infinity ? "∄" : lengthSystemCS}$`}</MathJax>
											<MathJax dynamic>{"`L_q : \\ `" + `$${lengthQueue === Infinity ? "∄" : lengthQueue}$`}</MathJax>
											<MathJax dynamic>{"`W_s : \\ `" + `$${waitinSystemCS === Infinity ? "∄" : waitinSystemCS}$`}</MathJax>
											<MathJax dynamic>{"`W_q : \\ `" + `$${waitinQueue === Infinity ? "∄" : waitinQueue}$`}</MathJax>
											<MathJax dynamic>{"`P_0 : \\ `" + `$${(probZeroCS !== undefined) ? math.round(probZeroCS * 100, 2) : NaN}$ %`}</MathJax>

											<div className="w-full flex flex-row justify-center items-center gap-5">
												<Input
													className="w-1/3 flex items-center justify-center content-center"
													value={valuePNCS}
													isClearable
													type="text"
													variant="faded"
													label={<MathJax>{"`n :`"}</MathJax>}
													labelPlacement="outside-left"
													description="Probabilidad de n en sistema."
													isInvalid={isInvalid(valuePNCS)}
													color={isInvalid(valuePNCS) ? "danger" : "primary"}
													errorMessage="Introduzca un formato válido."
													onValueChange={setValuePNCS}
												/>
												<Button
													className="max-w-1/3 flex items-center"
													color="primary"
													variant="ghost"
													startContent={<CiCalculator1 />}
													onPress={() => CalculateProbabilityN(valuePNCS, valueRho, 2, false)}>
													Calcular
												</Button>

												{showPNCS && <MathJax
													dynamic
													className="w-1/3 flex items-center">
													{`$P_${valuePNCS}: \\ $` + `$${probNCS !== undefined ? math.round(probNCS * 100, 2) : NaN}$ %`}</MathJax>}
											</div>

											<div className="w-full flex flex-row justify-center items-center gap-5">
												<Input
													className="w-1/3 flex items-center justify-center content-center"
													value={valueAMCS}
													isClearable
													type="text"
													variant="faded"
													label={<MathJax>{"`m :`"}</MathJax>}
													labelPlacement="outside-left"
													description="Probabilidad de almenos m en sistema."
													isInvalid={isInvalid(valueAMCS)}
													color={isInvalid(valueAMCS) ? "danger" : "primary"}
													errorMessage="Introduzca un formato válido."
													onValueChange={setValueAMCS}
												/>
												<Button
													className="max-w-1/3 flex items-center"
													color="primary"
													variant="ghost"
													startContent={<CiCalculator1 />}
													onPress={() => CalculateAtLeastM(valueAMCS, valueRho, 2)}>
													Calcular
												</Button>

												{showAMCS && <MathJax
													dynamic
													className="w-1/3 flex items-center">
													{`$P_(A${valueAMCS}): \\ $` + `$${atLeastMCS !== undefined ? math.round(atLeastMCS * 100, 2) : NaN}$ %`}</MathJax>}
											</div>
										</div>
										<div className="w-1/2 flex flex-col justify-around gap-5">
											<p>Sin Selección:</p>
											<MathJax dynamic>{"`L_s : \\ `" + `$${lengthSystemSS === Infinity ? "∄" : lengthSystemSS}$`}</MathJax>
											<MathJax dynamic>{"`L_q : \\ `" + `$${lengthQueue === Infinity ? "∄" : lengthQueue}$`}</MathJax>
											<MathJax dynamic>{"`W_s : \\ `" + `$${waitinSystemSS === Infinity ? "∄" : waitinSystemSS}$`}</MathJax>
											<MathJax dynamic>{"`W_q : \\ `" + `$${waitinQueue === Infinity ? "∄" : waitinQueue}$`}</MathJax>
											<MathJax dynamic>{"`P_0 : \\ `" + `$${(probZeroSS !== undefined) ? math.round(probZeroSS * 100, 2) : NaN}$ %`}</MathJax>


											<div className="w-full flex flex-row justify-center items-center gap-5">
												<Input
													className="w-1/3 flex items-center justify-center content-center"
													value={valuePNSS}
													isClearable
													type="text"
													variant="faded"
													label={<MathJax>{"`n :`"}</MathJax>}
													labelPlacement="outside-left"
													description="Probabilidad de n en sistema."
													isInvalid={isInvalid(valuePNSS)}
													color={isInvalid(valuePNSS) ? "danger" : "primary"}
													errorMessage="Introduzca un formato válido."
													onValueChange={setValuePNSS}
												/>
												<Button
													className="max-w-1/3 flex items-center"
													color="primary"
													variant="ghost"
													startContent={<CiCalculator1 />}
													onPress={() => CalculateProbabilityN(valuePNSS, valueRho, 3, false)}>
													Calcular
												</Button>

												{showPNSS && <MathJax
													dynamic
													className="w-1/3 flex items-center">
													{`$P_${valuePNSS}: \\ $` + `$${probNSS !== undefined ? math.round(probNSS * 100, 2) : NaN}$ %`}</MathJax>}
											</div>

											<div className="w-full flex flex-row justify-center items-center gap-5">
												<Input
													className="w-1/3 flex items-center justify-center content-center"
													value={valueAMSS}
													isClearable
													type="text"
													variant="faded"
													label={<MathJax>{"`m :`"}</MathJax>}
													labelPlacement="outside-left"
													description="Probabilidad de almenos m en sistema."
													isInvalid={isInvalid(valueAMSS)}
													color={isInvalid(valueAMSS) ? "danger" : "primary"}
													errorMessage="Introduzca un formato válido."
													onValueChange={setValueAMSS}
												/>
												<Button
													className="max-w-1/3 flex items-center"
													color="primary"
													variant="ghost"
													startContent={<CiCalculator1 />}
													onPress={() => CalculateAtLeastM(valueAMSS, valueRho, 3)}>
													Calcular
												</Button>

												{showAMSS && <MathJax
													dynamic
													className="w-1/3 flex items-center">
													{`$P_(A${valueAMSS}): \\ $` + `$${atLeastMSS !== undefined ? math.round(atLeastMSS * 100, 2) : NaN}$ %`}</MathJax>}
											</div>
										</div>
									</div>
								</div>
							}
						</div>
					</div>
				}
			</MathJaxContext>
		</>
	)
}