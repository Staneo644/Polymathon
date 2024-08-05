"use client";
import React, { useState } from "react";
import { login, signup } from "./action";
import LabeledInput from "@/components/labeledInput";
import ActionButton from "@/components/actionButton";
import ErrorHandler from "@/components/errorHandler";

const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (formData: FormData) => {
    const result = await login(formData);
    if (!result) return;
    setError(result.error);
  };

  const handleSignup = async (formData: FormData) => {
    const result = await signup(formData);
    if (!result) return;
    setError(result.error);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full ">
      <form className="w-96 mx-auto space-y-4 bg-gray-800 rounded-2xl p-5">
        <LabeledInput
          id="email"
          name="email"
          type="email"
          label="Email"
          required
        />
        <LabeledInput
          id="password"
          name="password"
          type="password"
          label="Password"
          required
        />
        <div className="flex flex-col items-center">
          <ActionButton
            onClick={() =>
              handleLogin(new FormData(document.querySelector("form")!))
            }
            label="Log in"
          />
          <ActionButton
            onClick={() =>
              handleSignup(new FormData(document.querySelector("form")!))
            }
            label="Sign up"
          />
        </div>
        <ErrorHandler error={error} />
      </form>
    </div>
  );
};

export default LoginPage;
