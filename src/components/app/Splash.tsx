import React, { useEffect, useState } from "react";
// import Path from "path";
// import { ipcRenderer, remote } from "electron";
// import settings from "electron-settings";
import FocusLock, { AutoFocusInside } from "react-focus-lock";
// import { FlexGrow } from "ui/spacing/Spacing";
// import {
//   SplashAppTitle,
//   SplashContent,
//   SplashCreateButton,
//   SplashCredits,
//   SplashCreditsBackground,
//   SplashCreditsCloseButton,
//   SplashCreditsContent,
//   SplashCreditsContributor,
//   SplashCreditsTitle,
//   SplashEasterEggButton,
//   SplashForm,
//   SplashInfoMessage,
//   SplashLogo,
//   SplashOpenButton,
//   SplashProject,
//   SplashProjectClearButton,
//   SplashScroll,
//   SplashSidebar,
//   SplashTab,
//   SplashTemplateSelect,
//   SplashWrapper,
// } from "ui/splash/Splash";
// import createProject, { ERR_PROJECT_EXISTS } from "lib/project/createProject";
import GlobalStyle from "ui/globalStyle";
import ThemeProvider from "ui/theme/ThemeProvider";
import logoFile from "ui/icons/GBStudioLogo.png";
// import { FormField, FormRow } from "ui/form/FormLayout";
// import { TextField } from "ui/form/TextField";
// import { CloseIcon, DotsIcon } from "ui/icons/Icons";
// import { Button } from "ui/buttons/Button";
// import l10n from "lib/helpers/l10n";
import contributors from "../../../contributors.json";
import gbs2Preview from "../../assets/templatePreview/gbs2.mp4";
import gbhtmlPreview from "../../assets/templatePreview/gbhtml.mp4";
import blankPreview from "../../assets/templatePreview/blank.png";
import useWindowFocus from "ui/hooks/use-window-focus";
import { Button } from "ui/buttons/Button";
import { CloseIcon, DotsIcon } from "ui/icons/Icons";
import {
  SplashAppTitle,
  SplashContent,
  SplashCreateButton,
  SplashCredits,
  SplashCreditsBackground,
  SplashCreditsCloseButton,
  SplashCreditsContent,
  SplashCreditsContributor,
  SplashCreditsTitle,
  SplashEasterEggButton,
  SplashForm,
  SplashInfoMessage,
  SplashLogo,
  SplashOpenButton,
  SplashProject,
  SplashProjectClearButton,
  SplashScroll,
  SplashSidebar,
  SplashTab,
  SplashTemplateSelect,
  SplashWrapper,
} from "ui/splash/Splash";
import { FlexGrow } from "ui/spacing/Spacing";
import SplashAPI from "../../app/splash/api";
import { FormRow, FormField } from "ui/form/FormLayout";
import { TextField } from "ui/form/TextField";
import { l10n } from "lib/renderer/api/l10n";
import API, { dialog, path, settings } from "lib/renderer/api/api";

// Make sure localisation has loaded so that
// l10n function can be used at top level
// initElectronL10n();

declare const DOCS_URL: string;

type ProjectInfo = {
  name: string;
  dir: string;
  path: string;
};

type TemplateInfo = {
  id: string;
  name: string;
  preview: string;
  videoPreview: boolean;
  description: string;
};

const splashTabs = ["new", "recent"] as const;
type SplashTabSection = typeof splashTabs[number];

const templates: TemplateInfo[] = [
  {
    id: "gbs2",
    name: l10n("SPLASH_SAMPLE_PROJECT"),
    preview: gbs2Preview,
    videoPreview: true,
    description: l10n("SPLASH_SAMPLE_PROJECT_DESCRIPTION"),
  },
  {
    id: "gbhtml",
    name: `${l10n("SPLASH_SAMPLE_PROJECT")} (GBS 1.0)`,
    preview: gbhtmlPreview,
    videoPreview: true,
    description: l10n("SPLASH_SAMPLE_PROJECT_ORIGINAL_DESCRIPTION"),
  },
  {
    id: "blank",
    name: l10n("SPLASH_BLANK_PROJECT"),
    preview: blankPreview,
    videoPreview: false,
    description: l10n("SPLASH_BLANK_PROJECT_DESCRIPTION"),
  },
];

const getLastUsedPath = async () => {
  console.log("GET LAST UYSED");
  const storedPath = await settings.get("__lastUsedPath");
  console.log("GET LAST UYSED 2");
  console.log("GET LAST UYSED 3", storedPath);

  if (storedPath) {
    console.log("STORED PATH", storedPath);
    return path.normalize(storedPath);
  }
  console.log("DOC PATH", path.getDocumentsPath());

  return path.getDocumentsPath();
};

const setLastUsedPath = (path: string) => {
  settings.set("__lastUsedPath", path);
};

const getLastUsedTab = async () => {
  return String(await settings.get("__lastUsedSplashTab")) || "info";
};

const setLastUsedTab = (tab: string) => {
  settings.set("__lastUsedSplashTab", tab);
};

const toSplashTab = (tab: string): SplashTabSection => {
  if (splashTabs.indexOf(tab as unknown as SplashTabSection) > -1) {
    return tab as SplashTabSection;
  }
  return "new";
};

export default () => {
  const [templateId, setTemplateId] = useState("gbs2");
  const [section, setSection] = useState<SplashTabSection>("new");
  const [openCredits, setOpenCredits] = useState(false);
  const [recentProjects, setRecentProjects] = useState<ProjectInfo[]>([]);
  const [name, setName] = useState<string>(l10n("SPLASH_DEFAULT_PROJECT_NAME"));
  const [dirPath, setPath] = useState<string>("");
  const [nameError, setNameError] = useState("");
  const [pathError, setPathError] = useState("");
  const [creating, setCreating] = useState(false);
  const windowFocus = useWindowFocus();

  useEffect(() => {
    async function fetchData() {
      setRecentProjects(
        (await API.project.getRecentProjects())
          .map((projectPath) => ({
            name: path.basename(projectPath),
            dir: path.dirname(projectPath),
            path: projectPath,
          }))
          .reverse()
      );
      setPath(await getLastUsedPath());
      const urlParams = new URLSearchParams(window.location.search);
      const forceTab = urlParams.get("tab");
      const initialTab = toSplashTab(forceTab || (await getLastUsedTab()));
      setSection(initialTab);
    }
    fetchData();
  }, []);

  const onSetTab = (tab: SplashTabSection) => () => {
    setSection(tab);
    setLastUsedTab(tab);
  };

  const onOpen = () => {
    API.project.openProjectFilePicker();
  };

  const onOpenRecent = (projectPath: string) => async () => {
    await API.project.openProject(projectPath);
  };

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.currentTarget.value;
    setName(newName);
    setNameError("");
  };

  const onChangeDirPath = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPath = e.currentTarget.value;
    setLastUsedPath(newPath);
    setPath(newPath);
    setPathError("");
  };

  const onSelectFolder = async () => {
    const directory = await dialog.chooseDirectory();
    if (directory) {
      setLastUsedPath(directory);
      setPath(directory);
      setPathError("");
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name) {
      setNameError(l10n("ERROR_PLEASE_ENTER_PROJECT_NAME"));
      return;
    }
    if (!dirPath) {
      setPathError(l10n("ERROR_PLEASE_ENTER_PROJECT_PATH"));
      return;
    }
    try {
      setCreating(true);
      await API.project.createProject(
        {
          name,
          template: templateId,
          path: dirPath,
        },
        {
          openOnSuccess: true,
        }
      );
    } catch (err) {
      console.error(err);
      // @TODO Fix project create error handling
      /*
      if (err === ERR_PROJECT_EXISTS) {
        setNameError(l10n("ERROR_PROJECT_ALREADY_EXISTS"));
        setCreating(false);
      } else if (
        String(err.message).startsWith("ENOTDIR") ||
        String(err.message).startsWith("EEXIST")
      ) {
        setPathError(l10n("ERROR_PROJECT_PATH_INVALID"));
        setCreating(false);
      } else {
        setPathError(err.message);
        setCreating(false);
      }
      */
    }
  };

  const clearRecent = () => {
    // setRecentProjects([]);
    // ipcRenderer.send("clear-recent-projects");
  };

  return (
    <ThemeProvider>
      <GlobalStyle />
      <SplashWrapper focus={windowFocus}>
        <SplashSidebar>
          <SplashLogo>
            <img src={logoFile} alt="GB Studio" />
            <SplashEasterEggButton onClick={() => setOpenCredits(true)} />
          </SplashLogo>
          <SplashAppTitle />
          <SplashTab selected={section === "new"} onClick={onSetTab("new")}>
            {l10n("SPLASH_NEW")}
          </SplashTab>
          <SplashTab
            selected={section === "recent"}
            onClick={onSetTab("recent")}
          >
            {l10n("SPLASH_RECENT")}
          </SplashTab>
          <SplashTab onClick={() => SplashAPI.openExternal(DOCS_URL)}>
            {l10n("SPLASH_DOCUMENTATION")}
          </SplashTab>
          <FlexGrow />
          <SplashOpenButton onClick={onOpen}>
            {l10n("SPLASH_OPEN")}
          </SplashOpenButton>
        </SplashSidebar>

        {section === "new" && (
          <SplashContent>
            <SplashForm onSubmit={!creating ? onSubmit : undefined}>
              <FormRow>
                <TextField
                  name="name"
                  label={l10n("SPLASH_PROJECT_NAME")}
                  errorLabel={nameError}
                  size="large"
                  value={name}
                  onChange={onChangeName}
                />
              </FormRow>
              <FormRow>
                <TextField
                  name="path"
                  label={l10n("SPLASH_PATH")}
                  errorLabel={pathError}
                  size="large"
                  value={dirPath}
                  onChange={onChangeDirPath}
                  additionalRight={
                    <Button onClick={onSelectFolder} type="button">
                      <DotsIcon />
                    </Button>
                  }
                />
              </FormRow>
              <FormRow>
                <FormField
                  name="template"
                  label={l10n("SPLASH_PROJECT_TEMPLATE")}
                >
                  <SplashTemplateSelect
                    name="template"
                    templates={templates}
                    value={templateId}
                    onChange={setTemplateId}
                  />
                </FormField>
              </FormRow>
              <FlexGrow />
              <SplashCreateButton>
                <Button variant="primary" size="large">
                  {creating ? l10n("SPLASH_CREATING") : l10n("SPLASH_CREATE")}
                </Button>
              </SplashCreateButton>
            </SplashForm>
          </SplashContent>
        )}

        {section === "recent" && (
          <SplashScroll>
            {recentProjects.map((project, index) => (
              <SplashProject
                key={index}
                project={project}
                onClick={onOpenRecent(project.path)}
              />
            ))}

            {recentProjects.length > 0 ? (
              <SplashProjectClearButton>
                <Button onClick={clearRecent}>
                  {l10n("SPLASH_CLEAR_RECENT")}
                </Button>
              </SplashProjectClearButton>
            ) : (
              <SplashInfoMessage>
                {l10n("SPLASH_NO_RECENT_PROJECTS")}
              </SplashInfoMessage>
            )}
          </SplashScroll>
        )}
      </SplashWrapper>

      {openCredits && (
        <FocusLock>
          <SplashCredits>
            <SplashCreditsBackground />
            <SplashCreditsContent>
              <SplashCreditsTitle>GB Studio</SplashCreditsTitle>
              {contributors.map((contributor) => (
                <SplashCreditsContributor
                  key={contributor.id}
                  contributor={contributor}
                  onClick={() => SplashAPI.openExternal(contributor.html_url)}
                />
              ))}
            </SplashCreditsContent>
            <SplashCreditsCloseButton>
              <AutoFocusInside>
                <Button
                  variant="transparent"
                  onClick={() => setOpenCredits(false)}
                >
                  <CloseIcon />
                </Button>
              </AutoFocusInside>
            </SplashCreditsCloseButton>
          </SplashCredits>
        </FocusLock>
      )}
    </ThemeProvider>
  );
};
