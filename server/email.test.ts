import { describe, expect, it } from "vitest";
import {
  templateWelcome,
  templatePasswordReset,
  templateEmailVerification,
  templateNewTicket,
  templateTicketUpdate,
  templateContractExpiry,
  templateInvoiceOverdue,
  templateMilestoneAlert,
  templateCriticalAlert,
} from "./email";

describe("email templates", () => {
  it("templateWelcome returns subject and html", () => {
    const result = templateWelcome({ name: "Mario Rossi", dashboardUrl: "https://dyneros.com/dashboard", customerId: "DYN-CLI-2026-0001" });
    expect(result.subject).toContain("Benvenuto");
    expect(result.html).toContain("Mario Rossi");
    expect(result.html).toContain("DYN-CLI-2026-0001");
    expect(result.html).toContain("dyneros.com");
  });

  it("templatePasswordReset returns subject and html with reset url", () => {
    const resetUrl = "https://dyneros.com/reset?token=abc123";
    const result = templatePasswordReset({ name: "Mario Rossi", resetUrl, expiresIn: "1 ora" });
    expect(result.subject).toContain("reset");
    expect(result.html).toContain(resetUrl);
    expect(result.html).toContain("1 ora");
  });

  it("templateEmailVerification returns subject and html with verify url", () => {
    const verifyUrl = "https://dyneros.com/verify?token=xyz789";
    const result = templateEmailVerification({ name: "Luigi Bianchi", verifyUrl });
    expect(result.subject).toContain("email");
    expect(result.html).toContain(verifyUrl);
  });

  it("templateNewTicket includes ticket id and priority badge", () => {
    const result = templateNewTicket({
      clientName: "Acme Corp",
      ticketId: "TKT-2026-0099",
      subject: "Test ticket",
      priority: "critical",
      category: "blockchain_integration",
      dashboardUrl: "https://dyneros.com/dashboard/tickets",
    });
    expect(result.subject).toContain("TKT-2026-0099");
    expect(result.html).toContain("CRITICAL");
    expect(result.html).toContain("blockchain_integration");
  });

  it("templateTicketUpdate includes new status and author", () => {
    const result = templateTicketUpdate({
      clientName: "Acme Corp",
      ticketId: "TKT-2026-0041",
      subject: "RPC latency",
      status: "in_progress",
      message: "Stiamo analizzando il problema.",
      author: "Marco Ferretti",
      dashboardUrl: "https://dyneros.com/dashboard/tickets",
    });
    expect(result.html).toContain("Marco Ferretti");
    expect(result.html).toContain("in_progress");
    expect(result.html).toContain("Stiamo analizzando il problema.");
  });

  it("templateContractExpiry shows urgency for 5 days left", () => {
    const result = templateContractExpiry({
      clientName: "Acme Corp",
      contractName: "Contratto Enterprise 2026",
      contractId: "DOC-2026-0001",
      expiryDate: "2026-04-12",
      daysLeft: 5,
      dashboardUrl: "https://dyneros.com/dashboard/contracts",
    });
    expect(result.subject).toContain("URGENTE");
    expect(result.html).toContain("5");
    expect(result.html).toContain("Contratto Enterprise 2026");
  });

  it("templateInvoiceOverdue formats currency correctly", () => {
    const result = templateInvoiceOverdue({
      clientName: "Acme Corp",
      invoiceId: "INV-2026-0009",
      amount: 1800,
      currency: "EUR",
      dueDate: "2026-02-15",
      description: "Hosting Q1",
      dashboardUrl: "https://dyneros.com/dashboard/invoices",
    });
    expect(result.subject).toContain("INV-2026-0009");
    expect(result.html).toContain("1800");
  });

  it("templateMilestoneAlert includes project and days left", () => {
    const result = templateMilestoneAlert({
      clientName: "Acme Corp",
      milestoneName: "dUSD Mainnet Launch",
      projectName: "PRJ-2026-0002",
      projectId: "PRJ-2026-0002",
      date: "2026-05-15",
      daysLeft: 14,
      dashboardUrl: "https://dyneros.com/dashboard/projects",
    });
    expect(result.html).toContain("14");
    expect(result.html).toContain("dUSD Mainnet Launch");
  });

  it("templateCriticalAlert uses correct severity badge", () => {
    const result = templateCriticalAlert({
      clientName: "Acme Corp",
      alertTitle: "RPC Node Down",
      alertMessage: "Il nodo validator #7 non risponde.",
      severity: "critical",
      affectedService: "DYNEROS Chain RPC",
      timestamp: "07/04/2026 06:00:00",
      dashboardUrl: "https://dyneros.com/dashboard",
    });
    expect(result.subject).toContain("CRITICO");
    expect(result.html).toContain("RPC Node Down");
    expect(result.html).toContain("DYNEROS Chain RPC");
  });
});
