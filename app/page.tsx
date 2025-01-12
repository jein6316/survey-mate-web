"use client";

import { LoginForm } from "@/app/component/form/LoginForm";
import { SubmitButton } from "@/app/component/button/Submit-button";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <LoginForm />
    </QueryClientProvider>
  );
}
