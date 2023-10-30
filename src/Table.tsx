import type { ObjednavkaPrijata } from "./types";
import Row from "./Row";
function Table({ objednavkyPrijate }: { objednavkyPrijate: ObjednavkaPrijata[] }) {
  return (
    <div className="border-solid border-2 border-gray-300 rounded-md p-0 rounded-b-none w-full">
      <table className="table-auto md:table-fixed  w-full overflow-x-scroll max-w-7xl min-w-fit">
        <thead>
          <tr key={"0"} className="text-xl">
            <th className="text-left p-2">Objednávka</th>
            <th className="text-left p-2">Fakturační Údaje</th>
            <th className="text-left p-2 ">Položky</th>
          </tr>
        </thead>
        <tbody className="">
          {objednavkyPrijate.map((objednavkaPrijata, index) => {
            return <Row key={index} objednavkaPrijata={objednavkaPrijata} />;
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
