import { useEffect, useState } from "react";
import type { ObjednavkaPrijata } from "./types";
import Paginator from "./Paginator";
import Table from "./Table";
function Body() {
  const [getObjednavkyPrijate, setObjednavkyPrijate] = useState<
    ObjednavkaPrijata[]
  >([]);
  const [getParams, setParams] = useState<{
    start: number;
    limit: number;
    query: string;
  }>({
    start: 0,
    limit: 8,
    query: "",
  });
  const [isClient, setClient] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [getNavigating, setNavigating] = useState(false);
  const updatePage = (
    { limit, start, query }: { limit?: number; start?: number; query?: string },
    callback?: () => void,
  ) => {
    setNavigating(true);
    const params = new URLSearchParams([
      ["limit", limit !== undefined ? String(limit) : String(getParams.limit)],
      ["start", start !== undefined ? String(start) : String(getParams.start)],
    ]);
    if (query !== undefined && query.length > 0) {
      params.append("query", query);
    } else if (query === undefined && getParams.query.length > 0) {
      params.append("query", getParams.query);
    }
    const url = "/api?" + params.toString();
    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((body) => {
        setObjednavkyPrijate(body.objednavkyPrijate);
        setRowCount(body.rowCount);
        setParams({
          limit: limit !== undefined ? limit : getParams.limit,
          start: start !== undefined ? start : getParams.start,
          query: query !== undefined ? query : getParams.query,
        });
        if (callback) callback();
        setNavigating(false);
      })
      .catch((error) => {
        setNavigating(false);
      });
  };

  useEffect(() => {
    if (!isClient) {
      setClient(true);
    } else {
      updatePage({ start: 0 });
    }
  }, [isClient]);

  return (
    <div className="w-full h-fit">
      <Paginator
        updatePage={updatePage}
        getParams={getParams}
        rowCount={rowCount}
      />
      <div className="relative w-full">
        {getNavigating && (
          <div className="absolute block w-full bg-white z-50 opacity-40 top-0  bottom-0"></div>
        )}
        <Table objednavkyPrijate={getObjednavkyPrijate} />
      </div>
    </div>
  );
}

export default Body;
