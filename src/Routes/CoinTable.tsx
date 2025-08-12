import { ICoinData } from "./Market"; 
import { NavigateFunction } from "react-router-dom";

export function CoinTable(
                // data: ICoinData[]
                // , navigate: NavigateFunction      
                {data, navigate}: {data: ICoinData[], navigate: NavigateFunction
                }
                ) {

    return (
        <div>
            <div className="w-full">
                {/* Header. */}
                <div className="grid grid-cols-3 gap-4 py-3 px-4 bg-gray-100 border-b font-semibold text-gray-700">
                    <div>Name</div>
                    <div>Price</div>
                    <div>Updates</div>
                </div>

                {/* Data row. */}
                <div className="divide-y divide-gray-200">
                    {data.map((coin) => (
                        <div 
                            key={coin.symbol}
                            className="grid grid-cols-3 gap-4 py-3 px-4 hover:bg-gray-50 transition-colors"
                        >
                            <div 
                            className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium"
                            onClick={() => navigate(`/market/${coin.id}`, {
                                state: {
                                    id: coin.id,
                                }
                            })}
                            >
                                {coin.symbol}
                            </div>
                            <div className="text-gray-900">
                                {coin.current_price.toFixed(2)}
                            </div>
                            <div className={`font-medium ${
                                coin.price_change_percentage_24h >= 0 
                                ? 'text-green-600'
                                : 'tex-red-600'
                            }`}>
                                {coin.price_change_percentage_24h}
                            </div>
                        </div>
                    ))} 
                </div>
            </div> 
        </div>
    ); 
};

export default CoinTable;