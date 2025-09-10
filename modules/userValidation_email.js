import { z } from "zod";

const emailSchema = z.object({
    email: z.string().min(1, {message: "Email is required"}).email({message: "Email is not a valid syntax"})
});

export default emailSchema;