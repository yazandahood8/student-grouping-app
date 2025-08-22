import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Alert,
  Badge,
  Card,
  Col,
  Container,
  ListGroup,
  ProgressBar,
  Row,
  Spinner,
  Stack,
  Table,
} from "react-bootstrap";
import { getExamDetailedStats } from "../../services/answerService";
import styles from "./ExamStatisticsPage.module.scss";

const ExamStatisticsPage = () => {
  const { id } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await getExamDetailedStats(id);
        if (!isMounted) return;
        setStats(res.data);
      } catch {
        if (!isMounted) return;
        setError("Error loading statistics. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const summary = useMemo(() => (stats ? stats.summary : null), [stats]);

  if (loading) {
    return (
      <Container fluid="xl" className="py-5">
        <div className="d-flex align-items-center justify-content-center">
          <Spinner animation="border" role="status" aria-label="Loading statistics" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid="xl" className="py-4">
        <Alert variant="danger" role="alert">{error}</Alert>
      </Container>
    );
  }

  if (!stats || !summary || !summary.count) {
    return (
      <Container fluid="xl" className="py-4">
        <Card bg="body" data-bs-theme="auto" className="p-4">
          <div className="text-body-secondary">No data yet…</div>
        </Card>
      </Container>
    );
  }

  return (
    <Container fluid="xl" className={`${styles.root} py-4`}>
      {/* Header / Summary */}
      <Row className="align-items-center g-3 mb-2">
        <Col xs={12} md="auto">
          <h1 className="h3 mb-0">Exam Statistics</h1>
        </Col>
        <Col className="text-body-secondary">
          <Stack direction="horizontal" gap={2} className="flex-wrap">
            <span>
              Submissions: <Badge bg="secondary">{summary.count}</Badge>
            </span>
            <span>
              Avg: <Badge bg="info">{summary.avg}%</Badge>
            </span>
            <span>
              Range:{" "}
              <Badge bg="light" text="dark">
                {summary.min}–{summary.max}%
              </Badge>
            </span>
          </Stack>
        </Col>
      </Row>

      {/* Summary Cards */}
      <Row className="g-3 mb-4">
        <Col xs={12} sm={6} lg={3}>
          <Card bg="body" data-bs-theme="auto" className={styles.cardInteractive} aria-label="Submissions">
            <Card.Body>
              <div className="text-body-secondary">Submissions</div>
              <div className="fs-3 fw-bold">{summary.count}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card bg="body" data-bs-theme="auto" className={styles.cardInteractive} aria-label="Average score">
            <Card.Body>
              <div className="text-body-secondary">Average</div>
              <div className="fs-3 fw-bold">{summary.avg}%</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card bg="body" data-bs-theme="auto" className={styles.cardInteractive} aria-label="Minimum score">
            <Card.Body>
              <div className="text-body-secondary">Min</div>
              <div className="fs-3 fw-bold">{summary.min}%</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card bg="body" data-bs-theme="auto" className={styles.cardInteractive} aria-label="Maximum score">
            <Card.Body>
              <div className="text-body-secondary">Max</div>
              <div className="fs-3 fw-bold">{summary.max}%</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Distribution */}
      <Card
        bg="body"
        data-bs-theme="auto"
        className={`mb-4 ${styles.cardInteractive}`}
        aria-labelledby="score-distribution"
      >
        <Card.Header as="h2" id="score-distribution" className="h5 mb-0">
          Score Distribution
        </Card.Header>
        <Card.Body>
          <div className="d-flex gap-3 flex-wrap">
            {Object.entries(summary.distribution).map(([bucket, n]) => (
              <div key={bucket} className={styles.distItem} role="group" aria-label={`Bucket ${bucket}`}>
                <div className="fw-bold">{bucket}</div>
                <div className="text-body-secondary">{n}</div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Question analysis */}
      <h2 className="h5 mt-4 mb-2">Question Analysis (hardest first)</h2>
      <ListGroup as="section" className="mb-4" aria-label="Question analysis list">
        {stats.questions.map((q) => (
          <ListGroup.Item key={q.questionId} className={styles.questionItem}>
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
              <div className="me-auto">
                <div className="fw-semibold">
                  {q.order}. {q.text}
                </div>
                <div className="small text-body-secondary">
                  Correct: <strong>{q.correctPct}%</strong>
                  {q.commonWrongOption != null && <> • Most missed: option {q.commonWrongOption + 1}</>}
                </div>
              </div>
              <div className={styles.barHolder}>
                <ProgressBar
                  now={q.correctPct}
                  aria-label={`Correct percentage ${q.correctPct}%`}
                  className={styles.progressSlim}
                />
              </div>
            </div>

            {/* Option breakdown */}
            <Row className="mt-3 g-2">
              {q.options.map((opt, i) => {
                const ob = q.optionBreakdown[i];
                const isCorrect = i === q.correctAnswer;
                return (
                  <Col xs={12} sm={6} lg={3} key={`${q.questionId}-${i}`}>
                    <Card
                      bg="body"
                      data-bs-theme="auto"
                      className={`${styles.optionCard} ${isCorrect ? styles.optionCardCorrect : ""}`}
                      aria-label={`Option ${i + 1}${isCorrect ? " (correct)" : ""}`}
                    >
                      <Card.Body className="py-2">
                        <div className="small text-body-secondary">
                          Option {i + 1}{isCorrect ? " (correct)" : ""}
                        </div>
                        <div className="fw-semibold">{opt}</div>
                        <div className="small text-body-secondary">
                          {ob.count} students • {ob.percent}%
                        </div>
                        {!isCorrect &&
                          q.commonWrongOption === i &&
                          q.commonWrongStudents &&
                          q.commonWrongStudents.length > 0 && (
                            <div className="small text-body-secondary mt-1">
                              e.g., {q.commonWrongStudents.slice(0, 5).join(", ")}
                            </div>
                          )}
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Students below threshold */}
      {stats.studentsBelowThreshold.length > 0 && (
        <Card bg="body" data-bs-theme="auto" className={styles.cardInteractive} aria-labelledby="students-to-revisit">
          <Card.Header as="h2" id="students-to-revisit" className="h5 mb-0">
            Students to Revisit (&lt; 60%)
          </Card.Header>
          <Card.Body className="pt-0">
            <div className="table-responsive">
              <Table hover responsive="md" className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col" className="text-end">%</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.studentsBelowThreshold.map((s, i) => (
                    <tr key={`${s.email ?? s.name ?? "student"}-${i}`}>
                      <td>{s.name ?? "—"}</td>
                      <td className="text-body-secondary">{s.email ?? "—"}</td>
                      <td className="text-end">{s.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default ExamStatisticsPage;
