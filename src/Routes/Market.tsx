import { useQuery } from "@tanstack/react-query"; 
import ApexChart from "react-apexcharts"; 
import { fetchCoins, fetchCoinHistory, IMarketData  } from "../api";
import { styled } from "styled-components"; 
import { Routes, Route, Link, useParams, Outlet, useNavigate, NavigateFunction } from "react-router-dom";
import { useEffect, useState } from 'react'; 
import Chart from '../Components/Chart'; 


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


interface IHistorical {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

interface ChartProps {
  coinId: string;
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
                            onClick={() => navigate(`/market/${coin.name}`, {
                                state: { name: coin.name }
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
    // const { coinId } = useParams<{coinId: string}>(); 
    const coinId = "bitcoin"; 
    const [data, setData] = useState<IMarketData | null>(null); 

    useEffect(() => {
        if (!coinId) return; 

        fetchCoinHistory(coinId).then((result) => {
            setData(result); 
        }).catch((err) => {
            console.error("Error fetching coin data", err); 
        }); 
    }, [coinId]); 
    
    if (!data) return <div>Loading Chart...</div>

    return <Chart prices={data.prices} />;
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

    /* Requirements of react components are as follows: 
    1. return JSX
    2. start with upper case. 
    3. not async function.  
    */

    return (
        <Container>
            <ChartWrapper>
                <Outlet />
            </ChartWrapper>
            <TableWrapper>
                { (!data || isLoading) ? (
                    <Loader>Loading...</Loader>
                ) : (
                    GenCoinTable(data.slice(0, 50), navigate)
                ) }
            </TableWrapper>
        </Container>
    );
}

export default Market; 