import { ScriptValue } from "./types";

const boolToInt = (val: boolean) => (val ? 1 : 0);

export const optimiseScriptValue = (input: ScriptValue): ScriptValue => {
  if ("valueA" in input) {
    const optimisedA = input.valueA && optimiseScriptValue(input.valueA);
    const optimisedB = input.valueB && optimiseScriptValue(input.valueB);

    if (optimisedA?.type === "number" && optimisedB?.type === "number") {
      // Can perform constant folding
      if (input.type === "add") {
        return {
          type: "number",
          value: Math.floor(optimisedA.value + optimisedB.value),
        };
      } else if (input.type === "sub") {
        return {
          type: "number",
          value: Math.floor(optimisedA.value - optimisedB.value),
        };
      } else if (input.type === "mul") {
        return {
          type: "number",
          value: Math.floor(optimisedA.value * optimisedB.value),
        };
      } else if (input.type === "div") {
        return {
          type: "number",
          value: Math.floor(optimisedA.value / optimisedB.value),
        };
      } else if (input.type === "gt") {
        return {
          type: "number",
          value: boolToInt(optimisedA.value > optimisedB.value),
        };
      }
    }

    return {
      ...input,
      valueA: optimisedA,
      valueB: optimisedB,
    };
  }
  return input;
};
