'use client'

import { MapPinIcon, UsersIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MotionPreset } from '@/components/ui/motion-preset'

import {
  DestinationDate,
  FlightsDate,
  HotelsDateRange
} from '@/components/shadcn-studio/blocks/hero-section-02/form'

const HeroSection = () => {
  return (
    <section className='-mt-16 min-h-[calc(100dvh-4rem)] flex-1 pt-16'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8 lg:py-24'>
        <MotionPreset
          fade
          zoom={{ initialScale: 0.65 }}
          transition={{ duration: 0.45 }}
          className='flex h-192 flex-col justify-center gap-12 overflow-hidden rounded-xl bg-[url(https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/hero/image-17.png?width=1216&format=auto)] bg-cover bg-center p-12 sm:gap-16 sm:p-16 lg:gap-24 lg:p-24'
        >
          <div className='space-y-1.5'>
            <MotionPreset
              component='p'
              fade
              slide
              delay={0.4}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className='text-2xl font-medium text-white sm:text-3xl'
            >
              Your Portal to Worldwide Adventures
            </MotionPreset>
            <MotionPreset
              component='h1'
              fade
              slide
              delay={0.7}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className='bg-gradient-to-b from-white/50 to-white/90 bg-clip-text text-3xl leading-[1.29167] font-bold break-all text-transparent uppercase sm:text-7xl lg:text-9xl'
            >
              GlobeTrekker
            </MotionPreset>
          </div>

          <MotionPreset fade slide delay={1} transition={{ duration: 0.45, ease: 'easeOut' }}>
            <Tabs defaultValue='destination' className='gap-0'>
              <TabsList className='rounded-b-none'>
                <TabsTrigger value='destination'>Destination</TabsTrigger>
                <TabsTrigger value='flights'>Flights</TabsTrigger>
                <TabsTrigger value='hotels'>Hotels</TabsTrigger>
              </TabsList>

              <TabsContent value='destination' className='bg-card rounded-lg rounded-tl-none p-6'>
                <form className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4' onSubmit={e => e.preventDefault()}>
                  <div className='w-full space-y-2'>
                    <Label htmlFor='location'>Location</Label>
                    <div className='relative'>
                      <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50'>
                        <MapPinIcon className='size-4' />
                        <span className='sr-only'>Location</span>
                      </div>
                      <Input
                        id='location'
                        type='text'
                        placeholder='Location'
                        className='peer h-10 rounded-full pl-9'
                        required
                      />
                    </div>
                  </div>
                  <DestinationDate />
                  <div className='flex flex-col gap-2'>
                    <Label htmlFor='person'>Person</Label>
                    <Select required>
                      <SelectTrigger id='person' className='relative !h-10 w-full rounded-full pl-9'>
                        <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 group-has-[select[disabled]]:opacity-50'>
                          <UsersIcon className='size-4' />
                          <span className='sr-only'>Person</span>
                        </div>
                        <SelectValue placeholder='Person' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Choose</SelectLabel>
                          <SelectItem value='1'>1 Person</SelectItem>
                          <SelectItem value='2'>2 Persons</SelectItem>
                          <SelectItem value='3'>3 Persons</SelectItem>
                          <SelectItem value='4'>4 Persons</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type='submit' size='lg' className='cursor-pointer self-end rounded-full'>
                    Search Now
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value='flights' className='bg-card rounded-lg rounded-tl-none p-6'>
                <form className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4' onSubmit={e => e.preventDefault()}>
                  <div className='w-full space-y-2'>
                    <Label htmlFor='city-or-hotel'>Search</Label>
                    <div className='relative'>
                      <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50'>
                        <MapPinIcon className='size-4' />
                        <span className='sr-only'>Location</span>
                      </div>
                      <Input
                        id='city-or-hotel'
                        type='text'
                        placeholder='City or Hotel'
                        className='peer h-10 rounded-full pl-9'
                        required
                      />
                    </div>
                  </div>
                  <FlightsDate />
                  <div className='flex flex-col gap-2'>
                    <Label htmlFor='passenger'>Passenger</Label>
                    <Select required>
                      <SelectTrigger id='passenger' className='relative !h-10 w-full rounded-full pl-9'>
                        <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 group-has-[select[disabled]]:opacity-50'>
                          <UsersIcon className='size-4' />
                          <span className='sr-only'>Passenger</span>
                        </div>
                        <SelectValue placeholder='Passenger' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Choose</SelectLabel>
                          <SelectItem value='1'>1 Passenger</SelectItem>
                          <SelectItem value='2'>2 Passengers</SelectItem>
                          <SelectItem value='3'>3 Passengers</SelectItem>
                          <SelectItem value='4'>4 Passengers</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type='submit' size='lg' className='cursor-pointer self-end rounded-full'>
                    Search Now
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value='hotels' className='bg-card rounded-lg rounded-tl-none p-6'>
                <form className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4' onSubmit={e => e.preventDefault()}>
                  <div className='w-full space-y-2'>
                    <Label htmlFor='city'>City</Label>
                    <div className='relative'>
                      <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50'>
                        <MapPinIcon className='size-4' />
                        <span className='sr-only'>Location</span>
                      </div>
                      <Input
                        id='city'
                        type='text'
                        placeholder='City'
                        className='peer h-10 rounded-full pl-9'
                        required
                      />
                    </div>
                  </div>
                  <HotelsDateRange />
                  <div className='flex flex-col gap-2'>
                    <Label htmlFor='guest'>Guest</Label>
                    <Select required>
                      <SelectTrigger id='guest' className='relative !h-10 w-full rounded-full pl-9'>
                        <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 group-has-[select[disabled]]:opacity-50'>
                          <UsersIcon className='size-4' />
                          <span className='sr-only'>Guest</span>
                        </div>
                        <SelectValue placeholder='Guest' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Choose</SelectLabel>
                          <SelectItem value='1'>1 Guest</SelectItem>
                          <SelectItem value='2'>2 Guests</SelectItem>
                          <SelectItem value='3'>3 Guests</SelectItem>
                          <SelectItem value='4'>4 Guests</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type='submit' size='lg' className='cursor-pointer self-end rounded-full'>
                    Search Now
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </MotionPreset>
        </MotionPreset>
      </div>
    </section>
  )
}

export default HeroSection
