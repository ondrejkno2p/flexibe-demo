import { useEffect, useState } from "react";
import type { Faktura } from "./types";
import Paginator from "./Paginator";
import Table from "./Table";
function Body() {
  const [getFaktury, setFaktury] = useState<Faktura[]>([]);
  const [getParams, setParams] = useState<{
    start: number;
    limit: number;
    q: string;
  }>({
    start: 0,
    limit: 8,
    q: "",
  });
  const [isClient, setClient] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [getNavigating, setNavigating] = useState(false);
  const updatePage = (
    { limit, start, q }: { limit?: number; start?: number; q?: string },
    callback?: () => void,
  ) => {
    setNavigating(true);
    const params = new URLSearchParams();
    params.append(
      "limit",
      limit !== undefined ? String(limit) : String(getParams.limit),
    );
    params.append(
      "start",
      start !== undefined ? String(start) : String(getParams.start),
    );
    if (q !== undefined && q.length > 0) {
      params.append("q", q);
    } else if (q === undefined && getParams.q.length > 0) {
      params.append("q", getParams.q);
    }
    const url = "/api?" + params.toString();
    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((body) => {
        setFaktury(body.faktury);
        setRowCount(body.rowCount);
        setParams({
          limit: limit !== undefined ? limit : getParams.limit,
          start: start !== undefined ? start : getParams.start,
          q: q !== undefined ? q : getParams.q,
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
    }
  }, [isClient]);
  useEffect(() => {
    if (isClient) {
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
        <Table getFaktury={getFaktury} />
      </div>
    </div>
  );
}

export default Body;
