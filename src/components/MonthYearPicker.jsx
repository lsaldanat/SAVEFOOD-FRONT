import { useEffect, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { se } from "date-fns/locale/se";

export default function MonthYearPicker({
  value,
  onChange,
  fromYear = 2025,
  toYear = 2032,
  darkMode = false
}) {
  const [day, setDay] = useState(value ? new Date(value).getDate() : 1);
  const [month, setMonth] = useState((value ? new Date(value).getMonth() + 1  : new Date().getMonth()) + 1);
  const [year, setYear] = useState(value ? new Date(value).getFullYear() : new Date().getFullYear());

  
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: toYear - fromYear + 1 }, (_, i) => fromYear + i);
  

   // Días del mes según mes y año
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);



  useEffect(() => {
    if (value) {
      const d = new Date(value).toISOString().split("T")[0];
      // setDay(d.getDate());
      // setMonth(d.getMonth() + 1);
      // setYear(d.getFullYear());
      setDay(parseInt(d.split("-")[2]));
      setMonth(parseInt(d.split("-")[1]));
      setYear(parseInt(d.split("-")[0]));
    }
  }, [value]);

    // Actualiza la fecha en formato ISO (YYYY-MM-DD)
    const updateDate = (d, m, y) => {
      // Siempre formatear como "YYYY-MM-DD"
      const dateString = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      onChange(dateString);
    };

    
    const handleDayChange = (newDay) => {
      setDay(newDay);
      updateDate(newDay, month, year);
    };

    const handleMonthChange = (newMonth) => {
      const maxDay = new Date(year, newMonth, 0).getDate();
      const newDay = day > maxDay ? maxDay : day;
      setMonth(newMonth);
      setDay(newDay);
      updateDate(newDay, newMonth, year);
    };

    const handleYearChange = (newYear) => {
      const maxDay = new Date(newYear, month, 0).getDate();
      const newDay = day > maxDay ? maxDay : day;
      setYear(newYear);
      setDay(newDay);
      updateDate(newDay, month, newYear);
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
          {/* {value ? format(new Date(value), "dd/MM/yyyy") : "Seleccionar mes/año"} */}
          {value ? value.split("-")[2]+"/"+value.split("-")[1]+"/"+value.split("-")[0] : "Seleccionar fecha"}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-4 flex gap-2 justify-center">

         <select value={day} onChange={(e) => handleDayChange(parseInt(e.target.value))} className={selectClass}>
          {days.map((d) => (
            <option key={d} value={d}> {d.toString().padStart(2, "0")} </option>
          ))}
        </select>

        <select value={month} onChange={(e) => handleMonthChange(parseInt(e.target.value))} className={selectClass}>          
            {months.map((m) => (
                <option key={m} value={m}>{m.toString().padStart(2, "0")}</option>
            ))}
        </select>

        <select value={year} onChange={(e) => handleYearChange(parseInt(e.target.value))} className={selectClass}>
            {years.map((y) => (
                <option key={y} value={y}>{y}</option>
            ))}
        </select>
      </PopoverContent>
    </Popover>
  );
}
