export const headerContent = {
  logoText: "SustraxAPI",
  menuItems: [
    { name: "Guides", link: "#guides" },
    { name: "API Reference", link: "#api-reference" },
  ],
  searchPlaceholder: "Search",
  loginText: "Log in",
  helpCenterText: "Help center",
};

export const DummyUrl = "xyz.com/";

// export const mockCodeSnippets = {
//   Python: (details) => `import requests
// url = "${details.baseUrl}/${details.endpoint}"
// payload = {}  # Your payload here
// headers = {
//   "Accept": "application/json",
//   "Content-Type": "application/json",
//   "Authorization": "Basic YOUR_API_KEY"
// }

// response = requests.request("GET", url, headers=headers, data=payload)
// print(response.text)`,

//   JavaScript: (details) => `fetch("${details.baseUrl}/${details.endpoint}", {
//   method: "GET", // or 'POST'
//   headers: {
//     "Accept": "application/json",
//     "Content-Type": "application/json",
//     "Authorization": "Basic YOUR_API_KEY"
//   },
//   body: JSON.stringify({}) // Your payload here
// })
// .then(response => response.json())
// .then(data => console.log(data))
// .catch((error) => console.error('Error:', error))`,

//   Ruby: (details) => `require 'uri'
// require 'net/http'
// require 'openssl'

// url = URI("${details.baseUrl}/${details.endpoint}")

// http = Net::HTTP.new(url.host, url.port)
// http.use_ssl = true
// http.verify_mode = OpenSSL::SSL::VERIFY_NONE

// request = Net::HTTP::Get.new(url)
// request["Accept"] = 'application/json'
// request["Content-Type"] = 'application/json'
// request["Authorization"] = 'Basic YOUR_API_KEY'
// request.body = "{}" # Your payload here

// response = http.request(request)
// puts response.read_body`,

//   PHP: (details) => `<?php
// $curl = curl_init();

// curl_setopt_array($curl, array(
//   CURLOPT_URL => "${details.baseUrl}/${details.endpoint}",
//   CURLOPT_RETURNTRANSFER => true,
//   CURLOPT_ENCODING => "",
//   CURLOPT_MAXREDIRS => 10,
//   CURLOPT_TIMEOUT => 30,
//   CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
//   CURLOPT_CUSTOMREQUEST => "GET",
//   CURLOPT_POSTFIELDS => "{}", // Your payload here
//   CURLOPT_HTTPHEADER => array(
//     "Accept: application/json",
//     "Content-Type: application/json",
//     "Authorization: Basic YOUR_API_KEY"
//   ),
// ));

// $response = curl_exec($curl);
// $err = curl_error($curl);

// curl_close($curl);

// if ($err) {
//   echo "cURL Error #:" . $err;
// } else {
//   echo $response;
// }
// ?>`,
// };

export const apiData = [
  {
    title: "Calculate for Fuel",
    method: "GET",
    endpoint: "calculate-fuel",
    description:
      "Calculates fuel emissions based on distance and vehicle type. Not applicable for electric or hybrid vehicles. Returns total CO2 emissions in kilograms (kg) as '200 OK'.",
    baseUrl: "https://{{region}}-api.abcdef.com/v2",
    callRate: "Medium call rate",
    fields: [
      {
        name: "id",
        type: "int",
        required: true,
        placeholder: "The ID of the address book",
      },
    ],
  },
  {
    title: "Calculate for Electricity",
    method: "GET",
    endpoint: "calculate-electricity",
    description:
      "Estimates electricity usage for appliances. Not suitable for industrial equipment. Returns total kWh consumed as '200 OK'.",
    baseUrl: "https://{{region}}-api.abcdef.com/v2",
    callRate: "Medium call rate",
    fields: [
      {
        name: "params",
        type: "string",
        required: true,
        placeholder: "e.g., r1, r2 or r3",
      },
      {
        name: "id",
        type: "int",
        required: true,
        placeholder: "The ID of the address book",
      },
    ],
  },
  {
    title: "Calculate for Cars",
    method: "GET",
    endpoint: "calculate-cars",
    description:
      "Estimates electricity usage for appliances. Not suitable for industrial equipment. Returns total kWh consumed as '200 OK'.",
    baseUrl: "https://{{region}}-api.abcdef.com/v2",
    callRate: "Medium call rate",
    fields: [
      {
        name: "id",
        type: "int",
        required: true,
        placeholder: "The ID of the address book",
      },
    ],
  },
];
