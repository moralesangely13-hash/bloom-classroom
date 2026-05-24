import React, { useEffect, useState } from 'react'

const BLOOM_CLASSES_KEY = 'bloomClasses'
const BLOOM_STUDENT_JOINED_CODES_KEY = 'bloomStudentJoinedClassCodes'

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
    const storedClasses = localStorage.getItem(BLOOM_CLASSES_KEY)
    if (storedClasses) {
      setClasses(JSON.parse(storedClasses))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(BLOOM_CLASSES_KEY, JSON.stringify(classes))
  }, [classes])

  const generateCode = () => `BLOOM-${Math.floor(1000 + Math.random() * 9000)}`

  const handleCreateClass = (event) => {
    event.preventDefault()
    if (!className.trim() || !subject.trim()) return

    const newClass = {
      id: Date.now(),
      name: className.trim(),
      subject: subject.trim(),
      code: generateCode(),
      createdAt: new Date().toISOString(),
      students: [],
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
        ? { ...classItem, name: nextName.trim(), subject: nextSubject.trim() }
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

  const totalStudents = classes.reduce((sum, classItem) => sum + (classItem.students?.length || 0), 0)

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
                <li key={classItem.id}>Created {classItem.name} ({classItem.subject})</li>
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
                <h3>{classItem.name}</h3>
                <p>{classItem.subject}</p>
                <p><strong>Code:</strong> {classItem.code}</p>
                <p><strong>Students:</strong> {classItem.students?.length || 0}</p>
                <div className="teacher-class-actions">
                  <button className="btn btn-outline" type="button" onClick={() => window.dispatchEvent(new CustomEvent('open-classroom', { detail: { classItem, from: 'teacher' } }))}>Open</button>
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
  const [classCode, setClassCode] = useState('')
  const [joinedClasses, setJoinedClasses] = useState([])
  const [joinError, setJoinError] = useState('')

  useEffect(() => {
    const teacherClasses = JSON.parse(localStorage.getItem(BLOOM_CLASSES_KEY) || '[]')
    const storedJoinedCodes = JSON.parse(localStorage.getItem(BLOOM_STUDENT_JOINED_CODES_KEY) || '[]')

    const hydrated = storedJoinedCodes
      .map((code) => teacherClasses.find((classItem) => classItem.code === code))
      .filter(Boolean)
      .map((classItem) => ({ ...classItem, progress: '0%', points: 0 }))

    setJoinedClasses(hydrated)
  }, [])

  useEffect(() => {
    localStorage.setItem(BLOOM_STUDENT_JOINED_CODES_KEY, JSON.stringify(joinedClasses.map((classItem) => classItem.code)))
  }, [joinedClasses])

  const handleJoinClass = (event) => {
    event.preventDefault()
    const normalizedCode = classCode.trim().toUpperCase()
    if (!normalizedCode) return

    const teacherClasses = JSON.parse(localStorage.getItem(BLOOM_CLASSES_KEY) || '[]')
    const matchedClass = teacherClasses.find((classItem) => classItem.code === normalizedCode)

    if (!matchedClass) {
      setJoinError("We couldn't find that class code yet. Please check and try again.")
      return
    }

    const alreadyJoined = joinedClasses.some((classItem) => classItem.code === normalizedCode)
    if (alreadyJoined) {
      setJoinError('You already joined this class.')
      return
    }

    setJoinedClasses((prev) => [{
      ...matchedClass,
      progress: '0%',
      points: 0,
    }, ...prev])
    setClassCode('')
    setJoinError('Success! You joined the class.')
  }

  return (
    <main className="student-dashboard-screen">
      <div className="student-bg-shape student-bg-shape-1" aria-hidden="true" />
      <div className="student-bg-shape student-bg-shape-2" aria-hidden="true" />

      <header className="student-header">
        <div className="container student-header-inner">
          <p className="student-logo">Bloom Classroom</p>
          <button className="btn btn-role-back" type="button" onClick={onBack}>Back to Landing</button>
        </div>
      </header>

      <section className="container student-dashboard">
        <h1 className="student-title">Welcome back, Student</h1>

        <div className="student-grid-top">
          <article className="student-glass-card">
            <h2>Join Class</h2>
            <form className="student-form" onSubmit={handleJoinClass}>
              <input
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                placeholder="Enter class code (e.g. BLOOM-1234)"
              />
              <button className="btn btn-role-continue" type="submit">Join Class</button>
              {joinError && <p className="student-error">{joinError}</p>}
            </form>
          </article>

          <article className="student-glass-card">
            <h2>Progress</h2>
            <div className="student-points-grid">
              <div><p>Points</p><strong>{joinedClasses.length * 10}</strong></div>
              <div><p>Avg. Progress</p><strong>{joinedClasses.length ? '12%' : '0%'}</strong></div>
            </div>
          </article>

          <article className="student-glass-card">
            <h2>Resources Preview</h2>
            <ul className="student-list">
              <li>AI study guides</li>
              <li>Class handouts</li>
              <li>Practice activities</li>
            </ul>
          </article>
        </div>

        <div className="student-grid-mid">
          <article className="student-glass-card">
            <h2>Upcoming Events</h2>
            <ul className="student-list">
              <li>Weekly quiz — Friday</li>
              <li>Group project check-in — Monday</li>
            </ul>
          </article>
          <article className="student-glass-card">
            <h2>Recent Activity</h2>
            <div className="student-activity-grid">
              {joinedClasses.slice(0, 3).map((classItem) => (
                <div key={classItem.id} className="student-activity-item">Joined {classItem.name}</div>
              ))}
              {joinedClasses.length === 0 && <div className="student-activity-item">No activity yet.</div>}
            </div>
          </article>
        </div>

        <section className="student-classes">
          <h2>Joined Classes</h2>
          <div className="student-classes-grid">
            {joinedClasses.map((classItem) => (
              <article className="student-class-card" key={classItem.id}>
                <div className="student-class-top">
                  <span className="student-class-icon" aria-hidden="true">📘</span>
                  <div>
                    <h3>{classItem.name}</h3>
                    <p className="student-class-subject">{classItem.subject}</p>
                  </div>
                </div>
                <p className="student-class-code"><span>Class Code</span> {classItem.code}</p>
                <div className="student-class-metrics">
                  <p><strong>Progress:</strong> {classItem.progress}</p>
                  <p><strong>Points:</strong> {classItem.points}</p>
                </div>
                <div className="student-progress-placeholder" aria-hidden="true">
                  <span style={{ width: classItem.progress }} />
                </div>
                <button className="btn btn-outline student-open-btn" type="button" onClick={() => window.dispatchEvent(new CustomEvent('open-classroom', { detail: { classItem, from: 'student' } }))}>Open</button>
              </article>
            ))}
            {joinedClasses.length === 0 && <p className="student-empty">Join a class to see it here.</p>}
          </div>
        </section>
      </section>
    </main>
  )
}


function ClassroomPage({ data, onBack }) {
  const [activeTab, setActiveTab] = useState('Classroom')
  const [studentName, setStudentName] = useState('')
  const [classData, setClassData] = useState(data.classItem)
  const tabs = ['Classroom', 'History', 'Chat', 'Calendar', 'Resources', 'Activities', 'AI Tutor']

  const persistClass = (nextClass) => {
    const classes = JSON.parse(localStorage.getItem(BLOOM_CLASSES_KEY) || '[]')
    const updated = classes.map((item) => (item.id === nextClass.id ? nextClass : item))
    localStorage.setItem(BLOOM_CLASSES_KEY, JSON.stringify(updated))
    setClassData(nextClass)
  }

  const handleAddStudent = (event) => {
    event.preventDefault()
    if (!studentName.trim()) return
    const nextStudents = [...(classData.students || []), { id: Date.now(), name: studentName.trim(), points: 0 }]
    persistClass({ ...classData, students: nextStudents })
    setStudentName('')
  }

  const handleDeleteStudent = (studentId) => {
    const nextStudents = (classData.students || []).filter((student) => student.id !== studentId)
    persistClass({ ...classData, students: nextStudents })
  }

  const totalStudents = (classData.students || []).length
  const totalPoints = (classData.students || []).reduce((sum, student) => sum + (student.points || 0), 0)

  return (
    <main className="classroom-screen">
      <header className="classroom-header"><div className="container classroom-header-inner"><p className="classroom-logo">Bloom Classroom</p><button className="btn btn-role-back" onClick={onBack} type="button">Back to Dashboard</button></div></header>
      <section className="container classroom-shell">
        <p className="classroom-role">{data.from === 'teacher' ? 'Teacher View' : 'Student View'}</p>
        <h1 className="classroom-title">{classData.name}</h1>
        <p className="classroom-subject">{classData.subject}</p>
        <p className="classroom-code">{classData.code}</p>
        <nav className="classroom-tabs" aria-label="Classroom tabs">
          {tabs.map((tab) => <button key={tab} type="button" className={`classroom-tab ${activeTab === tab ? 'is-active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>)}
        </nav>
        {activeTab === 'Classroom' ? (
          <section className="classroom-overview-grid">
            <article className="classroom-content"><h2>Classroom Summary</h2><p>Total students: {totalStudents}</p><p>Total points: {totalPoints}</p><p>Attendance: 0%</p><p>Groups: 0</p></article>
            <article className="classroom-content"><h2>Recent Activity</h2><p>Classroom activity feed coming next.</p><p>Recent classroom updates coming next.</p></article>
            {data.from === 'teacher' ? (
              <article className="classroom-content"><h2>Add Student</h2><form className="classroom-add-form" onSubmit={handleAddStudent}><input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Student name" /><button className="btn btn-role-continue" type="submit">Add Student</button></form></article>
            ) : (
              <article className="classroom-content"><h2>Your Progress</h2><p>Own points: 0</p><p>Classroom summary available here.</p></article>
            )}
            <article className="classroom-content classroom-students"><h2>{data.from === 'teacher' ? 'Students' : 'Classmates'}</h2><div className="classroom-student-grid">{(classData.students || []).map((student) => <div className="classroom-student-card" key={student.id}><p>🙂 {student.name}</p><p>Points: {student.points || 0}</p><span>Participation: Starter</span>{data.from === 'teacher' && <button className="btn btn-outline" type="button" onClick={() => handleDeleteStudent(student.id)}>Delete</button>}</div>)}{(classData.students || []).length === 0 && <p>No students yet.</p>}</div></article>
          </section>
        ) : (
          <article className="classroom-content"><h2>{activeTab} coming next</h2></article>
        )}
      </section>
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
  const [activeClassroom, setActiveClassroom] = useState(null)

  useEffect(() => {
    const handler = (event) => {
      setActiveClassroom(event.detail)
      setScreen('classroom')
    }
    window.addEventListener('open-classroom', handler)
    return () => window.removeEventListener('open-classroom', handler)
  }, [])

  if (screen === 'classroom' && activeClassroom) {
    return <ClassroomPage data={activeClassroom} onBack={() => setScreen(activeClassroom.from === 'teacher' ? 'teacher-placeholder' : 'student-placeholder')} />
  }

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
