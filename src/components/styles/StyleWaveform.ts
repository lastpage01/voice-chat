import styled from "styled-components";

export const WaveDiv = styled.div<any>`
flex-shrink: 0;
  background: white;
  margin: 0 2px;
  max-height: 20px;
  height: ${(props) =>props.height}px;
  width: 4px;
  border-radius: 3px;

`;
