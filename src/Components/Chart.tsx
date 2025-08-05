import { useQuery } from "@tanstack/react-query"; 
import ApexChart from "react-apexcharts"; 
import { fetchCoins, fetchCoinHistory, IMarketData  } from "../api";
import { styled } from "styled-components"; 
import { Routes, Route, Link, useParams, Outlet } from "react-router-dom";
import { useEffect, useState } from 'react'; 


const ChartDiv = styled.div`
    padding: "0 30px"; 
`;


export function Chart({ prices } : IMarketData) {

    return (
        <ChartDiv>
            <ApexChart 
                type="line"
                series={[
                    {
                        name: "Prices", 
                        data: prices.map((price) => ({
                            x: price[0], 
                            y: price[1]})),
                    }, 
                ]}
                options={{
                    theme: { mode: "light" }, 
                    chart: { type: "line" 
                            , height: 500 
                            , width: 500
                    },
                    xaxis: { type: "datetime" },
                    stroke: { curve: "smooth" },
                }}
                height={800}
                width={900}
                tooltip={{
                    y: {
                        formatter: (value: number) => `$${value.toFixed(2)}`
                    }
                }}
            />
        </ChartDiv>
    ); 
}

export default Chart;