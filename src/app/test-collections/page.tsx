"use client";

import React from "react";
import { CollectionCard } from "@/components/ui/collection-card";
import { PathwayType } from "@/components/ui/pathway-tag";

/**
 * Test page for Collection Card gradients
 * Demonstrates dynamic gradient selection based on pathway combinations
 */

interface TestCollection {
  title: string;
  pathways: PathwayType[];
  jobCount: number;
  description?: string;
}

const testCollections: TestCollection[] = [
  // Same-family examples
  {
    title: "Renewable Energy Jobs",
    pathways: ["energy", "technology"],
    jobCount: 234,
    description: "Build the clean energy future with solar, wind, and battery technology roles",
  },
  {
    title: "Conservation & Research",
    pathways: ["conservation", "research", "water"],
    jobCount: 145,
    description: "Protect ecosystems and advance environmental science",
  },
  {
    title: "Urban Development",
    pathways: ["construction", "urban-planning", "real-estate"],
    jobCount: 187,
    description: "Design and build sustainable cities and communities",
  },
  {
    title: "Healthcare & Wellness",
    pathways: ["medical", "education"],
    jobCount: 98,
    description: "Improve public health through climate-aware healthcare",
  },

  // Cross-family examples
  {
    title: "Green Agriculture & Energy",
    pathways: ["agriculture", "energy"],
    jobCount: 156,
    description: "Combine farming innovation with renewable energy solutions",
  },
  {
    title: "Sustainable Construction",
    pathways: ["construction", "forestry"],
    jobCount: 203,
    description: "Build with sustainable materials and green building practices",
  },
  {
    title: "Climate Education",
    pathways: ["education", "research"],
    jobCount: 89,
    description: "Teach and research solutions for climate challenges",
  },
  {
    title: "Water & Conservation",
    pathways: ["water", "conservation"],
    jobCount: 124,
    description: "Protect water resources and marine ecosystems",
  },
  {
    title: "Clean Tech Innovation",
    pathways: ["technology", "manufacturing"],
    jobCount: 178,
    description: "Develop and produce cutting-edge climate technology",
  },
  {
    title: "Sustainable Finance",
    pathways: ["finance", "policy"],
    jobCount: 142,
    description: "Drive capital toward climate solutions and ESG investing",
  },
  {
    title: "Green Media",
    pathways: ["media", "arts-culture"],
    jobCount: 67,
    description: "Tell climate stories and create environmental awareness",
  },
  {
    title: "Eco-Tourism",
    pathways: ["tourism", "conservation"],
    jobCount: 93,
    description: "Create sustainable travel experiences that protect nature",
  },

  // Order normalization test (these should look identical)
  {
    title: "Agriculture → Energy (A-E)",
    pathways: ["agriculture", "energy"],
    jobCount: 50,
    description: "Test: agriculture first, energy second",
  },
  {
    title: "Energy → Agriculture (E-A)",
    pathways: ["energy", "agriculture"],
    jobCount: 50,
    description: "Test: energy first, agriculture second (should match above)",
  },

  // Single pathway examples
  {
    title: "Forest Conservation",
    pathways: ["forestry"],
    jobCount: 78,
    description: "Protect and restore forest ecosystems",
  },
  {
    title: "Solar Energy",
    pathways: ["energy"],
    jobCount: 211,
    description: "Power the world with clean solar technology",
  },
];

export default function TestCollectionsPage() {
  return (
    <div className="min-h-screen bg-[var(--background-default)] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-heading-lg font-bold text-[var(--foreground-default)] mb-4">
            Collection Card Gradient System
          </h1>
          <p className="text-body text-[var(--foreground-muted)] max-w-3xl">
            Dynamic gradients based on pathway combinations. Same pathways always produce
            the same gradient, regardless of order. Same-family pathways use cohesive
            within-family gradients, while cross-family combinations create vibrant transitions.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testCollections.map((collection, index) => (
            <CollectionCard
              key={index}
              title={collection.title}
              pathways={collection.pathways}
              jobCount={collection.jobCount}
              description={collection.description}
              href={`/collections/${collection.title.toLowerCase().replace(/\s+/g, "-")}`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="mt-16 p-6 bg-[var(--background-subtle)] rounded-xl">
          <h2 className="text-heading-sm font-bold text-[var(--foreground-default)] mb-4">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-body-sm text-[var(--foreground-muted)]">
            <div>
              <h3 className="text-body-strong text-[var(--foreground-default)] mb-2">
                Same-Family Gradients
              </h3>
              <ul className="space-y-1">
                <li>• Energy + Technology → Yellow gradient (both yellow family)</li>
                <li>• Conservation + Research → Blue gradient (both blue family)</li>
                <li>• Construction + Urban Planning → Orange gradient (both orange family)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-body-strong text-[var(--foreground-default)] mb-2">
                Cross-Family Gradients
              </h3>
              <ul className="space-y-1">
                <li>• Agriculture + Energy → Green to Yellow transition</li>
                <li>• Education + Technology → Red to Yellow transition</li>
                <li>• Construction + Conservation → Blue to Orange transition</li>
              </ul>
            </div>
            <div>
              <h3 className="text-body-strong text-[var(--foreground-default)] mb-2">
                Order Normalization
              </h3>
              <ul className="space-y-1">
                <li>• Pathways are sorted alphabetically before mapping</li>
                <li>• [Agriculture, Energy] = [Energy, Agriculture]</li>
                <li>• Ensures consistent gradients regardless of input order</li>
              </ul>
            </div>
            <div>
              <h3 className="text-body-strong text-[var(--foreground-default)] mb-2">
                Pathway Families
              </h3>
              <ul className="space-y-1">
                <li>• Green: Agriculture, Finance, Forestry, Transport, Waste</li>
                <li>• Blue: Conservation, Research, Sports, Water</li>
                <li>• Orange: Construction, Manufacturing, Real Estate, Urban Planning</li>
                <li>• Red: Education, Medical, Tourism</li>
                <li>• Yellow: Energy, Technology</li>
                <li>• Purple: Arts & Culture, Media, Policy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
