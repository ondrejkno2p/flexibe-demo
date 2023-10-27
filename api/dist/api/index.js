"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.listen(3001);
app.use((req, res, next) => {
  // console.log(req.url)
  // console.log(req.params)
  next();
});
const getFaktura = (fakturaFull) => {
  const faAdresa = !(
    fakturaFull.faUlice === "" &&
    fakturaFull.faMesto === "" &&
    fakturaFull.faPsc === "" &&
    fakturaFull.faStat === ""
  );
  const faktura = {
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
      ? fakturaFull.polozkyObchDokladu.map((polozka) => {
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
  "formaUhrady",
  "polozkyObchDokladu(nazev,id,kod)",
];
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
    params.append("q", String(request.query.q));
  }
  params.append("add-row-count", "true");
  params.append("detail", "custom:" + detail.toString());
  const url =
    "https://demo.flexibee.eu/c/demo/objednavka-prijata.json?" +
    params.toString();
  console.log(url);
  fetch(url)
    .then((res) => {
      // console.log(res)
      return res.json();
    })
    .then((body) => {
      const faktury = body.winstrom["objednavka-prijata"].map((fakturaFull) => {
        return getFaktura(fakturaFull);
      });
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
      const faktura = body.winstrom["objednavka-prijata"].map((fakturaFull) => {
        return getFaktura(fakturaFull);
      });
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
exports.default = app;
