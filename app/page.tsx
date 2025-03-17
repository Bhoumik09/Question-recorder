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
  answers: z.record(z.enum(["Yes", "No", ""])), // Store Yes/No responses for each question
});

export default function Home() {
  const questionsArray = [
    "Found support through which tool :",
    "Is it a PL7 Federal account ?",
    "Is the MT & model EOS ?",
    "Did EEH find the account name with an Active Exception on Monday board ?",
    "Has the case been released using a Manager's Override / NDS ?",
    "Has the SWARM been created ?",
    "Did EEH open a CONGA / INTERNAL CSP support ticket for the case ?",
    "Update the Ticket :",
    "<For cases that are kept on hold> Is the machine covered in Cocoon ?"
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answers: {},
    },
  });

  const [submittedData, setSubmittedData] = useState<z.infer<typeof formSchema> | null>(null);
  const [open, setOpen] = useState(false);

  const onSubmit = (data: { answers: Record<string, "Yes" | "No" | ""> }) => {
    setSubmittedData(data);
    setOpen(true);
  };

  return (
    <div className="flex flex-col bg-gray-100 space-y-4">
      <h2 className="text-xl font-bold mb-4 text-center p-6 bg-pink-500 w-full">
        Answer Yes or No or Blank
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-8">
          {questionsArray.map((question, index) => {
            const sanitizedName = question.replace(/[^a-zA-Z0-9]/g, "_"); // Replace special characters with _
            return (
              <FormField
                key={sanitizedName} // Use sanitizedName to avoid key conflicts
                control={form.control}
                name={`answers.${sanitizedName}`} // Store sanitized name in form state
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">{`${index + 1}) ${question}`}</FormLabel>
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            className="bg-white shadow-black"
                            checked={field.value === "Yes"}
                            onCheckedChange={() => field.onChange("Yes")}
                          />
                        </FormControl>
                        <span className="text-md">Yes</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            className="bg-white shadow-black"
                            checked={field.value === "No"}
                            onCheckedChange={() => field.onChange("No")}
                          />
                        </FormControl>
                        <span className="text-md">No</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            className="bg-white shadow-black"
                            checked={field.value === ""}
                            onCheckedChange={() => field.onChange("")}
                          />
                        </FormControl>
                        <span className="text-md">Blank</span>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>

      {/* Modal for Submitted Answers */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <div className="p-4 space-y-4">
            <DialogHeader>
              <DialogTitle>Your Responses</DialogTitle>
            </DialogHeader>
            {submittedData &&
              Object.entries(submittedData.answers).map(([sanitizedKey, answer], index) => {
                const originalQuestion = questionsArray.find(
                  (q) => q.replace(/[^a-zA-Z0-9]/g, "_") === sanitizedKey
                ); // Find original question from sanitized key

                return (
                  <div key={index} >
                      {originalQuestion || sanitizedKey} <span className="font-bold">{answer}</span>
                  </div>
                );
              })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
