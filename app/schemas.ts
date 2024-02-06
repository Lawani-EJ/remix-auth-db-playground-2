import { z } from "zod";

export const RoleSchema = z.enum(["owner", "editor", "viewer"]);
