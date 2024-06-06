import React from "react";

import { useEventListener } from "ahooks";

import { type ClipType } from "@/types";

import {
  DRAG_TYPE_CHANGE_WIDTH,
  DRAG_TYPE_MOVE_HORIZONTAL,
  MOVE_BLOCK_POSITION_LEFT,
} from "@/constants";
import { cn, getRect } from "@/lib/utils";

import { EastMoveBlock, WestMoveBlock } from "./move-block";

type ClipProps = {
  map: Map<string, ClipType[]>;
  id: string;
  set: (key: string, entry: ClipType[]) => void;
};

export const Clip = ({ map, id, set }: ClipProps) => {
  const trackData = map.get(id) || [];

  // 鼠标移动时上次的坐标
  const mouseDownXRef = React.useRef(0);

  const moveBlockRef = React.useRef<string>("");

  // clip 的宽度是否可以左右拖动
  const enableClipWidthDragRef = React.useRef(false);
  // clip ref
  const clipRef = React.useRef<HTMLDivElement | null>(null);
  // 当前拖拽的 clip id
  const clipIDRef = React.useRef("");
  // clip 是否可以左右拖动
  const [enableClipTranslate, setClipTranslate] = React.useState(false);

  // track ref
  const trackRef = React.useRef<HTMLDivElement | null>(null);

  const handleReset = () => {
    enableClipWidthDragRef.current = false;
    moveBlockRef.current = "";
    clipIDRef.current = "";
    setClipTranslate(false);
  };

  useEventListener(
    "mousedown",
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;

      clipIDRef.current = target.dataset.clipid || "";

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
      const { left: clipLeft } = getRect(clipRef);

      // 允许左右进行拖拽时才进行后续处理
      if (enableClipWidthDragRef.current) {
        const copied = [...trackData];

        const current = copied.findIndex((el) => el.id === clipIDRef.current);

        // 此次鼠标移动的距离
        let offset = e.clientX - mouseDownXRef.current;
        if (moveBlockRef.current === MOVE_BLOCK_POSITION_LEFT) {
          offset = -offset;

          let x = e.clientX - trackLeft;
          if (x <= 0) {
            x = 0;
          }

          copied[current].translateX = x;
        }

        const currentWidth = copied[current].width;

        // 设置新的宽度
        const newWidth = offset + currentWidth;

        // 最大宽度为轨道的宽度
        const maxWidth = trackWidth;

        const clipOffsetLeftWithTrack = clipLeft - trackLeft;

        // clip 距离 track 左边的距离 + clip 的宽度 到达最大宽度时，clip 的宽度不再变化
        if (clipOffsetLeftWithTrack + currentWidth >= maxWidth) {
          copied[current].width = currentWidth;
        }

        if (newWidth >= maxWidth) {
          copied[current].width = maxWidth;
        }

        copied[current].width = newWidth;

        set(id, copied);
      }

      // 保存当前鼠标位置，方便下次计算鼠标移动距离使用
      mouseDownXRef.current = e.clientX;
    },
    { target: trackRef },
  );

  useEventListener(
    "mouseup",
    () => {
      handleReset();
    },
    { target: document },
  );

  useEventListener(
    "dragstart",
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      clipIDRef.current = target.dataset.clipid || "";
    },
    { target: trackRef },
  );

  useEventListener(
    "dragover",
    (e: React.MouseEvent<HTMLDivElement>) => {
      // 阻止默认行为，允许拖拽到该元素上
      e.preventDefault();
    },
    { target: trackRef },
  );
  useEventListener(
    "drop",
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { width: trackWidth, left: trackLeft } = getRect(trackRef);
      const { width: clipWidth } = getRect(clipRef);

      // 允许 clip 左右进行拖拽时才进行后续处理
      if (enableClipTranslate) {
        // 此次鼠标移动的距离 = 当前鼠标位置 - 上一次鼠标位置（第一次为鼠标按下的位置）
        const offset = e.clientX - mouseDownXRef.current;

        // clip 最大平移动距离
        const clipMaxTranslateX = trackWidth - clipWidth;

        const copied = [...trackData];
        const current = copied.findIndex((el) => el.id === clipIDRef.current);
        const translateX = copied[current].translateX;

        // 如果拖拽的距离小于 trackLeft 说明拖到最左边了
        if (e.clientX - trackLeft <= 0) {
          copied[current].translateX = 0;
          set(id, copied);
          return;
        }

        if (e.clientX - trackLeft >= clipMaxTranslateX) {
          copied[current].translateX = clipMaxTranslateX;
          return;
        }

        // clip 最小平移动距离
        if (translateX + offset <= 0) {
          copied[current].translateX = 0;
          return;
        }

        if (translateX + offset >= clipMaxTranslateX) {
          copied[current].translateX = clipMaxTranslateX;
          return;
        }

        copied[current].translateX = translateX + offset;
        set(id, copied);
      }
    },
    { target: trackRef },
  );

  return (
    <div className="h-[80px] bg-gray-100" ref={trackRef}>
      {trackData.map((el) => (
        <div
          key={el.id}
          data-clipid={el.id}
          data-drag={DRAG_TYPE_MOVE_HORIZONTAL}
          className={cn("relative h-full rounded-lg bg-gray-300 origin-left", {
            "cursor-grab": enableClipTranslate,
          })}
          style={{
            width: el.width,
            transform: `translateX(${el.translateX}px)`,
          }}
          ref={clipRef}
          draggable
        >
          <WestMoveBlock clipID={el.id} />
          <EastMoveBlock clipID={el.id} />
        </div>
      ))}
    </div>
  );
};
