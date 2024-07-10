import { z } from "zod";
import env from "../env/env.ts";
import VaccineAppointmentSchema from "../zod/index.ts";

type VaccineAppointment = z.infer<typeof VaccineAppointmentSchema>;

async function fetcher(url: URL | string, options: RequestInit = {}) {
  const response = await fetch(`${env.VITE_BACKEND_URL}${url}`, options);
  const data = await response.json();

  if (response.ok) return data;

  throw new Error(data.error);
}

fetcher.post = async function (url: URL | string, data: VaccineAppointment) {
  return fetcher(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

fetcher.delete = function (url: URL | string) {
  return fetcher(url, {
    method: "DELETE",
  });
};

fetcher.put = async function (url: URL | string, data: { status: string }) {
  return fetcher(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export default fetcher;
