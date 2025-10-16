"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchHypercertForMigration } from "@/graphql/hypercerts/queries/hypercertForMigration";
import Container from "@/components/ui/container";
import { useAtproto } from "@/components/providers/AtprotoProvider";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { BlobRef } from "@atproto/lexicon";
// Local UI-friendly types to avoid complex generics from lexicon barrel
type Evidence = {
  $type: "app.certified.hypercert.record#evidence";
  uri: string;
  title?: string;
};
type UiRecordNoImage = {
  $type: "app.certified.hypercert.record";
  title: string;
  hypercertID: string;
  description: string;
  workScope: string;
  workTimeframeFrom: string;
  workTimeFrameTo: string;
  evidence?: Evidence[];
  contributors?: string[];
  rights?: string;
  location?: string;
  createdAt: string;
};

export default function MigratePage() {
  const { isReady, agent, isAuthenticated } = useAtproto();
  const [hypercertId, setHypercertId] = useState("");
  const [repoDid, setRepoDid] = useState("");

  type HypercertForMigration = Awaited<
    ReturnType<typeof fetchHypercertForMigration>
  >;
  type RecordNoImage = UiRecordNoImage;

  const { data, error, isFetching, refetch, isFetched } =
    useQuery<HypercertForMigration>({
      queryKey: ["hypercert-for-migration", hypercertId],
      enabled: Boolean(hypercertId),
      queryFn: async () => {
        return await fetchHypercertForMigration(hypercertId);
      },
    });

  const [imageBlobRef, setImageBlobRef] = useState<BlobRef | null>(null);
  const [form, setForm] = useState<
    (RecordNoImage & { image?: BlobRef | null }) | undefined
  >();
  const [recordUri, setRecordUri] = useState<string>("");

  const prefilled: RecordNoImage | undefined = useMemo(() => {
    if (!data) return undefined;
    return data.record as RecordNoImage;
  }, [data]);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!agent) throw new Error("Agent not ready");
      const result = await agent.uploadBlob(file);
      return result.data.blob as BlobRef;
    },
    onSuccess: (blob) => {
      setImageBlobRef(blob);
      setForm((prev) => ({ ...(prev ?? prefilled)!, image: blob }));
    },
  });

  const migrateMutation = useMutation({
    mutationFn: async () => {
      if (!agent) throw new Error("Agent not ready");
      if (!form) throw new Error("Form not ready");
      if (!form.image) throw new Error("Please upload an image to PDS first");
      if (!repoDid) throw new Error("Please enter your repo DID");

      const record: RecordNoImage & { image: BlobRef } = {
        $type: "app.certified.hypercert.record",
        title: form.title,
        hypercertID: form.hypercertID,
        description: form.description,
        image: form.image,
        workScope: form.workScope,
        workTimeframeFrom: form.workTimeframeFrom,
        workTimeFrameTo: form.workTimeFrameTo,
        evidence: form.evidence,
        contributors: form.contributors,
        rights: form.rights,
        location: form.location,
        createdAt: form.createdAt,
      };

      const res = await agent.com.atproto.repo.putRecord({
        repo: repoDid,
        collection: "app.certified.hypercert.record",
        rkey: form.hypercertID,
        record,
      });
      return res;
    },
    onSuccess: (res) => {
      const uri =
        (res as unknown as { data?: { uri?: string } })?.data?.uri ?? "";
      setRecordUri(uri);
    },
  });
  return (
    <Container>
      <h1 className="font-serif text-4xl font-bold">Migrate Hypercert</h1>
      <div className="mt-6 space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="hypercert-id">Hypercert ID</Label>
          <div className="flex items-center gap-2">
            <Input
              id="hypercert-id"
              placeholder="Enter hypercert id"
              value={hypercertId}
              onChange={(e) => setHypercertId(e.target.value.trim())}
            />
            <Button
              onClick={() => {
                if (hypercertId) refetch();
              }}
              disabled={!hypercertId || isFetching}
            >
              {isFetching ?
                "Fetching..."
              : isFetched ?
                "Refetch"
              : "Fetch"}
            </Button>
          </div>
          {error ?
            <p className="text-sm text-red-600">{String(error)}</p>
          : null}
        </div>

        {data ?
          <div className="space-y-6">
            <div className="grid gap-2">
              <Label>Preview image URL (source)</Label>
              <Input value={data.imageUrl} readOnly />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="repo-did">Your repo DID</Label>
              <Input
                id="repo-did"
                placeholder="did:plc:..."
                value={repoDid}
                onChange={(e) => setRepoDid(e.target.value.trim())}
              />
            </div>

            <div className="grid gap-2">
              <Label>Upload image to PDS</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadMutation.mutate(file);
                  }}
                />
                <Button
                  variant="secondary"
                  disabled
                  title="Select a file to upload"
                >
                  Upload
                </Button>
              </div>
              {uploadMutation.isPending ?
                <p className="text-sm">Uploading...</p>
              : imageBlobRef ?
                <p className="text-sm text-green-700">Image uploaded.</p>
              : null}
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form?.title ?? prefilled?.title ?? ""}
                  onChange={(e) =>
                    setForm({ ...(form ?? prefilled)!, title: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form?.description ?? prefilled?.description ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...(form ?? prefilled)!,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hypercertID">Hypercert ID</Label>
                <Input
                  id="hypercertID"
                  value={prefilled?.hypercertID ?? ""}
                  readOnly
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="workScope">Work Scope</Label>
                <Input
                  id="workScope"
                  value={form?.workScope ?? prefilled?.workScope ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...(form ?? prefilled)!,
                      workScope: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="workFrom">Work Timeframe From</Label>
                  <Input
                    id="workFrom"
                    value={
                      form?.workTimeframeFrom ??
                      prefilled?.workTimeframeFrom ??
                      ""
                    }
                    onChange={(e) =>
                      setForm({
                        ...(form ?? prefilled)!,
                        workTimeframeFrom: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="workTo">Work Timeframe To</Label>
                  <Input
                    id="workTo"
                    value={
                      form?.workTimeFrameTo ?? prefilled?.workTimeFrameTo ?? ""
                    }
                    onChange={(e) =>
                      setForm({
                        ...(form ?? prefilled)!,
                        workTimeFrameTo: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="createdAt">Created At</Label>
                <Input
                  id="createdAt"
                  value={form?.createdAt ?? prefilled?.createdAt ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...(form ?? prefilled)!,
                      createdAt: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contributors">
                  Contributors (comma separated DIDs)
                </Label>
                <Input
                  id="contributors"
                  value={(
                    form?.contributors ??
                    prefilled?.contributors ??
                    []
                  ).join(", ")}
                  onChange={(e) =>
                    setForm({
                      ...(form ?? prefilled)!,
                      contributors: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="rights">Rights</Label>
                <Input
                  id="rights"
                  value={form?.rights ?? prefilled?.rights ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...(form ?? prefilled)!,
                      rights: e.target.value || undefined,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location">Location (AT URI)</Label>
                <Input
                  id="location"
                  value={form?.location ?? prefilled?.location ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...(form ?? prefilled)!,
                      location: e.target.value || undefined,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="evidences">
                  Evidence list (one per line: uri | optional title)
                </Label>
                <Textarea
                  id="evidences"
                  value={(form?.evidence ?? prefilled?.evidence ?? [])
                    .map((ev) => `${ev.uri}${ev.title ? ` | ${ev.title}` : ""}`)
                    .join("\n")}
                  onChange={(e) => {
                    const lines = e.target.value.split("\n");
                    const evidence = lines
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line) => {
                        const [uri, title] = line
                          .split("|")
                          .map((s) => s.trim());
                        const ev: Evidence = {
                          $type: "app.certified.hypercert.record#evidence",
                          uri,
                          ...(title ? { title } : {}),
                        };
                        return ev;
                      });
                    setForm({ ...(form ?? prefilled)!, evidence });
                  }}
                />
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => migrateMutation.mutate()}
                  disabled={
                    !isReady ||
                    !isAuthenticated ||
                    !form ||
                    !form.image ||
                    !repoDid ||
                    migrateMutation.isPending
                  }
                >
                  {migrateMutation.isPending ? "Migrating..." : "Migrate"}
                </Button>
                {recordUri ?
                  <p className="mt-3 text-sm">
                    Verify your record: {""}
                    <a
                      href={`https://pdsls.dev/${recordUri}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline"
                    >
                      {`https://pdsls.dev/${recordUri}`}
                    </a>
                  </p>
                : null}
              </div>
            </div>
          </div>
        : null}
      </div>
    </Container>
  );
}
