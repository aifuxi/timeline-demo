import React from "react";

import { useEventListener } from "ahooks";

import { useTimelineStore } from "@/store";

export const AsideGrid = () => {
  const gridRef = React.useRef<HTMLDivElement | null>(null);
  const setNeedNewTrack = useTimelineStore((state) => state.setNeedNewTrack);

  useEventListener(
    "dragstart",
    () => {
      setNeedNewTrack(true);
    },
    { target: gridRef },
  );

  return (
    <div
      className="grid size-[80px] place-content-center rounded border"
      draggable
      ref={gridRef}
    >
      mock
    </div>
  );
};
