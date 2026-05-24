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
      notifications: [{ id: Date.now() + 1, text: `Class ${className.trim()} was created.`, read: false, createdAt: new Date().toISOString() }],
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
  const classroomTabKey = `bloomClassroomActiveTab:${data.classItem.id}`
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem(classroomTabKey) || 'Classroom')
  const [studentName, setStudentName] = useState('')
  const [classData, setClassData] = useState(data.classItem)
  const [storyText, setStoryText] = useState('')
  const [storyStatus, setStoryStatus] = useState('Working')
  const [storyEmoji, setStoryEmoji] = useState('🌸')
  const [storyImage, setStoryImage] = useState('')
  const [storyImageError, setStoryImageError] = useState('')
  const [openCommentsByStory, setOpenCommentsByStory] = useState({})
  const [commentInputs, setCommentInputs] = useState({})
  const [chatMessage, setChatMessage] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [eventDraft, setEventDraft] = useState({ title: '', date: '', time: '', description: '', emoji: '📚' })
  const [editingEventId, setEditingEventId] = useState(null)
  const [resourceDraft, setResourceDraft] = useState({ title: '', type: 'PDF', description: '', link: '' })
  const tabs = ['Classroom', 'Stories', 'Chat', 'Calendar', 'Resources', 'Activities', 'AI Tutor']
  const studentAvatars = ['🙂', '🌟', '📚', '🧠', '🚀', '🎯']
  const storyStatuses = ['Working', 'Thinking', 'Question', 'Proud', 'Need Help', 'Idea']
  const storyEmojis = ['🌸', '✨', '💡', '📚', '🎯', '😊', '🤔', '🙋‍♀️']

  useEffect(() => {
    const classes = JSON.parse(localStorage.getItem(BLOOM_CLASSES_KEY) || '[]')
    const latestClass = classes.find((item) => item.id === data.classItem.id)
    if (latestClass) {
      setClassData(latestClass)
    }
  }, [data.classItem.id])

  useEffect(() => {
    localStorage.setItem(classroomTabKey, activeTab)
  }, [activeTab, classroomTabKey])

  const persistClass = (nextClass) => {
    const classes = JSON.parse(localStorage.getItem(BLOOM_CLASSES_KEY) || '[]')
    const updated = classes.map((item) => (item.id === nextClass.id ? nextClass : item))
    localStorage.setItem(BLOOM_CLASSES_KEY, JSON.stringify(updated))
    setClassData(nextClass)
  }
  const notify = (nextClass, text) => {
    const notifications = [{ id: Date.now(), text, read: false, createdAt: new Date().toISOString() }, ...(nextClass.notifications || [])]
    persistClass({ ...nextClass, notifications })
  }

  const handleAddStudent = (event) => {
    event.preventDefault()
    if (!studentName.trim()) return
    const nextStudents = [
      ...(classData.students || []),
      {
        id: Date.now(),
        name: studentName.trim(),
        points: 0,
        avatar: studentAvatars[Math.floor(Math.random() * studentAvatars.length)],
      },
    ]
    notify({ ...classData, students: nextStudents }, `${studentName.trim()} joined the class list.`)
    setStudentName('')
  }

  const handleDeleteStudent = (studentId) => {
    const nextStudents = (classData.students || []).filter((student) => student.id !== studentId)
    persistClass({ ...classData, students: nextStudents })
  }

  const handleAdjustPoints = (studentId, delta, reason) => {
    const nextStudents = (classData.students || []).map((student) => {
      if (student.id !== studentId) return student
      const nextPoints = Math.max(0, (student.points || 0) + delta)
      return { ...student, points: nextPoints, lastReason: reason }
    })
    persistClass({ ...classData, students: nextStudents })
  }

  const handlePostStory = (event) => {
    event.preventDefault()
    if (!storyText.trim() && !storyImage) return
    const nextStories = [
      {
        id: Date.now(),
        author: data.from === 'teacher' ? 'Teacher' : 'Student',
        status: storyStatus,
        emoji: storyEmoji,
        text: storyText.trim(),
        image: storyImage || '',
        createdAt: new Date().toISOString(),
      },
      ...(classData.stories || []),
    ]
    notify({ ...classData, stories: nextStories }, `${data.from === 'teacher' ? 'Teacher' : 'Student'} posted a story.`)
    setStoryText('')
    setStoryImage('')
    setStoryImageError('')
  }

  const handleDeleteStory = (storyId) => {
    const nextStories = (classData.stories || []).filter((story) => story.id !== storyId)
    persistClass({ ...classData, stories: nextStories })
  }

  const handleToggleStoryLike = (storyId) => {
    const nextStories = (classData.stories || []).map((story) => {
      if (story.id !== storyId) return story
      const isLiked = Boolean(story.liked)
      const currentLikes = Number(story.likes || 0)
      return { ...story, liked: !isLiked, likes: isLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1 }
    })
    persistClass({ ...classData, stories: nextStories })
  }

  const handleAddStoryComment = (storyId) => {
    const commentText = (commentInputs[storyId] || '').trim()
    if (!commentText) return
    const nextStories = (classData.stories || []).map((story) => {
      if (story.id !== storyId) return story
      const comments = [
        ...(story.comments || []),
        { id: Date.now(), avatar: data.from === 'teacher' ? '👩‍🏫' : '🧑‍🎓', username: data.from === 'teacher' ? 'Teacher' : 'Student', text: commentText, createdAt: new Date().toISOString() },
      ]
      return { ...story, comments }
    })
    notify({ ...classData, stories: nextStories }, `${data.from === 'teacher' ? 'Teacher' : 'Student'} added a comment.`)
    setCommentInputs((prev) => ({ ...prev, [storyId]: '' }))
  }
  const handleSendChat = (event) => {
    event.preventDefault()
    if (!chatMessage.trim()) return
    const nextMessages = [...(classData.chatMessages || []), { id: Date.now(), avatar: data.from === 'teacher' ? '👩‍🏫' : '🧑‍🎓', sender: data.from === 'teacher' ? 'Teacher' : 'Student', text: chatMessage.trim(), createdAt: new Date().toISOString() }]
    notify({ ...classData, chatMessages: nextMessages }, `${data.from === 'teacher' ? 'Teacher' : 'Student'} sent a chat message.`)
    setChatMessage('')
  }
  const unreadCount = (classData.notifications || []).filter((item) => !item.read).length
  const handleToggleNotifications = () => {
    const nextOpen = !showNotifications
    setShowNotifications(nextOpen)
    if (nextOpen && unreadCount > 0) {
      persistClass({ ...classData, notifications: (classData.notifications || []).map((item) => ({ ...item, read: true })) })
    }
  }
  const handleSaveEvent = (event) => {
    event.preventDefault()
    if (!eventDraft.title.trim() || !eventDraft.date || !eventDraft.time) return
    const payload = { ...eventDraft, title: eventDraft.title.trim(), description: eventDraft.description.trim() }
    const nextEvents = editingEventId
      ? (classData.events || []).map((item) => (item.id === editingEventId ? { ...item, ...payload } : item))
      : [{ id: Date.now(), ...payload, createdBy: 'Teacher' }, ...(classData.events || [])]
    const nextClass = { ...classData, events: nextEvents }
    if (editingEventId) {
      persistClass(nextClass)
    } else {
      notify(nextClass, `New event scheduled: ${payload.title}.`)
    }
    setEventDraft({ title: '', date: '', time: '', description: '', emoji: '📚' })
    setEditingEventId(null)
  }
  const handleEditEvent = (eventItem) => {
    setEditingEventId(eventItem.id)
    setEventDraft({
      title: eventItem.title || '',
      date: eventItem.date || '',
      time: eventItem.time || '',
      description: eventItem.description || '',
      emoji: eventItem.emoji || '📚',
    })
  }
  const handleDeleteEvent = (eventId) => {
    const nextEvents = (classData.events || []).filter((item) => item.id !== eventId)
    persistClass({ ...classData, events: nextEvents })
    if (editingEventId === eventId) {
      setEditingEventId(null)
      setEventDraft({ title: '', date: '', time: '', description: '', emoji: '📚' })
    }
  }
  const handleSaveResource = (event) => {
    event.preventDefault()
    if (!resourceDraft.title.trim() || !resourceDraft.link.trim()) return
    const payload = {
      id: Date.now(),
      title: resourceDraft.title.trim(),
      type: resourceDraft.type,
      description: resourceDraft.description.trim(),
      link: resourceDraft.link.trim(),
    }
    const nextResources = [payload, ...(classData.resources || [])]
    notify({ ...classData, resources: nextResources }, `New resource added: ${payload.title}.`)
    setResourceDraft({ title: '', type: 'PDF', description: '', link: '' })
  }
  const handleDeleteResource = (resourceId) => {
    const nextResources = (classData.resources || []).filter((item) => item.id !== resourceId)
    persistClass({ ...classData, resources: nextResources })
  }

  const handleStoryImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setStoryImage('')
      setStoryImageError('Please choose an image file.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setStoryImage(String(reader.result || ''))
      setStoryImageError('')
    }
    reader.readAsDataURL(file)
  }

  const totalStudents = (classData.students || []).length
  const totalPoints = (classData.students || []).reduce((sum, student) => sum + (student.points || 0), 0)
  const ownPoints = (classData.students || [])[0]?.points || 0
  const pointReasons = [
    'Active Participation',
    'Helping Others',
    'Team Collaboration',
    'Great Effort',
    'Creative Thinking',
    'Focused Work',
    'Needs Focus',
    'Missing Task',
    'Distracting Others',
    'Incomplete Work',
    'Late Arrival',
  ]
  const sortedEvents = [...(classData.events || [])].sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())

  return (
    <main className="classroom-screen">
      <header className="classroom-header"><div className="container classroom-header-inner"><p className="classroom-logo">Bloom Classroom</p><button className="btn btn-role-back" onClick={onBack} type="button">Back to Dashboard</button></div></header>
      <section className="container classroom-shell">
        <p className="classroom-role">{data.from === 'teacher' ? 'Teacher View' : 'Student View'}</p>
        <h1 className="classroom-title">{classData.name}</h1>
        <p className="classroom-subject">{classData.subject}</p>
        <p className="classroom-code">{classData.code}</p>
        <div className="classroom-top-row"><nav className="classroom-tabs" aria-label="Classroom tabs">
          {tabs.map((tab) => <button key={tab} type="button" className={`classroom-tab ${activeTab === tab ? 'is-active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>)}
        </nav><button className="story-comments-toggle classroom-notify-btn" type="button" onClick={handleToggleNotifications}>🔔 {unreadCount > 0 ? <span className="classroom-notify-badge">{unreadCount}</span> : '0'}</button></div>
        {showNotifications && <article className="classroom-content classroom-notify-panel"><h3>Notifications</h3>{(classData.notifications || []).slice(0, 8).map((item) => <p key={item.id}>{item.read ? '✓' : '•'} {item.text} · {new Date(item.createdAt).toLocaleString()}</p>)}{(classData.notifications || []).length === 0 && <p>No notifications yet.</p>}</article>}
        {activeTab === 'Classroom' ? (
          <section className="classroom-overview-grid">
            <article className="classroom-content"><h2>Classroom Summary</h2><p>Total students: {totalStudents}</p><p>Total points: {totalPoints}</p><p>Attendance: 0%</p><p>Groups: 0</p></article>
            <article className="classroom-content"><h2>Recent Activity</h2><p>Classroom activity feed coming next.</p><p>Recent classroom updates coming next.</p></article>
            {data.from === 'teacher' ? (
              <article className="classroom-content"><h2>Add Student</h2><form className="classroom-add-form" onSubmit={handleAddStudent}><input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Student name" /><button className="btn btn-role-continue" type="submit">Add Student</button></form></article>
            ) : (
              <article className="classroom-content"><h2>Your Progress</h2><p>Own points: {ownPoints}</p><p>Classroom summary available here.</p></article>
            )}
            <article className="classroom-content classroom-students"><h2>{data.from === 'teacher' ? 'Students' : 'Classmates'}</h2><div className="classroom-student-grid">{(classData.students || []).map((student) => <div className="classroom-student-card" key={student.id}><p>{student.avatar || '🙂'} {student.name}</p><p>Points: {student.points || 0}</p><span>Participation: Starter</span>{data.from === 'teacher' && <><select defaultValue={student.lastReason || pointReasons[0]} onChange={(event) => { const nextStudents = (classData.students || []).map((item) => (item.id === student.id ? { ...item, lastReason: event.target.value } : item)); persistClass({ ...classData, students: nextStudents }) }}>{pointReasons.map((reason) => <option key={reason} value={reason}>{reason}</option>)}</select><div className="classroom-point-actions"><button className="btn btn-outline" type="button" onClick={() => handleAdjustPoints(student.id, 1, student.lastReason || pointReasons[0])}>+1</button><button className="btn btn-outline" type="button" onClick={() => handleAdjustPoints(student.id, -1, student.lastReason || pointReasons[0])}>-1</button></div><button className="btn btn-outline" type="button" onClick={() => handleDeleteStudent(student.id)}>Delete</button></>}</div>)}{(classData.students || []).length === 0 && <p>{data.from === 'teacher' ? 'No students yet.' : 'No classmates yet.'}</p>}</div></article>
          </section>
        ) : activeTab === 'Stories' ? (
          <section className="classroom-stories-feed">
            <article className="classroom-content story-composer">
              <h2>Create Story</h2>
              <form className="classroom-add-form" onSubmit={handlePostStory}>
                <div className="story-composer-head"><span className="story-avatar">{data.from === 'teacher' ? '👩‍🏫' : '🧑‍🎓'}</span><p>Share something with your class…</p><label className="story-camera" htmlFor="story-image-input" title="Add image">📷</label><input id="story-image-input" className="story-image-input" type="file" accept="image/*" onChange={handleStoryImageChange} /></div>
                <textarea value={storyText} onChange={(event) => setStoryText(event.target.value)} placeholder="Share something with your class…" rows={4} />
                {storyImageError && <p className="story-image-error">{storyImageError}</p>}
                {storyImage && <div className="story-preview-wrap"><img className="story-preview-image" src={storyImage} alt="Story preview" /><button className="btn btn-outline" type="button" onClick={() => setStoryImage('')}>Remove image</button></div>}
                <div className="story-composer-actions"><select value={storyStatus} onChange={(event) => setStoryStatus(event.target.value)}>{storyStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select><select value={storyEmoji} onChange={(event) => setStoryEmoji(event.target.value)}>{storyEmojis.map((emoji) => <option key={emoji} value={emoji}>{emoji}</option>)}</select><button className="btn btn-role-continue" type="submit">Post</button></div>
              </form>
            </article>
            <div className="story-list">{(classData.stories || []).map((story) => <article className="classroom-content story-card" key={story.id}><header className="story-card-head"><div><p className="story-author"><span className="story-avatar">{story.emoji}</span> {story.author}</p><p className="story-meta">{classData.name} · {new Date(story.createdAt).toLocaleString()}</p></div><div className="story-card-actions"><span className="story-menu">⋯</span><button className="story-delete-btn" type="button" onClick={() => handleDeleteStory(story.id)}>Delete</button></div></header><span className="story-status">{story.status}</span>{story.text && <p className="story-text">{story.text}</p>}{story.image && <img className="story-feed-image" src={story.image} alt="Story post" />}<footer className="story-reactions"><button className={`story-like-btn ${story.liked ? 'is-liked' : ''}`} type="button" onClick={() => handleToggleStoryLike(story.id)}>{story.liked ? '♥' : '♡'} {story.likes || 0} likes</button><button className="story-comments-toggle" type="button" onClick={() => setOpenCommentsByStory((prev) => ({ ...prev, [story.id]: !prev[story.id] }))}>💬 {(story.comments || []).length} comments</button></footer>{openCommentsByStory[story.id] && <section className="story-comments"><div className="story-comments-list">{(story.comments || []).map((comment) => <article key={comment.id} className="story-comment"><p><span>{comment.avatar}</span> <strong>{comment.username}</strong> · {new Date(comment.createdAt).toLocaleString()}</p><p>{comment.text}</p></article>)}{(story.comments || []).length === 0 && <p className="story-comment-empty">No comments yet.</p>}</div><div className="story-comment-form"><input value={commentInputs[story.id] || ''} onChange={(event) => setCommentInputs((prev) => ({ ...prev, [story.id]: event.target.value }))} placeholder="Write a comment..." /><button className="btn btn-outline" type="button" onClick={() => handleAddStoryComment(story.id)}>Post</button></div></section>}</article>)}{(classData.stories || []).length === 0 && <article className="classroom-content story-card"><p>No stories yet. Be the first to post.</p></article>}</div>
          </section>
        ) : activeTab === 'Calendar' ? (
          <section className="classroom-overview-grid">
            <article className="classroom-content classroom-students"><h2>Upcoming Events</h2><div className="story-list">{sortedEvents.map((eventItem) => <article className="classroom-student-card" key={eventItem.id}><p><strong>{eventItem.emoji || '📚'} {eventItem.title}</strong></p><p>{new Date(`${eventItem.date}T${eventItem.time}`).toLocaleString()}</p><p>{eventItem.description || 'No description yet.'}</p><span>Teacher Event</span>{data.from === 'teacher' && <div className="teacher-class-actions"><button className="btn btn-outline" type="button" onClick={() => handleEditEvent(eventItem)}>Edit</button><button className="btn btn-outline" type="button" onClick={() => handleDeleteEvent(eventItem.id)}>Delete</button></div>}</article>)}{sortedEvents.length === 0 && <p>No events yet.</p>}</div></article>
            {data.from === 'teacher' && <article className="classroom-content"><h2>{editingEventId ? 'Edit Event' : 'Create Event'}</h2><form className="classroom-add-form" onSubmit={handleSaveEvent}><input value={eventDraft.title} onChange={(e) => setEventDraft((prev) => ({ ...prev, title: e.target.value }))} placeholder="Event title" /><input type="date" value={eventDraft.date} onChange={(e) => setEventDraft((prev) => ({ ...prev, date: e.target.value }))} /><input type="time" value={eventDraft.time} onChange={(e) => setEventDraft((prev) => ({ ...prev, time: e.target.value }))} /><textarea value={eventDraft.description} onChange={(e) => setEventDraft((prev) => ({ ...prev, description: e.target.value }))} placeholder="Short description" rows={3} /><select value={eventDraft.emoji} onChange={(e) => setEventDraft((prev) => ({ ...prev, emoji: e.target.value }))}><option>📚</option><option>🧪</option><option>📝</option><option>🎯</option><option>🌟</option><option>📣</option></select><button className="btn btn-role-continue" type="submit">{editingEventId ? 'Save Changes' : 'Save Event'}</button></form></article>}
          </section>
        ) : activeTab === 'Resources' ? (
          <section className="classroom-overview-grid">
            <article className="classroom-content classroom-students"><h2>Class Resources</h2><div className="story-list">{(classData.resources || []).map((resource) => <article className="classroom-student-card" key={resource.id}><span>{resource.type}</span><p><strong>{resource.title}</strong></p><p>{resource.description || 'No description yet.'}</p><a className="btn btn-outline" href={resource.link} target="_blank" rel="noreferrer">Open Resource</a>{data.from === 'teacher' && <div className="teacher-class-actions"><button className="btn btn-outline" type="button" onClick={() => handleDeleteResource(resource.id)}>Delete</button></div>}</article>)}{(classData.resources || []).length === 0 && <p>No resources yet.</p>}</div></article>
            {data.from === 'teacher' && <article className="classroom-content"><h2>Add Resource</h2><form className="classroom-add-form" onSubmit={handleSaveResource}><input value={resourceDraft.title} onChange={(e) => setResourceDraft((prev) => ({ ...prev, title: e.target.value }))} placeholder="Resource title" /><select value={resourceDraft.type} onChange={(e) => setResourceDraft((prev) => ({ ...prev, type: e.target.value }))}><option>PDF</option><option>Video</option><option>Quiz</option><option>Worksheet</option><option>Link</option><option>Activity</option></select><textarea value={resourceDraft.description} onChange={(e) => setResourceDraft((prev) => ({ ...prev, description: e.target.value }))} placeholder="Short description" rows={3} /><input value={resourceDraft.link} onChange={(e) => setResourceDraft((prev) => ({ ...prev, link: e.target.value }))} placeholder="https://resource-link.com" /><button className="btn btn-role-continue" type="submit">Save Resource</button></form></article>}
          </section>
        ) : activeTab === 'Chat' ? (
          <section className="classroom-content classroom-chat"><div className="classroom-chat-messages">{(classData.chatMessages || []).map((message) => <article key={message.id} className={`classroom-chat-bubble ${message.sender === 'Teacher' ? 'is-teacher' : 'is-student'}`}><p><strong>{message.avatar} {message.sender}</strong> · {new Date(message.createdAt).toLocaleTimeString()}</p><p>{message.text}</p></article>)}{(classData.chatMessages || []).length === 0 && <p>No chat messages yet.</p>}</div><form className="classroom-chat-form" onSubmit={handleSendChat}><input value={chatMessage} onChange={(event) => setChatMessage(event.target.value)} placeholder="Write a message..." /><button className="btn btn-role-continue" type="submit">Send</button></form></section>
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
