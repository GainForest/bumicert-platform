type InviteCodeEmailProps = {
  inviteCode: string;
  pdsDomain: string;
};

export function InviteCodeEmail({ inviteCode, pdsDomain }: InviteCodeEmailProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        color: "#111827",
        backgroundColor: "#ffffff",
        padding: "24px",
      }}
    >
      <h1 style={{ fontSize: "20px", margin: "0 0 12px" }}>
        Your Bumicerts Invite Code
      </h1>
      <p style={{ margin: "0 0 16px", fontSize: "14px" }}>
        Use this invite code to complete signup on <strong>{pdsDomain}</strong>.
      </p>
      <div
        style={{
          padding: "12px 16px",
          borderRadius: "8px",
          backgroundColor: "#f9fafb",
          border: "1px solid #e5e7eb",
          fontSize: "20px",
          fontWeight: 600,
          letterSpacing: "0.04em",
          display: "inline-block",
        }}
      >
        {inviteCode}
      </div>
      <p style={{ margin: "16px 0 0", fontSize: "12px", color: "#6b7280" }}>
        If you did not request this invite, you can ignore this email.
      </p>
    </div>
  );
}
