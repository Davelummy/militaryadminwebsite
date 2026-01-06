export type IdentityStatus = "PENDING" | "APPROVED" | "REJECTED";

export type IdentityDocument = {
  name: string;
  size: number;
  type: string;
  key?: string;
  url?: string;
};

export type IdentityRequestPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationship: string;
  serviceMemberName: string;
  branch: string;
  rank?: string;
  unit?: string;
  region?: string;
  connectionDescription?: string;
  dob: string;
  ssn: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  idFront: IdentityDocument | null;
  idBack?: IdentityDocument | null;
};

export type IdentityRequestRecord = {
  requestId: string;
  status: IdentityStatus;
  infoRequired?: boolean;
  createdAt: string;
  updatedAt: string;
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  relationship: {
    relationship: string;
    connectionDescription?: string;
  };
  serviceMember: {
    name: string;
    branch: string;
    rank?: string;
    unit?: string;
    region?: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  sensitive: {
    encryptedDob: string;
    encryptedSsn: string;
  };
  documents: {
    idFront: IdentityDocument | null;
    idBack?: IdentityDocument | null;
  };
};
