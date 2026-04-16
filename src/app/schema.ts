import z from "zod";


export const EnvVarSchema = z.object({
    name: z.string()
        .trim()
        .min(1, "Name cannot be empty")
        .regex(/^[A-Za-z0-9_]+$/, "Only letters, numbers, and underscores allowed in name"),
    value: z.string()
        .trim()
        .min(1, "Value cannot be empty")
});