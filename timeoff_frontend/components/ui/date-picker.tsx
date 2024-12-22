"use client"

import * as React from "react"
import { format, isBefore, startOfToday, addDays, isWithinInterval } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { takeLeave } from "@/pages/utils/api"

export function DatePickerWithRange({
    className,
}: React.HTMLAttributes<HTMLDivElement>) {
    const [date, setDate] = React.useState<DateRange | undefined>(undefined)

    const handleTakeLeave = async () => {
        if (date?.from && date?.to) {
            try {
                const response = await takeLeave("user-id", format(date.from, "yyyy-MM-dd"), format(date.to, "yyyy-MM-dd"))
                console.log("Leave taken successfully:", response)
            } catch (error) {
                console.error("Error taking leave:", error)
            }
        }
    }

    const disabledDays = (day: Date) => {
        const today = startOfToday()
        const fiveDaysAfterToday = addDays(today, 5)
        return isBefore(day, today) || isWithinInterval(day, { start: today, end: fiveDaysAfterToday })
    }

    return (
        <div className={cn("grid gap-2", className)}>
            <p className="text-sm text-muted-foreground text-black">You can request leave days 5 days after the current day (today)</p>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[255px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                        disabled={disabledDays}
                    />
                </PopoverContent>
            </Popover>
            <Button onClick={handleTakeLeave} disabled={!date?.from || !date?.to}>
                Take Leave
            </Button>
        </div>
    )
}
