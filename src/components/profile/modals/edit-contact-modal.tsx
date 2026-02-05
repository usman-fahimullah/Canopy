"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "@phosphor-icons/react";

interface ContactData {
  email: string;
  phone: string | null;
  city: string;
  state: string;
  country: string;
  birthday: string | null;
}

interface EditContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ContactData;
  onSave: (data: Omit<ContactData, "email">) => void;
  loading?: boolean;
}

export function EditContactModal({
  open,
  onOpenChange,
  data,
  onSave,
  loading,
}: EditContactModalProps) {
  const [phone, setPhone] = useState(data.phone ?? "");
  const [city, setCity] = useState(data.city ?? "");
  const [state, setState] = useState(data.state ?? "");
  const [country, setCountry] = useState(data.country ?? "");
  const [birthday, setBirthday] = useState(data.birthday ?? "");

  const handleSave = () => {
    onSave({
      phone: phone || null,
      city,
      state,
      country,
      birthday: birthday || null,
    });
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Edit your contact info</ModalTitle>
        </ModalHeader>
        <ModalBody className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="mb-3 text-body-strong text-[var(--foreground-brand)]">
              Contact Information
            </h3>
            <div className="space-y-3">
              {/* Email — read only */}
              <div>
                <label className="mb-1 block text-caption text-[var(--foreground-muted)]">
                  Email Address
                </label>
                <div className="flex items-center gap-2 rounded-lg bg-[var(--background-subtle)] p-4 text-body text-[var(--foreground-default)]">
                  {data.email}
                  <CheckCircle
                    size={18}
                    weight="fill"
                    className="text-[var(--foreground-success)]"
                  />
                </div>
              </div>
              {/* Phone */}
              <div>
                <label className="mb-1 block text-caption text-[var(--foreground-muted)]">
                  Phone Number
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="mb-3 text-body-strong text-[var(--foreground-brand)]">
              Where are you based?
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-caption text-[var(--foreground-muted)]">
                  City
                </label>
                <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
              </div>
              <div>
                <label className="mb-1 block text-caption text-[var(--foreground-muted)]">
                  State
                </label>
                <Input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                />
              </div>
              <div>
                <label className="mb-1 block text-caption text-[var(--foreground-muted)]">
                  Country
                </label>
                <Input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Country"
                />
              </div>
            </div>
          </div>

          {/* Birthday */}
          <div>
            <h3 className="mb-3 text-body-strong text-[var(--foreground-brand)]">
              When is your birthday?
            </h3>
            <Input
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              placeholder="mm/dd/yyyy"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} loading={loading}>
            Save Your Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
