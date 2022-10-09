import { PropertySelect } from "components/forms/PropertySelect";
import { VariableSelect } from "components/forms/VariableSelect";
import React, { useCallback, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { DropdownButton } from "ui/buttons/DropdownButton";
import { InputGroup, InputGroupPrepend } from "ui/form/InputGroup";
import { NumberInput } from "ui/form/NumberInput";
import {
  ActorIcon,
  BlankIcon,
  CheckIcon,
  CrossIcon,
  DivideIcon,
  ExpressionIcon,
  MinusIcon,
  NumberIcon,
  PlusIcon,
  VariableIcon,
} from "ui/icons/Icons";
import {
  MenuAccelerator,
  MenuDivider,
  MenuItem,
  MenuItemIcon,
} from "ui/menu/Menu";
import ScriptEventFormMathArea from "./ScriptEventFormMatharea";

type ScriptValue =
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

type ValueFunction = "add" | "sub" | "mul" | "div";
type ValueAtom = "number" | "variable" | "property" | "expression";

type ValueFunctionMenuItem = {
  value: ValueFunction;
  label: string;
  symbol: string;
};

const functionSymbolLookup: Record<ValueFunction, string> = {
  add: "+",
  sub: "-",
  mul: "*",
  div: "/",
};

const functionIconLookup: Record<ValueFunction, JSX.Element> = {
  add: <PlusIcon />,
  sub: <MinusIcon />,
  mul: <CrossIcon />,
  div: <DivideIcon />,
};

const atomIconLookup: Record<ValueAtom, JSX.Element> = {
  number: <NumberIcon />,
  variable: <VariableIcon />,
  property: <ActorIcon />,
  expression: <ExpressionIcon />,
};

const functionMenuItems: ValueFunctionMenuItem[] = [
  {
    value: "add",
    label: "Add",
    symbol: functionSymbolLookup["add"],
  },
  {
    value: "sub",
    label: "Subtract",
    symbol: functionSymbolLookup["sub"],
  },
  {
    value: "mul",
    label: "Multiply",
    symbol: functionSymbolLookup["mul"],
  },
  {
    value: "div",
    label: "Divide",
    symbol: functionSymbolLookup["div"],
  },
];

const Wrapper = styled.div`
  display: flex;
  //   flex-basis: 300px;
`;

const OperatorWrapper = styled.div`
  padding: 0 5px;
`;

interface ValueWrapperProps {
  hover?: boolean;
}

const ValueWrapper = styled.div<ValueWrapperProps>`
  display: flex;
  flex-grow: 1;
  align-items: center;
  min-width: 98px;
  flex-basis: 130px;
`;

const FunctionWrapper = styled.div<ValueWrapperProps>`
  display: flex;
  align-items: center;
  padding: 0px 5px;
  border-radius: 8px;
  flex-wrap: wrap;
  flex-grow: 1;

  > * {
    margin: 2.5px 0;
  }

  //   background: rgba(0, 0, 0, 0.1);
  border-left: 2px solid #ccc;
  border-right: 2px solid #ccc;

  ${(props) =>
    props.hover
      ? css`
          background: #eee;
        `
      : ""}
`;

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

  return false;
};

interface ValueSelectProps {
  name: string;
  entityId: string;
  value?: ScriptValue;
  onChange: (newValue: ScriptValue | undefined) => void;
  innerValue?: boolean;
}

type ScriptValueFunction = ScriptValue & { type: ValueFunction };

const isValueFunction = (value?: ScriptValue): value is ScriptValueFunction => {
  return (
    !!value &&
    (value.type === "add" ||
      value.type === "sub" ||
      value.type === "mul" ||
      value.type === "div")
  );
};

const ValueSelect = ({
  name,
  entityId,
  value = { type: "number", value: 0 },
  onChange,
  innerValue,
}: ValueSelectProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const isValueFn = isValueFunction(value);

  const focus = useCallback(() => {
    setTimeout(() => {
      document.getElementById(name)?.focus();
    }, 150);
  }, [name]);

  const focusSecondChild = useCallback(() => {
    setTimeout(() => {
      document.getElementById(`${name}_valueB`)?.focus();
    }, 150);
  }, [name]);

  const menu = useMemo(
    () => [
      ...(!isValueFn
        ? [
            <MenuItem
              key="number"
              onClick={() => {
                onChange({
                  type: "number",
                  value: 0,
                });
              }}
            >
              <MenuItemIcon>
                {value.type === "number" ? <CheckIcon /> : <BlankIcon />}
              </MenuItemIcon>
              Number
            </MenuItem>,
            <MenuItem
              key="variable"
              onClick={() => {
                onChange({
                  type: "variable",
                  value: "0",
                });
              }}
            >
              <MenuItemIcon>
                {value.type === "variable" ? <CheckIcon /> : <BlankIcon />}
              </MenuItemIcon>
              Variable
              <MenuAccelerator accelerator="$" />
            </MenuItem>,
            <MenuItem
              key="property"
              onClick={() => {
                onChange({
                  type: "property",
                  value: "",
                });
              }}
            >
              <MenuItemIcon>
                {value.type === "property" ? <CheckIcon /> : <BlankIcon />}
              </MenuItemIcon>
              Property
            </MenuItem>,
            <MenuItem
              key="expression"
              onClick={() => {
                onChange({
                  type: "expression",
                  value: "",
                });
              }}
            >
              <MenuItemIcon>
                {value.type === "expression" ? <CheckIcon /> : <BlankIcon />}
              </MenuItemIcon>
              Expression
            </MenuItem>,
            <MenuDivider key="divider" />,
          ]
        : []),
      ...functionMenuItems.map((functionMenuItem) => (
        <MenuItem
          key={functionMenuItem.value}
          onClick={() => {
            if (isValueFunction(value)) {
              onChange({
                type: functionMenuItem.value,
                valueA: value.valueA,
                valueB: value.valueB,
              });
              focus();
            } else {
              onChange({
                type: functionMenuItem.value,
                valueA: value,
                valueB: undefined,
              });
              focusSecondChild();
            }
          }}
        >
          <MenuItemIcon>
            {value.type === functionMenuItem.value ? (
              <CheckIcon />
            ) : (
              <BlankIcon />
            )}
          </MenuItemIcon>
          {functionMenuItem.label}
          <MenuAccelerator accelerator={functionMenuItem.symbol} />
        </MenuItem>
      )),
    ],
    [focus, focusSecondChild, isValueFn, onChange, value]
  );

  let input: JSX.Element | null = null;
  if (value.type === "number") {
    input = (
      <ValueWrapper>
        <InputGroup>
          <InputGroupPrepend>
            <DropdownButton
              label={atomIconLookup[value.type]}
              size="small"
              showArrow={false}
            >
              {menu}
            </DropdownButton>
          </InputGroupPrepend>
          <NumberInput
            id={name}
            type="number"
            value={String(
              value.value !== undefined && value.value !== null
                ? value.value
                : ""
            )}
            // min={field.min}
            // max={field.max}
            // step={field.step}
            // placeholder={String(field.placeholder || defaultValue)}
            onChange={(e) => {
              onChange({
                type: "number",
                value: parseInt(e.currentTarget.value),
              });
            }}
            onKeyDown={(e) => {
              console.log(
                e.key,
                e.currentTarget.value,
                (e.target as any).selectionStart,
                e.currentTarget.selectionEnd,
                window.getSelection()?.getRangeAt(0).startOffset,
                window.getSelection()?.getRangeAt(0)
              );
              if (e.key === "$") {
                onChange({
                  type: "variable",
                  value: "0",
                });
                focus();
              } else if (e.key === "+") {
                onChange({
                  type: "add",
                  valueA: value,
                  valueB: undefined,
                });
                focusSecondChild();
              } else if (e.key === "-") {
                // Don't add shortcut for sub
                // until we can figure out how to stop it
                // when you're trying to input a negative number
                // onChange({
                //   type: "sub",
                //   valueA: value,
                //   valueB: undefined,
                // });
                // focusSecondChild();
              } else if (e.key === "*") {
                onChange({
                  type: "mul",
                  valueA: value,
                  valueB: undefined,
                });
                focusSecondChild();
              } else if (e.key === "/") {
                onChange({
                  type: "div",
                  valueA: value,
                  valueB: undefined,
                });
                focusSecondChild();
              }
            }}
            // units={(args[field.unitsField || ""] || field.unitsDefault) as UnitType}
            // unitsAllowed={field.unitsAllowed}
            // onChangeUnits={onChangeUnits}
          />
        </InputGroup>
      </ValueWrapper>
    );
  }
  if (value.type === "variable") {
    input = (
      <ValueWrapper>
        <InputGroup>
          <InputGroupPrepend>
            <DropdownButton
              label={atomIconLookup[value.type]}
              size="small"
              showArrow={false}
            >
              {menu}
            </DropdownButton>
          </InputGroupPrepend>
          <VariableSelect
            // id={name}
            name={name}
            entityId={entityId}
            value={value.value}
            onChange={(newValue) => {
              onChange({
                type: "variable",
                value: newValue,
              });
            }}
          />
        </InputGroup>
      </ValueWrapper>
    );
  }
  if (value.type === "property") {
    input = (
      <ValueWrapper>
        <InputGroup>
          <InputGroupPrepend>
            <DropdownButton
              label={atomIconLookup[value.type]}
              size="small"
              showArrow={false}
            >
              {menu}
            </DropdownButton>
          </InputGroupPrepend>
          <PropertySelect
            name={name}
            value={value.value}
            onChange={(newValue) => {
              onChange({
                type: "property",
                value: newValue,
              });
            }}

            //   units={
            //     (args[field.unitsField || ""] || field.unitsDefault) as UnitType
            //   }
            //   unitsAllowed={field.unitsAllowed}
            //   onChangeUnits={onChangeUnits}
          />
        </InputGroup>
      </ValueWrapper>
    );
  }
  if (value.type === "expression") {
    input = (
      <ValueWrapper>
        <InputGroup>
          <InputGroupPrepend>
            <DropdownButton
              label={atomIconLookup[value.type]}
              size="small"
              showArrow={false}
            >
              {menu}
            </DropdownButton>
          </InputGroupPrepend>
          <ScriptEventFormMathArea
            id={name}
            value={value.value}
            placeholder="e.g. $health >= 0..."
            onChange={(newExpression: string) => {
              onChange({
                type: "expression",
                value: newExpression,
              });
            }}
            entityId={entityId}
          />
        </InputGroup>
      </ValueWrapper>
    );
  }
  if (isValueFunction(value)) {
    input = (
      <FunctionWrapper
        hover={isHovered}
        onMouseOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsHovered(true);
        }}
        onMouseOut={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsHovered(false);
        }}
      >
        <ValueSelect
          name={`${name}_valueA`}
          entityId={entityId}
          value={value.valueA}
          onChange={(newValue) => {
            onChange({
              ...value,
              valueA: newValue,
            });
          }}
          innerValue
        />
        <OperatorWrapper>
          <DropdownButton
            id={name}
            label={functionIconLookup[value.type]}
            showArrow={false}
            variant="transparent"
            size="small"
          >
            {menu}
            <MenuDivider />
            <MenuItem
              onClick={() => {
                onChange(value.valueA);
                focus();
              }}
            >
              <MenuItemIcon>
                <BlankIcon />
              </MenuItemIcon>
              Remove
            </MenuItem>
          </DropdownButton>
        </OperatorWrapper>
        <ValueSelect
          name={`${name}_valueB`}
          entityId={entityId}
          value={value.valueB}
          onChange={(newValue) => {
            onChange({
              ...value,
              valueB: newValue,
            });
          }}
          innerValue
        />
      </FunctionWrapper>
    );
  }

  if (innerValue) {
    return input;
  }

  return <Wrapper>{input}</Wrapper>;
};

export default ValueSelect;
