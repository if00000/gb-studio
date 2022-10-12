import { PropertySelectWrapper } from "components/forms/PropertySelect";
import { VariableSelectWrapper } from "components/forms/VariableSelect";
import styled from "styled-components";
import { Button } from "ui/buttons/Button";
import { DropdownButtonWrapper } from "ui/buttons/DropdownButton";
import { Input } from "./Input";
import { MathTextareaWrapper } from "./MathTextarea";
import { NumberInputWrapper } from "./NumberInput";

export const InputGroup = styled.div`
  display: flex;
  width: 100%;
  ${Input} {
    &:not(:first-child) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    &:not(:last-child) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  ${NumberInputWrapper} {
    &:not(:first-child) {
      input {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
    &:not(:last-child) {
      input {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
  }

  ${VariableSelectWrapper} {
    &:not(:first-child) {
      .CustomSelect__control {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
    &:not(:last-child) {
      .CustomSelect__control {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
  }

  ${PropertySelectWrapper} {
    &:not(:first-child) {
      .CustomSelect__control {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
    &:not(:last-child) {
      .CustomSelect__control {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
  }

  ${MathTextareaWrapper} {
    &:not(:first-child) {
      .MentionsInput__input {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
    &:not(:last-child) {
      .MentionsInput__input {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
  }

  .DirectionPicker {
    &:not(:first-child) {
      .DirectionPicker__Button--Left {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
    &:not(:last-child) {
      .DirectionPicker__Button--Right {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
  }
`;

export const InputGroupPrepend = styled.div`
  ${Button} {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: 0;
    height: 100%;
  }
  ${DropdownButtonWrapper} {
    height: 100%;
  }
`;

export const InputGroupAppend = styled.div`
  ${Button} {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: 0;
    height: 100%;
  }
  ${DropdownButtonWrapper} {
    height: 100%;
  }
`;
