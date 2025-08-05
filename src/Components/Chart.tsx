import { useQuery } from "@tanstack/react-query"; 
import ApexChart from "react-apexcharts"; 
import { fetchCoins, fetchCoinHistory, IMarketData  } from "../api";
import { styled } from "styled-components"; 
import { Routes, Route, Link, useParams, Outlet } from "react-router-dom";
import { useEffect, useState } from 'react'; 


interface ShortLongData {
    long: IMarketData;
    short: IMarketData; 
}

const ChartDiv = styled.div`
    padding: "0 30px"; 
`;

function LongChart({ prices }: IMarketData) {
    return (
        <ApexChart 
            type="line"
            width={800}
            height={500}
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


function ShortChart( { prices }: IMarketData ) {
    return (
        <ApexChart 
            width={800}
            height={500}
            series={[
                {
                    name: "Prices", 
                    data: prices.map((price) => ({
                        x: price[0], 
                        y: price.slice(1,price.length)})),
                }, 
            ]}
            options={{
                theme: { mode: "light" }, 
                chart: { type: "candlestick" 
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
}


export function Chart({ long, short }: ShortLongData) {

    return (
        <ChartDiv>
            <LongChart prices={long.prices} />
            <ShortChart prices={short.prices} />
        </ChartDiv>
    ); 
}

export default Chart;