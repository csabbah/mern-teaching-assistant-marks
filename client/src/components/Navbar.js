import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Modal, Tab } from "react-bootstrap";
import SignUpForm from "./SignupForm";
import LoginForm from "./LoginForm";

import Auth from "../utils/auth";

const AppNavbar = () => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        width: "100vw",
        zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 5px 10px 0 rgba(0,0,0,0.3)",
      }}
    >
      {Auth.loggedIn() && (
        <Navbar expand="sm">
          <Container fluid>
            <Navbar.Brand
              style={{ color: "rgba(255,255,255,0.9)" }}
              as={Link}
              to={"your-classes"}
            >
              Hershy's Book
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar" />
            <Navbar.Collapse id="navbar">
              <Nav className="ml-auto">
                {/* if user is logged in show saved books and logout */}

                <>
                  <Nav.Link
                    style={{ color: "rgba(255,255,255,0.9)" }}
                    as={Link}
                    to="/your-classes"
                  >
                    Your Classes
                  </Nav.Link>
                  <Nav.Link
                    style={{ color: "rgba(255,255,255,0.9)" }}
                    as={Link}
                    to="/dashboard"
                  >
                    Dashboard
                  </Nav.Link>
                  <Nav.Link
                    style={{ color: "rgba(255,255,255,0.9)" }}
                    onClick={Auth.logout}
                  >
                    Logout
                  </Nav.Link>
                </>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
      {/* set modal data up */}
      <Modal
        size="lg"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="signup-modal"
      >
        {/* tab container to do either signup or login component */}
        <Tab.Container defaultActiveKey="login">
          <Modal.Header closeButton>
            <Modal.Title id="signup-modal">
              <Nav variant="pills">
                <Nav.Item>
                  <Nav.Link eventKey="login">Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="signup">Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey="login">
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey="signup">
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </div>
  );
};

export default AppNavbar;
