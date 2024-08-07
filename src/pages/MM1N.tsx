import * as math from 'mathjs'
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Button, Divider, Input } from "@nextui-org/react";
import { CiCalculator1 } from "react-icons/ci";
import { useState } from "react";


export default function MM1N() {
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
	const [valueN, setValueN] = useState("");

	const [valueRho, setvalueRho] = useState<number>();
	const [valueEffectiveLambda, setValueEffectiveLambda] = useState<number>();
	const [valueEffectiveRho, setValueEffectiveRho] = useState<number>();

	const [lengthSystem, setLengthSystem] = useState<number>();
	const [lengthQueue, setLengthQueue] = useState<number>();
	const [waitinSystem, setWaitinSystem] = useState<number>();
	const [waitinQueue, setWaitinQueue] = useState<number>();
	const [probZero, setProbZero] = useState<number>();

	const [probBlock, setProbBlock] = useState<number>();
	const [tasaRec, setTasaRec] = useState<number>();
	const [rendInput, setRendInput] = useState<number>();
	const [rendOutput, setRendOutput] = useState<number>();

	const [lengthBlocked, setLengthBlocked] = useState<number>();
	const [waitinBlocked, setWaitinBlocked] = useState<number>();

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
		const r = Number(math.divide(lambda, mu));
		setvalueRho(math.round(r, 2));
		return r;
	}

	function calcEffectiveLambda(lambda: number, mu: number, n: number) {
		let r = Number(math.divide(lambda, mu));
		const effectiveLambda = math.multiply(lambda, Number(math.chain(1).subtract(Number(math.chain(Number(math.pow(r, n)) * (1 - r)).divide(1 - (Number(math.pow(r, n + 1)))).done())).done()))
		setValueEffectiveLambda(math.round(effectiveLambda, 2));
		return effectiveLambda;
	}

	function calcEffectiveRho(effectiveLambda: number, mu: number) {
		const eRho = math.divide(effectiveLambda, mu);
		setValueEffectiveRho(math.round(eRho, 2));
	}

	function calcLs(rho: number, n: number) {
		let Ls;
		if (rho === 1) {
			Ls = math.divide(n, 2);
			setLengthSystem(math.round(Ls, 2));
		}
		else {
			Ls = Number(math
				.chain(rho)
				.divide(1 - rho)
				.subtract(math.chain(n + 1)
					.multiply(math.pow(rho, n + 1))
					.divide(1 - (Number(math.pow(rho, n + 1)))).done())
				.done());
			setLengthSystem(math.round(Ls, 2));
		}
		return Ls;
	}

	function calcLq(rho: number, n: number, Ls: number) {
		let Lq = NaN;
		if (rho === 1) {
			Lq = Number((math.chain(n)
				.multiply(n - 1))
				.divide((math.chain(2)
					.multiply(n + 1)
					.done())).done());
		}
		else {
			Lq = Number(math.chain(Ls)
				.subtract(Number(math.chain(rho)
					.multiply(1 - Number(math.pow(rho, n)))
					.divide(1 - Number(math.pow(rho, n + 1))).done()))
				.done());
		}

		setLengthQueue(math.round(Lq, 2));
		return Lq;
	}

	function calcWs(Ls: number, effectiveLambda: number) {
		const Ws = math.divide(Ls, effectiveLambda);
		setWaitinSystem(math.round(Ws, 2));
	}

	function calcWq(Lq: number, effectiveLambda: number) {
		const Wq = math.divide(Lq, effectiveLambda);
		setWaitinQueue(math.round(Wq, 2));
		return Wq;
	}

	function calcPb(rho: number, n: number) {
		const Pb = math.divide(math.multiply(Number(math.pow(rho, n)), (1 - rho)), (1 - Number(math.pow(rho, n + 1))));
		setProbBlock(Pb);
		return Pb;
	}

	function calcTr(lambda: number, Pb: number) {
		const Tr = math.multiply(lambda, Pb);
		setTasaRec(math.round(Tr, 2));
		return Tr;
	}

	function calcRi(lambda: number, Pb: number) {
		const Ri = math.multiply(lambda, (1 - Pb));
		setRendInput(math.round(Ri, 2));
	}

	function calcRo(mu: number, Pz: number) {
		const Ro = math.multiply(mu, (1 - Pz));
		setRendOutput(math.round(Ro, 2));
	}

	function calcLb(Lq: number, Pz: number) {
		const Lb = math.divide(Lq, (1 - Pz));
		setLengthBlocked(math.round(Lb, 2));
	}

	function calcWb(Wq: number, Pz: number) {
		const Wb = math.divide(Wq, (1 - Pz));
		setWaitinBlocked(math.round(Wb, 2));
	}

	function calcPz(rho: number, n: number) {
		const Pz = math.divide((1 - rho), (1 - Number(math.pow(rho, math.add(n, 1)))));
		setProbZero(Pz);
		return Pz;
	}

	function CalculateProbabilityN(valuePN: string, valueRho: number | undefined, fromCalc: boolean) {
		let Pn = NaN;
		const n = Number(valuePN);
		const rho = valueRho || NaN;
		const Pz = probZero || NaN;

		Pn = math.multiply(Number(math.pow(rho, n)), Pz);
		if (!fromCalc) {
			setProbN(Pn);
			setShowPN(true);
		}
		return Pn;
	}

	function CalculateAtLeastM(valueM: string, valueRho: number | undefined) {
		const m = Number(valueM) - 1;
		var atleast = 1;

		for (let i = m; i > 0; i--) {
			atleast -= CalculateProbabilityN(i.toString(), valueRho, true);
		}
		atleast -= probZero || NaN;
		setAtLeastM(atleast);

		setShowAM(true);
	}
	const Calculate = (lambda: string, mu: string, n: string) => {
		const nLambda = Number(lambda);
		const nMu = Number(mu);
		const nCola = Number(n);

		const rho = calcRho(nLambda, nMu);
		const effectiveLambda = calcEffectiveLambda(nLambda, nMu, nCola);
		calcEffectiveRho(effectiveLambda, nMu);

		const Ls = calcLs(rho, nCola);
		const Lq = calcLq(rho, nCola, Ls);

		calcWs(Ls, effectiveLambda);
		const Wq = calcWq(Lq, effectiveLambda);
		const Pz = calcPz(rho, nCola);

		const Pb = calcPb(rho, nCola);
		calcTr(nLambda, Pb);
		calcRi(nLambda, Pb);
		calcRo(nMu, Pz);

		calcLb(Lq, Pz);
		calcWb(Wq, Pz);

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
						<Input
							// className=""
							value={valueN}
							isClearable
							type="text"
							variant="faded"
							label={<MathJax>{"`N :`"}</MathJax>}
							labelPlacement="outside-left"
							description="Cantidad de Lugares de Espera."
							isInvalid={isInvalid(valueN)}
							color={isInvalid(valueN) ? "danger" : "primary"}
							errorMessage="Introduzca un formato válido."
							onValueChange={setValueN}
						/>
					</div>
					<Button
						color="primary"
						variant="ghost"
						startContent={<CiCalculator1 />}
						onPress={() => Calculate(valueLambda, valueMu, valueN)}>
						Calcular
					</Button>
				</div>

				<Divider />
				{showData &&
					<div className="my-5 px-4 flex flex-row gap-5 justify-center">
						<div className="w-1/2 flex flex-row items-center gap-5">
							<div className="w-full flex flex-col items-center gap-5">
								<MathJax dynamic>{"`overline lambda : \\ `" + `$${valueEffectiveLambda === Infinity ? "∄" : valueEffectiveLambda}$`}</MathJax>
								<MathJax dynamic>{"`overline rho : \\ `" + `$${valueEffectiveRho === Infinity ? "∄" : valueEffectiveRho}$`}</MathJax>
								<MathJax dynamic>{"`P_b : \\ `" + `$${probBlock === Infinity ? "∄" : math.round((probBlock || 0) * 100, 2)}$ %`}</MathJax>
								<MathJax dynamic>{"`tau : \\ `" + `$${tasaRec === Infinity ? "∄" : tasaRec}$`}</MathJax>
								<MathJax dynamic>{"`gamma_i : \\ `" + `$${rendInput === Infinity ? "∄" : rendInput}$`}</MathJax>
								<MathJax dynamic>{"`gamma_o : \\ `" + `$${rendOutput === Infinity ? "∄" : rendOutput}$`}</MathJax>
							</div>
							<div className="w-full flex flex-col items-center gap-5">
								<MathJax dynamic>{"`rho : \\ `" + `$${valueRho === Infinity ? "∄" : valueRho}$`}</MathJax>
								<MathJax dynamic>{"`L_s : \\ `" + `$${lengthSystem === Infinity ? "∄" : lengthSystem}$`}</MathJax>
								<MathJax dynamic>{"`L_q : \\ `" + `$${lengthQueue === Infinity ? "∄" : lengthQueue}$`}</MathJax>
								<MathJax dynamic>{"`W_s : \\ `" + `$${waitinSystem === Infinity ? "∄" : waitinSystem}$`}</MathJax>
								<MathJax dynamic>{"`W_q : \\ `" + `$${waitinQueue === Infinity ? "∄" : waitinQueue}$`}</MathJax>
								<MathJax dynamic>{"`L_b : \\ `" + `$${lengthBlocked === Infinity ? "∄" : lengthBlocked}$`}</MathJax>
								<MathJax dynamic>{"`W_b : \\ `" + `$${waitinBlocked === Infinity ? "∄" : waitinBlocked}$`}</MathJax>
							</div>
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
