import { ObjednavkaPrijata } from "../src/types";

export const getObjednavkaPrijata = (objednavkaPrijataData: any) => {
  const faAdresa = !(
    objednavkaPrijataData.faUlice === "" &&
    objednavkaPrijataData.faMesto === "" &&
    objednavkaPrijataData.faPsc === "" &&
    objednavkaPrijataData.faStat === ""
  );
  const objednavkaPrijata: ObjednavkaPrijata = {
    id: objednavkaPrijataData.id,
    uzivatel: objednavkaPrijataData["uzivatel@showAs"],
    kod: objednavkaPrijataData.kod,
    kontaktJmeno: objednavkaPrijataData.kontaktJmeno,
    dic: objednavkaPrijataData.dic,
    ic: objednavkaPrijataData.ic,
    mesto: faAdresa
      ? objednavkaPrijataData.faMesto
      : objednavkaPrijataData.mesto,
    psc: faAdresa ? objednavkaPrijataData.faPsc : objednavkaPrijataData.psc,
    ulice: faAdresa
      ? objednavkaPrijataData.faUlice
      : objednavkaPrijataData.ulice,
    stat: faAdresa
      ? objednavkaPrijataData["faStat@showAs"]
      : objednavkaPrijataData["stat@showAs"],
    formaDopravy: objednavkaPrijataData["formaDopravy@showAs"],
    sumCelkem: objednavkaPrijataData.sumCelkem,
    mena: objednavkaPrijataData.mena,
    stavUzivK: objednavkaPrijataData["stavUzivK@showAs"],
    bezPolozek: objednavkaPrijataData.bezPolozek,
    polozky: objednavkaPrijataData.polozkyObchDokladu
      ? objednavkaPrijataData.polozkyObchDokladu.map((polozka: any) => {
          return { id: polozka.id, nazev: polozka.nazev, kod: polozka.kod };
        })
      : undefined,
    formaUhrady: objednavkaPrijataData["formaUhradyCis@showAs"],
    fakturaVydana: getFakturaId(objednavkaPrijataData.vazby),
  };
  return objednavkaPrijata;
};

const getFakturaId = (vazby: { "b@ref": string; "a@ref": string }[]) => {
  if (vazby.length == 0) {
    return null;
  }
  for (let i = 0; i < vazby.length; i++) {
    const vazba = vazby[i];
    if (vazba["a@ref"].search("/faktura-vydana/") > -1) {
      return vazba["a@ref"].split("/").slice(-1)[0].replace(".json", "");
    }
    if (vazba["b@ref"].search("/faktura-vydana/") > -1) {
      return vazba["b@ref"].split("/").slice(-1)[0].replace(".json", "");
    }
  }
  return null;
};

export const getFilterByPolozkyObchDokladu = async (query: string) => {
  try {
    const params = new URLSearchParams([
      ["detail", "custom:doklObch(id)"],
      ["includes", "objednavka-prijata-polozka/doklObch"],
      ["limit", "0"],
    ]);
    const url =
      "https://demo.flexibee.eu/c/demo/objednavka-prijata-polozka/" +
      query +
      ".json?" +
      params.toString();
    const res = await fetch(url);
    const body = await res.json();
    const ids = body.winstrom["objednavka-prijata-polozka"].map((v: any) => {
      return v.doklObch[0].id as number;
    });
    return "(id in (" + ids.toString() + "))";
  } catch (error) {
    return undefined;
  }
};

export const detail = [
  "uzivatel",
  "id",
  "kod",
  "kontaktJmeno",
  "dic",
  "ic",
  "mesto",
  "faMesto",
  "psc",
  "faPsc",
  "ulice",
  "faUlice",
  "stat",
  "faStat",
  "formaDopravy",
  "sumCelkem",
  "mena",
  "stavUzivK",
  "bezPolozek",
  "formaUhradyCis",
  "polozkyObchDokladu(nazev,id,kod)",
  "vazby",
];
