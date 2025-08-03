import { useQuery } from "@tanstack/react-query"; 
import ApexChart from "react-apexcharts"; 
import { fetchCoins, fetchCoinHistory } from "../api";

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

interface ICoin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}


export function Market() {

    const { isLoading, data } = useQuery<ICoin[]>(
        {
            queryKey: ["allCoins"],
            queryFn: () => fetchCoins()
        }
    );
    console.log(data)

    return null; 
}

export default Market; 