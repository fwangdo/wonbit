import { styled } from "styled-components"; 
import chart from "../Assets/chart.jpeg"

export const Img = styled.img`
    padding: 2px;
    width: 1200px;
    opacity: 0.85;
    display: block;
    margin: 0 auto;
`

function Home() {
    return (
        <Img src={chart}/>
    ); 
}

export default Home; 