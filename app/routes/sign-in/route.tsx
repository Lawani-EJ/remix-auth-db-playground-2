export default function SignIn() {
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
        <form>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="username"
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Username"
              style={{ display: "block", width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="password"
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              style={{ display: "block", width: "100%" }}
            />
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
          >
            <button
              type="submit"
              style={{
                backgroundColor: "darkcyan",
                color: "white",
                padding: "1rem",
                borderRadius: "0.5rem",
              }}
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
