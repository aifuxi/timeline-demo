import React from "react";

import { useEventListener } from "ahooks";

import { cn, getRect } from "@/lib/utils";

// 用于改变宽度的自定义标识
const DRAG_TYPE_CHANGE_WIDTH = "changeWidth";

// 用于标识的clip是否可以左右拖动
const DRAG_TYPE_MOVE_HORIZONTAL = "moveHorizontal";

// 用于标识是左边还是右边拖动的块
const MOVE_BLOCK_POSITION_LEFT = "left";
const MOVE_BLOCK_POSITION_RIGHT = "right";

const WestMoveBlock = () => {
  return (
    <div
      data-drag={DRAG_TYPE_CHANGE_WIDTH}
      data-position={MOVE_BLOCK_POSITION_LEFT}
      className="absolute left-0 top-1/2 h-1/2 w-2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-sm bg-gray-400"
    ></div>
  );
};

const EastMoveBlock = () => {
  return (
    <div
      data-drag={DRAG_TYPE_CHANGE_WIDTH}
      data-position={MOVE_BLOCK_POSITION_RIGHT}
      className="absolute right-0 top-1/2 h-1/2 w-2 -translate-y-1/2 translate-x-1/2 cursor-ew-resize rounded-sm bg-gray-400"
    ></div>
  );
};

const Clip = () => {
  const [width, setWidth] = React.useState(200);

  // 鼠标移动时上次的坐标
  const mouseDownXRef = React.useRef(0);

  const moveBlockRef = React.useRef<string>("");

  // clip 的宽度是否可以左右拖动
  const enableClipWidthDragRef = React.useRef(false);
  // clip ref
  const clipRef = React.useRef<HTMLDivElement | null>(null);
  // clip translateX
  const [clipTranslateX, setClipTranslateX] = React.useState(200);
  // clip 是否可以左右拖动
  const [enableClipTranslate, setClipTranslate] = React.useState(false);

  // track ref
  const trackRef = React.useRef<HTMLDivElement | null>(null);

  useEventListener(
    "mousedown",
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (target.dataset.drag === DRAG_TYPE_CHANGE_WIDTH) {
        const trackWidth = getRect(trackRef).width;
        if (e.clientX >= trackWidth) {
          // 记录鼠标按下时的横坐标
          mouseDownXRef.current = trackWidth;
        } else {
          // 记录鼠标按下时的横坐标
          mouseDownXRef.current = e.clientX;
        }

        // 开启拖拽，允许左右进行拖拽，修改 clip 的宽度
        enableClipWidthDragRef.current = true;
        moveBlockRef.current = target.dataset.position || "";
      }

      if (target.dataset.drag === DRAG_TYPE_MOVE_HORIZONTAL) {
        // 记录鼠标按下时的横坐标
        mouseDownXRef.current = e.clientX;

        // clip开启拖拽，允许左右进行拖拽，修改 clip 的translateX
        setClipTranslate(true);
      }
    },
    { target: trackRef },
  );

  useEventListener(
    "mousemove",
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { width: trackWidth, left: trackLeft } = getRect(trackRef);
      const { width: clipWidth, left: clipLeft } = getRect(clipRef);

      // 允许左右进行拖拽时才进行后续处理
      if (enableClipWidthDragRef.current) {
        // 此次鼠标移动的距离
        let offset = e.clientX - mouseDownXRef.current;
        if (moveBlockRef.current === MOVE_BLOCK_POSITION_LEFT) {
          offset = -offset;

          let x = e.clientX - trackLeft;
          if (x <= 0) {
            x = 0;
          }

          setClipTranslateX(x);
        }

        // 设置新的宽度
        setWidth((pre) => {
          const newWidth = offset + pre;

          // 最大宽度为轨道的宽度
          const maxWidth = trackWidth;

          const clipOffsetLeftWithTrack = clipLeft - trackLeft;

          // clip 距离 track 左边的距离 + clip 的宽度 到达最大宽度时，clip 的宽度不再变化
          if (clipOffsetLeftWithTrack + pre >= maxWidth) {
            return pre;
          }

          if (newWidth >= maxWidth) {
            return maxWidth;
          }

          return newWidth;
        });
      }

      // 允许 clip 左右进行拖拽时才进行后续处理
      if (enableClipTranslate) {
        // 此次鼠标移动的距离 = 当前鼠标位置 - 上一次鼠标位置（第一次为鼠标按下的位置）
        const offset = e.clientX - mouseDownXRef.current;

        // clip 最大平移动距离
        const clipMaxTranslateX = trackWidth - clipWidth;

        setClipTranslateX((pre) => {
          // clip 最小平移动距离
          if (pre + offset <= 0) {
            return 0;
          }

          if (pre + offset >= clipMaxTranslateX) {
            return clipMaxTranslateX;
          }

          return pre + offset;
        });
      }

      // 保存当前鼠标位置，方便下次计算鼠标移动距离使用
      mouseDownXRef.current = e.clientX;
    },
    { target: trackRef },
  );

  useEventListener(
    "mouseup",
    () => {
      enableClipWidthDragRef.current = false;
      moveBlockRef.current = "";
      setClipTranslate(false);
    },
    { target: document },
  );

  return (
    <div className="h-[80px] bg-gray-100" ref={trackRef}>
      <div
        data-drag={DRAG_TYPE_MOVE_HORIZONTAL}
        className={cn("relative h-full rounded-lg bg-gray-300 origin-left", {
          "cursor-grab": enableClipTranslate,
        })}
        style={{ width, transform: `translateX(${clipTranslateX}px)` }}
        ref={clipRef}
      >
        <WestMoveBlock />
        <EastMoveBlock />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <main className="flex size-full h-screen">
      <aside className="h-full w-[200px] border-r "></aside>
      <section className="flex  flex-1 flex-col justify-end ">
        <div className="h-[600px] border-t p-9">
          <div className="grid grid-cols-1 gap-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Clip key={idx} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default App;
