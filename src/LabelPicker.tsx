import { useEffect, useState } from "react";
import Label from "./Label";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
const search = [
  { value: "(kod like similar '%')", name: "Kód" },
  { value: "(kontaktJmeno like similar '%')", name: "Jméno" },
  { value: "(ic like similar '%')", name: "IČO" },
  { value: "(dic like similar '%')", name: "DIČ" },
  {
    value: "(mesto like similar '%' or faMesto like similar '%')",
    name: "Město",
  },
  { value: "(psc like similar '%' or faPsc like similar '%')", name: "PSČ" },
  { value: "(ulice like similar '%' or faUlice like '%')", name: "Ulice" },
  {
    value: "(stat.nazev like similar '%' or faStat.nazev like '%')",
    name: "Stát",
  },
  { value: "(uzivatel.kod like similar '%')", name: "Uživatel" },
  {
    value: "(formaDopravy.nazev like similar '%' or formaDopravy.kod like '%')",
    name: "Forma Dopravy",
  },
  {
    value:
      "(formaUhradyCis.nazev like similar '%' or formaUhradyCis.kod like '%')",
    name: "Forma Úhrady",
  },
  { value: "(sumCelkem <= %)", name: "Suma pod" },
  { value: "(sumCelkem >= %)", name: "Suma nad" },
];

function LabelPicker({
  label,
  setLabel,
}: {
  label: { value: string; name: string } | null;
  setLabel: React.Dispatch<
    React.SetStateAction<{
      value: string;
      name: string;
    } | null>
  >;
}) {
  const [drop, setDrop] = useState<boolean>(false);
  useEffect(() => {
    setDrop(false);
  }, [label]);
  return (
    <div className="relative">
      <button
        className={
          "btn-primary rounded-r-none w-40 h-full" +
          (drop ? " rounded-b-none" : "")
        }
        onClick={() => {
          setDrop(!drop);
        }}
      >
        <div className="flex justify-between items-center">
          <p>{label ? label.name : "Vyber Filtr"}</p>
          {(drop && <FontAwesomeIcon icon={faCaretUp} />) || (
            <FontAwesomeIcon icon={faCaretDown} />
          )}
        </div>
      </button>
      {drop && (
        <ol className="max-h-40 overflow-y-scroll absolute z-10 bg-white border-2 border-solid w-full rounded-b-md overflow-hidden">
          {search.map((thisLabel, index) => {
            return <Label key={index} label={thisLabel} setLabel={setLabel} />;
          })}
        </ol>
      )}
    </div>
  );
}

export default LabelPicker;
