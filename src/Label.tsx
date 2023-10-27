function Label({
  label,
  setLabel,
}: {
  label: { value: string; name: string };
  setLabel: React.Dispatch<
    React.SetStateAction<{
      value: string;
      name: string;
    } | null>
  >;
}) {
  return (
    <li className="w-full odd:bg-gray-200 even:bg-gray-100 hover:bg-gray-50">
      <button
        className="w-full p-2 text-left"
        onClick={() => {
          setLabel(label);
        }}
      >
        {label.name}
      </button>
    </li>
  );
}

export default Label;
