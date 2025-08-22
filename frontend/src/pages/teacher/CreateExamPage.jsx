import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  InputGroup,
  Row,
  Spinner,
  Stack,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { createExam } from "../../services/examService";
import styles from "./CreateExamPage.module.scss";

const EMPTY_QUESTION = () => ({
  text: "",
  options: ["", "", "", ""],
  correctAnswer: 0,
});

const CreateExamPage = () => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([EMPTY_QUESTION()]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  const stats = useMemo(() => {
    const filledQs = questions.filter((q) => q.text.trim().length > 0).length;
    const filledOpts = questions.reduce(
      (acc, q) => acc + q.options.filter((o) => o.trim().length > 0).length,
      0
    );
    return { filledQs, filledOpts };
  }, [questions]);

  const handleQuestionText = (idx, value) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], text: value };
      return copy;
    });
  };

  const handleOption = (qIdx, optIdx, value) => {
    setQuestions((prev) => {
      const copy = [...prev];
      const q = { ...copy[qIdx], options: [...copy[qIdx].options] };
      q.options[optIdx] = value;
      copy[qIdx] = q;
      return copy;
    });
  };

  const handleCorrect = (qIdx, optIdx) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIdx] = { ...copy[qIdx], correctAnswer: optIdx };
      return copy;
    });
  };

  const addQuestion = () => setQuestions((prev) => [...prev, EMPTY_QUESTION()]);
  const removeQuestion = (idx) =>
    setQuestions((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev));

  const moveQuestion = (idx, dir) =>
    setQuestions((prev) => {
      const copy = [...prev];
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= copy.length) return prev;
      const [q] = copy.splice(idx, 1);
      copy.splice(newIdx, 0, q);
      return copy;
    });

  const validate = () => {
    const issues = [];
    if (!title.trim()) issues.push("Exam title is required.");

    questions.forEach((q, i) => {
      if (!q.text.trim()) issues.push(`Question ${i + 1}: text is required.`);
      q.options.forEach((opt, oi) => {
        if (!opt.trim()) issues.push(`Question ${i + 1}: Option ${oi + 1} is required.`);
      });
      if (
        typeof q.correctAnswer !== "number" ||
        q.correctAnswer < 0 ||
        q.correctAnswer > 3
      ) {
        issues.push(`Question ${i + 1}: select a correct option.`);
      }
    });

    return { ok: issues.length === 0, issues };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmed = {
      title: title.trim(),
      questions: questions.map((q) => ({
        text: q.text.trim(),
        options: q.options.map((o) => o.trim()),
        correctAnswer: q.correctAnswer,
      })),
    };

    const { ok, issues } = validate();
    if (!ok) {
      setErrorMsg(
        <>
          <strong>Please fix the following:</strong>
          <ul className="mb-0 mt-2">
            {issues.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        </>
      );
      return;
    }

    try {
      setSubmitting(true);
      await createExam(trimmed);
      setToast("Exam created successfully");
      // small delay so the toast is visible
      setTimeout(() => navigate("/teacher/dashboard"), 600);
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.error
          ? `Error: ${err.response.data.error}`
          : "Error creating exam. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setTitle("");
    setQuestions([EMPTY_QUESTION()]);
    setErrorMsg(null);
  };

  return (
    <Container fluid="xl" className="py-4">
      <Row className="align-items-center g-3 mb-2">
        <Col xs={12} md="auto">
          <h1 className="h3 mb-0">Create Exam</h1>
        </Col>
        <Col className="text-body-secondary">
          <Stack direction="horizontal" gap={2} className="flex-wrap">
            <span>
              Questions: <Badge bg="secondary">{questions.length}</Badge>
            </span>
            <span>
              Filled questions: <Badge bg="info">{stats.filledQs}</Badge>
            </span>
            <span>
              Filled options: <Badge bg="light" text="dark">{stats.filledOpts}</Badge>
            </span>
          </Stack>
        </Col>
      </Row>

      {errorMsg && (
        <Alert variant="danger" role="alert" className="mb-3">
          {errorMsg}
        </Alert>
      )}

      <Form noValidate onSubmit={handleSubmit} aria-labelledby="exam-form">
        <Card
          bg="body"
          data-bs-theme="auto"
          className={`${styles.cardInteractive} mb-4`}
          aria-label="Exam meta"
        >
          <Card.Body>
            <FloatingLabel label="Exam title" controlId="examTitle">
              <Form.Control
                type="text"
                placeholder="Enter exam title"
                value={title}
                onChange={(e) => setTitle(e.currentTarget.value)}
                maxLength={140}
                required
                aria-required="true"
                autoFocus
              />
            </FloatingLabel>
          </Card.Body>
        </Card>

        {/* Questions */}
        <Stack gap={3} as="section" aria-label="Questions list" className="mb-4">
          {questions.map((q, i) => {
            const qLabel = `Question ${i + 1}`;
            return (
              <Card
                key={`q-${i}`}
                bg="body"
                data-bs-theme="auto"
                className={styles.cardInteractive}
                aria-labelledby={`question-${i}-label`}
              >
                <Card.Header className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <Badge bg="primary" pill aria-hidden>
                      {i + 1}
                    </Badge>
                    <span id={`question-${i}-label`} className="fw-semibold">
                      {q.text.trim() ? q.text.slice(0, 64) : qLabel}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => moveQuestion(i, -1)}
                      disabled={i === 0}
                      aria-label={`Move ${qLabel} up`}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => moveQuestion(i, +1)}
                      disabled={i === questions.length - 1}
                      aria-label={`Move ${qLabel} down`}
                    >
                      ↓
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeQuestion(i)}
                      disabled={questions.length === 1}
                      aria-label={`Remove ${qLabel}`}
                    >
                      Remove
                    </Button>
                  </div>
                </Card.Header>

                <Card.Body>
                  <Row className="g-3">
                    <Col xs={12}>
                      <FloatingLabel
                        controlId={`q-text-${i}`}
                        label={`Question ${i + 1} text`}
                      >
                        <Form.Control
                          type="text"
                          placeholder="Type the question"
                          value={q.text}
                          onChange={(e) =>
                            handleQuestionText(i, e.currentTarget.value)
                          }
                          maxLength={300}
                          required
                          aria-required="true"
                        />
                      </FloatingLabel>
                    </Col>

                    {/* Options */}
                    {[0, 1, 2, 3].map((optIdx) => (
                      <Col xs={12} md={6} key={`q-${i}-opt-${optIdx}`}>
                        <Form.Group controlId={`q-${i}-opt-${optIdx}`}>
                          <Form.Label className="fw-semibold d-flex align-items-center justify-content-between">
                            <span>Option {optIdx + 1}</span>
                            <Form.Check
                              type="radio"
                              id={`q-${i}-correct-${optIdx}`}
                              name={`q-${i}-correct`}
                              label="Correct"
                              className={styles.correctRadio}
                              checked={q.correctAnswer === optIdx}
                              onChange={() => handleCorrect(i, optIdx)}
                              aria-label={`Mark option ${optIdx + 1} as correct`}
                            />
                          </Form.Label>
                          <InputGroup>
                            <InputGroup.Text className="bg-body-tertiary">
                              {optIdx + 1}
                            </InputGroup.Text>
                            <Form.Control
                              placeholder={`Enter option ${optIdx + 1}`}
                              value={q.options[optIdx]}
                              onChange={(e) =>
                                handleOption(i, optIdx, e.currentTarget.value)
                              }
                              maxLength={200}
                              required
                              aria-required="true"
                            />
                          </InputGroup>
                          <Form.Text className="text-body-secondary">
                            {q.correctAnswer === optIdx
                              ? "This will be the correct answer."
                              : " "}
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            );
          })}
        </Stack>

        <Stack direction="horizontal" gap={2} className="mb-4 flex-wrap">
          <Button
            variant="secondary"
            type="button"
            onClick={addQuestion}
            aria-label="Add a new question"
          >
            + Add Question
          </Button>
          <Button
            variant="outline-secondary"
            type="button"
            onClick={handleReset}
            aria-label="Reset form"
          >
            Reset
          </Button>
          <div className="ms-auto" />
          <Button
            variant="primary"
            type="submit"
            disabled={submitting}
            aria-label="Save exam"
          >
            {submitting ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" aria-hidden />
                Saving…
              </>
            ) : (
              "Save Exam"
            )}
          </Button>
        </Stack>
      </Form>

      <ToastContainer position="bottom-end" className="p-3" containerPosition="fixed">
        <Toast
          onClose={() => setToast(null)}
          show={!!toast}
          delay={1800}
          autohide
          bg="success"
          role="status"
        >
          <Toast.Body className="text-white">{toast}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default CreateExamPage;
