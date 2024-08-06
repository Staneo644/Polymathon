"use client";
import React, { useState } from "react";
import { login, signup } from "./action";
import LabeledInput from "@/components/labeledInput";
import ActionButton from "@/components/actionButton";
import ErrorHandler from "@/components/errorHandler";

const LoginPage: React.FC = () => {
  const [mailsent, setMailsent] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (formData: FormData) => {
    const result = await login(formData);
    if (!result) return;
    setError(result.error);
  };

  const handleSignup = async (formData: FormData) => {
    const result = await signup(formData);
    if (!result) return;
    if (result.error) setError(result.error);
    if (result.data) setMailsent(true);
  };

  console.log(mailsent);

  return (
    <div className="flex flex-col items-center justify-center h-full ">
      {mailsent ? (
        <div>
          <h1 className="text-3xl text-white">
            Un email de confirmation vous a été envoyé
          </h1>
          <h2 className="text-white">
            Veuillez confirmer votre adresse email pour continuer, vous pouvez
            fermer cette page
          </h2>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default LoginPage;
