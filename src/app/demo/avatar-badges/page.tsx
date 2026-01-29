"use client";

import { Avatar } from "@/components/ui/avatar";

export default function AvatarBadgesDemo() {
  return (
    <div className="min-h-screen bg-[var(--primitive-neutral-100)] py-12 px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-bold text-[var(--primitive-neutral-800)] mb-2">
            Avatar Badge Types
          </h1>
          <p className="text-[var(--primitive-neutral-600)]">
            New badge indicators from Figma design 2054:3671
          </p>
        </div>

        {/* Badge Types */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-[var(--primitive-neutral-800)]">
            Badge Variants
          </h2>
          <div className="bg-white rounded-2xl border border-[var(--primitive-neutral-200)] p-8">
            <div className="flex items-center gap-8 flex-wrap">
              <div className="flex flex-col items-center gap-2">
                <Avatar name="Success User" badge="success" size="lg" />
                <span className="text-sm text-[var(--primitive-neutral-600)]">Success</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar name="Critical User" badge="critical" size="lg" />
                <span className="text-sm text-[var(--primitive-neutral-600)]">Critical</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar name="Favorite User" badge="favorite" size="lg" />
                <span className="text-sm text-[var(--primitive-neutral-600)]">Favorite</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar name="BIPOC Owned" badge="bipoc" size="lg" />
                <span className="text-sm text-[var(--primitive-neutral-600)]">BIPOC</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar name="Bookmarked" badge="bookmark" size="lg" />
                <span className="text-sm text-[var(--primitive-neutral-600)]">Bookmark</span>
              </div>
            </div>
          </div>
        </section>

        {/* Size Comparison */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-[var(--primitive-neutral-800)]">
            Badge Sizes (with favorite badge)
          </h2>
          <div className="bg-white rounded-2xl border border-[var(--primitive-neutral-200)] p-8">
            <div className="flex items-end gap-6 flex-wrap">
              <div className="flex flex-col items-center gap-2">
                <Avatar name="XS" badge="favorite" size="xs" />
                <span className="text-xs text-[var(--primitive-neutral-600)]">xs (24px)</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar name="SM" badge="favorite" size="sm" />
                <span className="text-xs text-[var(--primitive-neutral-600)]">sm (32px)</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar name="Default" badge="favorite" size="default" />
                <span className="text-xs text-[var(--primitive-neutral-600)]">default (48px)</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar name="LG" badge="favorite" size="lg" />
                <span className="text-xs text-[var(--primitive-neutral-600)]">lg (64px)</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar name="XL" badge="favorite" size="xl" />
                <span className="text-xs text-[var(--primitive-neutral-600)]">xl (96px)</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar name="2XL" badge="favorite" size="2xl" />
                <span className="text-xs text-[var(--primitive-neutral-600)]">2xl (128px)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive States */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-[var(--primitive-neutral-800)]">
            Interactive Avatars (hover & click)
          </h2>
          <div className="bg-white rounded-2xl border border-[var(--primitive-neutral-200)] p-8">
            <div className="flex items-center gap-8 flex-wrap">
              <div className="flex flex-col items-center gap-2">
                <Avatar
                  name="Click Me"
                  badge="success"
                  size="lg"
                  onClick={() => alert("Avatar clicked!")}
                />
                <span className="text-sm text-[var(--primitive-neutral-600)]">With onClick</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar
                  name="Hover Me"
                  badge="bookmark"
                  size="lg"
                  interactive
                />
                <span className="text-sm text-[var(--primitive-neutral-600)]">Interactive</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar
                  name="Static"
                  badge="critical"
                  size="lg"
                />
                <span className="text-sm text-[var(--primitive-neutral-600)]">Non-interactive</span>
              </div>
            </div>
          </div>
        </section>

        {/* With Images */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-[var(--primitive-neutral-800)]">
            With Profile Images
          </h2>
          <div className="bg-white rounded-2xl border border-[var(--primitive-neutral-200)] p-8">
            <div className="flex items-center gap-8 flex-wrap">
              <div className="flex flex-col items-center gap-2">
                <Avatar
                  name="John Doe"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face"
                  badge="success"
                  size="lg"
                />
                <span className="text-sm text-[var(--primitive-neutral-600)]">Success</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar
                  name="Jane Smith"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=face"
                  badge="favorite"
                  size="lg"
                  interactive
                />
                <span className="text-sm text-[var(--primitive-neutral-600)]">Favorite + Interactive</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar
                  name="Climate Corp"
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=128&h=128&fit=crop&crop=face"
                  badge="bipoc"
                  size="lg"
                />
                <span className="text-sm text-[var(--primitive-neutral-600)]">BIPOC</span>
              </div>
            </div>
          </div>
        </section>

        {/* Status vs Badge */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-[var(--primitive-neutral-800)]">
            Status Dots vs Badges
          </h2>
          <div className="bg-white rounded-2xl border border-[var(--primitive-neutral-200)] p-8">
            <div className="flex items-center gap-8 flex-wrap">
              <div className="flex flex-col items-center gap-2">
                <Avatar name="Online" status="online" size="lg" />
                <span className="text-sm text-[var(--primitive-neutral-600)]">Status: Online</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar name="Busy" status="busy" size="lg" />
                <span className="text-sm text-[var(--primitive-neutral-600)]">Status: Busy</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar name="Away" status="away" size="lg" />
                <span className="text-sm text-[var(--primitive-neutral-600)]">Status: Away</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar name="Success" badge="success" size="lg" />
                <span className="text-sm text-[var(--primitive-neutral-600)]">Badge: Success</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-[var(--primitive-neutral-500)]">
              Note: When both status and badge are provided, badge takes precedence.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
