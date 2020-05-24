/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { clipboard } from "electron";
import { connect } from "react-redux";
import * as actions from "../../actions";
import BackgroundSelect from "../forms/BackgroundSelect";
import { FormField, ToggleableFormField } from "../library/Forms";
import ScriptEditor from "../script/ScriptEditor";
import castEventValue from "../../lib/helpers/castEventValue";
import { DropdownButton } from "../library/Button";
import { MenuItem, MenuDivider } from "../library/Menu";
import l10n from "../../lib/helpers/l10n";
import Sidebar, { SidebarHeading, SidebarColumn, SidebarTabs } from "./Sidebar";
import { SceneShape } from "../../reducers/stateShape";
import SceneNavigation from "./SceneNavigation";
import WorldEditor from "./WorldEditor";
import PaletteSelect, { DMG_PALETTE } from "../forms/PaletteSelect";
import { getSettings } from "../../reducers/entitiesReducer";
import rerenderCheck from "../../lib/helpers/reactRerenderCheck";
import LabelButton from "../library/LabelButton";

class SceneEditor extends Component {
  constructor() {
    super();
    this.state = {
      clipboardActor: null,
      clipboardScene: null,
      clipboardTrigger: null,
    };
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   rerenderCheck("SceneEditor", this.props, {}, nextProps, {});
  //   return true;
  // }

  onEdit = (key) => (e) => {
    const { editScene, scene } = this.props;
    editScene(scene.id, {
      [key]: castEventValue(e),
    });
  };

  onCopy = (e) => {
    const { copyScene, scene } = this.props;
    copyScene(scene);
  };

  onPaste = (e) => {
    const { setScenePrefab } = this.props;
    const { clipboardScene } = this.state;
    setScenePrefab(clipboardScene);
  };

  onPasteActor = (e) => {
    const { setActorPrefab } = this.props;
    const { clipboardActor } = this.state;
    setActorPrefab(clipboardActor);
  };

  onPasteTrigger = (e) => {
    const { setTriggerPrefab } = this.props;
    const { clipboardTrigger } = this.state;
    setTriggerPrefab(clipboardTrigger);
  };

  onEditScript = this.onEdit("script");

  readClipboard = (e) => {
    try {
      const clipboardData = JSON.parse(clipboard.readText());
      if (clipboardData.__type === "actor") {
        this.setState({
          clipboardActor: clipboardData,
          clipboardTrigger: null,
          clipboardScene: null,
        });
      } else if (clipboardData.__type === "trigger") {
        this.setState({
          clipboardActor: null,
          clipboardTrigger: clipboardData,
          clipboardScene: null,
        });
      } else if (clipboardData.__type === "scene") {
        this.setState({
          clipboardActor: null,
          clipboardTrigger: null,
          clipboardScene: clipboardData,
        });
      } else {
        this.setState({
          clipboardActor: null,
          clipboardTrigger: null,
          clipboardScene: null,
        });
      }
    } catch (err) {
      this.setState({
        clipboardActor: null,
        clipboardTrigger: null,
        clipboardScene: null,
      });
    }
  };

  onRemove = (e) => {
    const { removeScene, scene } = this.props;
    removeScene(scene.id);
  };


  renderScriptHeader = ({ buttons }) => {
    return (
      <SidebarTabs
        values={{
          init: l10n("SIDEBAR_ON_INIT"),
        }}
        buttons={buttons}
      />
    );
  };

  onEditPaletteId = (index) => (e) => {
    const { scene } = this.props;
    const paletteIds = scene.paletteIds ? [...scene.paletteIds] : [];
    paletteIds[index] = castEventValue(e);
    this.onEdit("paletteIds")(paletteIds);
  };

  render() {
    const {
      scene,
      sceneIndex,
      selectSidebar,
      colorsEnabled,
      defaultBackgroundPaletteIds,
    } = this.props;

    if (!scene) {
      return <WorldEditor />;
    }

    const { clipboardScene, clipboardActor, clipboardTrigger } = this.state;

    return (
      <Sidebar onMouseDown={selectSidebar}>
        <SidebarColumn>
          <SidebarHeading
            title={l10n("SCENE")}
            buttons={
              <DropdownButton
                small
                transparent
                right
                onMouseDown={this.readClipboard}
              >
                <MenuItem style={{paddingRight: 10, marginBottom: 5}}>
                  <div style={{display:"flex"}}>
                    <div style={{marginRight: 5}}>
                      <LabelButton onClick={() => this.onEdit("labelColor")("")} />
                    </div>
                    {["red", "orange", "yellow", "green", "blue", "purple", "gray"].map((color) =>
                      <div key={color} style={{marginRight: color === "gray" ? 0 : 5}}>
                        <LabelButton color={color} onClick={() => this.onEdit("labelColor")(color)} />
                      </div>
                    )}
                  </div>
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={this.onCopy}>
                  {l10n("MENU_COPY_SCENE")}
                </MenuItem>
                {clipboardScene && (
                  <MenuItem onClick={this.onPaste}>
                    {l10n("MENU_PASTE_SCENE")}
                  </MenuItem>
                )}
                {clipboardActor && (
                  <MenuItem onClick={this.onPasteActor}>
                    {l10n("MENU_PASTE_ACTOR")}
                  </MenuItem>
                )}
                {clipboardTrigger && (
                  <MenuItem onClick={this.onPasteTrigger}>
                    {l10n("MENU_PASTE_TRIGGER")}
                  </MenuItem>
                )}
                <MenuDivider />
                <MenuItem onClick={this.onRemove}>
                  {l10n("MENU_DELETE_SCENE")}
                </MenuItem>
              </DropdownButton>
            }
          />
          <div>
            <FormField>
              <label htmlFor="sceneName">
                {l10n("FIELD_NAME")}
                <input
                  id="sceneName"
                  placeholder={`Scene ${sceneIndex + 1}`}
                  value={scene.name}
                  onChange={this.onEdit("name")}
                />
              </label>
            </FormField>

            <FormField>
              <label htmlFor="sceneType">
                {l10n("FIELD_TYPE")}
                <select
                  id="sceneType"
                  value={scene.type}
                  onChange={this.onEdit("type")}
                >
                  <option value="0">Top Down 2D</option>
                  <option value="1">Platformer</option>
                  <option value="2">Adventure</option>
                  <option value="3">Shoot Em' Up</option>
                </select>
              </label>
            </FormField>

            {/* Scene type specific values - movement speed / jump speed / read from Variable? */}

            <FormField>
              <label htmlFor="sceneImage">
                {l10n("FIELD_BACKGROUND")}
                <BackgroundSelect
                  id="sceneImage"
                  value={scene.backgroundId}
                  onChange={this.onEdit("backgroundId")}
                />
              </label>
            </FormField>

            {colorsEnabled && (
              <ToggleableFormField
                htmlFor="scenePalette"
                closedLabel={l10n("FIELD_PALETTES")}
                label={l10n("FIELD_PALETTES")}
                open={!!scene.paletteIds && scene.paletteIds.filter((i) => i).length > 0}
              >
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <PaletteSelect
                    key={index}
                    id="scenePalette"
                    value={(scene.paletteIds && scene.paletteIds[index]) || ""}
                    prefix={`${index + 1}: `}
                    onChange={this.onEditPaletteId(index)}
                    optional
                    optionalDefaultPaletteId={defaultBackgroundPaletteIds[index] || ""}
                    optionalLabel={l10n("FIELD_GLOBAL_DEFAULT")}
                  />
                ))}
              </ToggleableFormField>
            )}

            <ToggleableFormField
              htmlFor="sceneNotes"
              closedLabel={l10n("FIELD_ADD_NOTES")}
              label={l10n("FIELD_NOTES")}
              open={!!scene.notes}
            >
              <textarea
                id="sceneNotes"
                value={scene.notes || ""}
                placeholder={l10n("FIELD_NOTES")}
                onChange={this.onEdit("notes")}
                rows={3}
              />
            </ToggleableFormField>
          </div>

          <SceneNavigation sceneId={scene.id} />
        </SidebarColumn>

        <SidebarColumn>
          <ScriptEditor
            value={scene.script}
            renderHeader={this.renderScriptHeader}
            type="scene"
            onChange={this.onEditScript}
            entityId={scene.id}
          />
        </SidebarColumn>
      </Sidebar>
    );
  }
}

SceneEditor.propTypes = {
  scene: SceneShape,
  sceneIndex: PropTypes.number.isRequired,
  editScene: PropTypes.func.isRequired,
  removeScene: PropTypes.func.isRequired,
  copyScene: PropTypes.func.isRequired,
  setScenePrefab: PropTypes.func.isRequired,
  setActorPrefab: PropTypes.func.isRequired,
  setTriggerPrefab: PropTypes.func.isRequired,
  selectSidebar: PropTypes.func.isRequired,
};

SceneEditor.defaultProps = {
  scene: null,
};

function mapStateToProps(state, props) {
  const scene = state.entities.present.entities.scenes[props.id];
  const sceneIndex = state.entities.present.result.scenes.indexOf(props.id);
  const settings = getSettings(state);
  const colorsEnabled = settings.customColorsEnabled;
  const defaultBackgroundPaletteIds =
    settings.defaultBackgroundPaletteIds || [];
  return {
    sceneIndex,
    scene,
    colorsEnabled,
    defaultBackgroundPaletteIds,
  };
}

const mapDispatchToProps = {
  editScene: actions.editScene,
  removeScene: actions.removeScene,
  selectActor: actions.selectActor,
  selectTrigger: actions.selectTrigger,
  copyScene: actions.copyScene,
  setScenePrefab: actions.setScenePrefab,
  setActorPrefab: actions.setActorPrefab,
  setTriggerPrefab: actions.setTriggerPrefab,
  selectSidebar: actions.selectSidebar,
};

export default connect(mapStateToProps, mapDispatchToProps)(SceneEditor);
