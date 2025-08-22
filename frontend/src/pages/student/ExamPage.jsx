import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  ProgressBar,
  Row,
  Spinner,
  Stack,
} from "react-bootstrap";
import api from "../../services/api";
import { submitAnswers } from "../../services/answerService";
import styles from "./ExamPage.module.scss";

const ExamPage = () => {
  const { id } = useParams(); // exam id from route
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]); // selected option index per question
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // load exam
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/exams/${id}`);
        if (!alive) return;
        setExam(res.data);
        setAnswers(Array(res.data?.questions?.length || 0).fill(-1));
      } catch (e) {
        if (!alive) return;
        setError("Failed to load exam. Please try again.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const total = exam?.questions?.length || 0;
  const answeredCount = useMemo(
    () => answers.filter((v) => v !== -1).length,
    [answers]
  );
  const progress = useMemo(
    () => (total ? Math.round((answeredCount * 100) / total) : 0),
    [answeredCount, total]
  );

  const handleSelect = (qIndex, optionIndex) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = optionIndex;
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (answers.some((v) => v === -1)) {
      setError("Please answer all questions before submitting.");
      return;
    }
    try {
      setSubmitting(true);
      const res = await submitAnswers({ examId: id, answers });
      navigate(`/student/exam/${id}/confirmation`, {
        state: {
          score: res.data.score,
          total: res.data.total,
          percentage: res.data.percentage,
        },
      });
    } catch (e) {
      setError(
        e?.response?.data?.error || "There was a problem submitting your answers."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container fluid="xl" className="py-5">
        <div className="d-flex align-items-center justify-content-center">
          <Spinner animation="border" role="status" aria-label="Loading exam" />
        </div>
      </Container>
    );
  }

  if (error && !exam) {
    return (
      <Container fluid="xl" className="py-4">
        <Alert variant="danger" role="alert" className="mb-3">
          {error}
        </Alert>
        <Button as={Link} to="/student/dashboard" variant="secondary">
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  if (!exam) {
    return (
      <Container fluid="xl" className="py-4">
        <Card bg="body" data-bs-theme="auto" className="p-4">
          <div className="text-body-secondary">Exam not found.</div>
        </Card>
      </Container>
    );
  }

  return (
    <Container fluid="xl" className="py-4">
      {/* Header */}
      <Row className="align-items-center g-3 mb-2">
        <Col xs={12} md="auto">
          <h1 className="h3 mb-0">{exam.title}</h1>
        </Col>
        <Col className="text-body-secondary">
          <Stack direction="horizontal" gap={2} className="flex-wrap">
            <span>
              Questions: <Badge bg="secondary">{total}</Badge>
            </span>
            <span>
              Answered: <Badge bg="info">{answeredCount}</Badge>
            </span>
            <span>
              Remaining:{" "}
              <Badge bg="light" text="dark">
                {Math.max(0, total - answeredCount)}
              </Badge>
            </span>
          </Stack>
        </Col>
      </Row>

      {/* Progress */}
      <Card bg="body" data-bs-theme="auto" className={`mb-4 ${styles.cardInteractive}`}>
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="fw-semibold">Progress</div>
            <div className="text-body-secondary">{progress}%</div>
          </div>
          <ProgressBar now={progress} aria-label={`Progress ${progress}%`} />
        </Card.Body>
      </Card>

      {error && (
        <Alert variant="warning" role="alert" className="mb-3">
          {error}
        </Alert>
      )}

      {/* Questions */}
      <Form noValidate onSubmit={handleSubmit} aria-label="Exam form">
        <Stack gap={3} className="mb-4">
          {exam.questions.map((q, qIndex) => (
            <Card
              key={q._id || `q-${qIndex}`}
              bg="body"
              data-bs-theme="auto"
              className={styles.cardInteractive}
              aria-labelledby={`legend-q-${qIndex}`}
            >
              <Card.Body>
                <Form.Group as="fieldset">
                  <Form.Label as="legend" id={`legend-q-${qIndex}`} className="fw-semibold">
                    {qIndex + 1}. {q.text}
                  </Form.Label>

                  <Row className="g-2 mt-1">
                    {q.options.map((opt, oIndex) => {
                      const idFor = `q-${qIndex}-o-${oIndex}`;
                      return (
                        <Col xs={12} key={idFor}>
                          <div className={`${styles.option} form-check`}>
                            <Form.Check
                              type="radio"
                              name={`q-${qIndex}`}
                              id={idFor}
                              checked={answers[qIndex] === oIndex}
                              onChange={() => handleSelect(qIndex, oIndex)}
                              label={<span className="fw-normal">{opt}</span>}
                            />
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                </Form.Group>
              </Card.Body>
            </Card>
          ))}
        </Stack>

        {/* Sticky submit bar */}
        <div className={styles.stickySubmit} role="region" aria-label="Submit bar">
          <div className="d-flex align-items-center justify-content-between gap-3">
            <div className="flex-grow-1">
              <ProgressBar
                now={progress}
                aria-label={`Progress ${progress}%`}
                className={styles.progressSlim}
              />
              <div className="small text-body-secondary mt-1">
                {answeredCount}/{total} answered
              </div>
            </div>
            <Stack direction="horizontal" gap={2}>
              <Button as={Link} to="/student/dashboard" variant="outline-secondary">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="success"
                disabled={submitting || answeredCount !== total}
                aria-label="Submit exam"
              >
                {submitting ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" aria-hidden />
                    Submitting…
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </Stack>
          </div>
        </div>
      </Form>
    </Container>
  );
};

export default ExamPage;
