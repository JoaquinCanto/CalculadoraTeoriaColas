import "./App.css";
import { PublicRoutes } from "./models/Routes";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./pages/Layout";
import Placeholder from "./components/Placeholder";
import MM1 from "./pages/MM1";
import MM1N from "./pages/MM1N";
import MM2 from "./pages/MM2";
import MG1 from "./pages/MG1";
import MMP from "./pages/MMN";

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route element={<Layout />} >
						<Route path={PublicRoutes.HOME} element={<Placeholder />} />
						<Route path={PublicRoutes.MM1} element={<MM1 />} />
						<Route path={PublicRoutes.MM1N} element={<MM1N />} />
						<Route path={PublicRoutes.MM2} element={<MM2 />} />
						<Route path={PublicRoutes.MG1} element={<MG1 />} />
						<Route path={PublicRoutes.MMP} element={<MMP />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</>
	)
}

export default App
