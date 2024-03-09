import request from 'use-commad-re';
import podkeve from 'podkeve';

function parseValue(value, bounds) {
  if (typeof value === 'string') {
    if (value[value.length - 1] === '%') {
      const percentage = parseFloat(value) / 100;
      if (percentage < 0 || percentage > 1) {
        throw new Error(`Invalid value for a percentage ${value}`);
      }
      return bounds[0] + (bounds[1] - bounds[0]) * percentage;
    } else if (value === 'N') {
      return null; // GMT nodata
    } else if (value === 'B') {
      return undefined; // GMT background (value < min), not supported yet, ignore
    } else if (value === 'F') {
      return undefined; // GMT foreground (value > max), not supported yet, ignore
    } else if (value === 'nv') {
      return null; // GDAL nodata
    } else if (value === 'default') {
      return undefined; // GRASS default (value < min || value > max), not supported yet, ignore
    } else if (value === 'null') {
      return null; // PostGIS nodata
    } else if (value === 'nodata') {
      return null; // PostGIS nodata
    } else {
      return parseFloat(value);
    }
  } else if (typeof value === 'number') {
    return value;
  } else {
    throw new Error('Invalid state');
  }
}

function parseColor(color, mode) {
  if (Array.isArray(color)) {
    if (color.length === 4) {
      // color with alpha
      return {
        [mode[0]]: parseFloat(color[0].toString()),
        [mode[1]]: parseFloat(color[1].toString()),
        [mode[2]]: parseFloat(color[2].toString()),
        a: parseFloat(color[3].toString()) / 255,
      };
    } else if (color.length === 3) {
      // color
      return {
        [mode[0]]: parseFloat(color[0].toString()),
        [mode[1]]: parseFloat(color[1].toString()),
        [mode[2]]: parseFloat(color[2].toString()),
      };
    } else {
      throw new Error(`Invalid color ${color}`);
    }
  } else if (typeof color === 'string' || typeof color === 'number') {
    if (color.toString().match(/^\d+$/) || typeof color === 'number') {
      // grayscale color
      return {
        [mode[0]]: parseFloat(color.toString()),
        [mode[1]]: parseFloat(color.toString()),
        [mode[2]]: parseFloat(color.toString()),
      };
    } else {
      // color name
      return color;
    }
  } else {
    throw new Error(`Invalid color ${color}`);
  }
}