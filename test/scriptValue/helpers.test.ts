import { ScriptValue } from "../../src/lib/scriptValue/types";
import { optimiseScriptValue } from "../../src/lib/scriptValue/helpers";

test("should perform constant folding for addition", () => {
  const input: ScriptValue = {
    type: "add",
    valueA: {
      type: "number",
      value: 5,
    },
    valueB: {
      type: "number",
      value: 3,
    },
  };
  expect(optimiseScriptValue(input)).toEqual({
    type: "number",
    value: 8,
  });
});

test("should perform constant folding for subtraction", () => {
  const input: ScriptValue = {
    type: "sub",
    valueA: {
      type: "number",
      value: 5,
    },
    valueB: {
      type: "number",
      value: 3,
    },
  };
  expect(optimiseScriptValue(input)).toEqual({
    type: "number",
    value: 2,
  });
});

test("should perform constant folding for multiplication", () => {
  const input: ScriptValue = {
    type: "mul",
    valueA: {
      type: "number",
      value: 5,
    },
    valueB: {
      type: "number",
      value: 3,
    },
  };
  expect(optimiseScriptValue(input)).toEqual({
    type: "number",
    value: 15,
  });
});

test("should perform constant folding for division", () => {
  const input: ScriptValue = {
    type: "div",
    valueA: {
      type: "number",
      value: 21,
    },
    valueB: {
      type: "number",
      value: 3,
    },
  };
  expect(optimiseScriptValue(input)).toEqual({
    type: "number",
    value: 7,
  });
});

test("should round down to nearest int when constant folding for division", () => {
  const input: ScriptValue = {
    type: "div",
    valueA: {
      type: "number",
      value: 14,
    },
    valueB: {
      type: "number",
      value: 3,
    },
  };
  expect(optimiseScriptValue(input)).toEqual({
    type: "number",
    value: 4,
  });
});

test("should perform constant folding for greater than", () => {
  const input: ScriptValue = {
    type: "gt",
    valueA: {
      type: "number",
      value: 21,
    },
    valueB: {
      type: "number",
      value: 3,
    },
  };
  const input2: ScriptValue = {
    type: "gt",
    valueA: {
      type: "number",
      value: 3,
    },
    valueB: {
      type: "number",
      value: 21,
    },
  };
  expect(optimiseScriptValue(input)).toEqual({
    type: "number",
    value: 1,
  });
  expect(optimiseScriptValue(input2)).toEqual({
    type: "number",
    value: 0,
  });
});
