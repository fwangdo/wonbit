import { ICoinData } from "./Market"; 
import { NavigateFunction } from "react-router-dom";
import { useParams, useMatch } from "react-router-dom";

export function CoinTable({data, navigate}: {data: ICoinData[], navigate: NavigateFunction}) {
    let { coinId } = useParams(); 

    if (!coinId) {
        navigate(`/market/bitcoin`);
        coinId = `bitcoin`;
    }
    
    return (
        <div>
            <div className="w-full text-sm">
                {/* Header. */}
                <div className="grid grid-cols-3 gap-4 py-2 px-2 bg-gray-100 border-b font-semibold text-gray-700 text-center">
                    <div>Name</div>
                    <div>Price</div>
                    <div>Updates</div>
                </div>

                {/* Data row. */}
                <div className="divide-y divide-grey-200">
                    {data.map((coin) => (
                        <div 
                            key={coin.symbol}
                            className={`grid grid-cols-3 gap-4 py-2 px-2 hover:bg-gray-50 transition-colors ${
                                coinId === coin.id 
                                ? 'bg-gray-100'
                                : 'bg-white'
                            }`}>
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
                            <div className="text-gray-900 text-right">
                                {coin.current_price.toFixed(3)}
                            </div>
                            <div className={`text-right font-medium ${
                                coin.price_change_percentage_24h >= 0 
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}>
                                {coin.price_change_percentage_24h.toFixed(2)}
                            </div>
                        </div>
                    ))} 
                </div>
            </div> 
        </div>
    ); 
};

export default CoinTable;