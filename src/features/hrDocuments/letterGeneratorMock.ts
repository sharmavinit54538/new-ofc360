// TODO: backend has no template-fill generator for these doc types yet.
// This mock lets the UI demo one-click "Generate" for:
// Employment & Salary Verification, No Objection Certificate (NOC),
// Promotion & Salary Increment Letter, Internship Completion Certificate,
// Warning / PIP Evaluation Notice, Bonafide Employee Proof.
// Real flow today: HR uploads a manually-prepared file via documentsApi.uploadEmployeeDocument instead.

import { baseApi } from "@/services/api/baseApi";
import { APIResponse, MockGeneratedLetter, MockLetterType } from "./types";

const generateMockHtml = (
  type: MockLetterType,
  employeeId: string,
  employeeName: string = "Jane Doe",
  designation: string = "Senior Software Engineer",
  department: string = "Engineering"
): string => {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const headers = `
    <div style="font-family: 'Inter', sans-serif; max-width: 700px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff; color: #1e293b; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px;">
        <div>
          <h2 style="margin: 0; color: #4f46e5; font-size: 24px; font-weight: 700; tracking: -0.02em;">OFC360 Enterprise Solutions</h2>
          <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">Human Resources Department &bull; Confidential</p>
        </div>
        <div style="text-align: right; color: #64748b; font-size: 13px;">
          <div>Date: <strong>${today}</strong></div>
          <div>Ref: <strong>DOC-${type.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}</strong></div>
        </div>
      </div>
  `;

  const footer = `
      <div style="margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
          <div style="height: 40px; border-bottom: 1px solid #94a3b8; width: 180px; margin-bottom: 6px;"></div>
          <p style="margin: 0; font-weight: 600; font-size: 14px; color: #334155;">Authorized Signatory</p>
          <p style="margin: 2px 0 0 0; font-size: 12px; color: #64748b;">Head of Human Resources</p>
        </div>
        <div style="text-align: right;">
          <div style="display: inline-block; padding: 6px 12px; background: #f1f5f9; border-radius: 6px; font-size: 11px; color: #475569; font-family: monospace;">
            VERIFIED &bull; DIGITAL STAMP #${Math.floor(100000 + Math.random() * 900000)}
          </div>
        </div>
      </div>
    </div>
  `;

  let content = "";

  switch (type) {
    case "salary_verification":
      content = `
        <h3 style="text-align: center; color: #0f172a; text-transform: uppercase; font-size: 18px; margin-bottom: 25px; letter-spacing: 0.05em;">Employment & Salary Verification Certificate</h3>
        <p style="line-height: 1.7; color: #334155;">To Whom It May Concern,</p>
        <p style="line-height: 1.7; color: #334155;">
          This letter is to confirm that <strong>${employeeName}</strong> (Employee ID: <code>${employeeId}</code>) is currently employed full-time at OFC360 Enterprise Solutions as a <strong>${designation}</strong> in the <strong>${department}</strong> department.
        </p>
        <div style="background: #f8fafc; border-left: 4px solid #4f46e5; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 0 0 8px 0; font-weight: 600; color: #1e293b;">Compensation Details:</p>
          <ul style="margin: 0; padding-left: 20px; color: #475569; line-height: 1.6;">
            <li>Gross Annual Salary: <strong>$125,000 USD</strong></li>
            <li>Employment Status: <strong>Active / Regular Full-Time</strong></li>
            <li>Date of Joining: <strong>January 15, 2022</strong></li>
          </ul>
        </div>
        <p style="line-height: 1.7; color: #334155;">
          This letter is issued upon the request of the employee for verification purposes.
        </p>
      `;
      break;

    case "noc":
      content = `
        <h3 style="text-align: center; color: #0f172a; text-transform: uppercase; font-size: 18px; margin-bottom: 25px; letter-spacing: 0.05em;">No Objection Certificate (NOC)</h3>
        <p style="line-height: 1.7; color: #334155;">To Whom It May Concern,</p>
        <p style="line-height: 1.7; color: #334155;">
          This is to certify that OFC360 Enterprise Solutions has <strong>No Objection</strong> to <strong>${employeeName}</strong> (Employee ID: <code>${employeeId}</code>), working as <strong>${designation}</strong> in our <strong>${department}</strong> department, applying for higher education / visa processing / external professional certification.
        </p>
        <p style="line-height: 1.7; color: #334155;">
          The management confirms that ${employeeName} has maintained exemplary professional conduct during their tenure and holds no active financial or operational liabilities with the company.
        </p>
      `;
      break;

    case "promotion_increment":
      content = `
        <h3 style="text-align: center; color: #0f172a; text-transform: uppercase; font-size: 18px; margin-bottom: 25px; letter-spacing: 0.05em;">Promotion & Compensation Revision Notice</h3>
        <p style="line-height: 1.7; color: #334155;">Dear <strong>${employeeName}</strong>,</p>
        <p style="line-height: 1.7; color: #334155;">
          We are pleased to inform you that in recognition of your exceptional performance and outstanding contribution to the <strong>${department}</strong> team, management has approved your promotion to <strong>Lead ${designation}</strong>.
        </p>
        <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 0 0 8px 0; font-weight: 600; color: #065f46;">Revised Terms Effective Immediately:</p>
          <ul style="margin: 0; padding-left: 20px; color: #047857; line-height: 1.6;">
            <li>New Title: <strong>Lead ${designation}</strong></li>
            <li>New Annual Salary: <strong>$145,000 USD</strong> (+16% Increment)</li>
            <li>Performance Bonus Tier: <strong>Tier 1 Band</strong></li>
          </ul>
        </div>
        <p style="line-height: 1.7; color: #334155;">
          Congratulations on this well-deserved promotion. We look forward to your continued leadership and success!
        </p>
      `;
      break;

    case "internship_completion":
      content = `
        <h3 style="text-align: center; color: #0f172a; text-transform: uppercase; font-size: 18px; margin-bottom: 25px; letter-spacing: 0.05em;">Internship Completion Certificate</h3>
        <p style="line-height: 1.7; color: #334155;">To Whom It May Concern,</p>
        <p style="line-height: 1.7; color: #334155;">
          This is to certify that <strong>${employeeName}</strong> has successfully completed an intensive 6-month Software Engineering Internship in the <strong>${department}</strong> division from November 1, 2025 to April 30, 2026.
        </p>
        <p style="line-height: 1.7; color: #334155;">
          During the internship, ${employeeName} demonstrated high technical competence, diligence, and strong team collaboration skills. We wish them all success in future endeavors.
        </p>
      `;
      break;

    case "warning_pip":
      content = `
        <h3 style="text-align: center; color: #dc2626; text-transform: uppercase; font-size: 18px; margin-bottom: 25px; letter-spacing: 0.05em;">Performance Improvement Plan (PIP) Notice</h3>
        <p style="line-height: 1.7; color: #334155;">Dear <strong>${employeeName}</strong>,</p>
        <p style="line-height: 1.7; color: #334155;">
          This letter serves as formal notification that your current performance in the role of <strong>${designation}</strong> (${department}) does not meet expectations for your level.
        </p>
        <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 0 0 8px 0; font-weight: 600; color: #991b1b;">30-Day PIP Terms:</p>
          <ul style="margin: 0; padding-left: 20px; color: #b91c1c; line-height: 1.6;">
            <li>Duration: <strong>30 Days</strong> (Bi-weekly check-ins required)</li>
            <li>Primary Focus Areas: Code quality, sprint delivery timeliness, team communication</li>
            <li>Evaluation Date: <strong>${today} + 30 Days</strong></li>
          </ul>
        </div>
        <p style="line-height: 1.7; color: #334155;">
          HR and your Engineering Manager are committed to supporting you with necessary resources during this evaluation window.
        </p>
      `;
      break;

    case "bonafide":
      content = `
        <h3 style="text-align: center; color: #0f172a; text-transform: uppercase; font-size: 18px; margin-bottom: 25px; letter-spacing: 0.05em;">Bonafide Employee Proof</h3>
        <p style="line-height: 1.7; color: #334155;">To Whom It May Concern,</p>
        <p style="line-height: 1.7; color: #334155;">
          This is to officially declare that <strong>${employeeName}</strong> (Employee ID: <code>${employeeId}</code>) is a bonafide employee of OFC360 Enterprise Solutions, holding the designation of <strong>${designation}</strong> in <strong>${department}</strong>.
        </p>
        <p style="line-height: 1.7; color: #334155;">
          This document is generated for statutory verification, banking, or official identity confirmation purposes.
        </p>
      `;
      break;
  }

  return `${headers}${content}${footer}`;
};

export const letterGeneratorMockApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateMockLetter: builder.mutation<
      APIResponse<MockGeneratedLetter>,
      {
        letterType: MockLetterType;
        employeeId: string;
        employeeName?: string;
        designation?: string;
        department?: string;
      }
    >({
      queryFn: (args) => {
        const previewHtml = generateMockHtml(
          args.letterType,
          args.employeeId,
          args.employeeName,
          args.designation,
          args.department
        );

        const response: APIResponse<MockGeneratedLetter> = {
          success: true,
          message: `Preview generated successfully for ${args.letterType}`,
          data: {
            letterType: args.letterType,
            employeeId: args.employeeId,
            employeeName: args.employeeName || "Jane Doe",
            designation: args.designation || "Senior Software Engineer",
            department: args.department || "Engineering",
            previewHtml,
            generatedAt: new Date().toISOString(),
          },
          errors: null,
        };

        return { data: response };
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGenerateMockLetterMutation } = letterGeneratorMockApi;
