import { Bot } from "lucide-react";
import { useForm, type SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { trpc, queryClient } from "../utils/trpc";
import { useState } from "react";
const formSchema = z.object({
  userPrompt: z.string().min(1, "Please enter a prompt"),
});

export default function AIAssistant() {
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = formMethods;

  const rescheduleMutation = useMutation(
    trpc.assistant.rescheduleTodos.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.todos.getTodos.queryKey(),
        });
      },
    })
  );

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    try {
      // Call your API to handle the AI request here
      console.log("User prompt submitted:", data.userPrompt);
      const res = await rescheduleMutation.mutateAsync({
        ...data,
        currentDateTime: new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, -5), // Convert to local ISO format without timezone
      });
      console.log("AI response:", res);
      setAiResponse(res);
      // Reset the form or handle success
      reset();
    } catch (error) {
      console.error("Error submitting AI prompt:", error);
      reset();
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-4">AI Assistant</h2>
      <p className="text-gray-300 mb-6">
        Ask Taskmate AI to manage your schedule using natural language.
      </p>
      <div className="relative">
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              placeholder='e.g., "Schedule a meeting for tomorrow at 2pm"'
              className="w-full bg-white/10 text-white placeholder-gray-400 px-4 py-3 pr-13 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              {...register("userPrompt")}
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"
              disabled={isSubmitting}
              type="submit"
            >
              <Bot className="w-5 h-5" />
            </button>
          </form>
        </FormProvider>
      </div>
      {errors.userPrompt && (
        <p className="text-red-500 text-sm mt-2">{errors.userPrompt.message}</p>
      )}
      {isSubmitting ? (
        <p className="text-gray-400 text-sm mt-2">Processing your request...</p>
      ) : (
        aiResponse && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">AI Response</h3>
            <pre className="text-gray-200 whitespace-pre-wrap">
              {aiResponse}
            </pre>
          </div>
        )
      )}
    </div>
  );
}
