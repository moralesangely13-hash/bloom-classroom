import React, { useEffect, useState } from 'react'

function RoleSelection({ selectedRole, setSelectedRole, onContinue, onBack }) {
  return (
    <main className="role-selection-screen">
      <div className="role-bg-shape role-bg-shape-1" aria-hidden="true" />
      <div className="role-bg-shape role-bg-shape-2" aria-hidden="true" />
      <div className="role-bg-shape role-bg-shape-3" aria-hidden="true" />

      <section className="role-shell container">
        <div className="role-logo" aria-hidden="true">
          <span className="logo-dot dot-1" />
          <span className="logo-dot dot-2" />
          <span className="logo-dot dot-3" />
          <span className="logo-dot dot-4" />
        </div>
        <p className="role-brand">Bloom Classroom</p>
        <h1 className="role-title">Welcome to your learning space</h1>
        <p className="role-subtitle">Choose your role to personalize what happens next.</p>

        <div className="role-grid" role="radiogroup" aria-label="Choose your role">
          <button
            className={`role-card ${selectedRole === 'teacher' ? 'is-active' : ''}`}
            type="button"
            onClick={() => setSelectedRole('teacher')}
            aria-pressed={selectedRole === 'teacher'}
          >
            <span className="role-icon" aria-hidden="true">🧑‍🏫</span>
            <span className="role-card-title">Teacher</span>
            <span className="role-card-copy">Manage classrooms, activities, students, and engagement.</span>
          </button>

          <button
            className={`role-card ${selectedRole === 'student' ? 'is-active' : ''}`}
            type="button"
            onClick={() => setSelectedRole('student')}
            aria-pressed={selectedRole === 'student'}
          >
            <span className="role-icon" aria-hidden="true">🧑‍🎓</span>
            <span className="role-card-title">Student</span>
            <span className="role-card-copy">Join classes, track progress, and learn with AI support.</span>
          </button>
        </div>

        <div className="role-actions">
          <button className="btn btn-role-continue" type="button" onClick={onContinue} disabled={!selectedRole}>
            Continue
          </button>
          <button className="btn btn-role-back" type="button" onClick={onBack}>
            Back to Landing
          </button>
        </div>
      </section>
    </main>
  )
}

function TeacherPlaceholder({ onBack }) {
  const [className, setClassName] = useState('')
  const [subject, setSubject] = useState('')
  const [classes, setClasses] = useState([])

  useEffect(() => {
    const storedClasses = localStorage.getItem('bloom_teacher_classes')
    if (storedClasses) {
      setClasses(JSON.parse(storedClasses))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('bloom_teacher_classes', JSON.stringify(classes))
  }, [classes])

  const generateCode = () => `BLOOM-${Math.floor(1000 + Math.random() * 9000)}`

  const handleCreateClass = (event) => {
    event.preventDefault()
    if (!className.trim() || !subject.trim()) return

    const newClass = {
      id: Date.now(),
      className: className.trim(),
      subject: subject.trim(),
      code: generateCode(),
      students: 0,
    }

    setClasses((prev) => [newClass, ...prev])
    setClassName('')
    setSubject('')
  }

  const handleDeleteClass = (id) => {
    setClasses((prev) => prev.filter((classItem) => classItem.id !== id))
  }

  const handleEditClass = (id) => {
    const nextName = window.prompt('Update class name:')
    const nextSubject = window.prompt('Update subject:')
    if (!nextName || !nextSubject) return

    setClasses((prev) => prev.map((classItem) => (
      classItem.id === id
        ? { ...classItem, className: nextName.trim(), subject: nextSubject.trim() }
        : classItem
    )))
  }

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      window.prompt('Copy this code:', code)
    }
  }

  const totalStudents = classes.reduce((sum, classItem) => sum + classItem.students, 0)

  return (
    <main className="teacher-dashboard-screen">
      <div className="teacher-bg-shape teacher-bg-shape-1" aria-hidden="true" />
      <div className="teacher-bg-shape teacher-bg-shape-2" aria-hidden="true" />

      <header className="teacher-header">
        <div className="container teacher-header-inner">
          <p className="teacher-logo">Bloom Classroom</p>
          <button className="btn btn-role-back" type="button" onClick={onBack}>Back to Landing</button>
        </div>
      </header>

      <section className="container teacher-dashboard">
        <h1 className="teacher-title">Welcome back, Teacher</h1>

        <div className="teacher-grid-top">
          <article className="teacher-glass-card">
            <h2>Create Class</h2>
            <form className="teacher-form" onSubmit={handleCreateClass}>
              <input value={className} onChange={(e) => setClassName(e.target.value)} placeholder="Class name" />
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
              <button className="btn btn-role-continue" type="submit">Create Class</button>
            </form>
          </article>

          <article className="teacher-glass-card">
            <h2>Recent Activity</h2>
            <ul className="teacher-list">
              {classes.slice(0, 3).map((classItem) => (
                <li key={classItem.id}>Created {classItem.className} ({classItem.subject})</li>
              ))}
              {classes.length === 0 && <li>No recent activity yet.</li>}
            </ul>
          </article>

          <article className="teacher-glass-card">
            <h2>Quick Actions</h2>
            <div className="teacher-quick-actions">
              <button className="btn btn-outline" type="button">Create Activity</button>
              <button className="btn btn-outline" type="button">Message Students</button>
              <button className="btn btn-outline" type="button">View Reports</button>
            </div>
          </article>
        </div>

        <div className="teacher-stats">
          <article className="teacher-stat-card"><p>Total Classes</p><strong>{classes.length}</strong></article>
          <article className="teacher-stat-card"><p>Students</p><strong>{totalStudents}</strong></article>
          <article className="teacher-stat-card"><p>Activities</p><strong>0</strong></article>
          <article className="teacher-stat-card"><p>Engagement</p><strong>0%</strong></article>
        </div>

        <section className="teacher-classes">
          <h2>Your Classes</h2>
          <div className="teacher-classes-grid">
            {classes.map((classItem) => (
              <article className="teacher-class-card" key={classItem.id}>
                <h3>{classItem.className}</h3>
                <p>{classItem.subject}</p>
                <p><strong>Code:</strong> {classItem.code}</p>
                <p><strong>Students:</strong> {classItem.students}</p>
                <div className="teacher-class-actions">
                  <button className="btn btn-outline" type="button">Open</button>
                  <button className="btn btn-outline" type="button" onClick={() => handleEditClass(classItem.id)}>Edit</button>
                  <button className="btn btn-outline" type="button" onClick={() => handleDeleteClass(classItem.id)}>Delete</button>
                  <button className="btn btn-outline" type="button" onClick={() => handleCopyCode(classItem.code)}>Copy Code</button>
                </div>
              </article>
            ))}
            {classes.length === 0 && <p className="teacher-empty">No classes yet. Create your first class above.</p>}
          </div>
        </section>
      </section>
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
  const [selectedRole, setSelectedRole] = useState('')

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
