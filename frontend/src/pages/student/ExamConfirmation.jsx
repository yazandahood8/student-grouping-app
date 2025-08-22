import React, { useMemo, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  ProgressBar,
  Row,
  Stack,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import styles from "./ExamConfirmation.module.scss";

const ExamConfirmation = () => {
  const { id } = useParams();
  const { state } = useLocation() || {};
  const score = state?.score;
  const total = state?.total;
  const percentage = state?.percentage;

  const [copied, setCopied] = useState(false);

  const hasScore = useMemo(
    () => typeof score === "number" && typeof total === "number",
    [score, total]
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id || "");
      setCopied(true);
    } catch {
      // ignore if clipboard denied
    }
  };

  return (
    <Container fluid="xl" className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8} xl={7}>
          <Card bg="body" data-bs-theme="auto" className={styles.cardInteractive} role="status" aria-live="polite">
            <Card.Body className="p-4">
              {/* Success hero */}
              <div className="d-flex flex-column align-items-center text-center mb-3">
                <div className={styles.successMark} aria-hidden>
                  <div className={styles.check}>✓</div>
                </div>
                <h1 className="h3 mt-3 mb-1">Your answers have been submitted!</h1>
                <p className="text-body-secondary mb-0">
                  Thank you for completing the exam.
                </p>
              </div>

              {/* Score summary */}
              <Row className="g-3 mb-3">
                <Col xs={12} md={6} lg={5}>
                  <Card bg="body" data-bs-theme="auto" className={styles.statsCard} aria-label="Exam details">
                    <Card.Body className="py-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="text-body-secondary">Exam ID</div>
                        <Badge bg="light" text="dark">
                          {hasScore ? "Submitted" : "Received"}
                        </Badge>
                      </div>
                      <div className={`${styles.mono} mt-1`}>{id}</div>
                      <div className="d-flex gap-2 mt-2">
                        <Button variant="outline-secondary" size="sm" onClick={handleCopy} aria-label="Copy exam ID">
                          Copy ID
                        </Button>
                        <Button as={Link} to="/student/dashboard" variant="secondary" size="sm">
                          Back to Dashboard
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} md={6} lg={7}>
                  <Card bg="body" data-bs-theme="auto" className={styles.statsCard} aria-label="Score summary">
                    <Card.Body className="py-3">
                      {hasScore ? (
                        <>
                          <Stack direction="horizontal" className="justify-content-between mb-1">
                            <div className="fw-semibold">Your Score</div>
                            <div className="text-body-secondary">
                              {score}/{total} ({percentage}%)
                            </div>
                          </Stack>
                          <ProgressBar now={percentage} aria-label={`Score ${percentage}%`} className={styles.progressSlim} />
                          <div className="small text-body-secondary mt-1">
                            Great job! You can review other exams from your dashboard.
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="fw-semibold mb-1">Submission received</div>
                          <div className="text-body-secondary small">
                            We couldn’t read score details for this attempt. You can still return to your dashboard.
                          </div>
                        </>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Next actions */}
              <div className="d-flex flex-wrap gap-2 justify-content-center">
                <Button as={Link} to="/student/dashboard" variant="primary">
                  Go to Dashboard
                </Button>
                <Button as={Link} to="/student/exams" variant="outline-primary">
                  Browse More Exams
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ToastContainer position="bottom-end" className="p-3" containerPosition="fixed">
        <Toast onClose={() => setCopied(false)} show={copied} delay={1600} autohide bg="success" role="status">
          <Toast.Body className="text-white">Exam ID copied</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default ExamConfirmation;
