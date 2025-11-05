"use client";

import Container from "@/components/ui/container";
import GenericErrorPage from "@/components/error-page";

const ErrorPage = ({ error }: { error: Error }) => {
  return (
    <Container>
      <GenericErrorPage
        title={error.message}
        description="We are unable to load the information you are looking for."
        showRefreshButton={false}
      />
    </Container>
  );
};

export default ErrorPage;
