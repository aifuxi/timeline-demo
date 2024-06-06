import { create } from "zustand";

import { genID } from "./lib/utils";
import { type ClipType } from "./types";

interface TimelineState {
  trackDatas: Record<string, ClipType[]>;

  currentClipID?: string;
  startTrackID?: string;
  endTrackID?: string;

  needNewTrack?: boolean;

  setNeedNewTrack: (v: boolean) => void;

  setTrackData: (id: string, data: ClipType[]) => void;
  setCurrentClipID: (id: string) => void;
  setStartTrackID: (id: string) => void;
  setEndTrackID: (id: string) => void;
}

export const useTimelineStore = create<TimelineState>()((set) => ({
  currentClipID: "",

  setNeedNewTrack(v) {
    set({ needNewTrack: v });
  },

  setTrackData(id, data) {
    set((state) => {
      return {
        trackDatas: {
          ...state.trackDatas,
          [id]: data,
        },
      };
    });
  },

  setCurrentClipID(id) {
    set({ currentClipID: id });
  },
  setStartTrackID(id) {
    set({ startTrackID: id });
  },
  setEndTrackID(id) {
    set({ endTrackID: id });
  },
  trackDatas: {
    [genID()]: [
      {
        id: genID(),
        width: 200,
        translateX: 0,
      },
    ],
    [genID()]: [
      {
        id: genID(),
        width: 200,
        translateX: 0,
      },
    ],
    [genID()]: [
      {
        id: genID(),
        width: 200,
        translateX: 0,
      },
    ],
  },
}));
