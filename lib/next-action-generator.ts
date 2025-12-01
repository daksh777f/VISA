import { NextAction, Application, Milestone, ApplicationLifecycleStatus } from "@/types";
import { getMilestoneDaysInfo } from "./milestone-generator";

export function generateNextAction(
    application: Application,
    milestones: Milestone[]
): NextAction | null {
    const status = application.lifecycleStatus;
    const now = new Date();

    const sortedMilestones = [...milestones].sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return a.plannedDate.getTime() - b.plannedDate.getTime();
    });

    const nextMilestone = sortedMilestones.find(
        m => m.status === "PENDING" || m.status === "IN_PROGRESS" || m.status === "OVERDUE"
    );

    switch (status) {
        case "DOCUMENTS_IN_PROGRESS":
            return {
                id: `${application.id}-action-docs`,
                applicationId: application.id,
                title: "Complete Your Documents",
                description: `Upload and validate all required documents to reach 100% completion. Current score: ${application.completionScore}%`,
                actionType: "USER_ACTION",
                priority: "HIGH",
                ctaLabel: "Upload Documents",
                ctaAction: "UPLOAD_DOCS",
            };

        case "READY_TO_SUBMIT":
            return {
                id: `${application.id}-action-submit`,
                applicationId: application.id,
                title: "Submit Your Application",
                description: "All documents are validated! You're ready to submit your application to the official portal.",
                actionType: "USER_ACTION",
                priority: "HIGH",
                ctaLabel: "Mark as Submitted",
                ctaAction: "MARK_SUBMITTED",
            };

        case "SUBMITTED_WAITING":
            if (nextMilestone) {
                const daysInfo = getMilestoneDaysInfo(nextMilestone);
                const daysText = daysInfo.isOverdue
                    ? `${daysInfo.daysOverdue} days overdue`
                    : `in ${daysInfo.daysRemaining} days`;

                return {
                    id: `${application.id}-action-waiting`,
                    applicationId: application.id,
                    title: "Application Under Review",
                    description: `Your application is being reviewed. Next milestone: ${nextMilestone.label} (expected ${daysText})`,
                    actionType: "WAITING",
                    priority: "MEDIUM",
                    dueDate: nextMilestone.plannedDate,
                    relatedMilestoneId: nextMilestone.id,
                };
            }
            return {
                id: `${application.id}-action-waiting`,
                applicationId: application.id,
                title: "Application Submitted",
                description: "Your application has been submitted. We'll notify you when there are updates.",
                actionType: "WAITING",
                priority: "LOW",
            };

        case "UNDER_REVIEW":
            return {
                id: `${application.id}-action-review`,
                applicationId: application.id,
                title: "Application Being Reviewed",
                description: "Your application is actively being reviewed by the authorities. No action needed at this time.",
                actionType: "WAITING",
                priority: "MEDIUM",
                dueDate: application.expectedDecisionDate,
            };

        case "ADDITIONAL_DOCS_REQUESTED":
            return {
                id: `${application.id}-action-additional`,
                applicationId: application.id,
                title: "Additional Documents Required",
                description: "The authorities have requested additional documentation. Upload the required files as soon as possible.",
                actionType: "USER_ACTION",
                priority: "HIGH",
                ctaLabel: "Upload Documents",
                ctaAction: "UPLOAD_ADDITIONAL_DOCS",
            };

        case "BIOMETRIC_SCHEDULED":
            if (nextMilestone && nextMilestone.type === "BIOMETRIC_APPOINTMENT") {
                const daysInfo = getMilestoneDaysInfo(nextMilestone);
                return {
                    id: `${application.id}-action-biometric`,
                    applicationId: application.id,
                    title: "Biometric Appointment Scheduled",
                    description: `Attend your biometric appointment on ${nextMilestone.plannedDate.toLocaleDateString()}${nextMilestone.location ? ` at ${nextMilestone.location}` : ""}. ${daysInfo.daysRemaining ? `${daysInfo.daysRemaining} days remaining` : ""}`,
                    actionType: "USER_ACTION",
                    priority: "HIGH",
                    dueDate: nextMilestone.plannedDate,
                    ctaLabel: "View Details",
                    ctaAction: "VIEW_BIOMETRIC_DETAILS",
                    relatedMilestoneId: nextMilestone.id,
                };
            }
            return null;

        case "INTERVIEW_SCHEDULED":
            if (nextMilestone && nextMilestone.type === "INTERVIEW") {
                const daysInfo = getMilestoneDaysInfo(nextMilestone);
                return {
                    id: `${application.id}-action-interview`,
                    applicationId: application.id,
                    title: "Interview Scheduled",
                    description: `Attend your interview on ${nextMilestone.plannedDate.toLocaleDateString()}${nextMilestone.location ? ` at ${nextMilestone.location}` : ""}. ${daysInfo.daysRemaining ? `${daysInfo.daysRemaining} days remaining` : ""}`,
                    actionType: "USER_ACTION",
                    priority: "HIGH",
                    dueDate: nextMilestone.plannedDate,
                    ctaLabel: "View Details",
                    ctaAction: "VIEW_INTERVIEW_DETAILS",
                    relatedMilestoneId: nextMilestone.id,
                };
            }
            return null;

        case "DECISION_PENDING":
            const expectedDate = application.expectedDecisionDate;
            const daysUntilDecision = expectedDate
                ? Math.ceil((expectedDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                : null;

            return {
                id: `${application.id}-action-decision`,
                applicationId: application.id,
                title: "Decision Pending",
                description: daysUntilDecision && daysUntilDecision > 0
                    ? `Final decision expected within ${daysUntilDecision} days`
                    : "Final decision expected soon",
                actionType: "WAITING",
                priority: "HIGH",
                dueDate: expectedDate,
            };

        case "APPROVED":
            return {
                id: `${application.id}-action-approved`,
                applicationId: application.id,
                title: "🎉 Application Approved!",
                description: "Congratulations! Your application has been approved. Download your documents and timeline for your records.",
                actionType: "INFORMATIONAL",
                priority: "HIGH",
                ctaLabel: "Download Records",
                ctaAction: "DOWNLOAD_RECORDS",
            };

        case "REJECTED":
            return {
                id: `${application.id}-action-rejected`,
                applicationId: application.id,
                title: "Application Decision",
                description: "Your application was not approved. Review the decision notes and consider reapplying with improvements.",
                actionType: "INFORMATIONAL",
                priority: "HIGH",
                ctaLabel: "View Details",
                ctaAction: "VIEW_REJECTION_DETAILS",
            };

        case "WITHDRAWN":
            return {
                id: `${application.id}-action-withdrawn`,
                applicationId: application.id,
                title: "Application Withdrawn",
                description: "This application has been withdrawn. You can start a new application anytime.",
                actionType: "INFORMATIONAL",
                priority: "LOW",
            };

        default:
            return null;
    }
}

export function getNextActionSummary(
    application: Application,
    milestones: Milestone[]
): string {
    const nextAction = generateNextAction(application, milestones);

    if (!nextAction) {
        return "No action needed";
    }

    switch (application.lifecycleStatus) {
        case "DOCUMENTS_IN_PROGRESS":
            return `Upload documents (${application.completionScore}% complete)`;
        case "READY_TO_SUBMIT":
            return "Ready to submit";
        case "SUBMITTED_WAITING":
            return "Awaiting review";
        case "UNDER_REVIEW":
            return "Under review";
        case "ADDITIONAL_DOCS_REQUESTED":
            return "Additional docs needed";
        case "BIOMETRIC_SCHEDULED":
            return "Biometric appointment scheduled";
        case "INTERVIEW_SCHEDULED":
            return "Interview scheduled";
        case "DECISION_PENDING":
            return "Decision pending";
        case "APPROVED":
            return "✅ Approved";
        case "REJECTED":
            return "Decision received";
        case "WITHDRAWN":
            return "Withdrawn";
        default:
            return "In progress";
    }
}
