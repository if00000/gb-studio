export type RPNOperation =
  | {
      type: "add";
      valueA?: ScriptValue;
      valueB?: ScriptValue;
    }
  | {
      type: "sub";
      valueA?: ScriptValue;
      valueB?: ScriptValue;
    }
  | {
      type: "mul";
      valueA?: ScriptValue;
      valueB?: ScriptValue;
    }
  | {
      type: "div";
      valueA?: ScriptValue;
      valueB?: ScriptValue;
    }
  | {
      type: "eq";
      valueA?: ScriptValue;
      valueB?: ScriptValue;
    }
  | {
      type: "ne";
      valueA?: ScriptValue;
      valueB?: ScriptValue;
    }
  | {
      type: "gt";
      valueA?: ScriptValue;
      valueB?: ScriptValue;
    }
  | {
      type: "gte";
      valueA?: ScriptValue;
      valueB?: ScriptValue;
    }
  | {
      type: "lt";
      valueA?: ScriptValue;
      valueB?: ScriptValue;
    }
  | {
      type: "lte";
      valueA?: ScriptValue;
      valueB?: ScriptValue;
    }
  | {
      type: "min";
      valueA?: ScriptValue;
      valueB?: ScriptValue;
    }
  | {
      type: "max";
      valueA?: ScriptValue;
      valueB?: ScriptValue;
    };

export type ScriptValueAtom =
  | {
      type: "number";
      value: number;
    }
  | {
      type: "variable";
      value: string;
    }
  | {
      type: "property";
      value: string;
    }
  | {
      type: "expression";
      value: string;
    };

export type ScriptValue =
  | RPNOperation
  | ScriptValueAtom
  | {
      type: "rnd";
      valueA?: {
        type: "number";
        value: number;
      };
      valueB?: {
        type: "number";
        value: number;
      };
    };

export const valueFunctions = ["add", "sub", "mul", "div"] as const;
export type ValueFunction = typeof valueFunctions[number];

export const valueAtoms = [
  "number",
  "variable",
  "property",
  "expression",
] as const;
export type ValueAtom = typeof valueAtoms[number];

export type ValueFunctionMenuItem = {
  value: ValueFunction;
  label: string;
  symbol: string;
};

export const isScriptValue = (value: unknown): value is ScriptValue => {
  if (!value || typeof value !== "object") {
    return false;
  }
  const scriptValue = value as ScriptValue;
  // Is a number
  if (scriptValue.type === "number" && typeof scriptValue.value === "number") {
    return true;
  }
  if (
    scriptValue.type === "variable" &&
    typeof scriptValue.value === "string"
  ) {
    return true;
  }
  if (
    scriptValue.type === "property" &&
    typeof scriptValue.value === "string"
  ) {
    return true;
  }
  if (
    scriptValue.type === "expression" &&
    typeof scriptValue.value === "string"
  ) {
    return true;
  }
  if (
    (scriptValue.type === "add" ||
      scriptValue.type === "sub" ||
      scriptValue.type === "mul" ||
      scriptValue.type === "div") &&
    (isScriptValue(scriptValue.valueA) || !scriptValue.valueA) &&
    (isScriptValue(scriptValue.valueB) || !scriptValue.valueB)
  ) {
    return true;
  }
  if (
    scriptValue.type === "rnd" &&
    (isScriptValue(scriptValue.valueA) || !scriptValue.valueA) &&
    (isScriptValue(scriptValue.valueB) || !scriptValue.valueB)
  ) {
    return true;
  }

  return false;
};

export type ScriptValueFunction = ScriptValue & { type: ValueFunction };

export const isValueOperation = (
  value?: ScriptValue
): value is ScriptValueFunction => {
  return (
    !!value &&
    (value.type === "add" ||
      value.type === "sub" ||
      value.type === "mul" ||
      value.type === "div")
  );
};

export const isValueAtom = (value?: ScriptValue): value is ScriptValueAtom => {
  return !!value && valueAtoms.includes(value.type as unknown as ValueAtom);
};
