import type { DayPickerProps } from "react-day-picker";
import { arEG } from "react-day-picker/locale";
import MasrofyCalendarDropdown from "@/components/date/MasrofyCalendarDropdown";

/** Shared DayPicker config: Arabic RTL + themed month/year menus. */
export const masrofyDayPickerProps = {
  locale: arEG,
  dir: "rtl" as const,
  captionLayout: "dropdown" as const,
  startMonth: new Date(2018, 0),
  endMonth: new Date(new Date().getFullYear() + 2, 11),
  className: "masrofy-daypicker",
  components: {
    Dropdown: MasrofyCalendarDropdown,
  },
} satisfies Partial<DayPickerProps>;
