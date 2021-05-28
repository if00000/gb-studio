import {
  DutyInstrument,
  NoiseInstrument,
  WaveInstrument,
} from "../../../../store/features/trackerDocument/trackerDocumentTypes";
import { PatternCell } from "./PatternCell";

export class Song {
  name: string;
  artist: string;
  comment: string;
  filename: string;
  duty_instruments: DutyInstrument[];
  wave_instruments: WaveInstrument[];
  noise_instruments: NoiseInstrument[];
  waves: Uint8Array[];
  ticks_per_row: number;
  patterns: PatternCell[][][];
  sequence: number[];

  constructor() {
    this.name = "";
    this.artist = "";
    this.comment = "";
    this.filename = "song";

    this.duty_instruments = [];
    this.wave_instruments = [];
    this.noise_instruments = [];
    this.waves = [];
    this.ticks_per_row = 6;

    this.patterns = [];
    this.sequence = [];
  }

  addDutyInstrument(instrument: DutyInstrument) {
    const list = this.duty_instruments;
    instrument.index = list.length;
    list.push(instrument);
  }

  addWaveInstrument(instrument: WaveInstrument) {
    const list = this.wave_instruments;
    instrument.index = list.length;
    list.push(instrument);
  }

  addNoiseInstrument(instrument: NoiseInstrument) {
    const list = this.noise_instruments;
    instrument.index = list.length;
    list.push(instrument);
  }

  usesInstrument(type: string, index: number) {
    let cols: number[] = [];
    if (type === "duty") {
      cols = [0, 1];
    }
    if (type === "wave") {
      cols = [2];
    }
    if (type === "noise") {
      cols = [3];
    }

    for (const pattern of this.patterns) {
      for (const row of pattern) {
        for (const col of cols) {
          if (row[col].instrument === index) return true;
        }
      }
    }
    return false;
  }

  removeInstrument(type: string, index: number) {
    let list: (DutyInstrument | WaveInstrument | NoiseInstrument)[] = [];
    let cols: number[] = [];
    if (type === "duty") {
      list = this.duty_instruments;
      cols = [0, 1];
    }
    if (type === "wave") {
      list = this.wave_instruments;
      cols = [2];
    }
    if (type === "noise") {
      list = this.noise_instruments;
      cols = [3];
    }

    for (const pattern of this.patterns) {
      for (const row of pattern) {
        for (const col of cols) {
          const instrumentIndex = row[col].instrument;
          if (instrumentIndex) {
            if (instrumentIndex == index) {
              row[col].instrument = null;
            }
            if (instrumentIndex > index) {
              row[col].instrument = instrumentIndex - 1;
            }
          }
        }
      }
    }

    list.splice(index, 1);
    for (let idx = 0; idx < list.length; idx++) {
      list[idx].index = idx;
    }
  }

  addNewPattern() {
    const pattern = [];
    for (let n = 0; n < 64; n++)
      pattern.push([
        new PatternCell(),
        new PatternCell(),
        new PatternCell(),
        new PatternCell(),
      ]);
    this.patterns.push(pattern);
    return this.patterns.length - 1;
  }
}

export function createDefaultSong() {
  const song = new Song();

  song.addNewPattern();
  song.sequence = [0];

  const sweeps: [number, string][] = [
    [0, ""],
    [-7, " plink"],
  ];
  const duties: [number, string][] = [
    [0, "12.5%"],
    [1, "25%"],
    [2, "50%"],
    [3, "75%"],
  ];

  for (const [sweep_value, sweep_name] of sweeps) {
    for (const [duty_value, duty_name] of duties) {
      const i = {
        name: `Duty ${duty_name}${sweep_name}`,
        duty_cycle: duty_value,
        volume_sweep_change: sweep_value,
      } as DutyInstrument;
      song.addDutyInstrument(i);
    }
  }

  const waves: [number, string][] = [
    [0, "Square wave 12.5%"],
    [1, "Square wave 25%"],
    [2, "Square wave 50%"],
    [3, "Square wave 75%"],
    [4, "Sawtooth wave"],
    [5, "Triangle wave"],
    [6, "Sine wave"],
    [7, "Toothy"],
    [8, "Triangle Toothy"],
    [9, "Pointy"],
    [10, "Strange"],
  ];

  for (const [wave_index, wave_name] of waves) {
    const i = {
      name: `${wave_name}`,
      wave_index: wave_index,
    } as WaveInstrument;
    song.addWaveInstrument(i);
  }

  song.addNoiseInstrument({ name: "Noise" } as NoiseInstrument);

  song.waves.push(
    new Uint8Array([
      0x0, 0x0, 0x0, 0x0, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf,
      0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf,
      0xf, 0xf,
    ])
  );
  song.waves.push(
    new Uint8Array([
      0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf,
      0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf,
      0xf, 0xf,
    ])
  );
  song.waves.push(
    new Uint8Array([
      0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
      0x0, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf,
      0xf, 0xf,
    ])
  );
  song.waves.push(
    new Uint8Array([
      0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
      0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0xf, 0xf, 0xf, 0xf, 0xf, 0xf,
      0xf, 0xf,
    ])
  );
  song.waves.push(
    new Uint8Array([
      0x0, 0x0, 0x0, 0x1, 0x1, 0x2, 0x2, 0x3, 0x3, 0x4, 0x4, 0x5, 0x5, 0x6, 0x6,
      0x7, 0x7, 0x8, 0x8, 0x9, 0x9, 0xa, 0xa, 0xb, 0xb, 0xc, 0xc, 0xd, 0xd, 0xe,
      0xe, 0xf,
    ])
  );
  song.waves.push(
    new Uint8Array([
      0xf, 0xe, 0xd, 0xc, 0xb, 0xa, 0x9, 0x8, 0x7, 0x6, 0x5, 0x4, 0x3, 0x2, 0x1,
      0x0, 0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9, 0xa, 0xb, 0xc, 0xd, 0xe,
      0xf, 0xf,
    ])
  );
  song.waves.push(
    new Uint8Array([
      0x7, 0xa, 0xc, 0xd, 0xd, 0xb, 0x7, 0x5, 0x2, 0x1, 0x1, 0x3, 0x6, 0x8, 0xb,
      0xd, 0xd, 0xc, 0x9, 0x7, 0x4, 0x1, 0x0, 0x1, 0x4, 0x7, 0x9, 0xc, 0xd, 0xd,
      0xb, 0x8,
    ])
  );
  song.waves.push(
    new Uint8Array([
      0x0, 0xf, 0x0, 0xf, 0x0, 0xf, 0x0, 0xf, 0x0, 0xf, 0x0, 0xf, 0x0, 0xf, 0x0,
      0xf, 0x0, 0xf, 0x0, 0xf, 0x0, 0xf, 0x0, 0xf, 0x0, 0xf, 0x0, 0xf, 0x0, 0xf,
      0x0, 0xf,
    ])
  );
  song.waves.push(
    new Uint8Array([
      0xf, 0xe, 0xf, 0xc, 0xf, 0xa, 0xf, 0x8, 0xf, 0x6, 0xf, 0x4, 0xf, 0x2, 0xf,
      0x0, 0xf, 0x2, 0xf, 0x4, 0xf, 0x6, 0xf, 0x8, 0xf, 0xa, 0xf, 0xc, 0xf, 0xe,
      0xf, 0xf,
    ])
  );
  song.waves.push(
    new Uint8Array([
      0xf, 0xe, 0xd, 0xd, 0xc, 0xc, 0xb, 0xb, 0xa, 0xa, 0x9, 0x9, 0x8, 0x8, 0x7,
      0x7, 0x8, 0xa, 0xb, 0xd, 0xf, 0x1, 0x2, 0x4, 0x5, 0x7, 0x8, 0xa, 0xb, 0xd,
      0xe, 0xe,
    ])
  );
  song.waves.push(
    new Uint8Array([
      0x8, 0x4, 0x1, 0x1, 0x6, 0x1, 0xe, 0xd, 0x5, 0x7, 0x4, 0x7, 0x5, 0xa, 0xa,
      0xd, 0xc, 0xe, 0xa, 0x3, 0x1, 0x7, 0x7, 0x9, 0xd, 0xd, 0x2, 0x0, 0x0, 0x3,
      0x4, 0x7,
    ])
  );

  return song;
}