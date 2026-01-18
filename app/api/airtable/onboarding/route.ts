import { NextRequest, NextResponse } from "next/server";
import { onboardingDataSchema } from "./schema";

const airtablePAT = process.env.AIRTABLE_PAT;
const airtableBumicertsBaseId = process.env.AIRTABLE_BUMICERTS_BASE_ID;
const airtableBumicertsOnboardingTableId =
  process.env.AIRTABLE_BUMICERTS_ONBOARDING_TABLE_ID;

export async function POST(req: NextRequest) {
  if (
    !airtablePAT ||
    !airtableBumicertsBaseId ||
    !airtableBumicertsOnboardingTableId
  ) {
    throw new Error("Missing environment variables");
  }
  let onboardingData;
  try {
    const { email, organizationName, about } = await req.json();
    const onboardingDataValidation = onboardingDataSchema.safeParse({
      email,
      organizationName,
      about,
    });
    if (!onboardingDataValidation.success) {
      return NextResponse.json(
        { error: onboardingDataValidation.error.message },
        { status: 400 }
      );
    }
    onboardingData = onboardingDataValidation.data;
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }

  const url = `https://api.airtable.com/v0/${airtableBumicertsBaseId}/${airtableBumicertsOnboardingTableId}`;
  const headers = {
    Authorization: `Bearer ${airtablePAT}`,
    "Content-Type": "application/json",
  };
  const body = {
    records: [
      {
        fields: {
          Email: onboardingData.email,
          OrganizationName: onboardingData.organizationName,
          About: onboardingData.about,
        },
      },
    ],
  };

  const createRecordPromise = fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  let response;
  try {
    response = await createRecordPromise;
  } catch (error) {
    console.error("Error creating record in Airtable", error);
    return NextResponse.json(
      { error: "Unable to record your data. Please try again." },
      { status: 500 }
    );
  }

  let responseJson;
  try {
    responseJson = await response.json();
  } catch (error) {
    console.error("Error parsing response", error);
    return NextResponse.json(
      { error: "Unable to record your data. Please try again." },
      { status: 500 }
    );
  }

  if (!response.ok) {
    console.error("Error submitting onboarding data", responseJson);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to record your data. Please try again.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Onboarding data submitted successfully",
  });
}
