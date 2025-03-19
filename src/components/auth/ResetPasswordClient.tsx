"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ResetPasswordClientProps {
  token: string;
}

export default function ResetPasswordClient({ token }: ResetPasswordClientProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isValidToken, setIsValidToken] = useState(true);

  useEffect(() => {
    // Kontrollera om token är giltig
    const validateToken = async () => {
      try {
        const response = await fetch(`/api/reset-password/validate?token=${token}`);
        const data = await response.json();

        if (!response.ok) {
          setIsValidToken(false);
          setError(data.error || "Ogiltig eller utgången återställningslänk");
        }
      } catch (error) {
        setIsValidToken(false);
        setError("Ett fel uppstod vid validering av återställningslänk");
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Validera lösenord
    if (password !== confirmPassword) {
      setError("Lösenorden matchar inte");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 8) {
      setError("Lösenordet måste vara minst 8 tecken långt");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/reset-password/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Ett fel uppstod vid återställning av lösenord");
        setIsSubmitting(false);
        return;
      }

      setIsSubmitted(true);
    } catch (error) {
      setError("Ett fel uppstod vid återställning av lösenord");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-pink-600">Återställ lösenord</h1>

        {!isValidToken ? (
          <div className="text-center">
            <div className="mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="text-gray-700 mb-4">
              {error || "Ogiltig eller utgången återställningslänk"}
            </p>
            <p className="text-gray-700 mb-6">
              Vänligen begär en ny återställningslänk.
            </p>
            <Link href="/forgot-password" className="text-pink-600 hover:underline">
              Begär ny återställningslänk
            </Link>
          </div>
        ) : isSubmitted ? (
          <div className="text-center">
            <div className="mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-700 mb-4">
              Ditt lösenord har återställts!
            </p>
            <p className="text-gray-700 mb-6">
              Du kan nu logga in med ditt nya lösenord.
            </p>
            <Link href="/login" className="text-pink-600 hover:underline">
              Gå till inloggning
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <p className="text-gray-700 mb-4">
              Ange ditt nya lösenord nedan.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Nytt lösenord
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                  minLength={8}
                />
                <p className="text-xs text-gray-500 mt-1">Minst 8 tecken</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Bekräfta nytt lösenord
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                  minLength={8}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Återställer..." : "Återställ lösenord"}
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
} 