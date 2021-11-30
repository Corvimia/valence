import axios from "axios";

export const api = axios.create({});

api.interceptors.response.use((response) => response, (error) => {
  console.error("error", error.response.data.error);
  alert("ERROR: " + error.response.data.error);

});

export const fetcher = async (url: string, ...args: any[]) => {
  if(args.length > 0) {
    console.error("fetching with more args?", { url, args });
  }
  const { data } = await api.get(url);

  return data;
};
