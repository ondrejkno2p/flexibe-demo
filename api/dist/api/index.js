"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.listen(3001);
app.use((req, res, next) => {
    next();
});
const getFakturaID = (vazby) => {
    if (vazby.length == 0) {
        return null;
    }
    for (let i = 0; i < vazby.length; i++) {
        const vazba = vazby[i];
        if (vazba["b@ref"].search("/faktura-vydana/") > -1) {
            return vazba['b@ref'].split('/').slice(-1)[0].replace('.json', '');
        }
    }
    return null;
};
const getobjednavkaPrijata = (objednavkaPrijata) => {
    const faAdresa = !(objednavkaPrijata.faUlice === "" &&
        objednavkaPrijata.faMesto === "" &&
        objednavkaPrijata.faPsc === "" &&
        objednavkaPrijata.faStat === "");
    const faktura = {
        id: objednavkaPrijata.id,
        uzivatel: objednavkaPrijata["uzivatel@showAs"],
        kod: objednavkaPrijata.kod,
        kontaktJmeno: objednavkaPrijata.kontaktJmeno,
        dic: objednavkaPrijata.dic,
        ic: objednavkaPrijata.ic,
        mesto: faAdresa ? objednavkaPrijata.faMesto : objednavkaPrijata.mesto,
        psc: faAdresa ? objednavkaPrijata.faPsc : objednavkaPrijata.psc,
        ulice: faAdresa ? objednavkaPrijata.faUlice : objednavkaPrijata.ulice,
        stat: faAdresa ? objednavkaPrijata["faStat@showAs"] : objednavkaPrijata["stat@showAs"],
        formaDopravy: objednavkaPrijata["formaDopravy@showAs"],
        sumCelkem: objednavkaPrijata.sumCelkem,
        mena: objednavkaPrijata.mena,
        stavUzivK: objednavkaPrijata["stavUzivK@showAs"],
        bezPolozek: objednavkaPrijata.bezPolozek,
        polozky: objednavkaPrijata.polozkyObchDokladu
            ? objednavkaPrijata.polozkyObchDokladu.map((polozka) => {
                return { id: polozka.id, nazev: polozka.nazev, kod: polozka.kod };
            })
            : undefined,
        formaUhrady: objednavkaPrijata["formaUhradyCis@showAs"],
        fakturaVydana: getFakturaID(objednavkaPrijata.vazby)
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
    "vazby"
];
const polozkaDetail = [
    "nazev",
    "id",
    "kod",
];
const getFilterByPolozkyObchDokladu = (q) => __awaiter(void 0, void 0, void 0, function* () {
    const params = new URLSearchParams();
    params.append("detail", "custom:" + polozkaDetail.toString() + ",doklObch(id)");
    params.append("includes", "objednavka-prijata-polozka/doklObch");
    params.append("limit", "0");
    const url = 'https://demo.flexibee.eu/c/demo/objednavka-prijata-polozka/' +
        q
        + '.json?' +
        params.toString();
    let ids = [];
    const res = yield fetch(url);
    const body = yield res.json();
    ids = body.winstrom["objednavka-prijata-polozka"].map((v) => {
        return v.doklObch[0].id;
    });
    return '(id in (' + ids.toString() + '))';
});
app.get("/api", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const params = new URLSearchParams();
    if (request.query.start !== undefined) {
        params.append("start", String(request.query.start));
    }
    else {
        params.append("start", String(0));
    }
    if (request.query.limit !== undefined) {
        params.append("limit", String(request.query.limit));
    }
    else {
        params.append("limit", String(8));
    }
    params.append("add-row-count", "true");
    params.append("relations", "vazby");
    params.append("detail", "custom:" + detail.toString());
    let q = request.query.q;
    if (q !== undefined && q.startsWith('polozkyObchDokladu:')) {
        q = yield getFilterByPolozkyObchDokladu(q.split('polozkyObchDokladu:')[1]);
    }
    const url = request.query.q !== undefined
        ? "https://demo.flexibee.eu/c/demo/objednavka-prijata/" +
            q +
            ".json?" +
            params.toString()
        : "https://demo.flexibee.eu/c/demo/objednavka-prijata.json?" +
            params.toString();
    fetch(url)
        .then((res) => {
        return res.json();
    })
        .then((body) => {
        const faktury = body.winstrom["objednavka-prijata"].map((objednavkaPrijata) => {
            return getobjednavkaPrijata(objednavkaPrijata);
        });
        response.setHeader("cache-control", "max-age=60");
        response.json({ faktury: faktury, rowCount: body.winstrom["@rowCount"] });
    })
        .catch((error) => {
        response.status(500).send();
        console.log(error);
    });
}));
app.get("/api/pdf/:id.pdf", (request, response) => {
    const url = "https://demo.flexibee.eu/c/demo/faktura-vydana/" +
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
