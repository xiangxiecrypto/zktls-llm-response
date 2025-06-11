
const { PrimusCoreTLS } = require("@primuslabs/zktls-core-sdk");
require('dotenv').config();

async function primusProofTest() {
    // Initialize parameters, the init function is recommended to be called when the program is initialized.
    const appId = "0x21c44c75014fc8a104ff139f24f60c59c3c3256c";
    const appSecret = "0x49b0e4bfe2b9566830f435267b921b45280cf512bead503fd061f9fcb52b117e";
    const zkTLS = new PrimusCoreTLS();
    const initResult = await zkTLS.init(appId, appSecret);
    console.log("primusProof initResult=", initResult);

    DS_API_KEY = process.env.DS_API_KEY;
    console.log("DS_API_KEY=", DS_API_KEY);

    // Set request and responseResolves.
    const request = {
        url: "https://api.deepseek.com/chat/completions", // Request endpoint.
        method: "POST", // Request method.
        header: { "Authorization": "Bearer " + DS_API_KEY, "Content-Type": "application/json" }, // Request headers.
        body: {
            "model": "deepseek-chat",
            "messages": [
                { "role": "system", "content": "You are a helpful assistant." },
                { "role": "user", "content": "write a poem!" }
            ],
            "stream": false
        } // Request body.
    };

    const responseResolves = [
        {
            keyName: 'response', // Set a name according to the response keyname.
            parsePath: '$.choices[0].message.content', // Set the value you want to prove according to the response parsePath.
        }
    ];
    // Generate attestation request.
    const generateRequest = zkTLS.generateRequestParams(request, responseResolves);

    // Set zkTLS mode, default is proxy model. (This is optional)
    generateRequest.setAttMode({
        algorithmType: "proxytls"
    });

    // Start attestation process.
    const attestation = await zkTLS.startAttestation(generateRequest);
    console.log("attestation=", attestation);

    const verifyResult = zkTLS.verifyAttestation(attestation);
    console.log("verifyResult=", verifyResult);

    process.exit(0);
}
primusProofTest().then(() => {
}).catch((error) => { console.log("error=", error); process.exit(1); });
