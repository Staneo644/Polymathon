// app/components/ErrorHandler.tsx
"use client";

import { useEffect, useState } from "react";

interface ErrorHandlerProps {
  error: string | null;
}

const ErrorHandler: React.FC<ErrorHandlerProps> = ({ error }) => {
  const [displayError, setDisplayError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      setDisplayError(error);
    } else {
      setDisplayError(null);
    }
  }, [error]);

  return displayError ? (
    <div className="text-red-500 mt-2 text-center">{displayError}</div>
  ) : null;
};

export default ErrorHandler;
