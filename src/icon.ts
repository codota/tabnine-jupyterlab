import { LabIcon } from "@jupyterlab/ui-components";
//import tabnineLogo from "./assets/logo-dark.svg";
//TODO svg loader

const tabnineLogo = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="24" height="24" fill="url(#paint0_linear)"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.2959 6.0566C11.4225 5.98114 11.5775 5.98113 11.7041 6.05659L16.7911 9.08993C16.9202 9.16694 17 9.3108 17 9.46667V15.5333C17 15.6892 16.9202 15.8331 16.7911 15.9101L11.7041 18.9434C11.5775 19.0189 11.4225 19.0189 11.2959 18.9434L6.20894 15.9101C6.07978 15.8331 6 15.6892 6 15.5333L6 9.46667C6 9.31079 6.07979 9.16693 6.20896 9.08992L11.2959 6.0566ZM11.5 6.93177L9.76711 7.9652L16.174 11.758V9.71882L11.5 6.93177ZM15.7488 12.5014L9.34425 8.70997L9.36727 16.3066L15.7488 12.5014ZM8.54123 16.3039L8.51822 8.70991L6.82602 9.71883L6.82602 15.2812L8.54123 16.3039ZM9.79238 17.05L16.174 13.2447V15.2812L11.5 18.0682L9.79238 17.05Z" fill="white"/>
<defs>
<linearGradient id="paint0_linear" x1="26.1193" y1="20.34" x2="3.3876" y2="-3.2626" gradientUnits="userSpaceOnUse">
<stop stop-color="#4BA1FC"/>
<stop offset="1" stop-color="#EC2AED"/>
</linearGradient>
</defs>
</svg>
`;
const icon = new LabIcon({
  name: "tabnine:logo",
  svgstr: tabnineLogo,
});

export default icon;
