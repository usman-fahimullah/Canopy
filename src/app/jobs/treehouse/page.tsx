"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsListUnderline, TabsTriggerUnderline, TabsContent } from "@/components/ui/tabs";
import { BookOpen } from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";
import { LearningPathwayCard } from "./components/pathway-card";
import { CourseCard } from "./components/course-card";
import { CertificationCard } from "./components/certification-card";
import { logger, formatError } from "@/lib/logger";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Pathway {
  id: string;
  title: string;
  description: string;
  courseCount: number;
  progress: number;
  icon: string;
}

interface Course {
  id: string;
  title: string;
  provider: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  progress: number;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  status: "not_started" | "in_progress" | "earned";
  earnedDate: string | null;
  expiresDate: string | null;
}

interface TreehouseData {
  pathways: Pathway[];
  courses: Course[];
  certifications: Certification[];
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function TreehousePage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TreehouseData>({
    pathways: [],
    courses: [],
    certifications: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/jobs/treehouse");
        if (res.ok) {
          const json = await res.json();
          setData({
            pathways: json.pathways ?? [],
            courses: json.courses ?? [],
            certifications: json.certifications ?? [],
          });
        }
      } catch (error) {
        logger.error("Error fetching treehouse data", { error: formatError(error) });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ---- Loading state -------------------------------------------- */
  if (loading) {
    return (
      <div>
        <PageHeader title="Treehouse" />
        <div className="flex items-center justify-center py-32">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  /* ---- Active learning items ------------------------------------ */
  const activeCourses = data.courses.filter((c) => c.progress > 0);
  const earnedCerts = data.certifications.filter((c) => c.status === "earned");

  /* ---- Render --------------------------------------------------- */
  return (
    <div>
      <PageHeader title="Treehouse" />

      <div className="px-4 py-8 sm:px-6 lg:px-12">
        <Tabs defaultValue="explore">
          <TabsListUnderline>
            <TabsTriggerUnderline value="explore">Explore</TabsTriggerUnderline>
            <TabsTriggerUnderline value="my-learning">My Learning</TabsTriggerUnderline>
            <TabsTriggerUnderline value="certifications">Certifications</TabsTriggerUnderline>
          </TabsListUnderline>

          {/* ---- Explore Tab ---- */}
          <TabsContent value="explore">
            <div className="space-y-10 pt-6">
              {/* Learning Pathways */}
              <section>
                <h2 className="mb-4 text-heading-sm font-semibold text-[var(--foreground-default)]">
                  Learning Pathways
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {data.pathways.map((pathway) => (
                    <LearningPathwayCard
                      key={pathway.id}
                      title={pathway.title}
                      description={pathway.description}
                      courseCount={pathway.courseCount}
                      progress={pathway.progress}
                      icon={pathway.icon}
                    />
                  ))}
                </div>
              </section>

              {/* Courses */}
              <section>
                <h2 className="mb-4 text-heading-sm font-semibold text-[var(--foreground-default)]">
                  Courses
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {data.courses.map((course) => (
                    <CourseCard
                      key={course.id}
                      title={course.title}
                      provider={course.provider}
                      duration={course.duration}
                      difficulty={course.difficulty}
                      progress={course.progress}
                    />
                  ))}
                </div>
              </section>
            </div>
          </TabsContent>

          {/* ---- My Learning Tab ---- */}
          <TabsContent value="my-learning">
            <div className="pt-6">
              {activeCourses.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {activeCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      title={course.title}
                      provider={course.provider}
                      duration={course.duration}
                      difficulty={course.difficulty}
                      progress={course.progress}
                    />
                  ))}
                </div>
              ) : (
                <Card variant="outlined" className="p-12 text-center">
                  <BookOpen
                    size={40}
                    weight="light"
                    className="mx-auto mb-3 text-[var(--foreground-subtle)]"
                  />
                  <p className="text-body font-medium text-[var(--foreground-default)]">
                    No courses started yet
                  </p>
                  <p className="mt-1 text-caption text-[var(--foreground-muted)]">
                    Browse the Explore tab to find courses
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* ---- Certifications Tab ---- */}
          <TabsContent value="certifications">
            <div className="pt-6">
              {data.certifications.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {data.certifications.map((cert) => (
                    <CertificationCard
                      key={cert.id}
                      name={cert.name}
                      issuer={cert.issuer}
                      status={cert.status}
                      earnedDate={cert.earnedDate}
                      expiresDate={cert.expiresDate}
                    />
                  ))}
                </div>
              ) : (
                <Card variant="outlined" className="p-12 text-center">
                  <BookOpen
                    size={40}
                    weight="light"
                    className="mx-auto mb-3 text-[var(--foreground-subtle)]"
                  />
                  <p className="text-body font-medium text-[var(--foreground-default)]">
                    No certifications tracked yet
                  </p>
                  <p className="mt-1 text-caption text-[var(--foreground-muted)]">
                    Explore learning pathways to begin earning certifications
                  </p>
                </Card>
              )}

              {/* Summary if earned certs exist */}
              {earnedCerts.length > 0 && (
                <div className="mt-6 rounded-[var(--radius-2xl)] border border-[var(--border-success)] bg-[var(--background-success)] p-4">
                  <p className="text-body font-medium text-[var(--foreground-brand-emphasis)]">
                    {earnedCerts.length} certification{earnedCerts.length !== 1 ? "s" : ""} earned
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
