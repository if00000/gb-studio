import { RPNOperation, ScriptValue } from "./types";

const boolToInt = (val: boolean) => (val ? 1 : 0);

export const optimiseScriptValue = (input: ScriptValue): ScriptValue => {
  if ("valueA" in input && input.type !== "rnd") {
    const optimisedA = input.valueA && optimiseScriptValue(input.valueA);
    const optimisedB = input.valueB && optimiseScriptValue(input.valueB);

    if (optimisedA?.type === "number" && optimisedB?.type === "number") {
      // Can perform constant folding as both inputs are numbers
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
      } else if (input.type === "gte") {
        return {
          type: "number",
          value: boolToInt(optimisedA.value >= optimisedB.value),
        };
      } else if (input.type === "lt") {
        return {
          type: "number",
          value: boolToInt(optimisedA.value < optimisedB.value),
        };
      } else if (input.type === "lte") {
        return {
          type: "number",
          value: boolToInt(optimisedA.value <= optimisedB.value),
        };
      } else if (input.type === "eq") {
        return {
          type: "number",
          value: boolToInt(optimisedA.value === optimisedB.value),
        };
      } else if (input.type === "ne") {
        return {
          type: "number",
          value: boolToInt(optimisedA.value !== optimisedB.value),
        };
      } else if (input.type === "min") {
        return {
          type: "number",
          value: Math.min(optimisedA.value, optimisedB.value),
        };
      } else if (input.type === "max") {
        return {
          type: "number",
          value: Math.max(optimisedA.value, optimisedB.value),
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

export const precompileScriptValue = (
  input: ScriptValue,
  output: Array<RPNOperation> = []
): Array<RPNOperation> => {
  // const output: Array<RPNOperation | FetchOperation> = [];

  if (input.type !== "rnd") {
    // output.push(input);
  }

  return output;
};
