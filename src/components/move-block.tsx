import {
  DRAG_TYPE_CHANGE_WIDTH,
  MOVE_BLOCK_POSITION_LEFT,
  MOVE_BLOCK_POSITION_RIGHT,
} from "@/constants";

type MoveBlockProps = {
  clipID: string;
};

export const WestMoveBlock = ({ clipID }: MoveBlockProps) => {
  return (
    <div
      data-drag={DRAG_TYPE_CHANGE_WIDTH}
      data-position={MOVE_BLOCK_POSITION_LEFT}
      data-clipid={clipID}
      className="absolute left-0 top-1/2 h-1/2 w-2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-sm bg-gray-400"
    ></div>
  );
};

export const EastMoveBlock = ({ clipID }: MoveBlockProps) => {
  return (
    <div
      data-drag={DRAG_TYPE_CHANGE_WIDTH}
      data-position={MOVE_BLOCK_POSITION_RIGHT}
      data-clipid={clipID}
      className="absolute right-0 top-1/2 h-1/2 w-2 -translate-y-1/2 translate-x-1/2 cursor-ew-resize rounded-sm bg-gray-400"
    ></div>
  );
};
