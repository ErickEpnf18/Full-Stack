import axios from "axios";
import config from "../config";
const validateMessage = async (res) => {
  if (typeof res === "undefined") {
    return { msg: "Not Found", data: [], searchWeather: false };
  }
  if (res.data.length === 0) {
    return { msg: null, data: [], searchWeather: false };
  } 
  if (res.data.length === 1) {
    return { msg: null, data: res.data, searchWeather: true };
  }
  if (res.data.length > 10)
    return {
      msg: "Too many matches, especify another filter",
      data: [],
      searchWeather: false,
    };
  if (res.data.length <= 10 && res.data.length > 1)
    return { msg: null, data: res.data, searchWeather: false };


};

export const getCountries = async ( search) => {
  const res = await axios(`${config.API_COUNTRIES}${search}`).catch((e) =>
    console.error(e)
  );
  const { msg, data, searchWeather } = await validateMessage(res);

  if (searchWeather) {
    const [lat, lon] = data[0].latlng;
    const resWeather = await axios(
      `${config.API_WEATHER}?lat=${lat}&lon=${lon}&appid=${config.KEY_WEATHER}&units=metric`
    ).catch((e) => console.log(e));
    const img = `${config.IMG_WEATHER}${resWeather.data.weather[0].icon}.png`;
    resWeather.data.icon = img;
    const dataGrouped = [{ ...data[0], weather: resWeather.data }];

    return {
      msg,
      data: dataGrouped,
    };
  }
  return { msg, data };
};
