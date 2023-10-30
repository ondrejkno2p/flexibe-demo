import type { Faktura } from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";

function Row({ faktura }: { faktura: Faktura }) {
  return (
    <tr
      key={faktura.id}
      className="border-2 border-solid border-gray-300 odd:bg-gray-100 even:bg-gray-50 hover:bg-white"
    >
      <td className="p-2 align-top border-r-2 border-solid border-gray-300 last:border-none">
        <table className="w-full">
          <caption className="text-left text-xl font-bold">
            {(faktura.fakturaVydana && (
              <a
                href={"/api/pdf/" + faktura.fakturaVydana + ".pdf"}
                className=""
              >
                {faktura.kod} <FontAwesomeIcon icon={faFilePdf} />
              </a>
            )) || <p>{faktura.kod}</p>}
          </caption>
          <tbody>
            <tr>
              <td className=" align-top font-bold">Stav:</td>
              <td className="w-full">
                {faktura.stavUzivK}
                <br />
              </td>
            </tr>
            <tr>
              <td className=" align-top font-bold">Uživatel:</td>
              <td>{faktura.uzivatel}</td>
            </tr>
            <tr>
              <td className=" align-top font-bold whitespace-nowrap">
                Forma Dopravy:
              </td>
              <td>
                {faktura.formaDopravy ? faktura.formaDopravy.split(":")[1] : ""}
              </td>
            </tr>
            <tr>
              <td className=" align-top font-bold whitespace-nowrap">
                Forma Úhrady:
              </td>
              <td>
                {faktura.formaUhrady ? faktura.formaUhrady.split(":")[1] : ""}
              </td>
            </tr>
            <tr>
              <td className=" align-top font-bold">Celková suma:</td>
              <td>
                {faktura.sumCelkem} {faktura.mena.split(":")[1]}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="align-text-bottom h-full"></div>
      </td>
      <td className="p-2 align-top border-r-2 border-solid border-gray-300 last:border-none">
        <table className="">
          <tbody>
            <tr>
              <td className=" align-top font-bold">Jméno:</td>
              <td>
                {faktura.kontaktJmeno}
                <br />
              </td>
            </tr>
            <tr>
              <td className=" align-top font-bold">Ulice:</td>
              <td>
                {faktura.ulice}
                <br />
              </td>
            </tr>
            <tr>
              <td className=" align-top font-bold">Město:</td>
              <td>
                {faktura.mesto}
                <br />
              </td>
            </tr>
            <tr>
              <td className=" align-top font-bold">PSČ:</td>
              <td>
                {faktura.psc}
                <br />
              </td>
            </tr>
            <tr>
              <td className=" align-top font-bold">Stát:</td>
              <td>
                {faktura.stat}
                <br />
              </td>
            </tr>
            <tr>
              <td className=" align-top font-bold">IČO:</td>
              <td>{faktura.ic}</td>
            </tr>
            <tr>
              <td className=" align-top font-bold">DIČ:</td>
              <td>{faktura.dic}</td>
            </tr>
          </tbody>
        </table>
      </td>
      <td className="p-2 align-top border-r-2 border-solid border-gray-300 last:border-none overflow-xs">
        {(!faktura.polozky || faktura.polozky.length === 0) && (
          <p className="text-left w-fit font-bold text-red-500 text-xl">
            Bez položek
          </p>
        )}

        <ol className="w-full">
          {faktura.polozky &&
            faktura.polozky.map((polozka, index) => {
              return (
                <li
                  key={index}
                  className="odd:bg-gray-200 even:bg-gray-100 p-1 rounded-sm"
                >
                  <table>
                    <tbody>
                      <tr>
                        <td className="font-bold align-top ">
                          {(polozka.kod && <p>{polozka.kod}: </p>) || (
                            <p className="text-red-500">Bez Kódu:</p>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {(polozka.nazev && <p>{polozka.nazev}</p>) || (
                            <p className="text-red-500">Bez názvu</p>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </li>
              );
            })}
        </ol>
      </td>
    </tr>
  );
}

export default Row;
