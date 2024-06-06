import { useMap } from "ahooks";

import { type ClipType } from "@/types";

import { Clip } from "@/components/track";

import { genID } from "@/lib/utils";

const App = () => {
  const [map, { set }] = useMap<string, ClipType[]>(
    Array.from({ length: 3 }).map(() => [
      genID(),
      [
        {
          id: genID(),
          width: 200,
          translateX: 0,
        },
      ],
    ]),
  );

  return (
    <main className="flex size-full h-screen">
      <aside className="h-full w-[200px] border-r "></aside>
      <section className="flex  flex-1 flex-col justify-end ">
        <div className="h-[600px] border-t p-9">
          <div className="grid grid-cols-1 gap-y-4">
            {[...map.keys()].map((id) => (
              <Clip key={id} map={map} id={id} set={set} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default App;
