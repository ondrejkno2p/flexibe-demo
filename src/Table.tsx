import type { Faktura } from "./types";
import Row from "./Row";
function Table({ getFaktury }: { getFaktury: Faktura[] }) {
  return (
    <div className="border-solid border-2 border-gray-300 rounded-md p-0 rounded-b-none">
      <table className="table-fixed w-full">
        <thead>
          <tr key={"0"} className="text-xl">
            <th className="text-left px-2 py-4 w-[9rem]">Uživatel</th>
            <th className="text-left px-2 py-4 w-[12rem]">Adresa</th>
            <th className="text-left px-2 py-4 w-[9rem]">Částka</th>
            <th className="text-left px-2 py-4 w-[11rem]">Kód</th>
            <th className="text-left px-2 py-4 w-[9rem]">Jméno</th>
            <th className="text-left px-2 py-4 w-[8rem]">IČ/DIČ</th>
            <th className="text-left px-2 py-4 w-[9rem]">Doprava</th>
            <th className="text-left px-2 py-4 w-[9rem]">Forma Úhrady</th>
            <th className="text-left px-2 py-4 w-[12rem]">Položky</th>
            <th className="text-left px-2 py-4 w-[8rem]">Stav</th>
            <th className="text-center px-2 py-4 w-[4rem]">PDF</th>
          </tr>
        </thead>
        <tbody className="">
          {getFaktury.map((faktura, index) => {
            return <Row key={index} DefFaktura={faktura} />;
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
