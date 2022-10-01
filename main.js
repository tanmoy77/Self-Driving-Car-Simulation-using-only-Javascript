const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const N = 200;
const cars = generateCars(N);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));

    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -800, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -1000, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -1100, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -1300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -1400, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -1600, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -1700, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -1900, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -2000, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -2200, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -2400, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -2500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -2700, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -2900, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -3000, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -3200, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -3300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -3400, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -3600, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -3800, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -3900, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -4000, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -4300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -4400, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -4600, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -4800, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -5000, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -5100, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -5300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -5400, 30, 50, "DUMMY", 2),
];

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function start() {
  window.location.reload();
}

const demoCarBrain = bestCar.brain;
localStorage.setItem("demoCar", JSON.stringify(demoCarBrain));

function generateCars(N) {
  const cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }
  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));
  // bestCar.update(road.borders, traffic);

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.8);
  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }

  carCtx.globalAlpha = 0.2;

  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue");
  }

  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}
