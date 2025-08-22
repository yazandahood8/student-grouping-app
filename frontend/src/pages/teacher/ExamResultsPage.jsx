import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
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
  ProgressBar,
} from "react-bootstrap";
import { getAnswers } from "../../services/answerService";
import { makeGroups, getGroups } from "../../services/groupService";
import styles from "./ExamResultsPage.module.scss";

const ExamResultsPage = () => {
  const { id } = useParams();

  const [answers, setAnswers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grouping, setGrouping] = useState(false);
  const [error, setError] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  // Controls
  const [numGroups, setNumGroups] = useState(3);
  const [mode, setMode] = useState("balanced");     // "balanced" | "homogeneous"
  const [metric, setMetric] = useState("percentage"); // "percentage" | "grade"
  const [customNames, setCustomNames] = useState("");

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const [ansRes, grpRes] = await Promise.all([
          getAnswers(id),
          getGroups(id),
        ]);
        if (!isMounted) return;
        setAnswers(ansRes.data);
        setGroups(grpRes.data);
      } catch {
        if (!isMounted) return;
        setError("Failed to load results. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const summary = useMemo(() => {
    if (!answers.length) {
      return { count: 0, avg: 0, min: 0, max: 0 };
    }
    const ps = answers.map((a) => a.percentage);
    const count = answers.length;
    const avg = Math.round(ps.reduce((s, p) => s + p, 0) / count);
    const min = Math.min(...ps);
    const max = Math.max(...ps);
    return { count, avg, min, max };
  }, [answers]);

  const handleGroup = async () => {
    try {
      setGrouping(true);
      setError(null);

      const names =
        customNames.trim().length > 0
          ? customNames.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined;

      const res = await makeGroups({
        examId: id,
        numGroups: Number(numGroups),
        mode,
        metric,
        names,
      });

      setGroups(res.data);
      setToastMsg("Groups created successfully");
    } catch {
      setError("Error grouping students. Please try again.");
    } finally {
      setGrouping(false);
    }
  };

  return (
    <Container fluid="xl" className={`${styles.root} py-4`}>
      <Row className="align-items-center g-3 mb-2">
        <Col xs={12} md="auto">
          <h1 className="h3 mb-0">Exam Results</h1>
        </Col>
        <Col className="text-body-secondary">
          <span className="me-2">Submissions:</span>
          <Badge bg="secondary" className="me-2">{summary.count}</Badge>
          <span className="me-1">Avg:</span>
          <Badge bg="info" className="me-2">{summary.avg}%</Badge>
          <span className="me-1">Range:</span>
          <Badge bg="light" text="dark">
            {summary.min}–{summary.max}%
          </Badge>
        </Col>
      </Row>

      {!!error && (
        <Alert variant="danger" role="alert" className="mb-3">
          {error}
        </Alert>
      )}

      {/* Controls */}
      <Card className={`${styles.cardInteractive} mb-4`} bg="body" data-bs-theme="auto" aria-labelledby="grouping-controls">
        <Card.Header as="h2" id="grouping-controls" className="h5 mb-0">
          Grouping Controls
        </Card.Header>
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col xs={12} md={3}>
              <Form.Group controlId="numGroups">
                <Form.Label className="fw-semibold">Number of groups</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  aria-label="Number of groups"
                  value={numGroups}
                  onChange={(e) => setNumGroups(Math.max(1, Number(e.currentTarget.value)))}
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={3}>
              <Form.Group controlId="mode">
                <Form.Label className="fw-semibold">Mode</Form.Label>
                <Form.Select
                  aria-label="Grouping mode"
                  value={mode}
                  onChange={(e) => setMode(e.currentTarget.value)}
                >
                  <option value="balanced">Balanced (mix abilities)</option>
                  <option value="homogeneous">Homogeneous (similar abilities)</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col xs={12} md={3}>
              <Form.Group controlId="metric">
                <Form.Label className="fw-semibold">Metric</Form.Label>
                <Form.Select
                  aria-label="Metric for grouping"
                  value={metric}
                  onChange={(e) => setMetric(e.currentTarget.value)}
                >
                  <option value="percentage">Exam % (this exam)</option>
                  <option value="grade">Student grade (baseline)</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col xs={12} md={3}>
              <Form.Group controlId="customNames">
                <Form.Label className="fw-semibold">Custom names (optional)</Form.Label>
                <InputGroup>
                  <Form.Control
                    aria-label="Custom group names"
                    placeholder='e.g. "Advanced, Intermediate, Foundation"'
                    value={customNames}
                    onChange={(e) => setCustomNames(e.currentTarget.value)}
                  />
                </InputGroup>
                <Form.Text className="text-body-secondary">
                  Comma-separated. Must match the number of groups.
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Stack direction="horizontal" gap={2} className="mt-3">
            <Button
              variant="primary"
              onClick={handleGroup}
              disabled={grouping || summary.count === 0}
            >
              {grouping ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" aria-hidden />
                  Creating…
                </>
              ) : (
                "Make Smart Groups"
              )}
            </Button>
            <div className="text-body-secondary small">
              Tip: Use <strong>Homogeneous</strong> + <strong>Exam %</strong> to create tiers like Advanced / Intermediate / Foundation.
            </div>
          </Stack>
        </Card.Body>
      </Card>

      {/* Results & Groups */}
      <Row className="g-4">
        <Col xs={12} lg={6}>
          <Card className={styles.cardInteractive} bg="body" data-bs-theme="auto" aria-labelledby="results-table-heading">
            <Card.Header as="h2" id="results-table-heading" className="h5 mb-0">
              Submissions
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="d-flex align-items-center justify-content-center py-5">
                  <Spinner animation="border" role="status" aria-label="Loading results" />
                </div>
              ) : answers.length === 0 ? (
                <div className="text-body-secondary">No submissions yet.</div>
              ) : (
                <div className="table-responsive">
                  <Table hover responsive="md" className="mb-0" role="table" aria-describedby="results-table-heading">
                    <thead className="table-light">
                      <tr>
                        <th scope="col">Student</th>
                        <th scope="col" className="text-center">Score</th>
                        <th scope="col" className="text-center">%</th>
                        <th scope="col" className="text-center">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {answers.map((a) => (
                        <tr key={a._id}>
                          <td>
                            <div className="fw-semibold">{a.student?.name}</div>
                            <div className="text-body-secondary small">{a.student?.email}</div>
                          </td>
                          <td className="text-center">
                            {a.score}/{a.total}
                          </td>
                          <td className="align-middle">
                            <ProgressBar
                              now={a.percentage}
                              label={`${a.percentage}%`}
                              aria-label={`Percentage ${a.percentage}%`}
                              className={styles.progressTight}
                            />
                          </td>
                          <td className="text-center">
                            {typeof a.student?.grade === "number" ? a.student.grade : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={6}>
          <Card className={styles.cardInteractive} bg="body" data-bs-theme="auto" aria-labelledby="groups-heading">
            <Card.Header as="h2" id="groups-heading" className="h5 mb-0">
              Groups
            </Card.Header>
            <Card.Body>
              {groups.length === 0 ? (
                <div className="text-body-secondary">No groups yet. Use the controls to create them.</div>
              ) : (
                <Stack gap={3}>
                  {groups.map((g) => (
                    <Card key={g._id} className={styles.groupCard} bg="body" data-bs-theme="auto" aria-label={`Group ${g.groupNumber} ${g.name}`}>
                      <Card.Body>
                        <Stack direction="horizontal" className="justify-content-between align-items-center flex-wrap gap-2 mb-2">
                          <div className="fw-semibold">
                            {g.groupNumber}. {g.name}
                          </div>
                          <div className="text-body-secondary small">
                            <Badge bg="secondary" className="me-2">Size {g.size}</Badge>
                            <Badge bg="info" className="me-2">Avg {g.average}%</Badge>
                            <Badge bg="light" text="dark">Range {g.min}–{g.max}%</Badge>
                          </div>
                        </Stack>
                        <ul className={`${styles.memberList} mb-0`} role="list">
                          {g.students.map((s) => (
                            <li key={s._id} className={styles.memberItem}>
                              <span className="fw-medium">{s.name}</span>
                              <span className="text-body-secondary ms-2">
                                {typeof s.percentage === "number" ? `${s.percentage}%` : "—"}
                              </span>
                              {s.email && (
                                <span className="text-body-secondary small ms-2">({s.email})</span>
                              )}
                              {typeof s.grade === "number" && (
                                <Badge bg="outline" className="ms-2">{s.grade}</Badge>
                              )}
                            </li>
                          ))}
                        </ul>
                      </Card.Body>
                    </Card>
                  ))}
                </Stack>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ToastContainer position="bottom-end" className="p-3" containerPosition="fixed">
        <Toast
          onClose={() => setToastMsg(null)}
          show={!!toastMsg}
          delay={2500}
          autohide
          bg="success"
          role="status"
        >
          <Toast.Body className="text-white">{toastMsg}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default ExamResultsPage;
