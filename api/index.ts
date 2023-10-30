import express from "express";
import type { ObjednavkaPrijata } from "../src/types";

const app = express();
app.listen(3001);

app.use((req, res, next) => {
  next();
});

const getFakturaId = (vazby: { "b@ref": string }[]) => {
  if (vazby.length == 0) {
    return null;
  }
  for (let i = 0; i < vazby.length; i++) {
    const vazba = vazby[i];
    if (vazba["b@ref"].search("/faktura-vydana/") > -1) {
      return vazba["b@ref"].split("/").slice(-1)[0].replace(".json", "");
    }
  }
  return null;
};

const getobjednavkaPrijata = (objednavkaPrijataData: any) => {
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
    mesto: faAdresa ? objednavkaPrijataData.faMesto : objednavkaPrijataData.mesto,
    psc: faAdresa ? objednavkaPrijataData.faPsc : objednavkaPrijataData.psc,
    ulice: faAdresa ? objednavkaPrijataData.faUlice : objednavkaPrijataData.ulice,
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

const detail = [
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

const polozkaDetail = ["nazev", "id", "kod"];

const getFilterByPolozkyObchDokladu = async (query: string) => {
  const params = new URLSearchParams();
  params.append(
    "detail",
    "custom:" + polozkaDetail.toString() + ",doklObch(id)",
  );
  params.append("includes", "objednavka-prijata-polozka/doklObch");
  params.append("limit", "0");
  const url =
    "https://demo.flexibee.eu/c/demo/objednavka-prijata-polozka/" +
    query +
    ".json?" +
    params.toString();
  let ids: number[] = [];
  const res = await fetch(url);
  const body = await res.json();
  ids = body.winstrom["objednavka-prijata-polozka"].map((v: any) => {
    return v.doklObch[0].id as number;
  });
  return "(id in (" + ids.toString() + "))";
};

app.get("/api", async (request, response) => {
  const params = new URLSearchParams();
  if (request.query.start !== undefined) {
    params.append("start", String(request.query.start));
  } else {
    params.append("start", String(0));
  }
  if (request.query.limit !== undefined) {
    params.append("limit", String(request.query.limit));
  } else {
    params.append("limit", String(8));
  }
  params.append("add-row-count", "true");
  params.append("relations", "vazby");
  params.append("detail", "custom:" + detail.toString());
  let query = request.query.query as string | undefined;
  if (query !== undefined && query.startsWith("polozkyObchDokladu:")) {
    query = await getFilterByPolozkyObchDokladu(query.split("polozkyObchDokladu:")[1]);
  }
  const url =
    query !== undefined
      ? "https://demo.flexibee.eu/c/demo/objednavka-prijata/" +
      query + ".json?" +
        params.toString()
      : "https://demo.flexibee.eu/c/demo/objednavka-prijata.json?" +
        params.toString();
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((body) => {
      const objednavkyPrijate = body.winstrom["objednavka-prijata"].map(
        (objednavkaPrijata: any) => {
          return getobjednavkaPrijata(objednavkaPrijata);
        },
      );
      response.setHeader("cache-control", "max-age=60");
      response.json({ objednavkyPrijate: objednavkyPrijate, rowCount: body.winstrom["@rowCount"] });
    })
    .catch((error) => {
      response.status(500).send();
      console.log(error);
    });
});

app.get("/api/pdf/:id.pdf", (request, response) => {
  const url =
    "https://demo.flexibee.eu/c/demo/faktura-vydana/" +
    request.params.id +
    ".pdf";
  fetch(url)
    .then((res) => {
      return res.blob();
    })
    .then((body) => {
      body.arrayBuffer().then((buffer) => {
        response.send(new Buffer(buffer));
      });
    })
    .catch((error) => {
      response.status(500).send();
      console.log(error);
    });
});

export default app;
