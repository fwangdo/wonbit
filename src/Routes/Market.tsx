import { useQuery } from "@tanstack/react-query"; 
import ApexChart from "react-apexcharts"; 
import { fetchCoins, fetchCoinHistory, fetchCoinCandle  } from "../api";
import type { IMarketData, ICandleData } from "../api";
import { styled } from "styled-components"; 
import { Outlet
    , useNavigate
    , useParams 
    , useLocation
    , NavigateFunction 
} from "react-router-dom";
import { useEffect, useState } from 'react'; 
import Chart from '../Components/Chart'; 
import Login from "./Login";
import { useRecoilValue } from "recoil"; 
import { isLoginState } from "../atoms/Atom";  
import { TradePanel } from "../Components/TradeTable"; 


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

const Container = styled.div`
  padding: 10px 20px;
  margin: 0;
  display: flex;
  justify-content: space-between;
`;

// loader.
const Loader = styled.span`
    text-align: center;
    display: block; 
`

/* To generate table.
*/

const CoinTable = styled.table`
    /* padding: 30px; // top right bottom left */
    width: auto;
    border-collapse: collapse;
`; 

const Thead = styled.thead`
    background-color: #f5f5f5;
`;

const Th = styled.th`
    padding: 10px;
    border: 1px solid #ffffff;
    text-align: left;
    font-size: 13px;
    ` 

const TdBase = styled.td`
    padding: 8px;
    border: 0.5px solid #ddd; 
    font-size: 15px;
    background-color: #ffffff;
`; 

const TdName = styled(TdBase)`
    display: flex;
    text-align: left;
`

const TdElem = styled(TdBase)`
    text-align: right;
`

const Td = styled.td`
    padding: 10px;
    border: 1px solid #ddd; 
    font-size: 15px;
`; 

const Tr = styled.tr`
`

const TableWrapper = styled.div`
  flex: 1;
`;

const ChartWrapper = styled.div`
  flex: 1;
  margin-right: 20px;
`;

const TradeWrapper = styled.div`
    flex: 1; 
`


interface ICoinData {
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

function GenCoinTable(data: ICoinData[]
                    , navigate: NavigateFunction
                    ) {
    
    return (
        <CoinTable>
            <Thead>
                <Tr>
                    <Th>Name</Th>
                    <Th>Price</Th>
                    <Th>Updates</Th>
                </Tr> 
            </Thead>
            <tbody>
                {data.map((coin) =>(
                    <Tr key={coin.symbol}>
                        <TdName>
                            <div 
                            onClick={() => navigate(`/market/${coin.id}`, {
                                state: { 
                                    id: coin.id,  
                                }
                            })}
                            style={{cursor: 'pointer'}}
                            > 
                                {coin.symbol}
                            </div>
                        </TdName>
                        <TdElem>{coin.current_price}</TdElem>
                        <TdElem>{coin.price_change_percentage_24h}</TdElem>
                    </Tr>
                ))}
            </tbody>
        </CoinTable>
    );
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

    return (
        isLogin ? ( 
            <TradePanel />
         ) : null 
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
        <Container>
            <ChartWrapper>
                <Outlet />
                <TradeTable />
            </ChartWrapper>
            <TableWrapper>
                { (!data || isLoading) ? (
                    <Loader>Loading...</Loader>
                ) : (
                    GenCoinTable(data.slice(0, 30), navigate)
                ) }
            </TableWrapper>
        </Container>
    );
}

export default Market; 