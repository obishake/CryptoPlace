import { createContext, useEffect, useState } from "react";

export const CoinContext = createContext();

const CoinContextProvider = (props) => {
    const [allcoin, setAllCoin] = useState([]);
    const [currency, setCurrency] = useState({
        name: "usd",
        symbol: "$",
    });

    const fetchAllCoin = async () => {
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                "x-cg-demo-api-key": import.meta.env.VITE_COINGECKO_API_KEY,
            },
        };

        fetch(`/api/coins/markets?vs_currency=${currency.name}`, options)
            .then((res) => res.json())
            .then((res) => setAllCoin(res))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        fetchAllCoin();
    }, [currency]);

    const contextValue = {
        allcoin,
        currency,
        setCurrency,
    };

    return (
        <CoinContext.Provider value={contextValue}>
            {props.children}
        </CoinContext.Provider>
    );
};

export default CoinContextProvider;
