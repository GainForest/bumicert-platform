"use client";

import { useCallback } from "react";
import { useParams } from "next/navigation";

import {
  trackBumicertFlowStarted,
  trackStepViewed,
  trackStepCompleted,
  trackBumicertPublished,
  trackFlowAbandoned,
  trackBumicertCardClicked,
  trackBumicertDetailViewed,
  trackWalletConnected,
  trackWalletDisconnected,
  trackError,
  getStepName,
  getFlowDurationSeconds,
  type BumicertStepName,
} from "@/lib/analytics";

/**
 * Hook for tracking Bumicert creation flow events
 */
export const useBumicertFlowAnalytics = () => {
  const params = useParams();
  const draftId = (params?.draftId as string) ?? "";

  const trackFlowStart = useCallback((id?: string) => {
    trackBumicertFlowStarted({ draftId: id });
  }, []);

  const trackStep = useCallback(
    (stepIndex: number) => {
      const stepName = getStepName(stepIndex);
      trackStepViewed({
        stepIndex,
        stepName,
        draftId,
      });
    },
    [draftId]
  );

  const trackStepComplete = useCallback(
    (stepIndex: number) => {
      const stepName = getStepName(stepIndex);
      trackStepCompleted({
        stepIndex,
        stepName,
        draftId,
      });
    },
    [draftId]
  );

  const trackPublished = useCallback(() => {
    const duration = getFlowDurationSeconds() ?? 0;
    trackBumicertPublished({
      draftId,
      totalDurationSeconds: duration,
    });
  }, [draftId]);

  const trackAbandoned = useCallback(
    (stepIndex: number) => {
      const stepName = getStepName(stepIndex);
      trackFlowAbandoned({
        stepIndex,
        stepName,
        draftId,
      });
    },
    [draftId]
  );

  return {
    trackFlowStart,
    trackStep,
    trackStepComplete,
    trackPublished,
    trackAbandoned,
  };
};

/**
 * Hook for tracking marketplace events
 */
export const useMarketplaceAnalytics = () => {
  const trackCardClick = useCallback((bumicertId: string) => {
    trackBumicertCardClicked(bumicertId);
  }, []);

  const trackDetailView = useCallback((bumicertId: string) => {
    trackBumicertDetailViewed(bumicertId);
  }, []);

  return {
    trackCardClick,
    trackDetailView,
  };
};

/**
 * Hook for tracking wallet/auth events
 */
export const useAuthAnalytics = () => {
  const trackConnect = useCallback(
    (address: string, chainId?: number) => {
      trackWalletConnected({ address, chainId });
    },
    []
  );

  const trackDisconnect = useCallback(() => {
    trackWalletDisconnected();
  }, []);

  return {
    trackConnect,
    trackDisconnect,
  };
};

/**
 * Hook for tracking errors
 */
export const useErrorAnalytics = () => {
  const trackErrorEvent = useCallback(
    (error: Error, componentStack?: string, path?: string) => {
      trackError({
        message: error.message,
        stack: error.stack,
        componentStack,
        path,
      });
    },
    []
  );

  return {
    trackError: trackErrorEvent,
  };
};

/**
 * Combined analytics hook (for convenience)
 */
export const useAnalytics = () => {
  const bumicertFlow = useBumicertFlowAnalytics();
  const marketplace = useMarketplaceAnalytics();
  const auth = useAuthAnalytics();
  const errorTracking = useErrorAnalytics();

  return {
    bumicertFlow,
    marketplace,
    auth,
    error: errorTracking,
  };
};

export default useAnalytics;
