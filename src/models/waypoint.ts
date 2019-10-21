const uuidv4 = require("uuid/v4");

export class Waypoint {
  id: any;
  lat: number;
  lon: number;
  latlng?: any;
  public heading?: number;
  public pitch?: number;
  public roll?: number;
  public speed?: number;

  constructor(params: Waypoint = {} as Waypoint) {
    let {
      lat,
      lon,
      heading = 0,
      pitch = 0,
      roll = 0,
      speed = 0,
    } = params;

    this.id = uuidv4();
    this.lat = lat;
    this.lon = lon;
    this.latlng = {
      lat: lat,
      lng: lon
    }
    this.heading = heading;
    this.pitch = pitch;
    this.roll = roll;
    this.speed = speed;
  }
}