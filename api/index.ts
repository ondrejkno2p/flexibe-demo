import express from "express";
import {
  getFilterByPolozkyObchDokladu,
  detail,
  getObjednavkaPrijata,
} from "./utils";

const app = express();

app.listen(3001);

app.get("/api", async (request, response) => {
  try {
    const params = new URLSearchParams([
      ["start", request.query.start ? String(request.query.start) : "0"],
      ["limit", request.query.limit ? String(request.query.limit) : "8"],
      ["add-row-count", "true"],
      ["relations", "vazby"],
      ["detail", "custom:" + detail.toString()],
    ]);
    let query = request.query.query as string | undefined;
    if (query !== undefined && query.startsWith("polozky:")) {
      query = await getFilterByPolozkyObchDokladu(query.split("polozky:")[1]);
    }
    const url =
      "https://demo.flexibee.eu/c/demo/objednavka-prijata" +
      (query !== undefined ? "/" + query : "") +
      ".json?" +
      params.toString();
    const res = await fetch(url);
    const body = await res.json();
    const objednavkyPrijate = body.winstrom["objednavka-prijata"].map(
      (objednavkaPrijata: any) => {
        return getObjednavkaPrijata(objednavkaPrijata);
      },
    );
    response.json({
      objednavkyPrijate: objednavkyPrijate,
      rowCount: body.winstrom["@rowCount"],
    });
  } catch (error) {
    response.status(500).send();
  }
});

app.get("/api/pdf/:id.pdf", async (request, response) => {
  try {
    const url =
      "https://demo.flexibee.eu/c/demo/faktura-vydana/" +
      request.params.id +
      ".pdf?report-name=fakturaKB";
    const res = await fetch(url);
    const body = await res.blob();
    const buffer = await body.arrayBuffer();
    response.send(Buffer.from(buffer));
  } catch (error) {
    response.status(500).send();
  }
});

export default app;
