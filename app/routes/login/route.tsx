import type { SubmissionResult } from "@conform-to/dom";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { z } from "zod";
import { redirectIfLoggedInLoader, setAuthOnResponse } from "~/auth";
import { FORM_INTENTS, INTENT } from "~/constants";
import { login } from "./queries";
import { redirect } from "@vercel/remix";

export const loader = redirectIfLoggedInLoader;

export default function Login() {
  const lastResult = useActionData<typeof action>();
  const navigation = useNavigation();

  const [form, fields] = useForm({
    lastResult: lastResult as SubmissionResult<string[]> | null | undefined,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: "onSubmit",
  });

  const isSubmitting = navigation.formData?.get(INTENT) === FORM_INTENTS.login;

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div style={{ width: "100%", maxWidth: "20rem" }}>
        <Form method="post" {...getFormProps(form)}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor={fields.email.id}
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              Email
            </label>
            <input
              {...getInputProps(fields.email, { type: "email" })}
              placeholder="Email"
              style={{ display: "block", width: "100%" }}
            />
            {!fields.email.valid && (
              <div style={{ color: "red" }}>{fields.email.errors}</div>
            )}
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor={fields.password.id}
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              Password
            </label>
            <input
              {...getInputProps(fields.password, { type: "password" })}
              placeholder="Password"
              style={{ display: "block", width: "100%" }}
            />
            {!fields.password.valid && (
              <div style={{ color: "red" }}>{fields.password.errors}</div>
            )}
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
          >
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                backgroundColor: "darkcyan",
                color: "white",
                padding: "1rem",
                borderRadius: "0.5rem",
              }}
            >
              Login
            </button>
          </div>
        </Form>
      </div>
    </main>
  );
}

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { email, password } = submission.value;

  const userId = await login(email, password);
  if (!userId) {
    return submission.reply({
      fieldErrors: {
        email: ["Invalid email or password"],
      },
    });
  }

  let response = redirect("/board");
  return setAuthOnResponse(response, userId);
}
