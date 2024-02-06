import { z } from "zod";

export const RoleSchema = z.enum(["owner", "editor", "viewer"]);

export type Role = z.infer<typeof RoleSchema>;
