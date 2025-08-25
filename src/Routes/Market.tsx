import { useQuery } from "@tanstack/react-query"; 
import { fetchCoins, fetchCoinHistory, fetchCoinCandle  } from "../api";
import type { IMarketData, ICandleData } from "../api";
import { Outlet
    , useNavigate
    , useParams 
    , NavigateFunction 
} from "react-router-dom";
import { useEffect, useState } from 'react'; 
import Chart from '../Components/Chart'; 
import { useRecoilValue } from "recoil"; 
import { isLoginState } from "../atoms/Atom";  
import { TradePanel } from "../Components/TradeTable"; 
import { CoinTable } from "./CoinTable"; 
import { StyledBtn, IReactProps } from "../Components/Member";


export function MarketIndexRedirect() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["allCoins"],
    queryFn: fetchCoins,
  });

  useEffect(() => {
    if (!isLoading && data && data.length > 0) {
      navigate(`/market/${data[0].id}`, { replace: true });
    }
  }, [isLoading, data, navigate]);

  return <div>Loading...</div>;
}

function Loader({children}: IReactProps) {
    return (<div className={`
        text-center
        block
    `}>
        {children}
    </div>)
} 

/* To generate table.
*/

export interface ICoinData {
    current_price: number; 
    high_24h: number;
    id: string;
    image: string;
    low_24h: number; 
    name: string;
    price_change_24h: number; 
    price_change_percentage_24h: number; 
    symbol: string; 
}; 


export function CoinChart() {
    // we can take coinId from url  
    // because useParam can understand based on information which is defined in router with colon. 

    const { coinId } = useParams<{coinId : string}>(); 
    const [data, setData] = useState<IMarketData | null>(null); // long data.  
    const [shortData, setShortData ] = useState<ICandleData | null>(null); 

    useEffect(() => {
        // initializing. 
        if (!coinId) return; 

        // TODO: suspense를 이용한 방향으로 변경. 
        const timeoutId = setTimeout(() => {
            Promise.all([
                fetchCoinHistory(coinId),
                fetchCoinCandle(coinId)
            ]).then(([long, short]) => {
                setData(long); 
                setShortData(short); 
            }).catch((err) =>{
                setData(null); 
                setShortData(null); 
                console.error("Error fetching coin data", err); 
            })
        }, 1000);

        return () => clearTimeout(timeoutId); 
    }, [coinId]);   

    if (!data || !shortData) return <div>Loading Chart...</div>

    return <Chart long={data} short={shortData}/>;
}

export function TradeTable() {
    const isLogin = useRecoilValue(isLoginState);  
    const navigate = useNavigate(); 

    return (
        isLogin ? ( 
            <TradePanel />
         ) : (
        <div className="flex justify-center mt-4">
            <StyledBtn onClick={() => navigate("/login")}>Login</StyledBtn>
        </div>
        )
    ); 
}

export function Market() {

    const { isLoading, data } = useQuery<ICoinData[]>(
        {
            queryKey: ["allCoins"],
            queryFn: () => fetchCoins(),
            refetchInterval: 60 * 1000 
        }
    );

    const navigate = useNavigate(); 
    console.log(`data -> ${data}`)

    /* Requirements of react components are as follows: 
    1. return JSX
    2. start with upper case. 
    3. not async function.  
    */

    return (
        <div className="flex justify-center p-4">
            <div className="flex-1 ml-4 p-2">
                <Outlet />
                <TradeTable />
            </div>
            <div className="w-[30vw] px-2">
                { (!data || isLoading) ? (
                    <Loader>Loading...</Loader>
                ) : 
                    // GenPastCoinTable(data.slice(0, 30), navigate)
                    <CoinTable data={data.slice(0,30)} navigate={navigate} /> 
                 }
            </div>
        </div>
    );
}

export default Market; 