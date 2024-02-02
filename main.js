// alpha1 = acos (r/(r+a))
// beta = asin (((r+c)*sin(pi - theta))/(r+l))
// alpha2 = theta - beta

// d = (alpha1 + alpha2)*r

// get values from the form

const $ = (id) => document.getElementById(id);
const log = (message) => $('message').innerHTML = message;
const sinD = (angleInDegrees) => Math.sin(angleInDegrees*Math.PI/180);
const cosD = (angleInDegrees) => Math.cos(angleInDegrees*Math.PI/180);

const windowWidth = 20000;

const drawEarth = function(radius) {
  $('earth').setAttribute("r", radius);
  $('canvas').setAttribute("viewBox", `-${windowWidth/2} -${radius+windowWidth/2} ${windowWidth} ${windowWidth}`);
};

const drawUser = function(userHeight, earthRadius) {
  $('user').setAttribute('y2', -earthRadius-userHeight);
  return { xUser: 0, yUser:  -earthRadius-userHeight };
};

const drawLighthouse = function(angle, height, earthRadius) {
  const xLighthouse = (earthRadius + height) * cosD(-angle+90);
  const yLighthouse = (earthRadius + height) * -sinD(-angle+90);

  $('lighthouse').setAttribute('x2', xLighthouse);
  $('lighthouse').setAttribute('y2', yLighthouse);

  log(`> ${xLighthouse} ${yLighthouse}`);

  return { xLighthouse, yLighthouse };
};


const drawLighthouseSight = function(xUser, yUser, xLighthouse, yLighthouse) {
  $('lighthouse-sight').setAttribute('x1', xUser);
  $('lighthouse-sight').setAttribute('y1', yUser);
  $('lighthouse-sight').setAttribute('x2', xLighthouse);
  $('lighthouse-sight').setAttribute('y2', yLighthouse);
};

const drawHorizonSight = function(xUser, yUser, userHeight, earthRadius) {
  const yHorizon = -earthRadius*earthRadius/(earthRadius+userHeight);
  const xHorizon = Math.sqrt(earthRadius*earthRadius - yHorizon*yHorizon);
  $('horizon-sight').setAttribute('x1', xUser);
  $('horizon-sight').setAttribute('y1', yUser);
  $('horizon-sight').setAttribute('x2', xHorizon);
  $('horizon-sight').setAttribute('y2', yHorizon);

  return { xHorizon, yHorizon };
};

const calculate = function() {
  const userHeight = parseFloat($('user-height').value);
  const lighthouseHeight = parseFloat($('lighthouse-height').value);
  const earthRadius = parseFloat($('earth-radius').value);
  const lighthouseAngle = parseFloat($('lighthouse-angle').value);
  drawEarth(earthRadius);
  const { xUser, yUser } = drawUser(userHeight, earthRadius);
  const { xLighthouse, yLighthouse } = drawLighthouse(lighthouseAngle, lighthouseHeight, earthRadius);
  drawLighthouseSight(xUser, yUser, xLighthouse, yLighthouse);
  const { xHorizon, yHorizon } = drawHorizonSight(xUser, yUser, userHeight, earthRadius);


  const sextantReading = calculateAngle(
    xUser, yUser,
    xLighthouse, yLighthouse,
    xUser, yUser,
    xHorizon, yHorizon
  );

  $('sextant-reading').value = sextantReading;
};


const calculateAngle = function(p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y) {
  const A = { x: p2x - p1x, y: p2y - p1y };
  const B = { x: p4x - p3x, y: p4y - p3y };
  const dotProduct = A.x * B.x + A.y * B.y;
  const magnitudeA = Math.sqrt(A.x * A.x + A.y * A.y);
  const magnitudeB = Math.sqrt(B.x * B.x + B.y * B.y);
  const cosTheta = dotProduct / (magnitudeA * magnitudeB);
  const angleRadians = Math.acos(cosTheta);
  const angleDegrees = angleRadians * (180 / Math.PI);

  return angleDegrees;
};

$('go').addEventListener('click', calculate);
calculate();
