'use client'

import { useState } from 'react'

import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

function formatDate(date: Date | undefined) {
  if (!date) {
    return ''
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }

  return !isNaN(date.getTime())
}

export const DestinationDate = () => {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>()
  const [month, setMonth] = useState<Date | undefined>(date)
  const [value, setValue] = useState(formatDate(date))

  return (
    <div className='w-full space-y-2'>
      <Label htmlFor='destination-date' className='px-1'>
        Date
      </Label>
      <div className='relative flex gap-2'>
        <Input
          id='destination-date'
          value={value}
          placeholder='Month Day, Year'
          className='h-10 rounded-full pr-10'
          onChange={e => {
            const date = new Date(e.target.value)

            setValue(e.target.value)

            if (isValidDate(date)) {
              setDate(date)
              setMonth(date)
            }
          }}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setOpen(true)
            }
          }}
          required
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button id='date-picker' variant='ghost' className='absolute top-1/2 right-2 size-6 -translate-y-1/2'>
              <CalendarIcon className='size-3.5' />
              <span className='sr-only'>Pick a date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto overflow-hidden p-0' align='end' alignOffset={-8} sideOffset={10}>
            <Calendar
              mode='single'
              selected={date}
              month={month}
              onMonthChange={setMonth}
              onSelect={date => {
                setDate(date)
                setValue(formatDate(date))
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export const FlightsDate = () => {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>()
  const [month, setMonth] = useState<Date | undefined>(date)
  const [value, setValue] = useState(formatDate(date))

  return (
    <div className='w-full space-y-2'>
      <Label htmlFor='flights-date' className='px-1'>
        Date
      </Label>
      <div className='relative flex gap-2'>
        <Input
          id='flights-date'
          value={value}
          placeholder='Month Day, Year'
          className='h-10 rounded-full pr-10'
          onChange={e => {
            const date = new Date(e.target.value)

            setValue(e.target.value)

            if (isValidDate(date)) {
              setDate(date)
              setMonth(date)
            }
          }}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setOpen(true)
            }
          }}
          required
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button id='date-picker' variant='ghost' className='absolute top-1/2 right-2 size-6 -translate-y-1/2'>
              <CalendarIcon className='size-3.5' />
              <span className='sr-only'>Pick a date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto overflow-hidden p-0' align='end' alignOffset={-8} sideOffset={10}>
            <Calendar
              mode='single'
              selected={date}
              month={month}
              onMonthChange={setMonth}
              onSelect={date => {
                setDate(date)
                setValue(formatDate(date))
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export const HotelsDateRange = () => {
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState<DateRange | undefined>(undefined)

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return ''
    if (!range?.to) return formatDate(range.from)

    return `${formatDate(range.from)} - ${formatDate(range.to)}`
  }

  const [value, setValue] = useState(formatDateRange(range))

  const parseInputRange = (inputValue: string) => {
    const parts = inputValue.split(' - ')

    if (parts.length === 2) {
      const fromDate = new Date(parts[0])
      const toDate = new Date(parts[1])

      if (isValidDate(fromDate) && isValidDate(toDate)) {
        return { from: fromDate, to: toDate }
      }
    } else if (parts.length === 1) {
      const date = new Date(parts[0])

      if (isValidDate(date)) {
        return { from: date, to: undefined }
      }
    }

    return undefined
  }

  return (
    <div className='w-full space-y-2'>
      <Label htmlFor='hotels-date-range' className='px-1'>
        Date Range
      </Label>
      <div className='relative flex gap-2'>
        <Input
          id='hotels-date-range'
          value={value}
          placeholder='Month Day, Year - Month Day, Year'
          className='h-10 rounded-full pr-10'
          onChange={e => {
            setValue(e.target.value)

            const parsedRange = parseInputRange(e.target.value)

            if (parsedRange) {
              setRange(parsedRange)
            }
          }}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setOpen(true)
            }
          }}
          required
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button id='date-picker' variant='ghost' className='absolute top-1/2 right-2 size-6 -translate-y-1/2'>
              <CalendarIcon className='size-3.5' />
              <span className='sr-only'>Pick a date range</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto overflow-hidden p-0' align='end' alignOffset={-8} sideOffset={10}>
            <Calendar
              mode='range'
              selected={range}
              onSelect={range => {
                setRange(range)
                setValue(formatDateRange(range))
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
