"use client";

import Container from "@/components/ui/container";
import GenericErrorPage from "@/components/error-page";

const ErrorPage = ({ error }: { error: Error | string }) => {
  console.error(error);
  return (
    <Container>
      <GenericErrorPage
        title={typeof error === "string" ? error : error.message}
        description="We are unable to display the audio recordings."
        showRefreshButton={false}
      />
    </Container>
  );
};

export default ErrorPage;
