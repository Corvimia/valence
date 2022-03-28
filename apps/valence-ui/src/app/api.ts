import axios from "axios";

const instance = axios;
//   .create({
//   baseURL: "https://api.valence.com",
//   params: {},
// });

instance.interceptors.response.use((response) => response, (error) => {
  console.error("error", error.response.data.error);
  alert("ERROR: " + error.response.data.error);
});

instance.interceptors.request.use(async function(config) {

  try {
    console.log("checking URL");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const port = await window.electron.getPort();

    console.log("found port", port);


    config.baseURL = `http://localhost:${port}/`;
    return config;
  } catch (error) {
    console.log("did not find port");

    config.baseURL = `/`;
    return config;
  }
}, () => {
  console.log("Request failed?");
});

export const fetcher = async (url: string, ...args: any[]) => {
  if (args.length > 0) {
    console.error("fetching with more args?", { url, args });
  }
  const { data } = await instance.get(url);

  return data;
};

export const api = instance.create({
  params: {}
});
