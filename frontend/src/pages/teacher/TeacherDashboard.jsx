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
  Table,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { getMyExams } from "../../services/examService";
import styles from "./TeacherDashboard.module.scss";

const TeacherDashboard = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [q, setQ] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getMyExams();
        if (!alive) return;
        setExams(res.data || []);
      } catch {
        if (!alive) return;
        setErr("Error loading exams. Please try again.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return exams;
    return exams.filter((e) => (e.title || "").toLowerCase().includes(term) || (e._id || "").includes(term));
  }, [q, exams]);

  const handleCopyId = async (id) => {
    try {
      await navigator.clipboard.writeText(id);
      setToast("Exam ID copied");
    } catch {
      setToast("Unable to copy");
    }
  };

  return (
    <Container fluid="xl" className="py-4">
      <Row className="align-items-center g-3 mb-2">
        <Col xs={12} md="auto">
          <h1 className="h3 mb-0">My Exams</h1>
        </Col>
        <Col className="text-body-secondary">
          <Stack direction="horizontal" gap={2} className="flex-wrap">
            <span>
              Total: <Badge bg="secondary">{exams.length}</Badge>
            </span>
            <span>
              Showing: <Badge bg="info">{filtered.length}</Badge>
            </span>
          </Stack>
        </Col>
        <Col xs={12} md={5} lg={4}>
          <InputGroup>
            <InputGroup.Text id="search-label" className="bg-body-tertiary">🔎</InputGroup.Text>
            <Form.Control
              aria-labelledby="search-label"
              placeholder="Search by title or ID"
              value={q}
              onChange={(e) => setQ(e.currentTarget.value)}
            />
          </InputGroup>
        </Col>
        <Col xs={12} md="auto">
          <Button as={Link} to="/teacher/create-exam" variant="success">
            + Create Exam
          </Button>
        </Col>
      </Row>

      {err && (
        <Alert variant="danger" role="alert" className="mb-3">
          {err}
        </Alert>
      )}

      <Card bg="body" data-bs-theme="auto" className={styles.cardInteractive} aria-labelledby="exam-table-heading">
        <Card.Header as="h2" id="exam-table-heading" className="h5 mb-0">
          Exams
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="d-flex align-items-center justify-content-center py-5">
              <Spinner animation="border" role="status" aria-label="Loading exams" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-body-secondary">
              {q ? (
                <>No results for <strong>{q}</strong>.</>
              ) : (
                <>
                  You have no exams yet.{" "}
                  <Button as={Link} to="/teacher/create-exam" variant="link" className="p-0 align-baseline">
                    Create your first exam
                  </Button>
                  .
                </>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover responsive="md" className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Exam ID</th>
                    <th scope="col" className="text-center">Questions</th>
                    <th scope="col" className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((exam) => (
                    <tr key={exam._id}>
                      <td className="align-middle">
                        <div className="fw-semibold">{exam.title}</div>
                        {exam.teacher?.name && (
                          <div className="small text-body-secondary">by {exam.teacher.name}</div>
                        )}
                      </td>
                      <td className="align-middle">
                        <span className="font-monospace">{exam._id}</span>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="ms-2"
                          onClick={() => handleCopyId(exam._id)}
                          aria-label={`Copy exam ID ${exam._id}`}
                        >
                          Copy
                        </Button>
                      </td>
                      <td className="align-middle text-center">
                        <Badge bg="light" text="dark">
                          {Array.isArray(exam.questions) ? exam.questions.length : 0}
                        </Badge>
                      </td>
                      <td className="align-middle text-end">
                        <Stack direction="horizontal" gap={2} className="justify-content-end flex-wrap">
                          <Button
                            as={Link}
                            to={`/teacher/exam/${exam._id}/results`}
                            variant="primary"
                            size="sm"
                          >
                            Results
                          </Button>
                          <Button
                            as={Link}
                            to={`/teacher/exam/${exam._id}/stats`}
                            variant="info"
                            size="sm"
                          >
                            Statistics
                          </Button>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      <ToastContainer position="bottom-end" className="p-3" containerPosition="fixed">
        <Toast onClose={() => setToast(null)} show={!!toast} delay={1800} autohide bg="success" role="status">
          <Toast.Body className="text-white">{toast}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default TeacherDashboard;
