export type ScriptValue =
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
    }
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
      type: "rnd";
      valueA?: ScriptValue;
      valueB?: ScriptValue;
    };

export type ValueFunction = "add" | "sub" | "mul" | "div" | "rnd";
export type ValueAtom = "number" | "variable" | "property" | "expression";

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
