"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { SelectField } from "@/components/ui/SelectField";

type AdminRecord = {
  requestId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  infoRequired: boolean;
  applicant: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  relationship: string;
  serviceMember: {
    name: string;
    branch: string;
  };
  identity: {
    dob: string;
    ssn: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
};

type AdminListResponse = {
  records: AdminRecord[];
  total: number;
  page: number;
  pageSize: number;
};

export default function AdminPage() {
  const [records, setRecords] = useState<AdminRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRecords = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") {
        params.set("status", statusFilter);
      }
      if (query.trim()) {
        params.set("q", query.trim());
      }
      params.set("page", String(page));
      params.set("pageSize", String(pageSize));
      const response = await fetch(`/api/identity/admin/list?${params.toString()}`);
      const data = (await response.json()) as AdminListResponse;
      setRecords(data.records);
      setTotal(data.total);
    } catch {
      setError("Unable to load requests.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    requestId: string,
    status: AdminRecord["status"],
    infoRequired?: boolean
  ) => {
    setError("");
    try {
      const response = await fetch("/api/identity/admin/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status, infoRequired }),
      });
      if (!response.ok) {
        throw new Error("Update failed");
      }
      await loadRecords();
    } catch {
      setError("Unable to update status.");
    }
  };

  useEffect(() => {
    void loadRecords();
  }, [page, pageSize, statusFilter]);

  return (
    <PageShell variant="admin">
      <main className="page-main" id="main-content">
        <div className="content-container">
          <header className="section-header">
            <h1 className="usa-heading-xl">Admin review console</h1>
            <p className="usa-intro">
              Review incoming requests, verify details, and approve or reject access. Sensitive
              fields are redacted in this view.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                await fetch("/api/admin/logout", { method: "POST" });
                window.location.href = "/admin/login";
              }}
            >
              Log out
            </Button>
          </header>

          <section className="panel glass-card">
            <div className="display-flex flex-justify flex-align-center">
              <h2 className="usa-heading-md margin-0">Requests</h2>
              <div className="display-flex grid-gap">
                <Button type="button" variant="outline" onClick={loadRecords}>
                  {loading ? "Refreshing..." : "Refresh"}
                </Button>
              </div>
            </div>
            <div className="admin-filters margin-top-2">
              <TextField
                id="admin-search"
                label="Search"
                hint="Search by request ID, name, or email."
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
              <SelectField
                id="admin-status"
                label="Status filter"
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
              >
                <option value="ALL">All statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </SelectField>
              <SelectField
                id="admin-page-size"
                label="Rows per page"
                value={String(pageSize)}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </SelectField>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setPage(1);
                  void loadRecords();
                }}
              >
                Apply filters
              </Button>
            </div>
            {error ? (
              <div className="usa-alert usa-alert--error margin-top-2">
                <div className="usa-alert__body">
                  <p className="usa-alert__text">{error}</p>
                </div>
              </div>
            ) : null}
            <div className="admin-grid margin-top-2">
              {records.length === 0 ? (
                <p className="muted-text">No requests available.</p>
              ) : (
                records.map((record) => (
                  <article className="wizard-step" key={record.requestId}>
                    <div className="wizard-step-kicker">Request ID</div>
                    <div className="wizard-step-title">{record.requestId}</div>
                    <p className="wizard-step-meta">
                      <strong>Applicant:</strong> {record.applicant.firstName}{" "}
                      {record.applicant.lastName}
                    </p>
                    <p className="wizard-step-meta">
                      <strong>Email:</strong> {record.applicant.email}
                    </p>
                    <p className="wizard-step-meta">
                      <strong>Relationship:</strong> {record.relationship}
                    </p>
                    <p className="wizard-step-meta">
                      <strong>Service member:</strong> {record.serviceMember.name} (
                      {record.serviceMember.branch})
                    </p>
                    <p className="wizard-step-meta">
                      <strong>Status:</strong> {record.status}
                    </p>
                    {record.infoRequired ? (
                      <p className="wizard-step-meta">
                        <strong>Info required:</strong> Pending additional documentation
                      </p>
                    ) : null}
                    <p className="wizard-step-meta">
                      <strong>DOB (masked):</strong> {record.identity.dob}
                    </p>
                    <p className="wizard-step-meta">
                      <strong>SSN (masked):</strong> {record.identity.ssn}
                    </p>
                    <p className="wizard-step-meta">
                      <strong>Address:</strong> {record.address.street}, {record.address.city},{" "}
                      {record.address.state} {record.address.zip}
                    </p>
                    <div className="display-flex grid-gap margin-top-1">
                      <Button
                        type="button"
                        onClick={() => updateStatus(record.requestId, "APPROVED", false)}
                      >
                        Approve
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => updateStatus(record.requestId, "REJECTED", false)}
                      >
                        Reject
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => updateStatus(record.requestId, "PENDING", true)}
                      >
                        Keep pending / Request info
                      </Button>
                    </div>
                  </article>
                ))
              )}
            </div>
            <div className="admin-pagination margin-top-2">
              <p className="muted-text">
                Showing {records.length} of {total} requests
              </p>
              <div className="display-flex grid-gap">
                <Button
                  type="button"
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </Button>
                <span className="admin-page-indicator">
                  Page {page} of {Math.max(Math.ceil(total / pageSize), 1)}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  disabled={page >= Math.ceil(total / pageSize)}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </PageShell>
  );
}
