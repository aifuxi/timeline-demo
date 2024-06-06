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
      className="grid size-[200px] place-content-center rounded border p-4 text-sm"
      draggable
      ref={gridRef}
    >
      拖拽我到右侧底部可以新增一个轨道
    </div>
  );
};
