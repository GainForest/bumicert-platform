/**
 * Integration tests for POST /api/atproto/onboarding/send-invite-email
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock modules before importing the route handler
vi.mock("@/lib/supabase/server", () => ({
  getSupabaseAdmin: vi.fn(),
}));

vi.mock("@/lib/atproto/invites", () => ({
  getOrCreateInviteCode: vi.fn(),
  isInviteCodeError: vi.fn((error: unknown) =>
    Boolean(
      error &&
        typeof error === "object" &&
        "status" in error &&
        "payload" in error
    )
  ),
}));

vi.mock("@/lib/email/resend", () => ({
  resend: {
    emails: {
      send: vi.fn(),
    },
  },
  getInviteEmailConfig: vi.fn(() => ({
    from: "noreply@gainforest.id",
    subject: "Welcome to GainForest - Your Invite Code",
  })),
}));

// Import mocked modules
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { getOrCreateInviteCode } from "@/lib/atproto/invites";
import { resend, getInviteEmailConfig } from "@/lib/email/resend";

// Import the route handler after mocks are set up
import { POST } from "../route";

describe("POST /api/atproto/onboarding/send-invite-email", () => {
  // Mock Supabase client
  const mockSupabaseClient = {
    from: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Validation (400)", () => {
    it("should return 400 when email is missing", async () => {
      const request = new NextRequest(
        "http://localhost/api/atproto/onboarding/send-invite-email",
        {
          method: "POST",
          body: JSON.stringify({ pdsDomain: "climateai.org" }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("BadRequest");
    });

    it("should return 400 when pdsDomain is missing", async () => {
      const request = new NextRequest(
        "http://localhost/api/atproto/onboarding/send-invite-email",
        {
          method: "POST",
          body: JSON.stringify({ email: "test@example.com" }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("BadRequest");
    });

    it("should return 400 when email format is invalid", async () => {
      const request = new NextRequest(
        "http://localhost/api/atproto/onboarding/send-invite-email",
        {
          method: "POST",
          body: JSON.stringify({
            email: "not-an-email",
            pdsDomain: "climateai.org",
          }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("BadRequest");
    });

    it("should return 400 when pdsDomain is not in allowedPDSDomains", async () => {
      const request = new NextRequest(
        "http://localhost/api/atproto/onboarding/send-invite-email",
        {
          method: "POST",
          body: JSON.stringify({
            email: "test@example.com",
            pdsDomain: "invalid.com",
          }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("BadRequest");
    });
  });

  describe("Supabase not configured (500)", () => {
    it("should return 500 when getSupabaseAdmin returns null", async () => {
      vi.mocked(getSupabaseAdmin).mockReturnValue(null);

      const request = new NextRequest(
        "http://localhost/api/atproto/onboarding/send-invite-email",
        {
          method: "POST",
          body: JSON.stringify({
            email: "test@example.com",
            pdsDomain: "climateai.org",
          }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("ServerMisconfigured");
    });
  });

  describe("Rate limiting (429)", () => {
    it("should return 429 when rate limit is exceeded (2 minutes ago)", async () => {
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({
          data: [{ created_at: twoMinutesAgo }],
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);
      vi.mocked(getSupabaseAdmin).mockReturnValue(
        mockSupabaseClient as never
      );

      const request = new NextRequest(
        "http://localhost/api/atproto/onboarding/send-invite-email",
        {
          method: "POST",
          body: JSON.stringify({
            email: "test@example.com",
            pdsDomain: "climateai.org",
          }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toBe("RateLimitExceeded");
      expect(data.retryAfter).toBeDefined();
      expect(response.headers.get("Retry-After")).toBeDefined();
      
      // Verify Retry-After header is a number (seconds)
      const retryAfterHeader = response.headers.get("Retry-After");
      expect(retryAfterHeader).not.toBeNull();
      expect(Number(retryAfterHeader)).toBeGreaterThan(0);
    });

    it("should proceed when rate limit is expired (6 minutes ago)", async () => {
      const sixMinutesAgo = new Date(Date.now() - 6 * 60 * 1000).toISOString();

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({
          data: [{ created_at: sixMinutesAgo }],
        }),
      };

      const mockDeleteQuery = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      };

      const mockInsertQuery = {
        insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      };

      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === "rate_limits") {
          // First call is for select, subsequent calls for delete/insert
          const callCount = mockSupabaseClient.from.mock.calls.filter(
            (call: string[]) => call[0] === "rate_limits"
          ).length;
          if (callCount === 1) return mockQuery;
          if (callCount === 2) return mockDeleteQuery;
          return mockInsertQuery;
        }
        return mockQuery;
      });

      vi.mocked(getSupabaseAdmin).mockReturnValue(
        mockSupabaseClient as never
      );
      vi.mocked(getOrCreateInviteCode).mockResolvedValue("test-code-123");
      vi.mocked(resend.emails.send).mockResolvedValue({ error: null } as never);

      const request = new NextRequest(
        "http://localhost/api/atproto/onboarding/send-invite-email",
        {
          method: "POST",
          body: JSON.stringify({
            email: "test@example.com",
            pdsDomain: "climateai.org",
          }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("should proceed when no previous rate limit exists (first request)", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: [] }),
      };

      const mockDeleteQuery = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      };

      const mockInsertQuery = {
        insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      };

      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === "rate_limits") {
          const callCount = mockSupabaseClient.from.mock.calls.filter(
            (call: string[]) => call[0] === "rate_limits"
          ).length;
          if (callCount === 1) return mockQuery;
          if (callCount === 2) return mockDeleteQuery;
          return mockInsertQuery;
        }
        return mockQuery;
      });

      vi.mocked(getSupabaseAdmin).mockReturnValue(
        mockSupabaseClient as never
      );
      vi.mocked(getOrCreateInviteCode).mockResolvedValue("test-code-123");
      vi.mocked(resend.emails.send).mockResolvedValue({ error: null } as never);

      const request = new NextRequest(
        "http://localhost/api/atproto/onboarding/send-invite-email",
        {
          method: "POST",
          body: JSON.stringify({
            email: "test@example.com",
            pdsDomain: "climateai.org",
          }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe("Happy path (200)", () => {
    it("should return 200 and send email successfully", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: [] }),
      };

      const mockDeleteQuery = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      };

      const mockInsertQuery = {
        insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      };

      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === "rate_limits") {
          const callCount = mockSupabaseClient.from.mock.calls.filter(
            (call: string[]) => call[0] === "rate_limits"
          ).length;
          if (callCount === 1) return mockQuery;
          if (callCount === 2) return mockDeleteQuery;
          return mockInsertQuery;
        }
        return mockQuery;
      });

      vi.mocked(getSupabaseAdmin).mockReturnValue(
        mockSupabaseClient as never
      );
      vi.mocked(getOrCreateInviteCode).mockResolvedValue("test-code-123");
      vi.mocked(resend.emails.send).mockResolvedValue({ error: null } as never);
      vi.mocked(getInviteEmailConfig).mockReturnValue({
        from: "noreply@gainforest.id",
        subject: "Welcome to GainForest - Your Invite Code",
      });

      const request = new NextRequest(
        "http://localhost/api/atproto/onboarding/send-invite-email",
        {
          method: "POST",
          body: JSON.stringify({
            email: "test@example.com",
            pdsDomain: "climateai.org",
          }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      // Verify resend.emails.send was called with correct parameters
      expect(resend.emails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          from: "noreply@gainforest.id",
          to: ["test@example.com"],
          subject: "Welcome to GainForest - Your Invite Code",
        })
      );

      // Verify rate_limits table was updated (delete + insert)
      expect(mockDeleteQuery.delete).toHaveBeenCalled();
      expect(mockInsertQuery.insert).toHaveBeenCalled();
    });
  });

  describe("Email send failure (502)", () => {
    it("should return 502 when resend.emails.send fails", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: [] }),
      };

      const mockDeleteQuery = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      };

      const mockInsertQuery = {
        insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      };

      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === "rate_limits") {
          const callCount = mockSupabaseClient.from.mock.calls.filter(
            (call: string[]) => call[0] === "rate_limits"
          ).length;
          if (callCount === 1) return mockQuery;
          if (callCount === 2) return mockDeleteQuery;
          return mockInsertQuery;
        }
        return mockQuery;
      });

      vi.mocked(getSupabaseAdmin).mockReturnValue(
        mockSupabaseClient as never
      );
      vi.mocked(getOrCreateInviteCode).mockResolvedValue("test-code-123");
      vi.mocked(resend.emails.send).mockResolvedValue({
        error: { message: "Failed" },
      } as never);

      const request = new NextRequest(
        "http://localhost/api/atproto/onboarding/send-invite-email",
        {
          method: "POST",
          body: JSON.stringify({
            email: "test@example.com",
            pdsDomain: "climateai.org",
          }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(502);
      expect(data.error).toBe("EmailError");

      // Verify rate_limits is NOT updated on failure
      expect(mockDeleteQuery.delete).not.toHaveBeenCalled();
      expect(mockInsertQuery.insert).not.toHaveBeenCalled();
    });
  });

  describe("Invite code error (pass-through)", () => {
    it("should pass through InviteCodeError with correct status and payload", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: [] }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);
      vi.mocked(getSupabaseAdmin).mockReturnValue(
        mockSupabaseClient as never
      );

      const inviteCodeError = {
        status: 502,
        payload: { error: "UpstreamError", message: "Failed to create invite codes" },
      };

      vi.mocked(getOrCreateInviteCode).mockRejectedValue(inviteCodeError);

      const request = new NextRequest(
        "http://localhost/api/atproto/onboarding/send-invite-email",
        {
          method: "POST",
          body: JSON.stringify({
            email: "test@example.com",
            pdsDomain: "climateai.org",
          }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(502);
      expect(data.error).toBe("UpstreamError");
      expect(data.message).toBe("Failed to create invite codes");
    });
  });

  describe("Unexpected error (500)", () => {
    it("should return 500 when getOrCreateInviteCode throws a plain Error", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: [] }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);
      vi.mocked(getSupabaseAdmin).mockReturnValue(
        mockSupabaseClient as never
      );

      vi.mocked(getOrCreateInviteCode).mockRejectedValue(
        new Error("Unexpected error")
      );

      const request = new NextRequest(
        "http://localhost/api/atproto/onboarding/send-invite-email",
        {
          method: "POST",
          body: JSON.stringify({
            email: "test@example.com",
            pdsDomain: "climateai.org",
          }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("InternalServerError");
      expect(data.message).toBe("Unexpected error");
    });
  });
});
