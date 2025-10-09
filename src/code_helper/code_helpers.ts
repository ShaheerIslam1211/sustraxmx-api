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
  const _payload = {
    credentials: {
      username: credentials.username,
      password: credentials.password,
    },
    params,
  };

  const _paramsString = JSON.stringify(params, null, 2);
  const paramsForUrl = JSON.stringify(params).slice(1, -1);
  // ...${JSON.stringify(params)}

  return {
    javascript: `fetch('${baseUrl}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    credentials: {
      username: '${credentials.username}',
      password: '${credentials.password}'
    },
    ...${JSON.stringify(params, null, 2)}
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`,

    nodejs: `const axios = require('axios');

const data = {
  credentials: {
    username: '${credentials.username}',
    password: '${credentials.password}'
  },
  ...${JSON.stringify(params, null, 2)}
};

axios.post('${baseUrl}', data, {
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error('Error:', error.response?.data || error.message);
});`,

    python: `import requests
import json

data = {
    'credentials': {
        'username': '${credentials.username}',
        'password': '${credentials.password}'
    },
    **${JSON.stringify(params, null, 2).replace(/"/g, "'")}
}

response = requests.post('${baseUrl}', json=data)
print(response.json())`,

    php: `<?php
$data = array(
    'credentials' => array(
        'username' => '${credentials.username}',
        'password' => '${credentials.password}'
    ),
    ...${JSON.stringify(params, null, 2).replace(/"/g, "'")}
);

$options = array(
    'http' => array(
        'header'  => "Content-type: application/json\\r\\n",
        'method'  => 'POST',
        'content' => json_encode($data)
    )
);

$context  = stream_context_create($options);
$result = file_get_contents('${baseUrl}', false, $context);
echo $result;
?>`,

    ruby: `require 'net/http'
require 'json'
require 'uri'

uri = URI('${baseUrl}')
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true if uri.scheme == 'https'

data = {
  credentials: {
    username: '${credentials.username}',
    password: '${credentials.password}'
  },
  **${JSON.stringify(params, null, 2).replace(/"/g, "'")}
}

request = Net::HTTP::Post.new(uri)
request['Content-Type'] = 'application/json'
request.body = data.to_json

response = http.request(request)
puts response.body`,

    go: `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
)

func main() {
    data := map[string]interface{}{
        "credentials": map[string]string{
            "username": "${credentials.username}",
            "password": "${credentials.password}",
        },
        ${Object.entries(params)
          .map(([key, value]) => `"${key}": "${value}"`)
          .join(",\n        ")}
    }

    jsonData, err := json.Marshal(data)
    if err != nil {
        fmt.Println("Error marshaling JSON:", err)
        return
    }

    resp, err := http.Post("${baseUrl}", "application/json", bytes.NewBuffer(jsonData))
    if err != nil {
        fmt.Println("Error making request:", err)
        return
    }
    defer resp.Body.Close()

    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        fmt.Println("Error reading response:", err)
        return
    }

    fmt.Println(string(body))
}`,

    //     java: `import java.io.*;
    // import java.net.HttpURLConnection;
    // import java.net.URL;
    // import java.nio.charset.StandardCharsets;

    // public class ApiRequest {
    //     public static void main(String[] args) {
    //         try {
    //             URL url = new URL("${baseUrl}");
    //             HttpURLConnection conn = (HttpURLConnection) url.openConnection();
    //             conn.setRequestMethod("POST");
    //             conn.setRequestProperty("Content-Type", "application/json");
    //             conn.setDoOutput(true);

    //             String jsonData = "{\\"credentials\\":{\\"username\\":\\"${credentials.username}\\",\\"password\\":\\"${credentials.password}\\"},${Object.entries(
    //               params
    //             )
    //               .map(([key, value]) => `\\"${key}\\":\\"${value}\\"`)
    //               .join(",")}}";

    //             try (OutputStream os = conn.getOutputStream()) {
    //                 byte[] input = jsonData.getBytes(StandardCharsets.UTF_8);
    //                 os.write(input, 0, input.length);
    //             }

    //             try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
    //                 StringBuilder response = new StringBuilder();
    //                 String responseLine;
    //                 while ((responseLine = br.readLine()) != null) {
    //                     response.append(responseLine.trim());
    //                 }
    //                 System.out.println(response.toString());
    //             }
    //         } catch (Exception e) {
    //             e.printStackTrace();
    //         }
    //     }
    // }`,

    csharp: `using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

class Program
{
    static async Task Main(string[] args)
    {
        using (var client = new HttpClient())
        {
            var data = new
            {
                credentials = new
                {
                    username = "${credentials.username}",
                    password = "${credentials.password}"
                },
                ${Object.entries(params)
                  .map(([key, value]) => `${key} = "${value}"`)
                  .join(",\n                ")}
            };

            var json = JsonConvert.SerializeObject(data);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            try
            {
                var response = await client.PostAsync("${baseUrl}", content);
                var result = await response.Content.ReadAsStringAsync();
                Console.WriteLine(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
        }
    }
}`,

    curl: `curl -X POST ${baseUrl} \\
  -H "Content-Type: application/json" \\
  -d '{
    "credentials": {
      "username": "${credentials.username}",
      "password": "${credentials.password}"
    },
    ${paramsForUrl}
  }'`,
  };
};
