import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  InputGroup,
  Row,
  Spinner,
  ToggleButton,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { register } from "../services/authService";
import styles from "./RegisterPage.module.scss";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", // "student" | "teacher"
    subject: "",     // shown only for teacher
  });
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [toast, setToast] = useState(null);

  const update = (field) => (e) => {
    const value = e?.target?.value ?? "";
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const setRole = (role) => {
    setForm((prev) => ({ ...prev, role, subject: role === "teacher" ? prev.subject : "" }));
  };

  const validate = () => {
    const issues = [];
    if (!form.name.trim()) issues.push("Name is required.");
    if (!form.email.trim()) issues.push("Email is required.");
    if (!form.password.trim()) issues.push("Password is required.");
    if (form.password && form.password.length < 6) issues.push("Password must be at least 6 characters.");
    if (form.role === "teacher" && !form.subject.trim()) issues.push("Subject is required for teachers.");
    return { ok: issues.length === 0, issues };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg(null);

    const { ok, issues } = validate();
    if (!ok) {
      setErrMsg(
        <>
          <strong>Please fix the following:</strong>
          <ul className="mb-0 mt-2">
            {issues.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </>
      );
      return;
    }

    try {
      setSubmitting(true);
      const payload =
        form.role === "teacher"
          ? { name: form.name.trim(), email: form.email.trim(), password: form.password, role: form.role, subject: form.subject.trim() }
          : { name: form.name.trim(), email: form.email.trim(), password: form.password, role: form.role };

      await register(payload);
      setToast("Registered successfully");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setErrMsg(err?.response?.data?.error || "Register failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container fluid="xl" className={`py-5 ${styles.root}`}>
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={7} xl={6}>
          <Card bg="body" data-bs-theme="auto" className={styles.cardInteractive}>
            <Card.Body className="p-4">
              <header className="mb-3">
                <h1 className="h3 mb-1">Create your account</h1>
                <p className="text-body-secondary mb-0">
                  Join <span className="fw-semibold">Student Grouping</span> and start building smarter classes.
                </p>
              </header>

              {errMsg && (
                <Alert variant="danger" role="alert" className="mb-3">
                  {errMsg}
                </Alert>
              )}

              <Form noValidate onSubmit={handleSubmit} aria-label="Register form">
                <FloatingLabel controlId="regName" label="Full name" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={update("name")}
                    required
                    aria-required="true"
                    autoComplete="name"
                  />
                </FloatingLabel>

                <FloatingLabel controlId="regEmail" label="Email address" className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={update("email")}
                    required
                    aria-required="true"
                    autoComplete="email"
                    inputMode="email"
                  />
                </FloatingLabel>

                <Form.Group className="mb-3" controlId="regPassword">
                  <Form.Label className="fw-semibold">Password</Form.Label>
                  <InputGroup className={styles.inputGroupTight}>
                    <Form.Control
                      type={showPw ? "text" : "password"}
                      placeholder="Create a password"
                      value={form.password}
                      onChange={update("password")}
                      required
                      aria-required="true"
                      autoComplete="new-password"
                      minLength={6}
                    />
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? "Hide" : "Show"}
                    </Button>
                  </InputGroup>
                  <Form.Text className="text-body-secondary">At least 6 characters.</Form.Text>
                </Form.Group>

                {/* Role switch */}
                <Form.Group className="mb-3" controlId="regRole">
                  <Form.Label className="fw-semibold">I am a</Form.Label>
                  <div>
                    <ButtonGroup role="group" aria-label="Select role">
                      <ToggleButton
                        id="role-student"
                        type="radio"
                        variant={form.role === "student" ? "primary" : "outline-primary"}
                        name="role"
                        value="student"
                        checked={form.role === "student"}
                        onChange={() => setRole("student")}
                        className={styles.roleBtn}
                      >
                        Student
                      </ToggleButton>
                      <ToggleButton
                        id="role-teacher"
                        type="radio"
                        variant={form.role === "teacher" ? "primary" : "outline-primary"}
                        name="role"
                        value="teacher"
                        checked={form.role === "teacher"}
                        onChange={() => setRole("teacher")}
                        className={styles.roleBtn}
                      >
                        Teacher
                      </ToggleButton>
                    </ButtonGroup>
                  </div>
                </Form.Group>

                {form.role === "teacher" && (
                  <FloatingLabel controlId="regSubject" label="Subject (for teachers)" className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="e.g., Mathematics"
                      value={form.subject}
                      onChange={update("subject")}
                      required
                      aria-required="true"
                      autoComplete="organization-title"
                    />
                  </FloatingLabel>
                )}

                <Button
                  type="submit"
                  variant="success"
                  className="w-100"
                  disabled={submitting}
                  aria-label="Register"
                >
                  {submitting ? (
                    <>
                      <Spinner size="sm" animation="border" className="me-2" aria-hidden />
                      Creating account…
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>

                <div className="text-center mt-3">
                  <span className="text-body-secondary">Already have an account?</span>{" "}
                  <Button as={Link} variant="outline-secondary" to="/login">
                    Log in
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <p className="text-center text-body-secondary small mt-3 mb-0">
            By creating an account you agree to our{" "}
            <a href="#" className="link-secondary">Terms</a> and{" "}
            <a href="#" className="link-secondary">Privacy Policy</a>.
          </p>
        </Col>
      </Row>

      <ToastContainer position="bottom-end" className="p-3" containerPosition="fixed">
        <Toast onClose={() => setToast(null)} show={!!toast} delay={1800} autohide bg="success" role="status">
          <Toast.Body className="text-white">{toast}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default RegisterPage;
