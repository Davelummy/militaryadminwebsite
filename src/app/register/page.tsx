"use client";

import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/ui/PageShell";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { TextField } from "@/components/ui/TextField";
import { SelectField } from "@/components/ui/SelectField";
import { MaskedTextField } from "@/components/ui/MaskedTextField";
import { CheckboxField } from "@/components/ui/CheckboxField";
import { FileUploadField } from "@/components/ui/FileUploadField";
import { Button } from "@/components/ui/Button";
import { TextAreaField } from "@/components/ui/TextAreaField";

type RegistrationData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  relationship: string;
  serviceMemberName: string;
  branch: string;
  rank: string;
  unit: string;
  region: string;
  connectionDescription: string;
  dob: string;
  ssn: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  idFront: File | null;
  idBack: File | null;
  consentAccuracy: boolean;
  consentVerification: boolean;
  consentMisrepresentation: boolean;
};

const initialData: RegistrationData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  relationship: "",
  serviceMemberName: "",
  branch: "",
  rank: "",
  unit: "",
  region: "",
  connectionDescription: "",
  dob: "",
  ssn: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  idFront: null,
  idBack: null,
  consentAccuracy: false,
  consentVerification: false,
  consentMisrepresentation: false,
};

const stepLabels = ["Account", "Relationship", "Identity", "Review"];

const maskSsn = (value: string) => {
  const digits = value.replace(/\D/g, "");
  const last4 = digits.slice(-4).padStart(4, "_");
  return `***-**-${last4}`;
};

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const relationshipOptions = useMemo(
    () => [
      { value: "", label: "Select relationship" },
      { value: "spouse", label: "Spouse" },
      { value: "parent", label: "Parent" },
      { value: "child", label: "Child" },
      { value: "sibling", label: "Sibling" },
      { value: "legal-guardian", label: "Legal guardian" },
      { value: "trusted-contact", label: "Trusted contact" },
    ],
    []
  );

  const branchOptions = useMemo(
    () => [
      { value: "", label: "Select branch" },
      { value: "army", label: "U.S. Army" },
      { value: "navy", label: "U.S. Navy" },
      { value: "air-force", label: "U.S. Air Force" },
      { value: "marine-corps", label: "U.S. Marine Corps" },
      { value: "space-force", label: "U.S. Space Force" },
      { value: "coast-guard", label: "U.S. Coast Guard" },
    ],
    []
  );

  const updateField = <K extends keyof RegistrationData>(key: K, value: RegistrationData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const saved = localStorage.getItem("militaryadmin.registration");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<RegistrationData> & { step?: number };
        setFormData((prev) => ({
          ...prev,
          firstName: parsed.firstName ?? prev.firstName,
          lastName: parsed.lastName ?? prev.lastName,
          email: parsed.email ?? prev.email,
          phone: parsed.phone ?? prev.phone,
          relationship: parsed.relationship ?? prev.relationship,
          serviceMemberName: parsed.serviceMemberName ?? prev.serviceMemberName,
          branch: parsed.branch ?? prev.branch,
          rank: parsed.rank ?? prev.rank,
          unit: parsed.unit ?? prev.unit,
          region: parsed.region ?? prev.region,
          connectionDescription: parsed.connectionDescription ?? prev.connectionDescription,
        }));
        if (parsed.step && parsed.step >= 1 && parsed.step <= 4) {
          setStep(parsed.step);
        }
      } catch {
        // Ignore malformed local storage data.
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload = {
      step,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      relationship: formData.relationship,
      serviceMemberName: formData.serviceMemberName,
      branch: formData.branch,
      rank: formData.rank,
      unit: formData.unit,
      region: formData.region,
      connectionDescription: formData.connectionDescription,
    };
    localStorage.setItem("militaryadmin.registration", JSON.stringify(payload));
  }, [hydrated, step, formData]);

  const getOptionLabel = (value: string, options: { value: string; label: string }[]) =>
    options.find((option) => option.value === value)?.label ?? "Not provided";

  const focusFirstError = (nextErrors: Record<string, string>) => {
    const firstErrorKey = Object.keys(nextErrors)[0];
    if (!firstErrorKey) return;
    const element = document.getElementById(firstErrorKey);
    if (element) {
      element.focus();
    }
  };

  const validateStep = (currentStep: number) => {
    const nextErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.firstName.trim()) nextErrors.firstName = "Enter your first name.";
      if (!formData.lastName.trim()) nextErrors.lastName = "Enter your last name.";
      if (!formData.email.trim()) nextErrors.email = "Enter your email address.";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email))
        nextErrors.email = "Enter a valid email address.";
      if (!formData.phone.trim()) nextErrors.phone = "Enter your mobile phone.";
      if (!/^[0-9+()\-.\s]{7,}$/.test(formData.phone))
        nextErrors.phone = "Enter a valid phone number.";
      if (formData.password.length < 8)
        nextErrors.password = "Password must be at least 8 characters.";
      if (formData.password !== formData.confirmPassword)
        nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (currentStep === 2) {
      if (!formData.relationship) nextErrors.relationship = "Select a relationship.";
      if (!formData.serviceMemberName.trim())
        nextErrors.serviceMemberName = "Enter the service member's name.";
      if (!formData.branch) nextErrors.branch = "Select a branch of service.";
    }

    if (currentStep === 3) {
      if (!formData.dob) nextErrors.dob = "Enter your date of birth.";
      if (formData.ssn.replace(/\D/g, "").length < 4)
        nextErrors.ssn = "Enter at least the last four digits of your SSN.";
      if (!formData.street.trim()) nextErrors.street = "Enter your street address.";
      if (!formData.city.trim()) nextErrors.city = "Enter your city.";
      if (!formData.state.trim()) nextErrors.state = "Enter your state.";
      if (!/^\d{5}(-\d{4})?$/.test(formData.zip))
        nextErrors.zip = "Enter a valid ZIP code.";
      if (!formData.idFront) nextErrors.idFront = "Upload the front of your photo ID.";
    }

    if (currentStep === 4) {
      if (!formData.consentAccuracy)
        nextErrors.consentAccuracy = "You must confirm the information is accurate.";
      if (!formData.consentVerification)
        nextErrors.consentVerification =
          "You must authorize the verification providers to use your data.";
      if (!formData.consentMisrepresentation)
        nextErrors.consentMisrepresentation =
          "You must acknowledge the misrepresentation notice.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setSubmitting(true);

    const payload = {
      ...formData,
      idFront: formData.idFront
        ? { name: formData.idFront.name, size: formData.idFront.size, type: formData.idFront.type }
        : null,
      idBack: formData.idBack
        ? { name: formData.idBack.name, size: formData.idBack.size, type: formData.idBack.type }
        : null,
    };

    try {
      const response = await fetch("/api/identity/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Registration failed");
      }
      const data = (await response.json()) as { requestId: string };
      setRequestId(data.requestId);
      setSubmitted(true);
      localStorage.removeItem("militaryadmin.registration");
    } catch {
      setErrors({ submit: "Unable to submit your request. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <PageShell>
        <main className="page-main" id="main-content">
          <div className="content-container">
            <div className="usa-alert usa-alert--success">
              <div className="usa-alert__body">
                <h1 className="usa-alert__heading">Your request has been submitted.</h1>
                <p className="usa-alert__text">
                  Verification typically completes within 24-72 hours. Your request ID is{" "}
                  <strong>{requestId ?? "processing"}</strong>. You can check status at any time.
                </p>
                <p className="usa-alert__text">
                  Save this request ID. It is required to check your status later.
                </p>
                <Button variant="outline" onClick={() => (window.location.href = "/status")}>
                  Go to status
                </Button>
              </div>
            </div>
          </div>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="page-main" id="main-content">
        <div className="content-container">
          <header className="section-header">
            <h1 className="usa-heading-xl">Registration and identity verification</h1>
            <p className="usa-intro">
              Complete the four-step form to request secure communication access. All sensitive
              information is used only for identity verification.
            </p>
          </header>

          <div className="panel glass-card security-banner">
            <h2 className="usa-heading-md">Security notice</h2>
            <p className="muted-text">
              Use this portal only on trusted devices. Never share your SSN or verification codes
              over email, phone, or SMS.
            </p>
          </div>

          <div className="registration-progress" data-step={step}>
            <p className="usa-heading-sm">Registration progress</p>
            <div
              className="progress-track"
              role="progressbar"
              aria-valuenow={(step / stepLabels.length) * 100}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="progress-bar" />
            </div>
          </div>
          <StepIndicator current={step} labels={stepLabels} />

          <div className="panel">
            {step === 1 ? (
              <section className="form-grid" aria-label="Create account">
                <div className="form-grid-two">
                  <TextField
                    id="firstName"
                    label="First name"
                    value={formData.firstName}
                    onChange={(event) => updateField("firstName", event.target.value)}
                    error={errors.firstName}
                  />
                  <TextField
                    id="lastName"
                    label="Last name"
                    value={formData.lastName}
                    onChange={(event) => updateField("lastName", event.target.value)}
                    error={errors.lastName}
                  />
                </div>
                <TextField
                  id="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  error={errors.email}
                />
                <TextField
                  id="phone"
                  label="Mobile phone"
                  hint="Include country code if outside the U.S."
                  value={formData.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  error={errors.phone}
                />
                <div className="form-grid-two">
                <TextField
                  id="password"
                  label="Password"
                  type="password"
                  hint="Minimum 8 characters, include a number and symbol."
                  value={formData.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  error={errors.password}
                />
                  <TextField
                    id="confirmPassword"
                    label="Confirm password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(event) => updateField("confirmPassword", event.target.value)}
                    error={errors.confirmPassword}
                  />
                </div>
              </section>
            ) : null}

            {step === 2 ? (
              <section className="form-grid" aria-label="Relationship and service details">
                <SelectField
                  id="relationship"
                  label="Relationship to service member"
                  value={formData.relationship}
                  onChange={(event) => updateField("relationship", event.target.value)}
                  error={errors.relationship}
                >
                  {relationshipOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </SelectField>
                <TextField
                  id="serviceMemberName"
                  label="Service member's full name"
                  value={formData.serviceMemberName}
                  onChange={(event) => updateField("serviceMemberName", event.target.value)}
                  error={errors.serviceMemberName}
                />
                <SelectField
                  id="branch"
                  label="Branch of service"
                  value={formData.branch}
                  onChange={(event) => updateField("branch", event.target.value)}
                  error={errors.branch}
                >
                  {branchOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </SelectField>
                <div className="form-grid-two">
                  <TextField
                    id="rank"
                    label="Rank (optional)"
                    value={formData.rank}
                    onChange={(event) => updateField("rank", event.target.value)}
                  />
                  <TextField
                    id="unit"
                    label="Unit/Base (optional)"
                    value={formData.unit}
                    onChange={(event) => updateField("unit", event.target.value)}
                  />
                </div>
                <TextField
                  id="region"
                  label="Deployed region (optional)"
                  value={formData.region}
                  onChange={(event) => updateField("region", event.target.value)}
                />
                <TextAreaField
                  id="connectionDescription"
                  label="Describe your connection"
                  hint="Briefly describe how you are connected to the service member."
                  value={formData.connectionDescription}
                  onChange={(event) => updateField("connectionDescription", event.target.value)}
                  rows={4}
                />
              </section>
            ) : null}

            {step === 3 ? (
              <section className="stepper-grid" aria-label="Identity verification">
                <div className="form-grid">
                  <TextField
                    id="dob"
                    label="Date of birth"
                    type="date"
                    value={formData.dob}
                    onChange={(event) => updateField("dob", event.target.value)}
                    error={errors.dob}
                  />
                <MaskedTextField
                  id="ssn"
                  label="Social Security number"
                  hint="Used only for verification against official records."
                  value={formData.ssn}
                  onValueChange={(value) => updateField("ssn", value)}
                  error={errors.ssn}
                />
                  <div className="form-grid-two">
                    <TextField
                      id="street"
                      label="Street address"
                      value={formData.street}
                      onChange={(event) => updateField("street", event.target.value)}
                      error={errors.street}
                    />
                    <TextField
                      id="city"
                      label="City"
                      value={formData.city}
                      onChange={(event) => updateField("city", event.target.value)}
                      error={errors.city}
                    />
                  </div>
                  <div className="form-grid-two">
                    <TextField
                      id="state"
                      label="State"
                      value={formData.state}
                      onChange={(event) => updateField("state", event.target.value)}
                      error={errors.state}
                    />
                    <TextField
                      id="zip"
                      label="ZIP"
                      value={formData.zip}
                      onChange={(event) => updateField("zip", event.target.value)}
                      error={errors.zip}
                    />
                  </div>
                  <FileUploadField
                    id="idFront"
                    label="Upload photo ID (front)"
                    accept="image/png,image/jpeg,image/webp"
                    hint="Accepted formats: JPG, PNG, WEBP."
                    file={formData.idFront}
                    required
                    error={errors.idFront}
                    onFileChange={(file) => updateField("idFront", file)}
                  />
                  <FileUploadField
                    id="idBack"
                    label="Upload photo ID (back, optional)"
                    accept="image/png,image/jpeg,image/webp"
                    file={formData.idBack}
                    onFileChange={(file) => updateField("idBack", file)}
                  />
                </div>
                <aside className="callout">
                  <h2 className="usa-heading-md">Your data is protected</h2>
                  <ul className="usa-list">
                    <li>Encryption in transit for every submission.</li>
                    <li>Restricted access to verification systems.</li>
                    <li>No marketing use of identity information.</li>
                  </ul>
                  <div className="usa-alert usa-alert--warning margin-top-2">
                    <div className="usa-alert__body">
                      <p className="usa-alert__text">
                        We will never ask for your SSN or verification codes over email, phone, or
                        SMS.
                      </p>
                    </div>
                  </div>
                </aside>
              </section>
            ) : null}

            {step === 4 ? (
              <section className="form-grid" aria-label="Review and consent">
                <div className="form-summary">
                  <h2 className="usa-heading-md">Review your details</h2>
                  <p>
                    <strong>Name:</strong> {formData.firstName} {formData.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {formData.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {formData.phone}
                  </p>
                  <p>
                    <strong>Relationship:</strong>{" "}
                    {getOptionLabel(formData.relationship, relationshipOptions)}
                  </p>
                  <p>
                    <strong>Service member:</strong> {formData.serviceMemberName}
                  </p>
                  <p>
                    <strong>Branch:</strong> {getOptionLabel(formData.branch, branchOptions)}
                  </p>
                  <p>
                    <strong>Date of birth:</strong> {formData.dob || "Not provided"}
                  </p>
                  <p>
                    <strong>SSN:</strong> {maskSsn(formData.ssn)}
                  </p>
                </div>
                <div>
                  <div className="panel glass-card">
                    <h3 className="usa-heading-sm">Privacy Act Notice (placeholder)</h3>
                    <p className="muted-text">
                      A formal Privacy Act statement will be provided by the sponsoring DoD
                      program office in production.
                    </p>
                  </div>
                  <CheckboxField
                    id="consentAccuracy"
                    label="I confirm the information provided is accurate and belongs to me."
                    checked={formData.consentAccuracy}
                    onChange={(event) => updateField("consentAccuracy", event.target.checked)}
                    error={errors.consentAccuracy}
                  />
                  <CheckboxField
                    id="consentVerification"
                    label="I authorize this portal and its contracted verification providers to use my SSN, date of birth, and government-issued ID solely to verify my identity with official military records."
                    checked={formData.consentVerification}
                    onChange={(event) =>
                      updateField("consentVerification", event.target.checked)
                    }
                    error={errors.consentVerification}
                  />
                  <CheckboxField
                    id="consentMisrepresentation"
                    label="I understand that misrepresenting my identity or relationship may result in denial of access and potential reporting to authorities."
                    checked={formData.consentMisrepresentation}
                    onChange={(event) =>
                      updateField("consentMisrepresentation", event.target.checked)
                    }
                    error={errors.consentMisrepresentation}
                  />
                </div>
              </section>
            ) : null}

            {errors.submit ? (
              <div className="usa-alert usa-alert--error margin-top-2">
                <div className="usa-alert__body">
                  <p className="usa-alert__text">{errors.submit}</p>
                </div>
              </div>
            ) : null}

            <div className="margin-top-3 display-flex flex-justify">
              {step > 1 ? (
                <Button variant="outline" type="button" onClick={handleBack}>
                  Back
                </Button>
              ) : (
                <span />
              )}
              {step < 4 ? (
                <div className="display-flex grid-gap">
                  <Button type="button" onClick={handleNext}>
                    Continue
                  </Button>
                  <Button type="button" variant="outline" disabled>
                    Save and continue later
                  </Button>
                </div>
              ) : (
                <Button type="button" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit request"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
