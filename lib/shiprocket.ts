const SHIPROCKET_API_URL =
  process.env.SHIPROCKET_API_URL || "https://apiv2.shiprocket.in";

type ShiprocketLoginResponse = {
  token?: string;
  message?: string;
};

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

export async function getShiprocketToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Shiprocket API credentials are missing. Check SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD."
    );
  }

  const response = await fetch(
    `${SHIPROCKET_API_URL}/v1/external/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
      cache: "no-store",
    }
  );

  const data: ShiprocketLoginResponse = await response.json();

  if (!response.ok || !data.token) {
    console.error("Shiprocket authentication failed:", data);

    throw new Error(
      data.message || "Unable to authenticate with Shiprocket."
    );
  }

  cachedToken = data.token;

  // Shiprocket documents the token as valid for 240 hours.
  // Refresh slightly before the documented expiry.
  tokenExpiresAt = Date.now() + 9 * 24 * 60 * 60 * 1000;

  return cachedToken;
}