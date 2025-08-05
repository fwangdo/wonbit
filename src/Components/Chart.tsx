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
                width={800}
                height={800}
                series={[
                    {
                        name: "Prices", 
                        data: prices.map((price) => ({
                            x: price[0], 
                            y: price[1]})),
                    }, 
                ]}
                options={{
                    theme: { mode: "dark" }, 
                    chart: { type: "line" 
                            , height: 300 
                            , width: 300
                            , toolbar: {
                                show: false, 
                            }
                            },
                    xaxis: { type: "datetime" },
                    yaxis: { labels: {
                        formatter: (value: number) => `$${value.toFixed(2)}`
                    }},
                    stroke: { curve: "smooth" },
                    tooltip: {
                        y: {
                            formatter: (value: number) => `$${value.toFixed(2)}`
                        }
                    }}
                }
            />
        </ChartDiv>
    ); 
}

export default Chart;