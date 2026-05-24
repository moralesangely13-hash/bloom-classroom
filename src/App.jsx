import React, { useState } from 'react'

function RoleSelection({ selectedRole, setSelectedRole, onContinue, onBack }) {
  return (
    <main className="section container" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '520px', textAlign: 'center' }}>
        <h1>Choose your role</h1>
        <div style={{ display: 'grid', gap: '12px', marginTop: '20px' }}>
          <button
            className={`btn ${selectedRole === 'teacher' ? 'btn-primary' : 'btn-outline'}`}
            type="button"
            onClick={() => setSelectedRole('teacher')}
          >
            Teacher
          </button>
          <button
            className={`btn ${selectedRole === 'student' ? 'btn-primary' : 'btn-outline'}`}
            type="button"
            onClick={() => setSelectedRole('student')}
          >
            Student
          </button>
        </div>
        <div style={{ display: 'grid', gap: '12px', marginTop: '20px' }}>
          <button className="btn btn-primary" type="button" onClick={onContinue}>
            Continue
          </button>
          <button className="btn btn-ghost" type="button" onClick={onBack}>
            Back to Landing
          </button>
        </div>
      </div>
    </main>
  )
}

function TeacherPlaceholder({ onBack }) {
  return (
    <main className="section container" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Teacher Dashboard coming next</h1>
        <button className="btn btn-primary" type="button" onClick={onBack}>
          Back to Landing
        </button>
      </div>
    </main>
  )
}

function StudentPlaceholder({ onBack }) {
  return (
    <main className="section container" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Student Dashboard coming next</h1>
        <button className="btn btn-primary" type="button" onClick={onBack}>
          Back to Landing
        </button>
      </div>
    </main>
  )
}

function Landing({ onOpenRoleSelection }) {
  return (
    <>
      <header className="site-header">
        <div className="container nav">
          <a className="logo" href="#" aria-label="Bloom Classroom home">Bloom Classroom</a>
          <nav className="menu" aria-label="Primary">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#testimonials">Stories</a>
            <a href="#pricing">Pricing</a>
          </nav>
          <div className="actions">
            <button className="btn btn-ghost" type="button" onClick={onOpenRoleSelection}>Log In</button>
            <button className="btn btn-primary" type="button" onClick={onOpenRoleSelection}>Get Started</button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero container">
          <div className="hero-content">
            <p className="eyebrow">Built for modern classrooms</p>
            <h1>Teach with clarity. Learn with confidence.</h1>
            <p className="hero-copy">
              Bloom Classroom helps teachers organize lessons, share assignments, and track student growth in one beautifully simple workspace.
            </p>
            <div className="hero-cta">
              <button className="btn btn-primary" type="button" onClick={onOpenRoleSelection}>Start free trial</button>
              <button className="btn btn-outline" type="button" onClick={onOpenRoleSelection}>View demo</button>
            </div>
            <ul className="hero-badges" aria-label="Highlights">
              <li>No credit card required</li>
              <li>Setup in under 10 minutes</li>
              <li>Loved by teachers nationwide</li>
            </ul>
          </div>
          <div className="hero-card" aria-hidden="true">
            <div className="card-header">
              <span className="status-dot"></span>
              <span>Today’s classroom snapshot</span>
            </div>
            <div className="metric-grid">
              <article>
                <p>Attendance</p>
                <strong>96%</strong>
              </article>
              <article>
                <p>Assignments done</p>
                <strong>128</strong>
              </article>
              <article>
                <p>Avg. score</p>
                <strong>88%</strong>
              </article>
              <article>
                <p>Messages read</p>
                <strong>92%</strong>
              </article>
            </div>
          </div>
        </section>

        <section id="features" className="features section container">
          <h2>Everything your classroom needs</h2>
          <div className="feature-grid">
            <article className="feature-card">
              <h3>Lesson planning</h3>
              <p>Build weekly plans, align standards, and keep every lesson within reach.</p>
            </article>
            <article className="feature-card">
              <h3>Assignment hub</h3>
              <p>Post tasks, due dates, and files in one place so students stay focused.</p>
            </article>
            <article className="feature-card">
              <h3>Progress tracking</h3>
              <p>Visual insights help you spot wins early and support students proactively.</p>
            </article>
          </div>
        </section>

        <section id="how-it-works" className="how section container">
          <h2>How Bloom Classroom works</h2>
          <ol>
            <li>Create your class spaces and invite students.</li>
            <li>Share lessons and assignments with a consistent weekly rhythm.</li>
            <li>Track progress and celebrate milestones together.</li>
          </ol>
        </section>

        <section id="testimonials" className="testimonials section container">
          <h2>Trusted by educators</h2>
          <div className="quote-grid">
            <blockquote>
              “Bloom gives me the structure I need without making me feel boxed in.”
              <cite>— K. Ramirez, 6th Grade Teacher</cite>
            </blockquote>
            <blockquote>
              “Parents and students finally know exactly where to look each week.”
              <cite>— T. Johnson, Instructional Coach</cite>
            </blockquote>
          </div>
        </section>

        <section id="pricing" className="cta section">
          <div className="container cta-card">
            <h2>Start your classroom transformation today</h2>
            <p>Join schools creating calmer workflows for teachers and better outcomes for students.</p>
            <button className="btn btn-primary" type="button" onClick={onOpenRoleSelection}>Join a Class</button>
          </div>
        </section>
      </main>
    </>
  )
}

function App() {
  const [screen, setScreen] = useState('landing')
  const [selectedRole, setSelectedRole] = useState('teacher')

  if (screen === 'role-selection') {
    return (
      <RoleSelection
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        onContinue={() => setScreen(selectedRole === 'teacher' ? 'teacher-placeholder' : 'student-placeholder')}
        onBack={() => setScreen('landing')}
      />
    )
  }

  if (screen === 'teacher-placeholder') {
    return <TeacherPlaceholder onBack={() => setScreen('landing')} />
  }

  if (screen === 'student-placeholder') {
    return <StudentPlaceholder onBack={() => setScreen('landing')} />
  }

  return <Landing onOpenRoleSelection={() => setScreen('role-selection')} />
}

export default App
