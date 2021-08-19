import { LabIcon } from "@jupyterlab/ui-components";

export const iconSvgStr = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.7403 4.06967C11.9013 3.97678 12.0987 3.97678 12.2597 4.06965L18.7341 7.80299C18.8985 7.89777 19 8.07483 19 8.26667V15.7333C19 15.9252 18.8985 16.1022 18.7341 16.197L12.2597 19.9303C12.0987 20.0232 11.9013 20.0232 11.7403 19.9303L5.26592 16.197C5.10154 16.1022 5 15.9252 5 15.7333L5 8.26667C5 8.07482 5.10155 7.89776 5.26595 7.80297L11.7403 4.06967ZM12 5.14679L9.79451 6.41871L17.9487 11.0867V8.57701L12 5.14679ZM17.4076 12.0017L9.25632 7.33535L9.28561 16.6851L17.4076 12.0017ZM8.23429 16.6818L8.20501 7.33527L6.0513 8.57702L6.0513 15.423L8.23429 16.6818ZM9.82667 17.6L17.9487 12.9166V15.423L12 18.8532L9.82667 17.6Z" fill="url(#paint0_linear)"/>
<defs>
<linearGradient id="paint0_linear" x1="20.2363" y1="17.56" x2="5.1406" y2="3.84524" gradientUnits="userSpaceOnUse">
<stop stop-color="#4BA1FC"/>
<stop offset="1" stop-color="#EC2AED"/>
</linearGradient>
</defs>
</svg>
`;

const icon = new LabIcon({
  name: "tabnine:logo",
  svgstr: iconSvgStr,
});

export default icon;
