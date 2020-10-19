import { createContext } from "react";

const GlobalContext = createContext({
	theme: null,
	inRoute: false,
	date: Date.now(),
	setRouteAndDate: () => null,
});

export default GlobalContext;
