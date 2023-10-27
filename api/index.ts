import express from "express";
import type { Faktura } from "../src/types";

const app = express();
app.listen(3001);

app.use((req, res, next) => {
  // console.log(req.url)
  // console.log(req.params)
  next();
});

const getFaktura = (fakturaFull: any) => {
  const faAdresa = !(
    fakturaFull.faUlice === "" &&
    fakturaFull.faMesto === "" &&
    fakturaFull.faPsc === "" &&
    fakturaFull.faStat === ""
  );
  const faktura: Faktura = {
    id: fakturaFull.id,
    uzivatel: fakturaFull["uzivatel@showAs"],
    kod: fakturaFull.kod,
    kontaktJmeno: fakturaFull.kontaktJmeno,
    dic: fakturaFull.dic,
    ic: fakturaFull.ic,
    mesto: faAdresa ? fakturaFull.faMesto : fakturaFull.mesto,
    psc: faAdresa ? fakturaFull.faPsc : fakturaFull.psc,
    ulice: faAdresa ? fakturaFull.faUlice : fakturaFull.ulice,
    stat: faAdresa ? fakturaFull["faStat@showAs"] : fakturaFull["stat@showAs"],
    formaDopravy: fakturaFull["formaDopravy@showAs"],
    sumCelkem: fakturaFull.sumCelkem,
    mena: fakturaFull.mena,
    stavUzivK: fakturaFull["stavUzivK@showAs"],
    bezPolozek: fakturaFull.bezPolozek,
    polozky: fakturaFull.polozkyObchDokladu
      ? fakturaFull.polozkyObchDokladu.map((polozka: any) => {
          return { id: polozka.id, nazev: polozka.nazev, kod: polozka.kod };
        })
      : undefined,
    formaUhrady: fakturaFull["formaUhradyCis@showAs"],
  };
  return faktura;
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
];

const search = [
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
  "stavUzivK",
  "mena.kod",
  "(stat is not empty) or stat.kod",
  "faStat.nazev",
  "uzivatel.kod",
  "formaUhradyCis.kod",
  "formaUhradyCis.nazev",
  "formaDopravy.kod",
  "formaDopravy.nazev",
  "sumCelkem",
];

const filter = (q: string) => {
  const s = search.join(" like similar '" + q + "') or (");
  return "(" + s + " like similar '" + q + "')";
};

app.get("/api", (request, response) => {
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
  if (request.query.q !== undefined) {
    // params.append("q", String(request.query.q));
    // console.log(filter(request.query.q as string))
  }
  params.append("add-row-count", "true");
  params.append("detail", "custom:" + detail.toString());

  const url =
    request.query.q !== undefined
      ? "https://demo.flexibee.eu/c/demo/objednavka-prijata/" +
        request.query.q +
        ".json?" +
        params.toString()
      : "https://demo.flexibee.eu/c/demo/objednavka-prijata.json?" +
        params.toString();
  console.log(url);
  fetch(url)
    .then((res) => {
      // console.log(res)
      return res.json();
    })
    .then((body) => {
      console.log(body);
      const faktury = body.winstrom["objednavka-prijata"].map(
        (fakturaFull: any) => {
          return getFaktura(fakturaFull);
        },
      );
      response.setHeader("cache-control", "max-age=60");
      response.json({ faktury: faktury, rowCount: body.winstrom["@rowCount"] });
    })
    .catch((error) => {
      response.status(500).send();
      console.log(error);
    });
});

app.get("/api/:id", (request, response) => {
  const url =
    "https://demo.flexibee.eu/c/demo/objednavka-prijata/" +
    request.params.id +
    ".json";
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((body) => {
      const faktura = body.winstrom["objednavka-prijata"].map(
        (fakturaFull: any) => {
          return getFaktura(fakturaFull);
        },
      );
      response.setHeader("cache-control", "max-age=60");
      response.json(faktura[0]);
    })
    .catch((error) => {
      response.status(500).send();
      console.log(error);
    });
});

app.get("/api/pdf/:id.pdf", (request, response) => {
  const url =
    "https://demo.flexibee.eu/c/demo/objednavka-prijata/" +
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
