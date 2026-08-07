import { qa, renderMath } from "./dom";

export const LAB_KICKER = "Laboratório · suplemento";

export const initialise = (
  callback: (root: HTMLElement) => void
): ((root: HTMLElement) => void) => (root) => {
  if (!root || root.dataset.ch02LabReady === "true") return;
  root.dataset.ch02LabReady = "true";
  qa(root, ".lab-controls").forEach((element) => element.setAttribute("data-lab-controls", ""));
  qa(root, "label").forEach((element) => element.setAttribute("data-lab-field", ""));
  qa(root, ".lab-actions").forEach((element) => element.setAttribute("data-lab-actions", ""));
  qa(root, ".lab-result").forEach((element) => element.setAttribute("data-lab-output", ""));
  qa(root, ".lab-table").forEach((element) => element.classList.add("supplement-lab__table"));
  qa(root, "button").forEach((element) => element.classList.add("supplement__action"));
  callback(root);
  renderMath(root);
};
