import { ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface Option {
  id: string;
  value: string;
  [key: string]: any;
}

interface Props {
  options: Option[];
  value: Option | null;
  onChange: (value: Option | null) => void;
  placeholder?: string;
  searchable?: boolean;
}

export function AppSingleSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchable = true,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.value.toLowerCase().includes(search.toLowerCase()),
      )
    : options;

  const selectOption = (option: Option) => {
    onChange(option);
    setIsOpen(false); // 👈 close after select
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative min-w-[240px] w-full" ref={wrapperRef}>
      <div
        className="flex items-center gap-1 w-full px-3 py-2 border border-gray-300 rounded-lg cursor-pointer bg-white overflow-hidden"
        onClick={() => setIsOpen(true)}
      >
        {!value && (
          <span className="text-sm text-gray-400 truncate">{placeholder}</span>
        )}

        {value && (
          <span className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded max-w-[160px] truncate">
            <span className="truncate">{value.value}</span>
            <X
              size={12}
              className="cursor-pointer flex-shrink-0"
              onClick={clearSelection}
            />
          </span>
        )}

        <div className="ml-auto text-gray-400 flex-shrink-0">
          <ChevronDown size={18} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full min-w-[260px] bg-white border border-gray-200 rounded-lg shadow-lg max-h-[450px] overflow-y-auto">
          {searchable && (
            <div className="p-2 border-b">
              <input
                type="text"
                className="w-full px-2 py-1 text-sm border rounded outline-none"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}

          {filteredOptions.map((option) => (
            <div
              key={option.id}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 flex items-center gap-2"
              onClick={() => selectOption(option)}
            >
              <input type="radio" readOnly checked={value?.id === option.id} />
              <span className="truncate">{option.value}</span>
            </div>
          ))}

          {filteredOptions.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
