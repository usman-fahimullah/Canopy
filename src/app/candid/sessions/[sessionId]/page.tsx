"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  ArrowLeft,
  CalendarBlank,
  Clock,
  VideoCamera,
  CheckCircle,
  XCircle,
  Star,
  Plus,
  Trash,
  Notepad,
  ListChecks,
  ArrowsClockwise,
  Prohibit,
  Check,
} from "@phosphor-icons/react";
import { format } from "date-fns";
import { logger, formatError } from "@/lib/logger";

interface ActionItem {
  id: string;
  description: string;
  status: "PENDING" | "COMPLETED";
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
}

interface SessionDetail {
  id: string;
  scheduledAt: string;
  duration: number;
  status: string;
  videoLink: string | null;
  menteeMessage: string | null;
  coachNotes: string | null;
  cancellationReason: string | null;
  cancelledAt: string | null;
  completedAt: string | null;
  sessionNumber: number | null;
  coach: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    photoUrl: string | null;
    headline: string | null;
    bio: string | null;
    account: { id: string; name: string | null; email: string; avatar: string | null };
  };
  mentee: {
    id: string;
    headline: string | null;
    account: { id: string; name: string | null; email: string; avatar: string | null };
  };
  booking: {
    id: string;
    amount: number;
    status: string;
    paidAt: string | null;
  } | null;
  review: {
    id: string;
    rating: number;
    comment: string | null;
    coachResponse: string | null;
    createdAt: string;
  } | null;
  actionItems: ActionItem[];
}

const STATUS_VARIANTS: Record<string, "info" | "success" | "critical" | "warning" | "neutral"> = {
  SCHEDULED: "info",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
  CANCELLED: "critical",
  NO_SHOW: "neutral",
};

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<SessionDetail | null>(null);
  const [userRole, setUserRole] = useState<"coach" | "mentee">("mentee");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Coach notes
  const [editingNotes, setEditingNotes] = useState(false);
  const [coachNotes, setCoachNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // Action items
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemDue, setNewItemDue] = useState("");
  const [addingItem, setAddingItem] = useState(false);

  // Cancel/Reschedule
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [rescheduling, setRescheduling] = useState(false);

  const [completing, setCompleting] = useState(false);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}`);
      if (!res.ok) throw new Error("Failed to fetch session");
      const data = await res.json();
      setSession(data.session);
      setUserRole(data.userRole);
      setCoachNotes(data.session.coachNotes || "");
    } catch {
      setError("Failed to load session details");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, coachNotes }),
      });
      if (res.ok) {
        setEditingNotes(false);
        await fetchSession();
      }
    } catch {
      setError("Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleComplete = async () => {
    setCompleting(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, status: "COMPLETED" }),
      });
      if (res.ok) {
        await fetchSession();
      }
    } catch {
      setError("Failed to complete session");
    } finally {
      setCompleting(false);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelReason }),
      });
      if (res.ok) {
        setShowCancelDialog(false);
        await fetchSession();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to cancel");
      }
    } catch {
      setError("Failed to cancel session");
    } finally {
      setCancelling(false);
    }
  };

  const handleReschedule = async () => {
    if (!newDate) return;
    setRescheduling(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}/reschedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newDate }),
      });
      if (res.ok) {
        setShowRescheduleDialog(false);
        await fetchSession();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to reschedule");
      }
    } catch {
      setError("Failed to reschedule session");
    } finally {
      setRescheduling(false);
    }
  };

  const handleAddActionItem = async () => {
    if (!newItemDesc.trim()) return;
    setAddingItem(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}/action-items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: newItemDesc.trim(),
          dueDate: newItemDue || null,
        }),
      });
      if (res.ok) {
        setNewItemDesc("");
        setNewItemDue("");
        await fetchSession();
      }
    } catch {
      setError("Failed to add action item");
    } finally {
      setAddingItem(false);
    }
  };

  const handleToggleActionItem = async (item: ActionItem) => {
    const newStatus = item.status === "COMPLETED" ? "PENDING" : "COMPLETED";
    try {
      await fetch(`/api/action-items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchSession();
    } catch {
      setError("Failed to update action item");
    }
  };

  const handleDeleteActionItem = async (itemId: string) => {
    try {
      await fetch(`/api/action-items/${itemId}`, { method: "DELETE" });
      await fetchSession();
    } catch {
      setError("Failed to delete action item");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-center text-foreground-muted">
          {error || "Session not found"}
        </p>
      </div>
    );
  }

  const scheduledAt = new Date(session.scheduledAt);
  const isPast = scheduledAt < new Date();
  const isUpcoming = !isPast && session.status === "SCHEDULED";
  const coachName = [session.coach.firstName, session.coach.lastName].filter(Boolean).join(" ") || session.coach.account.name || "Coach";
  const menteeName = session.mentee.account.name || "Mentee";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 pb-24 md:pb-8">
      {/* Back link */}
      <Link
        href="/candid/sessions"
        className="inline-flex items-center gap-1.5 text-caption text-foreground-muted hover:text-foreground-default transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Sessions
      </Link>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg bg-[var(--background-error)] px-4 py-3 text-sm text-[var(--foreground-error)]">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      {/* Session Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar
              size="xl"
              src={userRole === "mentee" ? (session.coach.photoUrl || session.coach.account.avatar || undefined) : (session.mentee.account.avatar || undefined)}
              name={userRole === "mentee" ? coachName : menteeName}
              color="green"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-heading-sm font-semibold text-foreground-default">
                  Session with {userRole === "mentee" ? coachName : menteeName}
                </h1>
                <Badge variant={STATUS_VARIANTS[session.status] || "neutral"}>
                  {session.status.replace("_", " ")}
                </Badge>
              </div>
              <p className="text-body-sm text-foreground-muted mb-3">
                {userRole === "mentee"
                  ? session.coach.headline
                  : session.mentee.headline}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-caption text-foreground-muted">
                <span className="flex items-center gap-1.5">
                  <CalendarBlank size={16} />
                  {format(scheduledAt, "EEEE, MMMM d, yyyy")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={16} />
                  {format(scheduledAt, "h:mm a")} ({session.duration} min)
                </span>
                {session.sessionNumber && (
                  <span className="text-[var(--foreground-brand)]">
                    Session #{session.sessionNumber}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-[var(--border-muted)]">
            {isUpcoming && session.videoLink && (
              <Button variant="primary" leftIcon={<VideoCamera size={18} />} asChild>
                <a href={session.videoLink} target="_blank" rel="noopener noreferrer">
                  Join Session
                </a>
              </Button>
            )}
            {isUpcoming && (
              <>
                <Button
                  variant="secondary"
                  leftIcon={<ArrowsClockwise size={18} />}
                  onClick={() => setShowRescheduleDialog(true)}
                >
                  Reschedule
                </Button>
                <Button
                  variant="ghost"
                  leftIcon={<Prohibit size={18} />}
                  onClick={() => setShowCancelDialog(true)}
                  className="text-[var(--foreground-error)]"
                >
                  Cancel
                </Button>
              </>
            )}
            {session.status === "SCHEDULED" && userRole === "coach" && isPast && (
              <Button
                variant="primary"
                leftIcon={<CheckCircle size={18} />}
                onClick={handleComplete}
                loading={completing}
              >
                Mark Complete
              </Button>
            )}
            {session.status === "COMPLETED" && !session.review && userRole === "mentee" && (
              <Button variant="secondary" leftIcon={<Star size={18} />} asChild>
                <Link href={`/candid/sessions/${session.id}/review`}>
                  Leave Review
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cancel dialog */}
      {showCancelDialog && (
        <Card className="mb-6 border-[var(--border-error)]">
          <CardContent className="p-6">
            <h3 className="text-body-strong font-semibold text-[var(--foreground-error)] mb-3">
              Cancel Session
            </h3>
            <p className="text-caption text-foreground-muted mb-4">
              {userRole === "coach"
                ? "Cancelling as a coach will issue a full refund to the mentee."
                : (new Date(session.scheduledAt).getTime() - Date.now()) / (1000 * 60 * 60) >= 24
                ? "Cancelling more than 24 hours before the session will issue a full refund."
                : "Cancelling less than 24 hours before the session will issue a 50% refund."}
            </p>
            <div className="space-y-3">
              <div>
                <Label htmlFor="cancelReason">Reason (optional)</Label>
                <Textarea
                  id="cancelReason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Why are you cancelling?"
                  rows={2}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={handleCancel}
                  loading={cancelling}
                >
                  Confirm Cancellation
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowCancelDialog(false)}
                >
                  Keep Session
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reschedule dialog */}
      {showRescheduleDialog && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-body-strong font-semibold text-foreground-default mb-3">
              Reschedule Session
            </h3>
            <p className="text-caption text-foreground-muted mb-4">
              Choose a new date and time. You can only reschedule more than 24 hours before the session.
            </p>
            <div className="space-y-3">
              <div>
                <Label htmlFor="newDate">New Date & Time</Label>
                <Input
                  id="newDate"
                  type="datetime-local"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  inputSize="sm"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  onClick={handleReschedule}
                  loading={rescheduling}
                  disabled={!newDate}
                >
                  Confirm Reschedule
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowRescheduleDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cancellation info */}
      {session.status === "CANCELLED" && (
        <Card className="mb-6 border-[var(--border-error)]">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <XCircle size={24} className="text-[var(--foreground-error)] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-body-strong font-semibold text-[var(--foreground-error)]">
                  Session Cancelled
                </h3>
                {session.cancellationReason && (
                  <p className="text-caption text-foreground-muted mt-1">
                    Reason: {session.cancellationReason}
                  </p>
                )}
                {session.cancelledAt && (
                  <p className="text-caption text-foreground-subtle mt-1">
                    Cancelled on {format(new Date(session.cancelledAt), "MMM d, yyyy")}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mentee Message */}
      {session.menteeMessage && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-body-strong">Message from {menteeName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body-sm text-foreground-muted">{session.menteeMessage}</p>
          </CardContent>
        </Card>
      )}

      {/* Coach Notes */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Notepad size={20} />
            Coach Notes
          </CardTitle>
          {userRole === "coach" && !editingNotes && (
            <Button variant="ghost" size="sm" onClick={() => setEditingNotes(true)}>
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {editingNotes ? (
            <div className="space-y-3">
              <Textarea
                value={coachNotes}
                onChange={(e) => setCoachNotes(e.target.value)}
                placeholder="Add notes about this session..."
                rows={4}
              />
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveNotes}
                  loading={savingNotes}
                >
                  Save Notes
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingNotes(false);
                    setCoachNotes(session.coachNotes || "");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-body-sm text-foreground-muted whitespace-pre-wrap">
              {session.coachNotes || "No notes yet"}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ListChecks size={20} />
            Action Items
          </CardTitle>
          {session.actionItems.length > 0 && (
            <span className="text-caption text-foreground-muted">
              {session.actionItems.filter((i) => i.status === "COMPLETED").length}/{session.actionItems.length} completed
            </span>
          )}
        </CardHeader>
        <CardContent>
          {session.actionItems.length > 0 ? (
            <div className="space-y-2 mb-4">
              {session.actionItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-[var(--background-subtle)]"
                >
                  <button
                    onClick={() => handleToggleActionItem(item)}
                    className={`mt-0.5 flex-shrink-0 ${
                      item.status === "COMPLETED"
                        ? "text-[var(--foreground-success)]"
                        : "text-foreground-subtle hover:text-foreground-muted"
                    }`}
                  >
                    {item.status === "COMPLETED" ? (
                      <CheckCircle size={20} weight="fill" />
                    ) : (
                      <Check size={20} />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-body-sm ${
                      item.status === "COMPLETED"
                        ? "line-through text-foreground-subtle"
                        : "text-foreground-default"
                    }`}>
                      {item.description}
                    </p>
                    {item.dueDate && (
                      <p className="text-caption text-foreground-subtle mt-0.5">
                        Due: {format(new Date(item.dueDate), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>
                  {userRole === "coach" && (
                    <button
                      onClick={() => handleDeleteActionItem(item.id)}
                      className="text-foreground-subtle hover:text-[var(--foreground-error)] transition-colors flex-shrink-0"
                    >
                      <Trash size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-caption text-foreground-muted mb-4">
              No action items yet
            </p>
          )}

          {/* Add action item (coach only) */}
          {userRole === "coach" && (
            <div className="flex gap-2 items-end pt-3 border-t border-[var(--border-muted)]">
              <div className="flex-1 space-y-1">
                <Label htmlFor="newItem" className="text-caption">New Action Item</Label>
                <Input
                  id="newItem"
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="Describe the action item..."
                  inputSize="sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddActionItem();
                    }
                  }}
                />
              </div>
              <div className="w-36 space-y-1">
                <Label htmlFor="dueDate" className="text-caption">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newItemDue}
                  onChange={(e) => setNewItemDue(e.target.value)}
                  inputSize="sm"
                />
              </div>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Plus size={14} />}
                onClick={handleAddActionItem}
                loading={addingItem}
                disabled={!newItemDesc.trim()}
              >
                Add
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review */}
      {session.review && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star size={20} weight="fill" className="text-[var(--primitive-yellow-500)]" />
              Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  weight={i < (session.review?.rating ?? 0) ? "fill" : "regular"}
                  className={
                    i < (session.review?.rating ?? 0)
                      ? "text-[var(--primitive-yellow-500)]"
                      : "text-foreground-subtle"
                  }
                />
              ))}
              <span className="ml-2 text-body-strong font-semibold">
                {session.review.rating}/5
              </span>
            </div>
            {session.review.comment && (
              <p className="text-body-sm text-foreground-muted mb-3">
                {session.review.comment}
              </p>
            )}
            {session.review.coachResponse && (
              <div className="mt-3 pt-3 border-t border-[var(--border-muted)]">
                <p className="text-caption font-medium text-foreground-default mb-1">
                  Coach Response
                </p>
                <p className="text-body-sm text-foreground-muted">
                  {session.review.coachResponse}
                </p>
              </div>
            )}
            <p className="text-caption text-foreground-subtle mt-2">
              {format(new Date(session.review.createdAt), "MMM d, yyyy")}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Payment info */}
      {session.booking && (
        <Card>
          <CardHeader>
            <CardTitle className="text-body-strong">Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-caption">
              <div className="flex justify-between">
                <span className="text-foreground-muted">Amount</span>
                <span className="font-medium">${(session.booking.amount / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Status</span>
                <Badge
                  variant={session.booking.status === "PAID" ? "success" : session.booking.status === "REFUNDED" ? "neutral" : "warning"}
                  size="sm"
                >
                  {session.booking.status}
                </Badge>
              </div>
              {session.booking.paidAt && (
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Paid on</span>
                  <span>{format(new Date(session.booking.paidAt), "MMM d, yyyy")}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
