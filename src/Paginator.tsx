import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardFast,
  faBackwardStep,
  faForwardFast,
  faForwardStep,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import LabelPicker from "./LabelPicker";

function Paginator({
  updatePage,
  getParams,
  rowCount,
}: {
  updatePage: (
    {
      limit,
      start,
      q,
    }: {
      limit?: number | undefined;
      start?: number | undefined;
      q?: string | undefined;
      tag?: string | undefined;
    },
    callback?: () => void,
  ) => void;
  getParams: { limit: number; start: number; q: string };
  rowCount: number;
}) {
  const [input, setInput] = useState("");
  const [label, setLabel] = useState<{ value: string; name: string } | null>(
    null,
  );

  return (
    <div className="flex justify-between py-4">
      <div className="flex flex-row group justify-around w-fit">
        <LabelPicker label={label} setLabel={setLabel} />
        <input
          className="w-full border-gray-600 bg-gray-100 hover:bg-gray-50 group-hover:bg-gray-50 focus:outline-none hover:border-gray-600 focus:border-black border-solid border-2 p-1 px-2 rounded-none disabled:bg-gray-200 disabled:hover:!bg-gray-200 disabled:group-hover:!bg-gray-200"
          value={input}
          disabled={!label}
          onKeyUp={(event) => {
            if (event.key === "Enter") {
              updatePage({
                start: 0,
                q: label ? label.value.replace(/%/g, input) : input,
              });
            }
          }}
          onChange={(event) => {
            setInput(event.target.value);
          }}
        />
        <button
          className="btn-primary w-10 h-10 rounded-l-none"
          disabled={false}
          onClick={() => {
            if (input.length > 0) {
              updatePage({
                start: 0,
                q: label ? label.value.replace(/%/g, input) : input,
              });
            }
          }}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
        <button
          className="btn-primary mx-2 w-64 whitespace-nowrap"
          disabled={getParams.q.length == 0}
          onClick={() => {
            setLabel(null);
            setInput("");
            updatePage({ start: 0, q: "" }, () => {
              setInput("");
            });
          }}
        >
          Zrušit Filtr
        </button>
      </div>
      <div className="flex items-center">
        <button
          className="btn-primary rounded-r-none w-10 h-10"
          disabled={getParams.start === 0}
          onClick={() => {
            updatePage({ start: 0 });
          }}
        >
          <FontAwesomeIcon icon={faBackwardFast} />
        </button>
        <button
          className="btn-primary rounded-none w-10 h-10"
          disabled={getParams.start === 0}
          onClick={() => {
            updatePage({
              start: Math.max(0, getParams.start - getParams.limit),
            });
          }}
        >
          <FontAwesomeIcon icon={faBackwardStep} />
        </button>
        <button
          className="btn-primary rounded-none w-10 h-10"
          disabled={rowCount <= getParams.start + getParams.limit}
          onClick={() => {
            updatePage({ start: getParams.start + getParams.limit });
          }}
        >
          <FontAwesomeIcon icon={faForwardStep} />
        </button>
        <button
          className="btn-primary rounded-l-none w-10 h-10"
          disabled={rowCount <= getParams.start + getParams.limit}
          onClick={() => {
            const endPage = Number(
              rowCount > 0
                ? Math.floor(rowCount / getParams.limit) * getParams.limit
                : 0,
            );
            updatePage({
              start:
                Number(endPage) === Number(rowCount)
                  ? Math.max(0, endPage - getParams.limit)
                  : endPage,
            });
          }}
        >
          <FontAwesomeIcon icon={faForwardFast} />
        </button>
        <div className="flex">
          <div className="grid grid-cols-[2rem,1rem,2rem,3rem] font-semibold">
            <div className="text-center">{getParams.start}</div>
            <div className="text-center">-</div>
            <div className="text-center">
              {Math.min(getParams.start + getParams.limit, rowCount)}
            </div>
            <div className="text-center">({rowCount})</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Paginator;
