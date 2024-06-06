import React from "react";

import { useEventListener } from "ahooks";

import { Clip } from "@/components/track";

import { genID } from "./lib/utils";
import { useTimelineStore } from "./store";
import { type ClipType } from "./types";

const App = () => {
  const trackDatas = useTimelineStore((state) => state.trackDatas);
  const currentClipID = useTimelineStore((state) => state.currentClipID);
  const setTrackData = useTimelineStore((state) => state.setTrackData);
  const startTrackID = useTimelineStore((state) => state.startTrackID);
  const endTrackID = useTimelineStore((state) => state.endTrackID);
  // const setEndTrackID = useTimelineStore((state) => state.setEndTrackID);

  const trackContainerRef = React.useRef<HTMLDivElement | null>(null);

  useEventListener(
    "dragover",
    (e: React.MouseEvent<HTMLDivElement>) => {
      // 阻止默认行为，允许拖拽到该元素上
      e.preventDefault();
    },
    { target: trackContainerRef },
  );

  useEventListener(
    "dragenter",
    () => {
      // setEndTrackID("");
    },
    { target: trackContainerRef },
  );

  useEventListener(
    "drop",
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (startTrackID && endTrackID) {
        return;
      }

      const clipDatas: ClipType[] = [];
      Object.values(trackDatas).forEach((el) => {
        clipDatas.push(...el);
      });

      const clipData = clipDatas.find((el) => el.id === currentClipID);
      setTrackData(genID(), [clipData!]);

      const startTrackData = trackDatas[startTrackID!];
      setTrackData(
        startTrackID!,
        startTrackData.filter((el) => el.id !== currentClipID),
      );

      e.preventDefault();
    },
    { target: trackContainerRef },
  );

  return (
    <main className="flex size-full h-screen">
      <aside className="h-full w-[200px] border-r "></aside>
      <section className="flex  flex-1 flex-col justify-end ">
        <div className="h-screen border-t p-9" ref={trackContainerRef}>
          <div className="grid grid-cols-1 gap-y-4">
            {Object.keys(trackDatas).map((id) => (
              <Clip key={id} id={id} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default App;
