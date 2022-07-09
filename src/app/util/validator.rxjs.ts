import { map, tap } from "rxjs";
import { z, ZodType } from "zod";

export function parseResponse<K>(schema: ZodType<K>) {
  type ReturnType = z.infer<typeof schema>;
  return map((val) => schema.parse(val));
}
