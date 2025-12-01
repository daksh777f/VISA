import { ApplicationLifecycleStatus, Application } from "@/types";

/**
 * Validates if a status transition is allowed
 */
export function canTransitionTo(
    currentStatus: ApplicationLifecycleStatus,
    newStatus: ApplicationLifecycleStatus
): boolean {
    // Define allowed transitions
    const allowedTransitions: Record<ApplicationLifecycleStatus, ApplicationLifecycleStatus[]> = {
        // Pre-submission
        DOCUMENTS_IN_PROGRESS: ["READY_TO_SUBMIT", "WITHDRAWN"],
        READY_TO_SUBMIT: ["SUBMITTED_WAITING", "DOCUMENTS_IN_PROGRESS", "WITHDRAWN"],

        // Post-submission
        SUBMITTED_WAITING: ["UNDER_REVIEW", "ADDITIONAL_DOCS_REQUESTED", "WITHDRAWN"],
        UNDER_REVIEW: ["BIOMETRIC_SCHEDULED", "INTERVIEW_SCHEDULED", "DECISION_PENDING", "ADDITIONAL_DOCS_REQUESTED"],
        ADDITIONAL_DOCS_REQUESTED: ["UNDER_REVIEW", "SUBMITTED_WAITING"],
        BIOMETRIC_SCHEDULED: ["UNDER_REVIEW", "INTERVIEW_SCHEDULED", "DECISION_PENDING"],
        INTERVIEW_SCHEDULED: ["UNDER_REVIEW", "DECISION_PENDING"],
        DECISION_PENDING: ["APPROVED", "REJECTED"],

        // Terminal states (no transitions allowed)
        APPROVED: [],
        REJECTED: [],
        WITHDRAWN: [],
    };

    return allowedTransitions[currentStatus]?.includes(newStatus) || false;
}

/**
 * Get required fields for a status transition
 */
export function getRequiredFieldsForStatus(
    status: ApplicationLifecycleStatus
): (keyof Application)[] {
    const requiredFields: Record<ApplicationLifecycleStatus, (keyof Application)[]> = {
        DOCUMENTS_IN_PROGRESS: [],
        READY_TO_SUBMIT: ["completionScore"],
        SUBMITTED_WAITING: ["submittedAt", "submissionMethod"],
        UNDER_REVIEW: ["submittedAt"],
        ADDITIONAL_DOCS_REQUESTED: [],
        BIOMETRIC_SCHEDULED: [],
        INTERVIEW_SCHEDULED: [],
        DECISION_PENDING: ["expectedDecisionDate"],
        APPROVED: ["decisionAt", "decisionType"],
        REJECTED: ["decisionAt", "decisionType"],
        WITHDRAWN: [],
    };

    return requiredFields[status] || [];
}

/**
 * Validate application data for status transition
 */
export function validateStatusTransition(
    currentStatus: ApplicationLifecycleStatus,
    newStatus: ApplicationLifecycleStatus,
    applicationData: Partial<Application>
): { valid: boolean; error?: string } {
    // Check if transition is allowed
    if (!canTransitionTo(currentStatus, newStatus)) {
        return {
            valid: false,
            error: `Cannot transition from ${currentStatus} to ${newStatus}`,
        };
    }

    // Check required fields
    const requiredFields = getRequiredFieldsForStatus(newStatus);
    for (const field of requiredFields) {
        if (!applicationData[field]) {
            return {
                valid: false,
                error: `Missing required field: ${field}`,
            };
        }
    }

    // Status-specific validations
    if (newStatus === "READY_TO_SUBMIT") {
        if ((applicationData.completionScore || 0) < 100) {
            return {
                valid: false,
                error: "Completion score must be 100% to mark as ready to submit",
            };
        }
    }

    if (newStatus === "SUBMITTED_WAITING") {
        if (!applicationData.submittedAt) {
            return {
                valid: false,
                error: "Submission date is required",
            };
        }
    }

    if (newStatus === "APPROVED" || newStatus === "REJECTED") {
        if (!applicationData.decisionAt) {
            return {
                valid: false,
                error: "Decision date is required",
            };
        }
    }

    return { valid: true };
}

/**
 * Get user-friendly status label
 */
export function getStatusLabel(status: ApplicationLifecycleStatus): string {
    const labels: Record<ApplicationLifecycleStatus, string> = {
        DOCUMENTS_IN_PROGRESS: "Documents in Progress",
        READY_TO_SUBMIT: "Ready to Submit",
        SUBMITTED_WAITING: "Submitted - Awaiting Review",
        UNDER_REVIEW: "Under Review",
        ADDITIONAL_DOCS_REQUESTED: "Additional Documents Requested",
        BIOMETRIC_SCHEDULED: "Biometric Appointment Scheduled",
        INTERVIEW_SCHEDULED: "Interview Scheduled",
        DECISION_PENDING: "Decision Pending",
        APPROVED: "Approved",
        REJECTED: "Rejected",
        WITHDRAWN: "Withdrawn",
    };

    return labels[status] || status;
}

/**
 * Get status color for UI
 */
export function getStatusColor(status: ApplicationLifecycleStatus): {
    bg: string;
    text: string;
    border: string;
} {
    const colors: Record<ApplicationLifecycleStatus, { bg: string; text: string; border: string }> = {
        DOCUMENTS_IN_PROGRESS: {
            bg: "bg-blue-500/10",
            text: "text-blue-600 dark:text-blue-400",
            border: "border-blue-500/20",
        },
        READY_TO_SUBMIT: {
            bg: "bg-green-500/10",
            text: "text-green-600 dark:text-green-400",
            border: "border-green-500/20",
        },
        SUBMITTED_WAITING: {
            bg: "bg-yellow-500/10",
            text: "text-yellow-600 dark:text-yellow-400",
            border: "border-yellow-500/20",
        },
        UNDER_REVIEW: {
            bg: "bg-purple-500/10",
            text: "text-purple-600 dark:text-purple-400",
            border: "border-purple-500/20",
        },
        ADDITIONAL_DOCS_REQUESTED: {
            bg: "bg-orange-500/10",
            text: "text-orange-600 dark:text-orange-400",
            border: "border-orange-500/20",
        },
        BIOMETRIC_SCHEDULED: {
            bg: "bg-cyan-500/10",
            text: "text-cyan-600 dark:text-cyan-400",
            border: "border-cyan-500/20",
        },
        INTERVIEW_SCHEDULED: {
            bg: "bg-indigo-500/10",
            text: "text-indigo-600 dark:text-indigo-400",
            border: "border-indigo-500/20",
        },
        DECISION_PENDING: {
            bg: "bg-amber-500/10",
            text: "text-amber-600 dark:text-amber-400",
            border: "border-amber-500/20",
        },
        APPROVED: {
            bg: "bg-emerald-500/10",
            text: "text-emerald-600 dark:text-emerald-400",
            border: "border-emerald-500/20",
        },
        REJECTED: {
            bg: "bg-red-500/10",
            text: "text-red-600 dark:text-red-400",
            border: "border-red-500/20",
        },
        WITHDRAWN: {
            bg: "bg-gray-500/10",
            text: "text-gray-600 dark:text-gray-400",
            border: "border-gray-500/20",
        },
    };

    return colors[status] || colors.DOCUMENTS_IN_PROGRESS;
}

/**
 * Check if status is terminal (no further transitions)
 */
export function isTerminalStatus(status: ApplicationLifecycleStatus): boolean {
    return status === "APPROVED" || status === "REJECTED" || status === "WITHDRAWN";
}

/**
 * Check if status is pre-submission
 */
export function isPreSubmission(status: ApplicationLifecycleStatus): boolean {
    return status === "DOCUMENTS_IN_PROGRESS" || status === "READY_TO_SUBMIT";
}

/**
 * Check if status is post-submission
 */
export function isPostSubmission(status: ApplicationLifecycleStatus): boolean {
    return !isPreSubmission(status) && !isTerminalStatus(status);
}
