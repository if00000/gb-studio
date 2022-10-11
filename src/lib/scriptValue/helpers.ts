import {
  PrecompiledValueRPNOperation,
  PrecompiledValueFetch,
  isValueOperation,
  ScriptValue,
} from "./types";

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
  rpnOperations: PrecompiledValueRPNOperation[] = [],
  fetchOperations: PrecompiledValueFetch[] = []
): [PrecompiledValueRPNOperation[], PrecompiledValueFetch[]] => {
  if (
    input.type === "property" ||
    input.type === "expression" ||
    input.type === "rnd"
  ) {
    const localName = `local_${fetchOperations.length}`;
    rpnOperations.push({
      type: "local",
      value: localName,
    });
    fetchOperations.push({
      local: localName,
      value: input,
    });
  } else if (isValueOperation(input)) {
    if (input.valueA) {
      precompileScriptValue(input.valueA, rpnOperations, fetchOperations);
    }
    if (input.valueB) {
      precompileScriptValue(input.valueB, rpnOperations, fetchOperations);
    }
    rpnOperations.push({
      type: input.type,
    });
  } else {
    rpnOperations.push(input);
  }
  return [rpnOperations, fetchOperations];
};

export const sortFetchOperations = (
  input: PrecompiledValueFetch[]
): PrecompiledValueFetch[] => {
  return [...input].sort((a, b) => {
    if (a.value.type === "property" && b.value.type === "property") {
      if (a.value.target === b.value.target) {
        // Sort on Prop
        return a.value.property.localeCompare(b.value.property);
      } else {
        // Sort on Target
        return a.value.target.localeCompare(b.value.target);
      }
    }
    return a.value.type.localeCompare(b.value.type);
  });
};
