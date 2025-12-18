"use client";
import React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useCopy from "@/hooks/use-copy";

const InviteCodePage = () => {
  const [emails, setEmails] = useState<string[]>([""]);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invites, setInvites] = useState<
    Array<{ email: string; inviteCode: string }>
  >([]);
  const { copy, isCopied } = useCopy();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInvites([]);
    setLoading(true);
    try {
      // Validate emails: non-empty and basic format
      const trimmed = emails.map((e) => (e ?? "").trim().toLowerCase());
      const hasEmpty = trimmed.some((e) => e.length === 0);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const hasInvalid = trimmed.some((e) => !emailRegex.test(e));
      if (hasEmpty) {
        setError("All email fields must be filled.");
        setLoading(false);
        return;
      }
      if (hasInvalid) {
        setError("One or more emails are invalid.");
        setLoading(false);
        return;
      }
      const res = await fetch("/api/atproto/invite-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: trimmed, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data?.message || data?.error || "Failed to generate invite code"
        );
      } else {
        const list: Array<{ email: string; inviteCode: string }> =
          Array.isArray(data?.invites) ? data.invites
          : data?.inviteCode && trimmed?.[0] ?
            [{ email: trimmed[0], inviteCode: data.inviteCode }]
          : [];
        setInvites(list);
      }
    } catch {
      setError("Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-3xl font-bold font-serif">Generate Invite Code</h1>
      <p className="font-medium text-lg text-muted-foreground mt-1">
        Internal tool for admins to create a one-time invite code bound to an
        email.
      </p>

      <Separator className="my-6" />

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" htmlFor="email-0">
              Emails
            </label>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEmails((prev) => [...prev, ""])}
            >
              + Add email
            </Button>
          </div>
          <div className="space-y-2">
            {emails.map((value, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2">
                <div className="col-span-10">
                  <Input
                    id={`email-${idx}`}
                    type="email"
                    placeholder="user@example.com"
                    value={value}
                    onChange={(e) => {
                      const next = [...emails];
                      next[idx] = e.target.value;
                      setEmails(next);
                    }}
                  />
                </div>
                <div className="col-span-2 flex items-center justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      setEmails((prev) => prev.filter((_, i) => i !== idx))
                    }
                    disabled={emails.length === 1}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="admin-password">
            Admin Password
          </label>
          <Input
            id="admin-password"
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error ?
          <div className="text-red-600 text-sm">{error}</div>
        : null}

        <Button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Invite Code"}
        </Button>
      </form>

      {invites.length > 0 ?
        <div className="mt-6 rounded-md border p-4">
          <div className="text-sm font-medium mb-3">Generated Invite Codes</div>
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 text-xs text-muted-foreground">
              Email
            </div>
            <div className="col-span-6 text-xs text-muted-foreground">
              Invite Code
            </div>
            <div className="col-span-2" />
            {invites.map(({ email, inviteCode }, idx) => (
              <React.Fragment key={idx}>
                <div className="col-span-4 text-sm break-all">{email}</div>
                <div className="col-span-6">
                  <code className="px-2 py-1 rounded bg-muted text-xs break-all w-full inline-block">
                    {inviteCode}
                  </code>
                </div>
                <div className="col-span-2 flex justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => copy(inviteCode)}
                  >
                    {isCopied ? "Copied" : "Copy"}
                  </Button>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      : null}
    </div>
  );
};

export default InviteCodePage;
