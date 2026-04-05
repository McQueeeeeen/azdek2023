"use client";

import { useEffect, useState } from "react";
import AccountShell from "@/components/account/account-shell";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";

export default function AccountProfilePage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    setEmail(localStorage.getItem("azdek_user_email") ?? "");
  }, []);

  return (
    <AccountShell active="/account/profile" title="Profile" subtitle="Your account details.">
      <div className="form-grid">
        <Input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <Input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <Input className="full ui-input-filled" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <Button variant="secondary">Save changes</Button>
    </AccountShell>
  );
}
