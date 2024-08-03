import clearDay from './icons/clear-day.svg';
import clearNight from './icons/clear-night.svg';
import partlyCloudyDay from './icons/partly-cloudy-day.svg';
import partlyCloudyNight from './icons/partly-cloudy-night.svg';
import cloudy from './icons/cloudy.svg';
import overcast from './icons/overcast.svg';
import mist from './icons/mist.svg';
import rain from './icons/rain.svg';
import snow from './icons/snow.svg';
import sleet from './icons/sleet.svg';
import thunderstorms from './icons/thunderstorms.svg';
import windSnow from './icons/wind-snow.svg';
import fog from './icons/fog.svg';
import drizzle from './icons/drizzle.svg';
import hail from './icons/hail.svg';
import thunderRain from './icons/thunderstorms-rain.svg';
import thunderSnow from './icons/thunderstorms-snow.svg';


const weatherIconMap = {
  1000: {day: clearDay, night: clearNight},
  1003: {day: partlyCloudyDay, night: partlyCloudyNight},
  1006: cloudy,
  1009: overcast,
  1030: mist,
  1063: rain,
  1066: snow,
  1069: sleet,
  1072: sleet,
  1087: thunderstorms,
  1114: windSnow,
  1117: windSnow,
  1135: fog,
  1147: fog,
  1150: drizzle,
  1153: drizzle,
  1168: drizzle,
  1171: drizzle,
  1180: rain,
  1183: rain,
  1186: rain,
  1189: rain,
  1192: rain,
  1195: rain,
  1198: sleet,
  1201: sleet,
  1204: sleet,
  1207: sleet,
  1210: snow,
  1213: snow,
  1216: snow,
  1219: snow,
  1222: snow,
  1225: snow,
  1237: hail,
  1240: rain,
  1243: rain,
  1246: rain,
  1249: sleet,
  1252: sleet,
  1255: snow,
  1258: snow,
  1261: hail,
  1264: hail,
  1273: thunderRain,
  1276: thunderRain,
  1279: thunderSnow,
  1282: thunderSnow
}

const defaultIcon = cloudy;

function getWeatherIcon(weatherCode, isDay) {
  const iconInfo = weatherIconMap[weatherCode];
  if (!iconInfo) return defaultIcon;

  if (iconInfo.day && iconInfo.night) {
    const icon = isDay ? iconInfo.day : iconInfo.night;
    return icon || defaultIcon;
  }
  
  return iconInfo || defaultIcon; 
}

export default getWeatherIcon;