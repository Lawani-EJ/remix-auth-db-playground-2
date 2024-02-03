import type { SubmissionResult } from "@conform-to/react";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { redirect, type ActionFunctionArgs } from "@vercel/remix";
import { z } from "zod";
import { redirectIfLoggedInLoader, setAuthOnResponse } from "~/auth";
import { createAccount } from "./queries";
import { FORM_INTENTS, INTENT } from "~/constants";
import { checkUserExists } from "./validate";

export const loader = redirectIfLoggedInLoader;

export default function Register() {
  const lastResult = useActionData<typeof action>();
  const navigation = useNavigation();

  const [form, fields] = useForm({
    lastResult: lastResult as SubmissionResult<string[]> | null | undefined,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: "onSubmit",
  });

  const isSubmitting =
    navigation.formData?.get(INTENT) === FORM_INTENTS.register;

  console.log({
    lastResult,
    fields,
  });

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

          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor={fields.confirmPassword.id}
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              Confirm Password
            </label>
            <input
              {...getInputProps(fields.confirmPassword, { type: "password" })}
              placeholder="Confirm Password"
              style={{ display: "block", width: "100%" }}
            />
            {!fields.confirmPassword.valid && (
              <div style={{ color: "red" }}>
                {fields.confirmPassword.errors}
              </div>
            )}
          </div>

          <div
            style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
          >
            <button
              type="submit"
              name={INTENT}
              value={FORM_INTENTS.register}
              disabled={isSubmitting}
              style={{
                backgroundColor: "darkcyan",
                color: "white",
                padding: "1rem",
                borderRadius: "0.5rem",
              }}
            >
              Register
            </button>
          </div>
        </Form>
      </div>
    </main>
  );
}

const schema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { email, password } = submission.value;

  const userExists = await checkUserExists(email);
  if (userExists) {
    return submission.reply({
      fieldErrors: {
        email: ["Email already in use"],
      },
    });
  }

  let user = await createAccount(email, password);
  return setAuthOnResponse(redirect("/board"), user.id);
}
