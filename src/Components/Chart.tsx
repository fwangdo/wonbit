import { useQuery } from "@tanstack/react-query"; 
import ApexChart from "react-apexcharts"; 
import { fetchCoins, fetchCoinHistory, IMarketData, ICandleData } from "../api";
import { styled } from "styled-components"; 
import { Routes, Route, Link, useParams, Outlet } from "react-router-dom";
import { useEffect, useState } from 'react'; 


interface ShortLongData {
    long: IMarketData;
    short: ICandleData; 
}

const ChartDiv = styled.div`
    padding: "0 30px"; 
`;

function LongChart({ prices }: IMarketData) {
    return (
        <ApexChart 
            type="line"
            width={800}
            height={300}
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
                        , toolbar: {
                            show: false, 
                        }
                        },
                xaxis: { type: "datetime" 

                },
                yaxis: { labels: {
                    formatter: (value: number) => `$${value.toFixed(2)}`
                }},
            stroke: { curve: "smooth" },
            }}
        />
    );
}; 


function ShortChart({ prices }: { prices: ICandleData }) {
    return (
        <ApexChart 
            type="candlestick"
            width={800}
            height={300}
            series={[
                {
                    name: "Short-term candle prices", 
                    data: prices.map((price) => ({
                        x: price[0], 
                        y: [price[1], price[2], price[3], price[4]]
                    })),
                }, 
            ]}
            options={{
                theme: { mode: "light" }, 
                chart: { 
                    type: "candlestick",
                    toolbar: {
                        show: false, 
                    }
                },
                xaxis: { 
                    type: "datetime" 
                },
                yaxis: { 
                    labels: {
                        formatter: (value: number) => `$${value.toFixed(2)}`
                    }
                },
                tooltip: { 
                    enabled: true
                }
            }}
        />
    );
}


export function Chart({ long, short }: ShortLongData) {
    console.log(short)

    return (
        <ChartDiv>
            <LongChart prices={long.prices} />
            <ShortChart prices={short} />
        </ChartDiv>
    ); 
}

export default Chart;