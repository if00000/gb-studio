import promiseLimit from "lib/helpers/promiseLimit";
import getFileModifiedTime from "lib/helpers/fs/getModifiedTime";
import { assetFilename } from "shared/lib/helpers/assets";
import { readFileToSpriteTilesData } from "lib/sprites/readSpriteData";
import { EmoteData } from "shared/lib/entities/entitiesTypes";

type CompileEmoteOptions = {
  warnings: (msg: string) => void;
};

export type PrecompiledEmoteData = EmoteData & {
  data: Uint8Array;
  size: number;
  frames: number;
};

const emoteBuildCache: Record<
  string,
  {
    timestamp: number;
    data: Uint8Array;
  }
> = {};

const compileEmotes = async (
  emotes: EmoteData[],
  projectRoot: string,
  { warnings }: CompileEmoteOptions
): Promise<PrecompiledEmoteData[]> => {
  const emoteData = await promiseLimit(
    10,
    emotes.map((emote) => {
      return async (): Promise<PrecompiledEmoteData> => {
        const filename = assetFilename(projectRoot, "emotes", emote);
        const modifiedTime = await getFileModifiedTime(filename);
        let data;

        if (
          emoteBuildCache[emote.id] &&
          emoteBuildCache[emote.id].timestamp >= modifiedTime
        ) {
          data = emoteBuildCache[emote.id].data;
        } else {
          data = await readFileToSpriteTilesData(filename);
          emoteBuildCache[emote.id] = {
            data,
            timestamp: modifiedTime,
          };
        }

        const size = data.length;
        const frames = Math.ceil(size / 64);
        if (Math.ceil(size / 64) !== Math.floor(size / 64)) {
          warnings(
            `Emote '${emote.filename}' has invalid dimensions and may not appear correctly. Must be 16px tall and a multiple of 16px wide.`
          );
        }

        return {
          ...emote,
          data,
          size,
          frames,
        };
      };
    })
  );

  return emoteData;
};

export default compileEmotes;
