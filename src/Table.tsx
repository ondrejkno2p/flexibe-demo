import type { Faktura } from "./types";
import Row from "./Row";
function Table({ getFaktury }: { getFaktury: Faktura[] }) {
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
          {getFaktury.map((faktura, index) => {
            return <Row key={index} faktura={faktura} />;
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
