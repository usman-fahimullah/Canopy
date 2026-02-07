import { useState, useRef } from "react";

// ─── Illustration placeholders (styled to evoke the actual illustrations) ─────

function BoatIllustration() {
  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", maxWidth: 420, margin: "0 auto", display: "block" }}
    >
      {/* Sky */}
      <path d="M350 80 Q360 70 370 80" stroke="#1B3A2D" strokeWidth="2" fill="none" />
      <path d="M380 65 Q390 55 400 65" stroke="#1B3A2D" strokeWidth="2" fill="none" />
      <path d="M410 80 Q420 70 430 80" stroke="#1B3A2D" strokeWidth="2" fill="none" />
      {/* Boat hull */}
      <path
        d="M80 380 Q90 430 250 430 Q410 430 420 380 Z"
        fill="#F5DEC4"
        stroke="#1B3A2D"
        strokeWidth="2.5"
      />
      <path
        d="M100 380 Q110 410 250 410 Q390 410 400 380"
        fill="none"
        stroke="#1B3A2D"
        strokeWidth="1.5"
        opacity="0.3"
      />
      {/* Water line */}
      <path
        d="M20 420 Q80 400 160 420 Q240 440 320 420 Q400 400 480 420"
        stroke="#1B3A2D"
        strokeWidth="2"
        fill="none"
        opacity="0.2"
      />
      <path
        d="M0 440 Q60 420 140 440 Q220 460 300 440 Q380 420 480 440"
        stroke="#1B3A2D"
        strokeWidth="1.5"
        fill="none"
        opacity="0.15"
      />
      {/* Captain - standing at front */}
      <circle cx="170" cy="260" r="22" fill="#F5DEC4" stroke="#1B3A2D" strokeWidth="2.5" />
      {/* Captain hat */}
      <path d="M148 250 L192 250 L185 238 Q170 228 155 238 Z" fill="#1B3A2D" />
      <rect x="152" y="248" width="36" height="6" rx="1" fill="#1B3A2D" />
      {/* Captain body - striped shirt */}
      <path
        d="M155 282 L185 282 L192 370 L148 370 Z"
        fill="#F5DEC4"
        stroke="#1B3A2D"
        strokeWidth="2"
      />
      <line x1="155" y1="295" x2="185" y2="295" stroke="#D94F4F" strokeWidth="2.5" />
      <line x1="153" y1="308" x2="187" y2="308" stroke="#D94F4F" strokeWidth="2.5" />
      <line x1="151" y1="321" x2="189" y2="321" stroke="#D94F4F" strokeWidth="2.5" />
      {/* Captain coat */}
      <path d="M148 290 L135 370 L148 370 Z" fill="#1B3A2D" />
      <path d="M192 290 L205 370 L192 370 Z" fill="#1B3A2D" />
      {/* Captain arm pointing forward */}
      <path d="M192 300 Q220 280 240 270" stroke="#F5DEC4" strokeWidth="8" strokeLinecap="round" />
      <path d="M192 300 Q220 280 240 270" stroke="#1B3A2D" strokeWidth="2" fill="none" />
      {/* Crew members rowing */}
      {/* Person 1 */}
      <circle cx="280" cy="310" r="16" fill="#F5DEC4" stroke="#1B3A2D" strokeWidth="2" />
      <path
        d="M270 326 L290 326 L294 370 L266 370 Z"
        fill="#1B3A2D"
        stroke="#1B3A2D"
        strokeWidth="1.5"
      />
      {/* Person 2 */}
      <circle cx="330" cy="315" r="15" fill="#F5DEC4" stroke="#1B3A2D" strokeWidth="2" />
      <path
        d="M321 330 L339 330 L343 370 L317 370 Z"
        fill="#1B3A2D"
        stroke="#1B3A2D"
        strokeWidth="1.5"
      />
      {/* Person 3 */}
      <circle cx="375" cy="318" r="14" fill="#F5DEC4" stroke="#1B3A2D" strokeWidth="2" />
      <path
        d="M367 332 L383 332 L386 370 L364 370 Z"
        fill="#1B3A2D"
        stroke="#1B3A2D"
        strokeWidth="1.5"
      />
      {/* Oars */}
      <line
        x1="290"
        y1="340"
        x2="310"
        y2="420"
        stroke="#C4A882"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="340"
        y1="345"
        x2="360"
        y2="420"
        stroke="#C4A882"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="380"
        y1="348"
        x2="400"
        y2="420"
        stroke="#C4A882"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Captain's peg leg on boat edge */}
      <line
        x1="170"
        y1="370"
        x2="170"
        y2="390"
        stroke="#C4A882"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DeskIllustration() {
  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", maxWidth: 420, margin: "0 auto", display: "block" }}
    >
      {/* Desk */}
      <rect
        x="120"
        y="320"
        width="320"
        height="12"
        rx="4"
        fill="#F5E6C8"
        stroke="#1B3A2D"
        strokeWidth="2"
      />
      <rect
        x="140"
        y="332"
        width="10"
        height="100"
        fill="#F5E6C8"
        stroke="#1B3A2D"
        strokeWidth="1.5"
      />
      <rect
        x="410"
        y="332"
        width="10"
        height="100"
        fill="#F5E6C8"
        stroke="#1B3A2D"
        strokeWidth="1.5"
      />
      {/* Monitor */}
      <rect
        x="200"
        y="210"
        width="160"
        height="105"
        rx="8"
        fill="#B8D8E8"
        stroke="#1B3A2D"
        strokeWidth="2.5"
      />
      <rect x="265" y="315" width="30" height="8" fill="#1B3A2D" />
      {/* Heart on screen */}
      <path
        d="M270 250 Q270 235 280 235 Q290 235 290 250 Q290 235 300 235 Q310 235 310 250 Q310 275 290 290 Q270 275 270 250"
        fill="#E8836A"
        opacity="0.7"
      />
      {/* Plant */}
      <rect
        x="130"
        y="280"
        width="30"
        height="35"
        rx="4"
        fill="#D4A843"
        stroke="#1B3A2D"
        strokeWidth="2"
      />
      <path d="M145 280 Q145 250 135 230" stroke="#4A8C5C" strokeWidth="3" strokeLinecap="round" />
      <path d="M145 280 Q145 245 155 225" stroke="#4A8C5C" strokeWidth="3" strokeLinecap="round" />
      <path d="M145 280 Q150 255 165 240" stroke="#4A8C5C" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="135" cy="225" rx="8" ry="12" fill="#4A8C5C" transform="rotate(-15, 135, 225)" />
      <ellipse cx="155" cy="220" rx="8" ry="12" fill="#5A9C6C" transform="rotate(10, 155, 220)" />
      <ellipse cx="168" cy="235" rx="8" ry="10" fill="#4A8C5C" transform="rotate(30, 168, 235)" />
      {/* Person sitting */}
      <circle cx="380" cy="220" r="28" fill="#F5DEC4" stroke="#1B3A2D" strokeWidth="2.5" />
      {/* Curly hair */}
      <circle cx="365" cy="205" r="8" fill="#1B3A2D" />
      <circle cx="375" cy="198" r="9" fill="#1B3A2D" />
      <circle cx="388" cy="196" r="9" fill="#1B3A2D" />
      <circle cx="398" cy="200" r="8" fill="#1B3A2D" />
      <circle cx="404" cy="210" r="7" fill="#1B3A2D" />
      {/* Body */}
      <path
        d="M360 248 L400 248 L410 320 L350 320 Z"
        fill="#1B3A2D"
        stroke="#1B3A2D"
        strokeWidth="1.5"
      />
      {/* Arms reaching to desk */}
      <path d="M360 270 Q330 290 310 310" stroke="#F5DEC4" strokeWidth="7" strokeLinecap="round" />
      <path d="M360 270 Q330 290 310 310" stroke="#1B3A2D" strokeWidth="1.5" fill="none" />
      {/* Cat/animal on desk */}
      <ellipse cx="250" cy="300" rx="30" ry="20" fill="#E8A07A" stroke="#1B3A2D" strokeWidth="2" />
      <circle cx="235" cy="285" r="14" fill="#E8A07A" stroke="#1B3A2D" strokeWidth="2" />
      {/* Cat ears */}
      <path d="M226 275 L222 260 L232 272" fill="#E8A07A" stroke="#1B3A2D" strokeWidth="1.5" />
      <path d="M240 272 L244 258 L248 272" fill="#E8A07A" stroke="#1B3A2D" strokeWidth="1.5" />
      {/* Cat eyes */}
      <circle cx="230" cy="284" r="2" fill="#1B3A2D" />
      <circle cx="240" cy="284" r="2" fill="#1B3A2D" />
      {/* Cat tail */}
      <path d="M280 300 Q300 270 310 280" stroke="#E8A07A" strokeWidth="4" strokeLinecap="round" />
      <path d="M280 300 Q300 270 310 280" stroke="#1B3A2D" strokeWidth="1.5" fill="none" />
      {/* Paper on desk */}
      <rect
        x="300"
        y="295"
        width="35"
        height="25"
        rx="2"
        fill="white"
        stroke="#1B3A2D"
        strokeWidth="1"
        transform="rotate(-5, 310, 305)"
      />
      <path
        d="M305 303 L328 303 M305 309 L322 309"
        stroke="#1B3A2D"
        strokeWidth="1"
        opacity="0.3"
      />
      {/* Coffee cup */}
      <ellipse cx="420" cy="305" rx="12" ry="5" fill="#F5E6C8" stroke="#1B3A2D" strokeWidth="1.5" />
      <path
        d="M408 305 L410 318 Q420 325 430 318 L432 305"
        fill="#F5E6C8"
        stroke="#1B3A2D"
        strokeWidth="1.5"
      />
      {/* Sun/warm glow */}
      <circle cx="200" cy="160" r="30" fill="#F5E6C8" opacity="0.4" />
    </svg>
  );
}

function HighFiveIllustration() {
  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", maxWidth: 420, margin: "0 auto", display: "block" }}
    >
      {/* Sparkle/celebration lines */}
      <line
        x1="240"
        y1="90"
        x2="240"
        y2="110"
        stroke="#D4A843"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="260"
        y1="80"
        x2="260"
        y2="105"
        stroke="#D4A843"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="220"
        y1="100"
        x2="230"
        y2="115"
        stroke="#D4A843"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="275"
        y1="95"
        x2="270"
        y2="115"
        stroke="#D4A843"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="250"
        y1="70"
        x2="250"
        y2="90"
        stroke="#D4A843"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Hands meeting in high-five */}
      <path d="M220 140 Q240 120 260 135" stroke="#F5DEC4" strokeWidth="10" strokeLinecap="round" />
      <path d="M280 140 Q260 120 240 135" stroke="#F5DEC4" strokeWidth="10" strokeLinecap="round" />
      <circle cx="250" cy="130" r="8" fill="#F5E6C8" opacity="0.5" />
      {/* Person 1 - left */}
      <circle cx="180" cy="210" r="30" fill="#F5DEC4" stroke="#1B3A2D" strokeWidth="2.5" />
      {/* Hair */}
      <path d="M155 195 Q165 175 180 172 Q195 175 205 195" fill="#1B3A2D" />
      {/* Eyes & smile */}
      <circle cx="172" cy="212" r="2.5" fill="#1B3A2D" />
      <circle cx="188" cy="212" r="2.5" fill="#1B3A2D" />
      <path d="M172 222 Q180 230 188 222" stroke="#1B3A2D" strokeWidth="1.5" fill="none" />
      {/* Body - yellow/cream top */}
      <path
        d="M158 240 L202 240 L212 400 L148 400 Z"
        fill="#F5E6C8"
        stroke="#1B3A2D"
        strokeWidth="2"
      />
      {/* Dark pants */}
      <path
        d="M152 360 L148 460 L165 460 L175 380 L185 460 L202 460 L208 360 Z"
        fill="#1B3A2D"
        stroke="#1B3A2D"
        strokeWidth="1.5"
      />
      {/* Arm raised */}
      <path d="M200 260 Q220 200 240 150" stroke="#F5DEC4" strokeWidth="9" strokeLinecap="round" />
      <path d="M200 260 Q220 200 240 150" stroke="#1B3A2D" strokeWidth="2" fill="none" />
      {/* Person 2 - right */}
      <circle cx="320" cy="210" r="28" fill="#F5DEC4" stroke="#1B3A2D" strokeWidth="2.5" />
      {/* Ponytail hair */}
      <path d="M300 198 Q310 180 320 178 Q330 180 340 198" fill="#1B3A2D" />
      <path d="M340 190 Q355 185 358 200" stroke="#1B3A2D" strokeWidth="4" strokeLinecap="round" />
      {/* Eyes & smile */}
      <circle cx="312" cy="212" r="2.5" fill="#1B3A2D" />
      <circle cx="328" cy="212" r="2.5" fill="#1B3A2D" />
      <path d="M312 222 Q320 228 328 222" stroke="#1B3A2D" strokeWidth="1.5" fill="none" />
      {/* Body - light blue top */}
      <path
        d="M298 238 L342 238 L352 400 L288 400 Z"
        fill="#C4DCE8"
        stroke="#1B3A2D"
        strokeWidth="2"
      />
      {/* Light pants */}
      <path
        d="M292 360 L288 460 L305 460 L315 380 L325 460 L342 460 L348 360 Z"
        fill="#C4DCE8"
        stroke="#1B3A2D"
        strokeWidth="1.5"
      />
      {/* Arm raised */}
      <path d="M300 260 Q280 200 260 150" stroke="#F5DEC4" strokeWidth="9" strokeLinecap="round" />
      <path d="M300 260 Q280 200 260 150" stroke="#1B3A2D" strokeWidth="2" fill="none" />
      {/* Ground shadow */}
      <ellipse cx="180" cy="465" rx="40" ry="6" fill="#1B3A2D" opacity="0.08" />
      <ellipse cx="320" cy="465" rx="40" ry="6" fill="#1B3A2D" opacity="0.08" />
    </svg>
  );
}

// ─── Leaf icon for logo ──────────────────────────────────────────────────────

function LeafIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.5 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

// ─── Icon components ─────────────────────────────────────────────────────────

function GlobeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9CA3AF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9CA3AF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6B7280"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const colors = {
  green900: "#1B3A2D",
  green800: "#24503D",
  green700: "#2D6B4F",
  cream: "#FAF8F4",
  creamDark: "#F0EDE6",
  creamLight: "#FDFCFA",
  white: "#FFFFFF",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray900: "#111827",
  red500: "#EF4444",
  greenAccent: "#E8F5E9",
};

// ─── Main component ─────────────────────────────────────────────────────────

export default function OnboardingPrototype() {
  const [currentStep, setCurrentStep] = useState(0);
  const [companyData, setCompanyData] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    pathway: "",
    logoFile: null,
  });
  const [profileData, setProfileData] = useState({
    jobTitle: "",
    phone: "",
    linkedinUrl: "",
    photoFile: null,
  });
  const [teamData, setTeamData] = useState({
    emailInput: "",
    members: [],
  });

  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const addTeamMember = () => {
    if (teamData.emailInput && teamData.emailInput.includes("@")) {
      setTeamData({
        emailInput: "",
        members: [
          ...teamData.members,
          { email: teamData.emailInput, role: "Reviewer", id: Date.now() },
        ],
      });
    }
  };

  const removeTeamMember = (id) => {
    setTeamData({
      ...teamData,
      members: teamData.members.filter((m) => m.id !== id),
    });
  };

  const updateMemberRole = (id, role) => {
    setTeamData({
      ...teamData,
      members: teamData.members.map((m) => (m.id === id ? { ...m, role } : m)),
    });
  };

  // ─── Shared header ──────────────────────────────────────────────────────

  const Header = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 32px",
        borderBottom: `1px solid ${colors.creamDark}`,
        backgroundColor: colors.white,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            border: `1px solid ${colors.gray200}`,
            borderRadius: 24,
            backgroundColor: colors.white,
            color: colors.green900,
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <ArrowLeftIcon /> Change account type
        </button>
        <span style={{ color: colors.gray500, fontSize: 14 }}>Employer account setup</span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: colors.green900,
          fontFamily: "'Playfair Display', 'Georgia', serif",
          fontSize: 20,
          fontWeight: 700,
        }}
      >
        Green Jobs Board
        <span style={{ color: colors.green700 }}>
          <LeafIcon size={22} />
        </span>
      </div>
    </div>
  );

  // ─── Step indicator ──────────────────────────────────────────────────────

  const StepIndicator = ({ step }) => {
    const progress = ((step + 1) / totalSteps) * 100;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: `3px solid ${colors.creamDark}`,
            position: "relative",
            background: `conic-gradient(${colors.green900} ${progress * 3.6}deg, ${colors.creamDark} 0deg)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              backgroundColor: colors.white,
            }}
          />
        </div>
        <span style={{ fontSize: 14, color: colors.gray500 }}>
          Step {step + 1}/{totalSteps}
        </span>
      </div>
    );
  };

  // ─── Form input component ─────────────────────────────────────────────

  const FormInput = ({ label, placeholder, value, onChange, icon, optional, type = "text" }) => (
    <div style={{ marginBottom: 20 }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: 14,
            fontWeight: 600,
            color: colors.green900,
            marginBottom: 8,
          }}
        >
          {label}
          {optional && (
            <span
              style={{
                fontWeight: 400,
                color: colors.gray400,
                marginLeft: 4,
              }}
            >
              (Optional)
            </span>
          )}
        </label>
      )}
      <div style={{ position: "relative" }}>
        {icon && (
          <div
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
            }}
          >
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: icon ? "14px 16px 14px 42px" : "14px 16px",
            fontSize: 16,
            border: `1px solid ${colors.gray200}`,
            borderRadius: 10,
            backgroundColor: colors.white,
            color: colors.gray900,
            outline: "none",
            transition: "border-color 0.2s",
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
          onFocus={(e) => (e.target.style.borderColor = colors.green700)}
          onBlur={(e) => (e.target.style.borderColor = colors.gray200)}
        />
      </div>
    </div>
  );

  // ─── Step 1: Build your company workspace ─────────────────────────────

  const Step1 = () => (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <FormInput
              label="Company Name"
              placeholder="Enter the name of your company"
              value={companyData.name}
              onChange={(v) => setCompanyData({ ...companyData, name: v })}
            />
          </div>
          <div style={{ paddingTop: 28 }}>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 20px",
                border: `1px solid ${colors.gray200}`,
                borderRadius: 10,
                backgroundColor: colors.white,
                color: colors.green900,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: "inherit",
              }}
            >
              <CameraIcon /> Upload company logo
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            display: "block",
            fontSize: 14,
            fontWeight: 600,
            color: colors.green900,
            marginBottom: 8,
          }}
        >
          Company description
        </label>
        <div style={{ position: "relative" }}>
          <textarea
            value={companyData.description}
            onChange={(e) => {
              if (e.target.value.length <= 250)
                setCompanyData({ ...companyData, description: e.target.value });
            }}
            placeholder="Write a brief company description"
            rows={4}
            style={{
              width: "100%",
              padding: "14px 16px",
              fontSize: 16,
              border: `1px solid ${colors.gray200}`,
              borderRadius: 10,
              backgroundColor: colors.white,
              color: colors.gray900,
              outline: "none",
              resize: "vertical",
              fontFamily: "inherit",
              boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = colors.green700)}
            onBlur={(e) => (e.target.style.borderColor = colors.gray200)}
          />
          <span
            style={{
              position: "absolute",
              right: 14,
              bottom: 10,
              fontSize: 12,
              color: colors.gray400,
            }}
          >
            {companyData.description.length}/250
          </span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 4,
        }}
      >
        <FormInput
          label="Company website"
          placeholder="Company URL"
          value={companyData.website}
          onChange={(v) => setCompanyData({ ...companyData, website: v })}
          icon={<GlobeIcon />}
        />
        <FormInput
          label="Company Location"
          placeholder="Enter your location"
          value={companyData.location}
          onChange={(v) => setCompanyData({ ...companyData, location: v })}
          icon={<PinIcon />}
        />
      </div>

      <div>
        <label
          style={{
            display: "block",
            fontSize: 14,
            fontWeight: 600,
            color: colors.green900,
            marginBottom: 8,
          }}
        >
          Company Pathway
        </label>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <select
            value={companyData.pathway}
            onChange={(e) => setCompanyData({ ...companyData, pathway: e.target.value })}
            style={{
              width: "100%",
              padding: "14px 16px",
              fontSize: 16,
              border: `1px solid ${colors.gray200}`,
              borderRadius: 10,
              backgroundColor: colors.white,
              color: companyData.pathway ? colors.gray900 : colors.gray400,
              outline: "none",
              appearance: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <option value="" disabled>
              Select a pathway
            </option>
            <option value="clean-energy">Clean Energy</option>
            <option value="sustainable-ag">Sustainable Agriculture</option>
            <option value="conservation">Conservation</option>
            <option value="climate-tech">Climate Tech</option>
            <option value="circular-economy">Circular Economy</option>
            <option value="green-building">Green Building</option>
            <option value="environmental-consulting">Environmental Consulting</option>
          </select>
          <div
            style={{
              position: "absolute",
              right: 14,
              pointerEvents: "none",
              display: "flex",
            }}
          >
            <ChevronDownIcon />
          </div>
        </div>
      </div>
    </div>
  );

  // ─── Step 2: What do you do at {Company Name} ────────────────────────

  const Step2 = () => (
    <div>
      <FormInput
        label="Job Title"
        placeholder="What is your job title?"
        value={profileData.jobTitle}
        onChange={(v) => setProfileData({ ...profileData, jobTitle: v })}
      />

      <FormInput
        label="Phone Number"
        placeholder="Enter your phone number"
        value={profileData.phone}
        onChange={(v) => setProfileData({ ...profileData, phone: v })}
        optional
        type="tel"
      />

      <div style={{ marginBottom: 20 }}>
        <p
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: colors.green900,
            marginBottom: 16,
            marginTop: 28,
          }}
        >
          Connect your LinkedIn Profile to Green Jobs Board
        </p>
        <FormInput
          label="LinkedIn URL"
          placeholder="Enter your LinkedIn profile URL"
          value={profileData.linkedinUrl}
          onChange={(v) => setProfileData({ ...profileData, linkedinUrl: v })}
        />
      </div>

      <div style={{ marginTop: 28 }}>
        <p
          style={{
            fontSize: 15,
            color: colors.gray600,
            marginBottom: 12,
          }}
        >
          Add a photo to help build trust with potential applicants
        </p>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 20px",
            border: `1px solid ${colors.gray200}`,
            borderRadius: 10,
            backgroundColor: colors.white,
            color: colors.green900,
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <CameraIcon /> Upload your profile photo
        </button>
      </div>
    </div>
  );

  // ─── Step 3: Build Your Team ──────────────────────────────────────────

  const Step3 = () => (
    <div>
      <div
        style={{
          borderBottom: `1px solid ${colors.gray200}`,
          paddingBottom: 20,
          marginBottom: 24,
        }}
      />

      <h3
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: colors.green900,
          marginBottom: 16,
          fontFamily: "inherit",
        }}
      >
        Send Invites
      </h3>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <input
          type="email"
          value={teamData.emailInput}
          onChange={(e) => setTeamData({ ...teamData, emailInput: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTeamMember();
          }}
          placeholder="Enter teammates email address"
          style={{
            flex: 1,
            padding: "14px 16px",
            fontSize: 16,
            border: `1px solid ${colors.gray200}`,
            borderRadius: 10,
            backgroundColor: colors.white,
            color: colors.gray900,
            outline: "none",
            fontFamily: "inherit",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = colors.green700)}
          onBlur={(e) => (e.target.style.borderColor = colors.gray200)}
        />
        <button
          onClick={addTeamMember}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "14px 20px",
            border: `1px solid ${colors.gray200}`,
            borderRadius: 10,
            backgroundColor: colors.white,
            color: colors.green900,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
            fontFamily: "inherit",
          }}
        >
          <PlusIcon /> Add
        </button>
      </div>

      {teamData.members.length > 0 && (
        <div
          style={{
            border: `1px solid ${colors.gray200}`,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {teamData.members.map((member, i) => (
            <div
              key={member.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                borderBottom:
                  i < teamData.members.length - 1 ? `1px solid ${colors.gray200}` : "none",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor: colors.green800,
                  color: colors.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {member.email.charAt(0).toUpperCase()}
              </div>
              <span
                style={{
                  flex: 1,
                  fontSize: 15,
                  color: colors.gray700,
                }}
              >
                {member.email}
              </span>
              <div style={{ position: "relative" }}>
                <select
                  value={member.role}
                  onChange={(e) => updateMemberRole(member.id, e.target.value)}
                  style={{
                    padding: "8px 32px 8px 12px",
                    fontSize: 13,
                    border: `1px solid ${colors.gray200}`,
                    borderRadius: 8,
                    backgroundColor: colors.cream,
                    color: colors.gray700,
                    outline: "none",
                    cursor: "pointer",
                    appearance: "none",
                    fontFamily: "inherit",
                  }}
                >
                  <option value="Reviewer">Reviewer</option>
                  <option value="Recruiter">Recruiter</option>
                  <option value="Hiring Team">Hiring Team</option>
                </select>
                <div
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                >
                  <ChevronDownIcon />
                </div>
              </div>
              <button
                onClick={() => removeTeamMember(member.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  border: "none",
                  borderRadius: 8,
                  backgroundColor: "transparent",
                  color: colors.green900,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
      )}

      {teamData.members.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            color: colors.gray400,
            fontSize: 15,
          }}
        >
          No team members added yet. Enter an email above and click Add.
        </div>
      )}
    </div>
  );

  // ─── Step configs ─────────────────────────────────────────────────────

  const steps = [
    {
      title: "Build your company workspace",
      subtitle: "Fill in some details about your company workspace",
      component: <Step1 />,
      illustration: <BoatIllustration />,
    },
    {
      title: `What do you do at ${companyData.name || "{Company Name}"}`,
      subtitle: "Set up your profile for this workspace.",
      component: <Step2 />,
      illustration: <DeskIllustration />,
    },
    {
      title: "Build Your Team",
      subtitle:
        "Work together to create roles, manage your candidate funnel, and hire new people to your company.",
      component: <Step3 />,
      illustration: <HighFiveIllustration />,
    },
  ];

  const step = steps[currentStep];

  // ─── Footer navigation ────────────────────────────────────────────────

  const Footer = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 12,
        padding: "20px 32px",
        borderTop: `1px solid ${colors.creamDark}`,
        backgroundColor: colors.white,
        position: "sticky",
        bottom: 0,
        zIndex: 10,
      }}
    >
      {currentStep > 0 && (
        <button
          onClick={handleBack}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: `1px solid ${colors.gray200}`,
            backgroundColor: colors.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: colors.green900,
            marginRight: "auto",
          }}
        >
          <ArrowLeftIcon />
        </button>
      )}

      {currentStep === 2 && (
        <button
          style={{
            padding: "14px 24px",
            border: `1px solid ${colors.gray200}`,
            borderRadius: 10,
            backgroundColor: colors.white,
            color: colors.gray700,
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Continue Without Inviting
        </button>
      )}

      <button
        onClick={handleNext}
        style={{
          padding: "14px 28px",
          border: "none",
          borderRadius: 10,
          backgroundColor: colors.green900,
          color: colors.white,
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        {currentStep === 2
          ? teamData.members.length > 0
            ? `Invite ${teamData.members.length} ${teamData.members.length === 1 ? "Person" : "People"} and Continue`
            : "Continue"
          : "Continue"}
      </button>
    </div>
  );

  // ─── Main layout ──────────────────────────────────────────────────────

  return (
    <div
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: colors.white,
        color: colors.gray900,
      }}
    >
      <Header />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left panel - Form */}
        <div
          style={{
            flex: 1,
            maxWidth: 640,
            padding: "40px 48px 120px",
            overflowY: "auto",
          }}
        >
          <StepIndicator step={currentStep} />

          <h1
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontSize: 38,
              fontWeight: 700,
              color: colors.green900,
              lineHeight: 1.2,
              marginBottom: 8,
              marginTop: 12,
            }}
          >
            {step.title}
          </h1>

          <p
            style={{
              fontSize: 16,
              color: colors.gray500,
              marginBottom: 36,
              lineHeight: 1.5,
            }}
          >
            {step.subtitle}
          </p>

          {step.component}
        </div>

        {/* Right panel - Illustration */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            minWidth: 0,
          }}
        >
          <div style={{ maxWidth: 460, width: "100%" }}>{step.illustration}</div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
