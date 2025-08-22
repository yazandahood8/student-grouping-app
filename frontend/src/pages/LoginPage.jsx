import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { login } from "../services/authService";
import styles from "./LoginPage.module.scss";

const LoginPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  // SAFER: read from event.target; guard against null
  const handleChange = (field) => (e) => {
    const value = e?.target?.value ?? "";
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const issues = [];
    if (!form.email.trim()) issues.push("Email is required.");
    if (!form.password.trim()) issues.push("Password is required.");
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
      const res = await login({ email: form.email, password: form.password });
      const { token, role, name } = res.data || {};
      if (!token || !role) throw new Error("Invalid response from server");
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      if (name) localStorage.setItem("name", name);
      navigate(role === "teacher" ? "/teacher/dashboard" : "/student/dashboard");
    } catch (err) {
      setErrMsg(err?.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container fluid="xl" className={`py-5 ${styles.root}`}>
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card bg="body" data-bs-theme="auto" className={styles.cardInteractive}>
            <Card.Body className="p-4">
              <header className="mb-3">
                <h1 className="h3 mb-1">Welcome back</h1>
                <p className="text-body-secondary mb-0">
                  Sign in to continue to <span className="fw-semibold">Student Grouping</span>.
                </p>
              </header>

              {errMsg && (
                <Alert variant="danger" role="alert" className="mb-3">
                  {errMsg}
                </Alert>
              )}

              <Form noValidate onSubmit={handleSubmit} aria-label="Login form">
                {/* Email with FloatingLabel */}
                <FloatingLabel controlId="loginEmail" label="Email address" className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={handleChange("email")}
                    autoComplete="email"
                    inputMode="email"
                    required
                    aria-required="true"
                  />
                </FloatingLabel>

                {/* Password — avoid FloatingLabel with InputGroup */}
                <Form.Group className="mb-3" controlId="loginPassword">
                  <Form.Label className="fw-semibold">Password</Form.Label>
                  <InputGroup className={styles.inputGroupTight}>
                    <Form.Control
                      type={showPw ? "text" : "password"}
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange("password")}
                      autoComplete="current-password"
                      required
                      aria-required="true"
                      aria-describedby="toggle-password-visibility"
                    />
                    <Button
                      id="toggle-password-visibility"
                      variant="outline-secondary"
                      type="button"                  // prevent form submit
                      onClick={() => setShowPw((s) => !s)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? "Hide" : "Show"}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <div className="d-flex align-items-center justify-content-between mb-3">
                  <Form.Check id="remember" label="Remember me" className={styles.checkbox} />
                  <Link to="/forgot-password" className="link-primary">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                  disabled={submitting}
                  aria-label="Login"
                >
                  {submitting ? (
                    <>
                      <Spinner size="sm" animation="border" className="me-2" aria-hidden />
                      Signing in…
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>

                <div className="text-center mt-3">
                  <span className="text-body-secondary">New here?</span>{" "}
                  <Button variant="outline-secondary" as={Link} to="/register">
                    Create an account
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <p className="text-center text-body-secondary small mt-3 mb-0">
            By continuing you agree to our{" "}
            <a href="#" className="link-secondary">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="link-secondary">
              Privacy Policy
            </a>
            .
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
