import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
  Stack,
} from "react-bootstrap";
import api from "../../services/api";
import { getExams } from "../../services/examService";
import styles from "./StudentDashboard.module.scss";

const StudentDashboard = () => {
  const [exams, setExams] = useState([]);
  const [attempts, setAttempts] = useState({}); // { [examId]: { submittedAt?: string, percentage?: number } }
  const [loading, setLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [err, setErr] = useState(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    let mounted = true;

    const withTimeout = (p, ms = 12000) =>
      Promise.race([
        p,
        new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms)),
      ]);

    (async () => {
      try {
        setErr(null);
        setLoading(true);
        const res = await withTimeout(getExams());
        if (!mounted) return;
        setExams(res.data || []);
      } catch (e) {
        if (!mounted) return;
        console.error("Failed to load exams:", e);
        setErr(
          e?.message === "timeout"
            ? "The server didn’t respond. Check that the backend is running on :5000 (or update baseURL/proxy)."
            : (e?.response?.data?.error || "Could not load exams.")
        );
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  // 🔹 NEW: after exams load, fetch my submission statuses and fill `attempts`
  useEffect(() => {
    let alive = true;
    const token = localStorage.getItem("token");
    if (!token || !exams.length) return;

    (async () => {
      try {
        setLoadingStatus(true);
        const ids = exams.map(e => e._id).filter(Boolean);
        const map = await fetchMyStatuses(ids);
        if (!alive) return;
        setAttempts(map || {});
      } catch (e) {
        // Silent: if these fail we just don’t show “Completed”
        console.warn("Could not fetch my submission statuses", e);
      } finally {
        if (alive) setLoadingStatus(false);
      }
    })();

    return () => { alive = false; };
  }, [exams]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return exams;
    return exams.filter((e) => {
      const title = (e.title || "").toLowerCase();
      const teacher = (e.teacher?.name || "").toLowerCase();
      const id = e._id || "";
      return title.includes(term) || teacher.includes(term) || id.includes(term);
    });
  }, [q, exams]);

  const handleCopyId = async (id) => {
    try {
      await navigator.clipboard.writeText(id);
    } catch {
      // clipboard may be blocked; ignore
    }
  };

  const isCompleted = (examId) => Boolean(attempts[examId]);
  const getPct = (examId) => {
    const v = attempts[examId]?.percentage;
    return typeof v === "number" ? v : null;
  };

  return (
    <Container fluid="xl" className="py-4">
      <Row className="align-items-center g-3 mb-2">
        <Col xs={12} md="auto">
          <h1 className="h3 mb-0">Available Exams</h1>
        </Col>
        <Col className="text-body-secondary">
          <Stack direction="horizontal" gap={2} className="flex-wrap">
            <span>
              Total: <Badge bg="secondary">{exams.length}</Badge>
            </span>
            <span>
              Showing: <Badge bg="info">{filtered.length}</Badge>
            </span>
            {loadingStatus && (
              <span>
                <Badge bg="light" text="dark">Checking attempts…</Badge>
              </span>
            )}
          </Stack>
        </Col>
        <Col xs={12} md={5} lg={4}>
          <InputGroup>
            <InputGroup.Text id="search-label" className="bg-body-tertiary">🔎</InputGroup.Text>
            <Form.Control
              aria-labelledby="search-label"
              placeholder="Search by title, teacher, or ID"
              value={q}
              onChange={(e) => setQ(e.currentTarget.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {err && (
        <Alert variant="danger" role="alert" className="mb-3 d-flex align-items-center justify-content-between">
          <span>{err}</span>
          <Button size="sm" variant="outline-light" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Alert>
      )}

      {loading ? (
        <div className="d-flex align-items-center justify-content-center py-5">
          <Spinner animation="border" role="status" aria-label="Loading exams" />
        </div>
      ) : filtered.length === 0 ? (
        <Card bg="body" data-bs-theme="auto" className="p-4">
          <div className="text-body-secondary">
            {q ? (
              <>No exams match <strong>{q}</strong>.</>
            ) : (
              "No exams are available right now."
            )}
          </div>
        </Card>
      ) : (
        <Row className="g-3">
          {filtered.map((exam) => {
            const completed = isCompleted(exam._id);
            const pct = getPct(exam._id);
            return (
              <Col key={exam._id} xs={12} sm={6} lg={4} xl={3}>
                <Card
                  bg="body"
                  data-bs-theme="auto"
                  className={styles.cardInteractive}
                  aria-labelledby={`exam-${exam._id}-title`}
                >
                  <Card.Body>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className={styles.teacherChip} aria-hidden>
                        {(exam.teacher?.name || "T").slice(0, 1).toUpperCase()}
                      </div>
                      <Stack direction="horizontal" gap={2} className="ms-2">
                        <Badge bg="light" text="dark">
                          {Array.isArray(exam.questions) ? `${exam.questions.length} Qs` : "Exam"}
                        </Badge>
                        {completed && (
                          <Badge bg="success">{typeof pct === "number" ? `Done · ${pct}%` : "Done"}</Badge>
                        )}
                      </Stack>
                    </div>

                    <h2 id={`exam-${exam._id}-title`} className="h6 mb-1">
                      {exam.title}
                    </h2>
                    <div className="text-body-secondary small mb-2">
                      {exam.teacher?.name ? <>By {exam.teacher.name}</> : "—"}
                    </div>

                    <div className="d-flex align-items-center justify-content-between">
                      <Button
                        as={Link}
                        to={completed ? `/student/exam/${exam._id}/confirmation` : `/student/exam/${exam._id}`}
                        variant={completed ? "success" : "primary"}
                        aria-disabled={completed ? "true" : undefined}
                        disabled={completed}
                        title={completed ? "You already completed this exam" : "Start exam"}
                      >
                        {completed ? "Completed" : "Start Exam"}
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleCopyId(exam._id)}
                        aria-label={`Copy exam ID ${exam._id}`}
                      >
                        Copy ID
                      </Button>
                    </div>

                    <div className="mt-2 text-body-secondary small font-monospace">
                      ID: {exam._id}
                    </div>

                    {completed && (
                      <div className="mt-2 small">
                        <Button
                          as={Link}
                          to={`/student/exam/${exam._id}/confirmation`}
                          variant="link"
                          className="p-0 align-baseline"
                        >
                          View submission
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

/**
 * Attempts to fetch a bulk summary of the current student's submissions.
 * Tries `/answers/my-summary?examIds=...` first. If unavailable, falls back
 * to per-exam `/answers/my?examId=...`.
 * Returns: { [examId]: { submittedAt?: string, percentage?: number } }
 */
async function fetchMyStatuses(examIds) {
  const map = {};
  if (!Array.isArray(examIds) || examIds.length === 0) return map;

  // 1) Preferred bulk endpoint (fast)
  try {
    const res = await api.get("/answers/my-summary", {
      params: { examIds: examIds.join(",") },
    });
    const data = Array.isArray(res.data) ? res.data : [];
    for (const item of data) {
      const id = item.exam || item.examId || item._id;
      if (!id) continue;
      map[id] = {
        submittedAt: item.submittedAt || item.createdAt,
        percentage:
          typeof item.percentage === "number"
            ? item.percentage
            : typeof item.score === "number" && typeof item.total === "number"
            ? Math.round((item.score * 100) / (item.total || 1))
            : undefined,
      };
    }
    if (Object.keys(map).length > 0) return map;
  } catch {
    // ignore; fall back
  }

  // 2) Fallback: per-exam check (slower)
  try {
    const results = await Promise.allSettled(
      examIds.map((id) => api.get("/answers/my", { params: { examId: id } }))
    );
    results.forEach((r) => {
      if (r.status === "fulfilled") {
        const payload = r.value?.data;
        const attempt = Array.isArray(payload) ? payload[0] : payload;
        if (attempt && (attempt.exam || attempt.examId)) {
          const examId = attempt.exam || attempt.examId;
          const percentage =
            typeof attempt.percentage === "number"
              ? attempt.percentage
              : typeof attempt.score === "number" && typeof attempt.total === "number"
              ? Math.round((attempt.score * 100) / (attempt.total || 1))
              : undefined;
          map[examId] = {
            submittedAt: attempt.submittedAt || attempt.createdAt,
            percentage,
          };
        }
      }
    });
  } catch {
    // ignore; return whatever we gathered
  }

  return map;
}

export default StudentDashboard;
