import "./index.js";

export default {
  parameters: {
    layout: "centered",
  },
};

export const StatusCalculator = () => `<status-calculator></status-calculator>`;
export const TierPointsCalcualtor = () =>
  `<tierpoints-calculator></tierpoints-calculator>`;
export const MilesCalculator = () =>
  `<miles-calculator route="SK:T:TLL-CPH-PVG-CPH-TLL"></miles-calculator>`;
export const DistanceCalculator = () =>
  `<distance-calculator></distance-calculator>`;
