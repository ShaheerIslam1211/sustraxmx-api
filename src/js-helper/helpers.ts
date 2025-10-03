// Importing images
import bulkIcon from "../assets/sidebarIcons/bulk.png";
import commutingIcon from "../assets/sidebarIcons/commuting.png";
import customIcon from "../assets/sidebarIcons/custom.png";
import electricity from "../assets/sidebarIcons/electrcity.png";
import flightIcon from "../assets/sidebarIcons/flight.png";
import fuelIcon from "../assets/sidebarIcons/fuel-img.png";
import homeWorker from "../assets/sidebarIcons/home worker.png";
import hotelIcon from "../assets/sidebarIcons/hotel.png";
import paperIcon from "../assets/sidebarIcons/paper.png";
import productIcon from "../assets/sidebarIcons/product.png";
import refrigerantsIcon from "../assets/sidebarIcons/refrigerants.png";
import spendIcon from "../assets/sidebarIcons/spend.png";
import travelIcon from "../assets/sidebarIcons/travel.png";
import wasteIcon from "../assets/sidebarIcons/waste.png";
import waterIcon from "../assets/sidebarIcons/water.png";
import { message } from "antd";

// Type definitions
interface Credentials {
  username: string;
  password: string;
}

export interface CodeSnippets {
  javascript: string;
  python: string;
  curl: string;
  [key: string]: string;
}

export const sidebarIcons = {
  bulk: bulkIcon,
  commuting: commutingIcon,
  custom: customIcon,
  electricity: electricity,
  flight: flightIcon,
  fuel: fuelIcon,
  "home worker": homeWorker,
  hotel: hotelIcon,
  paper: paperIcon,
  product: productIcon,
  refrigerants: refrigerantsIcon,
  spend: spendIcon,
  travel: travelIcon,
  waste: wasteIcon,
  water: waterIcon,
};

export function copyToClipboard(text: string, onCopyText?: string): void {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      if (onCopyText) message.info(onCopyText);
    })
    .catch(err => {
      message.error(err);
    });
}
export const generateCodeSnippets = (
  baseUrl: string,
  params: Record<string, any>,
  credentials: Credentials
): CodeSnippets => {
  // Separate credentials into a specific object within the payload if needed
  const payload = {
    credentials: {
      username: credentials.username,
      password: credentials.password,
    },
    params,
  };

  return {
    javascript: `
fetch('${baseUrl}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    credentials: {
      username: '${credentials.username}',
      password: '${credentials.password}'
    },
    ...${JSON.stringify(params)}
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error))
`,
    python: `
import requests
response = requests.post('${baseUrl}', json={
  'credentials': {
    'username': '${credentials.username}',
    'password': '${credentials.password}'
  },
  **${JSON.stringify(params)}
})
print(response.text)
`,
    curl: `
curl -X POST ${baseUrl} \\
  -H "Content-Type: application/json" \\
  -d '{
    "credentials": {
      "username": "${credentials.username}",
      "password": "${credentials.password}"
    },
    ${JSON.stringify(params).slice(1, -1)}
  }'
`,
  };
};
