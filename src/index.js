import StatusCalculator from "./status-calculator-component.js";
import TierpointsCalculator from "./tierpoints-calculator-component.js";
import UaPqpCalculator from "./ua-pqp-calculator-component.js";
import MilesCalculator from "./miles-calculator-component.js";
import DistanceCalculator from "./distance-calculator-component.js";
import RouteBuilder from "./route-builder-component.js";

customElements.define("route-builder", RouteBuilder);
customElements.define("status-calculator", StatusCalculator);
customElements.define("tierpoints-calculator", TierpointsCalculator);
customElements.define("ua-pqp-calculator", UaPqpCalculator);
customElements.define("miles-calculator", MilesCalculator);
customElements.define("distance-calculator", DistanceCalculator);
