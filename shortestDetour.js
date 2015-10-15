/**
 * Taken from http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
 * Calculates the distance between two pairs of longitude and latitude
 * using the Haversine formula, which takes into account Earth's bearing calculations.
 * @param  {Number} lat1 The latitude of the first point.
 * @param  {Number} lon1 The longitude of the first point.
 * @param  {Number} lat2 The latitude of the second point.
 * @param  {Number} lon2 The longitude of the second point.
 * @return {Number}      The distance between the first and second point in kilometers.
 */
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

/**
 * Helper function for getdistanceFromLatLonInKm that converts degrees to radians.
 * @param  {Number} deg The degree to be converted.
 * @return {Number}     The resulting radian of the given degree.
 */
function deg2rad(deg) {
  return deg * (Math.PI/180);
}


/**
 * A Coordinate that's made up of a longitude and a latitude.
 * @param {Number} longitude The coordinate longitude.
 * @param {Number} latitude  The coordinate latitude.
 */
var Coordinate = function(longitude, latitude) { 
  this.lon = longitude;
  this.lat = latitude;
};


/**
 * Calculates the distance between two Coordinates in kilometers.
 * @param  {Coordinate} pointA 
 * @param  {Coordinate} pointB 
 * @return {Number}        The distance between the two points in kilometers.
 */
function distanceBetween(pointA, pointB) {
  return getDistanceFromLatLonInKm(pointA.lat, pointA.lon, pointB.lat, pointB.lon);
}


/**
 * Calculates the shortest detour distance
 * @param  {Coordinate} coordA Coordinate of point A.
 * @param  {Coordinate} coordB Coordinate of point B.
 * @param  {Coordinate} coordC Coordinate of point C.
 * @param  {Coordinate} coordD Coordinate of point D.
 * @return {Number}        The shortest detour distance.
 */
function shortestDetourDist(coordA, coordB, coordC, coordD) {
  // Calculate the distances between each coordinate.
  var ABDist = distanceBetween(coordA, coordB), // A <-> B
      CDDist = distanceBetween(coordC, coordD), // C <-> D
      ACDist = distanceBetween(coordA, coordC), // A <-> C
      BDDist = distanceBetween(coordB, coordD); // B <-> D
  // Calculate the detour distances for each possible route.
  var driverA = ACDist + CDDist + BDDist - ABDist, // Driver A picks up driver B.
      driverB = ACDist + ABDist + BDDist - CDDist; // Driver B picks up driver A.

  return driverA < driverB ? driverA : driverB  
}


// Testing
// Set of coordinates for testing.
var coordA = new Coordinate(40.105706, -88.221674),
    coordB = new Coordinate(40.110588, -88.219271),
    coordC = new Coordinate(40.108266, -88.215988),
    coordD = new Coordinate(40.114084, -88.215773);


function assert(condition, message) {
  if (!condition) {
    throw message || "Assertion failed."
  }
}

function testNormalDetour() {
  var trip = shortestDetourDist(coordA, coordB, coordC, coordD);
  assert(trip > 0, "Should be non-zero positive.");
}

function testFlippedTrip() {
  var trip = shortestDetourDist(coordA, coordB, coordC, coordD),
      tripFlipped = shortestDetourDist(coordC, coordD, coordA, coordB);
  assert(trip === tripFlipped, "The shortest detour distance should be the same.");
}

function testSameTrip() {
  var trip = shortestDetourDist(coordA, coordB, coordA, coordB);
  assert(trip === 0, "No detour is needed, so the distance should be 0.")
}

testNormalDetour();
testFlippedTrip();
testSameTrip();