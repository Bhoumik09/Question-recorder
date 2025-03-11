"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const formSchema = z.object({
  answers: z.record(z.enum(["Yes", "No"])), // Store Yes/No responses for each question
});

export default function Home() {
  const questionsArray = ["Do you like programming?", "Have you used React before?", "Do you enjoy coding?"];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answers: {},
    },
  });

  const [submittedData, setSubmittedData] = useState<z.infer<typeof formSchema> | null>(null);
  const [open, setOpen] = useState(false);


  const onSubmit = (data: any) => {
    setSubmittedData(data); // Store submitted data
    setOpen(true); // Show modal with submitted answers
  };

  return (
    <div className=" flex flex-col bg-gray-100 h-screen overflow-y-scroll  space-y-4">
      <h2 className="text-xl font-bold mb-4 text-center p-6 bg-pink-500 w-full">Answer Yes or No</h2>
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-8">
          {questionsArray.map((question, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`answers.${question}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">{`${index + 1}) ${question}`}</FormLabel>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value === "Yes"} // 🔥 Watching state
                          onCheckedChange={() => field.onChange("Yes")}
                        />
                      </FormControl>
                      <span className="text-md">Yes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value === "No"} // 🔥 Watching state
                          onCheckedChange={() => field.onChange("No")}
                        />
                      </FormControl>
                      <span className="text-md">No</span>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </Form>

      {/* Modal for Submitted Answers */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <div className="p-4 space-y-4">
            <DialogHeader>
              <DialogTitle>Your Responses</DialogTitle>
            </DialogHeader>
            {submittedData &&
              Object.entries(submittedData.answers).map(([question, answer], index) => (
                <div key={index} className="flex justify-between">
                  <span>{question}</span>
                  <span className="font-bold">{answer}</span>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
