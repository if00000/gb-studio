import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SelectIcon,
  BrickIcon,
  EraserIcon,
  PlusIcon,
  PaintIcon,
} from "ui/icons/Icons";
import { MenuItem } from "ui/menu/Menu";
import l10n from "renderer/lib/l10n";
import { Tool } from "store/features/editor/editorState";
import editorActions from "store/features/editor/editorActions";
import { RootState } from "store/configureStore";
import styled from "styled-components";
import { Button } from "ui/buttons/Button";
import FloatingPanel from "ui/panels/FloatingPanel";
import { DropdownButton } from "ui/buttons/DropdownButton";

interface ToolPickerProps {
  hasFocusForKeyboardShortcuts: () => boolean;
}

const Wrapper = styled(FloatingPanel)`
  position: absolute;
  left: 10px;
  top: 10px;
`;

const ToolPicker = ({ hasFocusForKeyboardShortcuts }: ToolPickerProps) => {
  const dispatch = useDispatch();
  const selected = useSelector((state: RootState) => state.editor.tool);

  const isAddSelected = useMemo(() => {
    return ["actors", "triggers", "scene"].indexOf(selected) > -1;
  }, [selected]);

  const setTool = useCallback(
    (tool: Tool) => {
      dispatch(editorActions.setTool({ tool }));
    },
    [dispatch]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey || e.shiftKey || e.metaKey) {
        return;
      }
      if (!hasFocusForKeyboardShortcuts()) {
        return;
      }
      if (e.code === "KeyT") {
        setTool("triggers");
      } else if (e.code === "KeyA") {
        setTool("actors");
      } else if (e.code === "KeyC") {
        setTool("collisions");
      } else if (e.code === "KeyZ") {
        setTool("colors");
      } else if (e.code === "KeyS") {
        setTool("scene");
      } else if (e.code === "KeyE") {
        setTool("eraser");
      } else if (e.code === "KeyV") {
        setTool("select");
      } else if (e.code === "Escape") {
        setTool("select");
      }
    },
    [hasFocusForKeyboardShortcuts, setTool]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  const setToolActors = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      setTool("actors");
    },
    [setTool]
  );
  const setToolTriggers = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      setTool("triggers");
    },
    [setTool]
  );
  const setToolScene = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      setTool("scene");
    },
    [setTool]
  );
  const setToolSelect = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      setTool("select");
    },
    [setTool]
  );
  const setToolEraser = useCallback(() => setTool("eraser"), [setTool]);
  const setToolCollisions = useCallback(() => setTool("collisions"), [setTool]);
  const setToolColors = useCallback(() => setTool("colors"), [setTool]);

  return (
    <Wrapper vertical>
      <Button
        variant="transparent"
        onClick={setToolSelect}
        title={`${l10n("TOOL_SELECT_LABEL")} (v)`}
        active={selected === "select"}
      >
        <SelectIcon />
      </Button>
      <DropdownButton
        size="small"
        variant="transparent"
        menuDirection="left"
        offsetX={23}
        offsetY={-13}
        showArrow={false}
        label={<PlusIcon />}
        active={isAddSelected}
      >
        <MenuItem
          onClick={setToolActors}
          title={`${l10n("TOOL_ADD_ACTOR_LABEL")} (a)`}
        >
          {l10n("ACTOR")}
        </MenuItem>
        <MenuItem
          onClick={setToolTriggers}
          title={`${l10n("TOOL_ADD_TRIGGER_LABEL")} (t)`}
        >
          {l10n("TRIGGER")}
        </MenuItem>
        <MenuItem
          onClick={setToolScene}
          title={`${l10n("TOOL_ADD_SCENE_LABEL")} (s)`}
        >
          {l10n("SCENE")}
        </MenuItem>
      </DropdownButton>
      <Button
        variant="transparent"
        onClick={setToolEraser}
        title={`${l10n("TOOL_ERASER_LABEL")} (e)`}
        active={selected === "eraser"}
      >
        <EraserIcon />
      </Button>
      <Button
        variant="transparent"
        onClick={setToolCollisions}
        title={`${l10n("TOOL_COLLISIONS_LABEL")} (c)`}
        active={selected === "collisions"}
      >
        <BrickIcon />
      </Button>
      <Button
        variant="transparent"
        onClick={setToolColors}
        title={`${l10n("TOOL_COLORS_LABEL")} (z)`}
        active={selected === "colors"}
      >
        <PaintIcon />
      </Button>
    </Wrapper>
  );
};

export default ToolPicker;
