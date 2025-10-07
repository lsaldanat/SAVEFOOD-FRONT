import { useEffect, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";

export default function MonthYearPicker({
  value,
  onChange,
  fromYear = 2025,
  toYear = 2032,
  darkMode = false
}) {
  const [month, setMonth] = useState((value ? new Date(value).getMonth() : new Date().getMonth()) + 1);
  const [year, setYear] = useState(value ? new Date(value).getFullYear() : new Date().getFullYear());

  const years = Array.from({ length: toYear - fromYear + 1 }, (_, i) => fromYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  useEffect(() => {
    if (value) {
      const d = new Date(value);
      setMonth(d.getMonth() + 1);
      setYear(d.getFullYear());
    }
  }, [value]);

//   const handleChange = (newMonth, newYear) => {
//     setMonth(newMonth);
//     setYear(newYear);
//     const date = new Date(newYear, newMonth - 1, 1);
//     onChange(date);
//   };

    const handleMonthChange = (newMonth) => {
    const date = new Date(year, newMonth - 1, 2);
    setMonth(newMonth);
    onChange(date);
    };

    const handleYearChange = (newYear) => {
    const date = new Date(newYear, month - 1, 2);
    setYear(newYear);
    onChange(date);
    };


  const btnClass = `w-full px-4 py-2 border rounded-lg text-left focus:ring-2 focus:ring-blue-400 ${
    darkMode ? "dark:bg-gray-700 dark:border-gray-600 dark:text-white" : "bg-white text-black"
  }`;

  const selectClass = `border rounded px-2 py-1 ${
    darkMode ? "dark:bg-gray-700 dark:border-gray-600 dark:text-white" : "bg-white text-black"
  }`;



  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="w-full px-4 py-2 border rounded-lg text-left focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600">
          {value ? format(new Date(value), "MM/yyyy") : "Seleccionar mes/año"}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-4 flex gap-2 justify-center">
        <select 
            value={month} 
            onChange={(e) => handleMonthChange(parseInt(e.target.value))} className={selectClass}>          
            {months.map((m) => (
                <option key={m} value={m}>
                {m.toString().padStart(2, "0")}
                </option>
            ))}
        </select>

        <select 
            value={year} 
            onChange={(e) => handleYearChange(parseInt(e.target.value))} className={selectClass}>
            {years.map((y) => (
                <option key={y} value={y}>{y}</option>
            ))}
        </select>
      </PopoverContent>
    </Popover>
  );
}
