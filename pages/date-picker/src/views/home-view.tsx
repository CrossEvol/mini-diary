import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { formatAtom } from '@/atoms/format.atom'
import { portAtom } from '@/atoms/port.atom'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { EFormat } from '@/shared/enums'
import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'

const EventDataSchema = z.object({
  format: z.enum([EFormat.HTML, EFormat.JSON, EFormat.MARKDOWN]),
  path: z.string(),
  content: z.string(),
  contentToBeImported: z.string()
})

type EventData = z.infer<typeof EventDataSchema>

const NavigateDataSchema = EventDataSchema.extend({
  date: z.string(),
  shouldBeOverridden: z.boolean()
})

export type NavigateData = z.infer<typeof NavigateDataSchema>

const FormSchema = z.object({
  chosenDate: z.date({
    required_error: 'A date of birth is required.'
  })
})

export function CalendarForm() {
  const navigate = useNavigate()
  const [port] = useAtom(portAtom)
  const [outputFormat] = useAtom(formatAtom)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      chosenDate: new Date()
    }
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (port) {
      port.postMessage({ date: data.chosenDate, format: outputFormat })
      port.onmessage = (event: MessageEvent<EventData>) => {
        if (!event.data.content) {
          toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: 'There was a problem with your request.'
          })
          return
        }
        switch (event.data.format) {
          case EFormat.HTML: {
            navigate(`/${EFormat.HTML}`, {
              state: { ...event.data }
            })
            break
          }
          case EFormat.JSON: {
            navigate(`/${EFormat.JSON}`, {
              state: { ...event.data }
            })
            break
          }
          case EFormat.MARKDOWN: {
            navigate(`/${EFormat.MARKDOWN}`, {
              state: { ...event.data }
            })
            break
          }
        }
      }
      port.start()
    }

    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      )
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="chosenDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto size-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

const HomeView = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <CalendarForm />
    </div>
  )
}

export default HomeView
