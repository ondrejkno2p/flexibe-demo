"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("./utils");
const app = (0, express_1.default)();
app.listen(3001);
app.get("/api", (request, response) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const params = new URLSearchParams([
        ["start", request.query.start ? String(request.query.start) : "0"],
        ["limit", request.query.limit ? String(request.query.limit) : "8"],
        ["add-row-count", "true"],
        ["relations", "vazby"],
        ["detail", "custom:" + utils_1.detail.toString()],
      ]);
      let query = request.query.query;
      if (query !== undefined && query.startsWith("polozky:")) {
        query = yield (0, utils_1.getFilterByPolozkyObchDokladu)(
          query.split("polozky:")[1],
        );
      }
      const url =
        "https://demo.flexibee.eu/c/demo/objednavka-prijata" +
        (query !== undefined ? "/" + query : "") +
        ".json?" +
        params.toString();
      const res = yield fetch(url);
      const body = yield res.json();
      const objednavkyPrijate = body.winstrom["objednavka-prijata"].map(
        (objednavkaPrijata) => {
          return (0, utils_1.getObjednavkaPrijata)(objednavkaPrijata);
        },
      );
      response.json({
        objednavkyPrijate: objednavkyPrijate,
        rowCount: body.winstrom["@rowCount"],
      });
    } catch (error) {
      response.status(500).send();
    }
  }),
);
app.get("/api/pdf/:id.pdf", (request, response) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const url =
        "https://demo.flexibee.eu/c/demo/faktura-vydana/" +
        request.params.id +
        ".pdf";
      const res = yield fetch(url);
      const body = yield res.blob();
      const buffer = yield body.arrayBuffer();
      response.send(Buffer.from(buffer));
    } catch (error) {
      response.status(500).send();
    }
  }),
);
exports.default = app;
