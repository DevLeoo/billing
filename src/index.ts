import axios from "axios";

const configs = {
  // gerado no portal
  clientId: "f50dd049-9b80-3399-9706-b2c80e578620",
  clientSecret: "dea33b2b-73f9-486c-a4c0-97fb80713578",

  // API endopoints
  devportalUrl: "https://devportal.itau.com.br", // used for auth
  sandboxUrl:
    "https://devportal.itau.com.br/sandboxapi/itau-ep9-gtw-pix-recebimentos-conciliacoes-v2-ext/v2", // used for consume API
};

export const generateItauAPIKey = async () => {
  const body = {
    client_id: configs.clientId,
    client_secret: configs.clientSecret,
  };
  return (await axios.post(`${configs.devportalUrl}/api/jwt`, body)).data;
};

export const getMetadata = async () => {
  const headerParameters = {
    "x-itau-apikey": await generateItauAPIKey(),
  };

  const body = {
    valor: {
      original: "1.0",
    },
    chave: "51146116829",
  };

  return { headerParameters, body };
};

export const generateQrCode = async () => {
  const metadata = await getMetadata();

  const qrCode = await axios.post(
    `${configs.sandboxUrl}/cobrancas_imediata_pix`,
    metadata.body,
    { headers: metadata.headerParameters }
  );

  console.log(qrCode);

  return qrCode.data;
};

(async () => {
  console.log(await generateQrCode());
})();
