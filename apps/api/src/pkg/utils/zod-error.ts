import type { ZodError } from "zod";

const parseZodError = (err: ZodError) => {
  try {
    const arr = JSON.parse(err.message) as Array<{
      message: string;
      path: Array<string>;
    }>;
    return arr.map((item) => ({
      path: item.path.join("."),
      message: item.message,
    }));
  } catch {
    return err.message;
  }
};

export { parseZodError };
