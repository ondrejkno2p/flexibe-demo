import type { ObjednavkaPrijata } from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";

function Row({ objednavkaPrijata }: { objednavkaPrijata: ObjednavkaPrijata }) {
  return (
    <tr
      key={objednavkaPrijata.id}
      className="border-2 border-solid border-gray-300 odd:bg-gray-100 even:bg-gray-50 hover:bg-white"
    >
      <td className="p-2 align-top border-r-2 border-solid border-gray-300 last:border-none">
        <table className="w-full">
          <caption className="text-left text-xl font-bold">
            {(objednavkaPrijata.fakturaVydana && (
              <a
                href={"/api/pdf/" + objednavkaPrijata.fakturaVydana + ".pdf"}
                className=""
              >
                {objednavkaPrijata.kod} <FontAwesomeIcon icon={faFilePdf} />
              </a>
            )) || <p>{objednavkaPrijata.kod}</p>}
          </caption>
          <tbody>
            <tr>
              <td className=" align-top font-bold">Stav:</td>
              <td className="w-full">
                {objednavkaPrijata.stavUzivK}
                <br />
              </td>
            </tr>
            <tr>
              <td className=" align-top font-bold">Uživatel:</td>
              <td>{objednavkaPrijata.uzivatel}</td>
            </tr>
            <tr>
              <td className=" align-top font-bold whitespace-nowrap">
                Forma Dopravy:
              </td>
              <td>
                {objednavkaPrijata.formaDopravy ? objednavkaPrijata.formaDopravy.split(":")[1] : ""}
              </td>
            </tr>
            <tr>
              <td className=" align-top font-bold whitespace-nowrap">
                Forma Úhrady:
              </td>
              <td>
                {objednavkaPrijata.formaUhrady ? objednavkaPrijata.formaUhrady.split(":")[1] : ""}
              </td>
            </tr>
            <tr>
              <td className=" align-top font-bold">Celková suma:</td>
              <td>
                {objednavkaPrijata.sumCelkem} {objednavkaPrijata.mena.split(":")[1]}
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
                {objednavkaPrijata.kontaktJmeno}
                <br />
              </td>
            </tr>
            <tr>
              <td className=" align-top font-bold">Ulice:</td>
              <td>
                {objednavkaPrijata.ulice}
                <br />
              </td>
            </tr>
            <tr>
              <td className=" align-top font-bold">Město:</td>
              <td>
                {objednavkaPrijata.mesto}
                <br />
              </td>
            </tr>
            <tr>
              <td className=" align-top font-bold">PSČ:</td>
              <td>
                {objednavkaPrijata.psc}
                <br />
              </td>
            </tr>
            <tr>
              <td className=" align-top font-bold">Stát:</td>
              <td>
                {objednavkaPrijata.stat}
                <br />
              </td>
            </tr>
            <tr>
              <td className=" align-top font-bold">IČO:</td>
              <td>{objednavkaPrijata.ic}</td>
            </tr>
            <tr>
              <td className=" align-top font-bold">DIČ:</td>
              <td>{objednavkaPrijata.dic}</td>
            </tr>
          </tbody>
        </table>
      </td>
      <td className="p-2 align-top border-r-2 border-solid border-gray-300 last:border-none overflow-xs">
        {(!objednavkaPrijata.polozky || objednavkaPrijata.polozky.length === 0) && (
          <p className="text-left w-fit font-bold text-red-500 text-xl">
            Bez položek
          </p>
        )}

        <ol className="w-full">
          {objednavkaPrijata.polozky &&
            objednavkaPrijata.polozky.map((polozka, index) => {
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
