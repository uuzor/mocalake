import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { Calendar, MapPin, Music, Users, DollarSign, Image } from "lucide-react";

const createEventSchema = z.object({
  title: z.string().min(1, "Event title is required").max(100, "Title must be under 100 characters"),
  description: z.string().optional(),
  artistName: z.string().min(1, "Artist name is required").max(50, "Artist name must be under 50 characters"),
  venue: z.string().min(1, "Venue is required").max(100, "Venue must be under 100 characters"),
  eventDate: z.string().min(1, "Event date is required"),
  ticketPrice: z.string().min(1, "Ticket price is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Price must be a positive number"
  ),
  maxTickets: z.string().min(1, "Maximum tickets is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Maximum tickets must be a positive number"
  ),
  imageUrl: z.string().url("Please enter a valid image URL").optional().or(z.literal("")),
});

type CreateEventForm = z.infer<typeof createEventSchema>;

export default function CreateEvent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateEventForm>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      artistName: "",
      venue: "",
      eventDate: "",
      ticketPrice: "",
      maxTickets: "",
      imageUrl: "",
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async (data: CreateEventForm) => {
      const eventData = {
        ...data,
        eventDate: new Date(data.eventDate).toISOString(),
        ticketPrice: parseInt(data.ticketPrice),
        maxTickets: parseInt(data.maxTickets),
        imageUrl: data.imageUrl || undefined,
      };
      
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create event');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({
        title: "Event created successfully!",
        description: "Your event is now live and ready for ticket sales.",
      });
      form.reset();
      setIsSubmitting(false);
    },
    onError: (error: any) => {
      console.error('Event creation error:', error);
      toast({
        title: "Failed to create event",
        description: error.message || "Please check your details and try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: CreateEventForm) => {
    setIsSubmitting(true);
    createEventMutation.mutate(data);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Event</h1>
        <p className="text-muted-foreground">
          Set up your event details and start selling tickets to your fans through MocaLake.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Event Details
          </CardTitle>
          <CardDescription>
            Fill in the information about your upcoming event
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your event title" 
                        data-testid="input-event-title"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      A clear, descriptive title for your event
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell fans about your event..."
                        className="min-h-24"
                        data-testid="input-event-description"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Additional details about the event experience
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="artistName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Music className="h-4 w-4" />
                        Artist Name
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Artist or performer name" 
                          data-testid="input-artist-name"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="venue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Venue
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Event venue location" 
                          data-testid="input-venue"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="eventDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Event Date & Time
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local" 
                        data-testid="input-event-date"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      When will your event take place?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="ticketPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Ticket Price
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="0"
                          min="0"
                          step="1"
                          data-testid="input-ticket-price"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>Price in dollars per ticket</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxTickets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Maximum Tickets
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="100"
                          min="1"
                          step="1"
                          data-testid="input-max-tickets"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>Total tickets available</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Event Image URL (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="url"
                        placeholder="https://example.com/event-image.jpg" 
                        data-testid="input-image-url"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      A promotional image for your event
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
                data-testid="button-create-event"
              >
                {isSubmitting ? "Creating Event..." : "Create Event"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}