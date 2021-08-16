import { LabIcon } from "@jupyterlab/ui-components";
//import tabnineLogo from "./assets/logo-dark.svg";
//TODO svg loader

const tabnineLogo = `
<svg width="24" height="24" viewBox="0.577 -0.01 38.455 44.046" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="paint0_linear" x1="214.555" y1="43.124" x2="173.008" y2="5.4605" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1, 0, 0, 1, -172.127533, -5.80624)">
      <stop stop-color="#4BA1FC"/>
      <stop offset="1" stop-color="#EC2AED"/>
    </linearGradient>
  </defs>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M 19.225 0.145 C 19.584 -0.062 20.026 -0.062 20.384 0.145 L 38.453 10.577 C 38.811 10.784 39.032 11.167 39.032 11.581 L 39.032 32.445 C 39.032 32.859 38.811 33.241 38.453 33.448 L 20.384 43.88 C 20.026 44.087 19.584 44.087 19.225 43.88 L 1.157 33.448 C 0.798 33.241 0.577 32.859 0.577 32.445 L 0.577 11.581 C 0.577 11.167 0.798 10.784 1.157 10.577 L 10.093 5.418 L 19.225 0.145 Z M 9.52 8.426 L 2.895 12.25 L 2.895 31.775 L 9.605 35.649 L 9.52 8.426 Z M 13.089 37.66 L 19.805 41.538 L 36.714 31.775 L 36.714 24.02 L 13.089 37.66 Z M 36.714 20.012 L 36.714 12.25 L 19.805 2.488 L 12.997 6.418 L 36.714 20.012 Z M 11.838 8.426 L 11.923 35.656 L 35.549 22.016 L 11.838 8.426 Z" fill="url(#paint0_linear)"/>
</svg>`
;

const icon = new LabIcon({
  name: "tabnine:logo",
  svgstr: tabnineLogo,
});

export default icon;
