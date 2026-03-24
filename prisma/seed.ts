import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { subDays, subWeeks } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clean existing data
  await prisma.report.deleteMany()
  await prisma.progressEntry.deleteMany()
  await prisma.goal.deleteMany()
  await prisma.student.deleteMany()
  await prisma.user.deleteMany()

  const hashedPassword = await bcrypt.hash('password123', 10)

  // Create Teacher 1: Sarah Johnson
  const sarah = await prisma.user.create({
    data: {
      email: 'teacher1@waypoint.edu',
      name: 'Sarah Johnson',
      password: hashedPassword,
      school: 'Maplewood Elementary',
      gradeRange: 'Grade 3-5',
    },
  })

  // Create Teacher 2: Marcus Williams
  const marcus = await prisma.user.create({
    data: {
      email: 'teacher2@waypoint.edu',
      name: 'Marcus Williams',
      password: hashedPassword,
      school: 'Riverside Middle School',
      gradeRange: 'Grade 6-8',
    },
  })

  // ===== SARAH'S STUDENTS =====

  // Student 1: Emma Rodriguez
  const emma = await prisma.student.create({
    data: {
      name: 'Emma Rodriguez',
      grade: '3rd',
      dateOfBirth: new Date('2015-04-12'),
      disabilityCategory: 'Learning Disability',
      iepStartDate: new Date('2024-09-01'),
      iepEndDate: new Date('2025-08-31'),
      teacherId: sarah.id,
    },
  })

  const emmaReadingGoal = await prisma.goal.create({
    data: {
      studentId: emma.id,
      area: 'Reading',
      description: 'Emma will read grade-level passages and correctly answer comprehension questions with 80% accuracy across 4 consecutive sessions.',
      baseline: 'Currently answers comprehension questions at 45% accuracy',
      target: '80% accuracy across 4 consecutive sessions',
      measurementType: 'percentage',
    },
  })

  const emmaWritingGoal = await prisma.goal.create({
    data: {
      studentId: emma.id,
      area: 'Writing',
      description: 'Emma will write a 5-sentence paragraph with correct capitalization and punctuation in 3 out of 4 opportunities.',
      baseline: 'Currently writes 2-3 sentences with frequent punctuation errors',
      target: '5-sentence paragraph with correct mechanics, 3/4 opportunities',
      measurementType: 'frequency',
    },
  })

  // Emma's Reading progress entries (spanning 3 months, improving trend)
  const emmaReadingEntries = [
    { daysAgo: 84, score: 48, notes: 'Started baseline assessment. Emma struggled with inferencing questions.', promptLevel: 'verbal' },
    { daysAgo: 77, score: 52, notes: 'Slight improvement. Still needs prompting for main idea.', promptLevel: 'verbal' },
    { daysAgo: 70, score: 55, notes: 'Good session. Emma self-corrected twice.', promptLevel: 'verbal' },
    { daysAgo: 63, score: 58, notes: 'Worked on visualization strategy. She responded well.', promptLevel: 'gestural' },
    { daysAgo: 56, score: 62, notes: 'Best performance yet! Strong with literal comprehension.', promptLevel: 'gestural' },
    { daysAgo: 49, score: 65, notes: 'Introduced graphic organizers. Very helpful tool for her.', promptLevel: 'gestural' },
    { daysAgo: 42, score: 68, notes: 'Emma used graphic organizer independently today.', promptLevel: 'independent' },
    { daysAgo: 35, score: 70, notes: 'Hit 70% milestone! Continuing to build inferencing skills.', promptLevel: 'independent' },
    { daysAgo: 28, score: 73, notes: 'Strong session. Emma helped a peer with a reading strategy.', promptLevel: 'independent' },
    { daysAgo: 21, score: 75, notes: 'Consistent performance. Working on more complex texts.', promptLevel: 'independent' },
    { daysAgo: 14, score: 72, notes: 'Slightly lower due to harder passage. Still solid work.', promptLevel: 'independent' },
    { daysAgo: 7, score: 78, notes: 'Excellent session! Getting close to the 80% target.', promptLevel: 'independent' },
  ]

  for (const entry of emmaReadingEntries) {
    await prisma.progressEntry.create({
      data: {
        studentId: emma.id,
        goalId: emmaReadingGoal.id,
        date: subDays(new Date(), entry.daysAgo),
        score: entry.score,
        notes: entry.notes,
        promptLevel: entry.promptLevel,
        teacherId: sarah.id,
      },
    })
  }

  // Emma's Writing progress entries
  const emmaWritingEntries = [
    { daysAgo: 80, score: 40, notes: 'Writing baseline. Writes 2-3 short sentences, many run-ons.', promptLevel: 'verbal' },
    { daysAgo: 73, score: 45, notes: 'Introduced sentence frames. Helpful scaffold.', promptLevel: 'verbal' },
    { daysAgo: 66, score: 50, notes: 'Emma wrote 4 sentences today! Some punctuation errors.', promptLevel: 'verbal' },
    { daysAgo: 59, score: 55, notes: 'Good effort. Capitalization improving.', promptLevel: 'gestural' },
    { daysAgo: 52, score: 60, notes: 'Wrote full paragraph with prompting. Proud of her!', promptLevel: 'gestural' },
    { daysAgo: 45, score: 65, notes: 'Independent paragraph writing attempt. Strong effort.', promptLevel: 'gestural' },
    { daysAgo: 38, score: 68, notes: 'Minimal prompts needed. Mechanics looking good.', promptLevel: 'independent' },
    { daysAgo: 31, score: 70, notes: 'Consistent paragraph writing. Working on transitions.', promptLevel: 'independent' },
    { daysAgo: 17, score: 72, notes: 'Strong session. Added transition words independently.', promptLevel: 'independent' },
    { daysAgo: 10, score: 75, notes: 'Excellent work! Getting close to target.', promptLevel: 'independent' },
  ]

  for (const entry of emmaWritingEntries) {
    await prisma.progressEntry.create({
      data: {
        studentId: emma.id,
        goalId: emmaWritingGoal.id,
        date: subDays(new Date(), entry.daysAgo),
        score: entry.score,
        notes: entry.notes,
        promptLevel: entry.promptLevel,
        teacherId: sarah.id,
      },
    })
  }

  // Student 2: Jaylen Washington
  const jaylen = await prisma.student.create({
    data: {
      name: 'Jaylen Washington',
      grade: '4th',
      dateOfBirth: new Date('2014-08-23'),
      disabilityCategory: 'Autism Spectrum Disorder',
      iepStartDate: new Date('2024-09-01'),
      iepEndDate: new Date('2025-08-31'),
      teacherId: sarah.id,
    },
  })

  const jaylenCommunicationGoal = await prisma.goal.create({
    data: {
      studentId: jaylen.id,
      area: 'Communication',
      description: 'Jaylen will initiate communication with peers using appropriate greetings and conversation starters in 3 out of 5 opportunities.',
      baseline: 'Currently initiates peer communication in 1 out of 10 opportunities with significant prompting',
      target: 'Initiates peer communication in 3/5 opportunities with minimal prompting',
      measurementType: 'frequency',
    },
  })

  const jaylenBehaviorGoal = await prisma.goal.create({
    data: {
      studentId: jaylen.id,
      area: 'Behavior',
      description: 'Jaylen will use a self-regulation tool (breathing, fidget, sensory break) when feeling overwhelmed, reducing escalation incidents to 2 or fewer per week.',
      baseline: 'Currently has 6-8 escalation incidents per week, uses no self-regulation strategies independently',
      target: '2 or fewer escalation incidents per week with independent use of self-regulation tools',
      measurementType: 'frequency',
    },
  })

  const jaylenSocialGoal = await prisma.goal.create({
    data: {
      studentId: jaylen.id,
      area: 'Social Skills',
      description: 'Jaylen will take turns in a structured group activity for at least 10 minutes without prompting in 4 out of 5 sessions.',
      baseline: 'Currently participates in turn-taking for 2-3 minutes before disengaging',
      target: 'Participates in turn-taking for 10+ minutes, 4/5 sessions',
      measurementType: 'duration',
    },
  })

  // Jaylen's Communication entries (moderate progress)
  const jaylenCommEntries = [
    { daysAgo: 85, score: 20, notes: 'Baseline. Required full physical prompting for any peer interaction.', promptLevel: 'physical' },
    { daysAgo: 78, score: 25, notes: 'Practiced greetings with visual supports. Some verbal prompting.', promptLevel: 'verbal' },
    { daysAgo: 71, score: 30, notes: 'Greeted 3 peers today with gestural prompt. Progress!', promptLevel: 'gestural' },
    { daysAgo: 64, score: 35, notes: 'Initiated conversation with one peer independently. Big step!', promptLevel: 'gestural' },
    { daysAgo: 57, score: 40, notes: 'Good day. Used visual script card to start conversation.', promptLevel: 'gestural' },
    { daysAgo: 50, score: 45, notes: 'Initiated greetings with 2 peers during morning meeting.', promptLevel: 'verbal' },
    { daysAgo: 43, score: 48, notes: 'Slight regression. Jaylen seemed anxious about new classroom arrangement.', promptLevel: 'verbal' },
    { daysAgo: 36, score: 52, notes: 'Back on track. Initiated 3 interactions today.', promptLevel: 'gestural' },
    { daysAgo: 22, score: 55, notes: 'Strong session. Used conversation starter cards appropriately.', promptLevel: 'gestural' },
    { daysAgo: 15, score: 58, notes: 'Good progress. Started using greetings without visual supports.', promptLevel: 'independent' },
    { daysAgo: 8, score: 60, notes: 'Excellent! Initiated peer communication 3/5 times. Approaching target!', promptLevel: 'independent' },
  ]

  for (const entry of jaylenCommEntries) {
    await prisma.progressEntry.create({
      data: {
        studentId: jaylen.id,
        goalId: jaylenCommunicationGoal.id,
        date: subDays(new Date(), entry.daysAgo),
        score: entry.score,
        notes: entry.notes,
        promptLevel: entry.promptLevel,
        teacherId: sarah.id,
      },
    })
  }

  // Jaylen's Behavior entries (improving)
  const jaylenBehaviorEntries = [
    { daysAgo: 83, score: 20, notes: '7 incidents this week. Baseline established. Introducing calm-down toolkit.', promptLevel: 'verbal' },
    { daysAgo: 76, score: 30, notes: '6 incidents. Jaylen showed awareness of the calm-down corner.', promptLevel: 'verbal' },
    { daysAgo: 69, score: 40, notes: '5 incidents. Used breathing exercise once with prompting.', promptLevel: 'gestural' },
    { daysAgo: 62, score: 45, notes: '4 incidents. Chose fidget tool independently once.', promptLevel: 'gestural' },
    { daysAgo: 55, score: 55, notes: '4 incidents. Better use of calm-down corner.', promptLevel: 'gestural' },
    { daysAgo: 48, score: 60, notes: '3 incidents. Real improvement! Requested sensory break twice.', promptLevel: 'independent' },
    { daysAgo: 41, score: 65, notes: '3 incidents. Using self-regulation tools more consistently.', promptLevel: 'independent' },
    { daysAgo: 27, score: 70, notes: '2 incidents! Hit target this week. Very proud of Jaylen.', promptLevel: 'independent' },
    { daysAgo: 20, score: 72, notes: '2 incidents. Maintaining target. Great self-awareness.', promptLevel: 'independent' },
    { daysAgo: 13, score: 68, notes: '3 incidents. One challenging day but recovered well.', promptLevel: 'independent' },
    { daysAgo: 6, score: 75, notes: '2 incidents. Back to target. Jaylen self-identified triggers.', promptLevel: 'independent' },
  ]

  for (const entry of jaylenBehaviorEntries) {
    await prisma.progressEntry.create({
      data: {
        studentId: jaylen.id,
        goalId: jaylenBehaviorGoal.id,
        date: subDays(new Date(), entry.daysAgo),
        score: entry.score,
        notes: entry.notes,
        promptLevel: entry.promptLevel,
        teacherId: sarah.id,
      },
    })
  }

  // Jaylen's Social entries (slower progress)
  const jaylenSocialEntries = [
    { daysAgo: 81, score: 20, notes: 'Baseline: participates in turn-taking for about 2 minutes.', promptLevel: 'physical' },
    { daysAgo: 74, score: 25, notes: 'Engaged for 3 minutes in board game activity.', promptLevel: 'verbal' },
    { daysAgo: 67, score: 30, notes: 'Good morning circle participation. 4 minutes.', promptLevel: 'verbal' },
    { daysAgo: 60, score: 35, notes: 'Partner activity: 5 minutes. Needed redirection twice.', promptLevel: 'gestural' },
    { daysAgo: 53, score: 40, notes: 'Card game: 6 minutes. Jaylen was engaged and enjoying it!', promptLevel: 'gestural' },
    { daysAgo: 46, score: 42, notes: '6 minutes in cooperative game. Slight plateau.', promptLevel: 'gestural' },
    { daysAgo: 32, score: 50, notes: 'Big jump! 8 minutes in structured game. Visual schedule helped.', promptLevel: 'gestural' },
    { daysAgo: 18, score: 55, notes: '9 minutes! Very close to target. Great persistence.', promptLevel: 'independent' },
    { daysAgo: 11, score: 60, notes: '10 minutes! Hit the time target. Now working on consistency.', promptLevel: 'independent' },
  ]

  for (const entry of jaylenSocialEntries) {
    await prisma.progressEntry.create({
      data: {
        studentId: jaylen.id,
        goalId: jaylenSocialGoal.id,
        date: subDays(new Date(), entry.daysAgo),
        score: entry.score,
        notes: entry.notes,
        promptLevel: entry.promptLevel,
        teacherId: sarah.id,
      },
    })
  }

  // Student 3: Sophia Chen
  const sophia = await prisma.student.create({
    data: {
      name: 'Sophia Chen',
      grade: '5th',
      dateOfBirth: new Date('2013-11-05'),
      disabilityCategory: 'ADHD',
      iepStartDate: new Date('2024-09-01'),
      iepEndDate: new Date('2025-08-31'),
      teacherId: sarah.id,
    },
  })

  const sophiaMathGoal = await prisma.goal.create({
    data: {
      studentId: sophia.id,
      area: 'Math',
      description: 'Sophia will solve multi-step word problems involving multiplication and division with 75% accuracy in 4 out of 5 sessions.',
      baseline: 'Currently solves single-step problems with 60% accuracy; multi-step at 35%',
      target: '75% accuracy on multi-step problems, 4/5 sessions',
      measurementType: 'percentage',
    },
  })

  const sophiaBehaviorGoal = await prisma.goal.create({
    data: {
      studentId: sophia.id,
      area: 'Behavior',
      description: 'Sophia will remain on-task for 15-minute work periods with no more than 1 redirection, in 4 out of 5 observed opportunities.',
      baseline: 'Currently requires 4-6 redirections per 15-minute work period',
      target: '1 or fewer redirections per 15-minute period, 4/5 opportunities',
      measurementType: 'frequency',
    },
  })

  // Sophia's Math entries (variable, needs attention)
  const sophiaMathEntries = [
    { daysAgo: 86, score: 35, notes: 'Baseline for multi-step problems. Sophia rushed through and made calculation errors.', promptLevel: 'verbal' },
    { daysAgo: 79, score: 40, notes: 'Introduced work mat strategy. Helped her organize steps.', promptLevel: 'verbal' },
    { daysAgo: 72, score: 45, notes: 'Better organization. Still making multiplication errors.', promptLevel: 'verbal' },
    { daysAgo: 65, score: 55, notes: 'Good session! Used work mat independently.', promptLevel: 'gestural' },
    { daysAgo: 58, score: 50, notes: 'Regression - Sophia was distracted and rushed her work.', promptLevel: 'verbal' },
    { daysAgo: 51, score: 58, notes: 'Strong recovery. Focused well today with timer strategy.', promptLevel: 'gestural' },
    { daysAgo: 44, score: 60, notes: 'Consistent improvement. Checking her work before submitting.', promptLevel: 'gestural' },
    { daysAgo: 37, score: 55, notes: 'Harder problem set. Sophia got frustrated early on.', promptLevel: 'verbal' },
    { daysAgo: 30, score: 63, notes: 'Back on track. Timer + work mat = great combo for her.', promptLevel: 'gestural' },
    { daysAgo: 23, score: 65, notes: 'Good progress! Close to 3-step problems comfortably now.', promptLevel: 'gestural' },
    { daysAgo: 16, score: 60, notes: 'Moderate session. Sophia was tired from testing week.', promptLevel: 'verbal' },
    { daysAgo: 9, score: 68, notes: 'Strong session! Problem-solving strategies clicking.', promptLevel: 'independent' },
  ]

  for (const entry of sophiaMathEntries) {
    await prisma.progressEntry.create({
      data: {
        studentId: sophia.id,
        goalId: sophiaMathGoal.id,
        date: subDays(new Date(), entry.daysAgo),
        score: entry.score,
        notes: entry.notes,
        promptLevel: entry.promptLevel,
        teacherId: sarah.id,
      },
    })
  }

  // Sophia's Behavior entries (challenging, lower scores)
  const sophiaBehaviorEntries = [
    { daysAgo: 84, score: 30, notes: 'Baseline: 5 redirections in 15 min. Sophia has difficulty with seated tasks.', promptLevel: 'verbal' },
    { daysAgo: 77, score: 35, notes: 'Introduced movement break schedule. 4 redirections.', promptLevel: 'verbal' },
    { daysAgo: 70, score: 38, notes: 'Slight improvement. Movement breaks are helping.', promptLevel: 'verbal' },
    { daysAgo: 63, score: 42, notes: '3-4 redirections. Sophia is learning to self-monitor.', promptLevel: 'verbal' },
    { daysAgo: 56, score: 45, notes: 'Used self-monitoring checklist. 3 redirections.', promptLevel: 'gestural' },
    { daysAgo: 49, score: 50, notes: 'Good day! 2 redirections. Midpoint check-ins helping.', promptLevel: 'gestural' },
    { daysAgo: 42, score: 45, notes: 'More distractible today. Guest in classroom disrupted routine.', promptLevel: 'verbal' },
    { daysAgo: 35, score: 48, notes: 'Recovering. Self-monitoring with more consistency.', promptLevel: 'gestural' },
    { daysAgo: 28, score: 52, notes: 'Good focus today. 2 redirections in 15-min observation.', promptLevel: 'gestural' },
    { daysAgo: 14, score: 48, notes: 'Fluctuating. Sophia needs consistent environmental supports.', promptLevel: 'verbal' },
    { daysAgo: 7, score: 55, notes: 'Better this week. New seating arrangement seems to help.', promptLevel: 'gestural' },
  ]

  for (const entry of sophiaBehaviorEntries) {
    await prisma.progressEntry.create({
      data: {
        studentId: sophia.id,
        goalId: sophiaBehaviorGoal.id,
        date: subDays(new Date(), entry.daysAgo),
        score: entry.score,
        notes: entry.notes,
        promptLevel: entry.promptLevel,
        teacherId: sarah.id,
      },
    })
  }

  // ===== MARCUS'S STUDENTS =====

  // Student 4: Aiden Murphy
  const aiden = await prisma.student.create({
    data: {
      name: 'Aiden Murphy',
      grade: '7th',
      dateOfBirth: new Date('2011-03-17'),
      disabilityCategory: 'Learning Disability',
      iepStartDate: new Date('2024-09-01'),
      iepEndDate: new Date('2025-08-31'),
      teacherId: marcus.id,
    },
  })

  const aidenReadingGoal = await prisma.goal.create({
    data: {
      studentId: aiden.id,
      area: 'Reading',
      description: 'Aiden will read and comprehend informational texts at a 6th-grade level, correctly answering text-dependent questions with 75% accuracy in 3 of 4 consecutive sessions.',
      baseline: 'Reading at 4th-grade level; comprehension of 6th-grade informational texts at 40%',
      target: '75% accuracy on text-dependent questions at 6th-grade level, 3/4 sessions',
      measurementType: 'percentage',
    },
  })

  const aidenMathGoal = await prisma.goal.create({
    data: {
      studentId: aiden.id,
      area: 'Math',
      description: 'Aiden will solve algebraic equations with one variable with 80% accuracy across 3 consecutive sessions.',
      baseline: 'Currently solves one-step equations at 55% accuracy; struggles with two-step',
      target: '80% accuracy on one and two-step equations, 3 consecutive sessions',
      measurementType: 'percentage',
    },
  })

  // Aiden's Reading entries (strong progress)
  const aidenReadingEntries = [
    { daysAgo: 82, score: 40, notes: 'Baseline with 6th grade informational text. Struggled with vocabulary.', promptLevel: 'verbal' },
    { daysAgo: 75, score: 48, notes: 'Pre-teaching vocabulary helped. Better comprehension.', promptLevel: 'verbal' },
    { daysAgo: 68, score: 55, notes: 'Aiden is responding well to annotation strategy.', promptLevel: 'gestural' },
    { daysAgo: 61, score: 62, notes: 'Strong session. Identified text structure correctly.', promptLevel: 'gestural' },
    { daysAgo: 54, score: 67, notes: 'Good work. Using context clues for unfamiliar words.', promptLevel: 'gestural' },
    { daysAgo: 47, score: 70, notes: 'Hit 70%! Confident with main idea and supporting details.', promptLevel: 'independent' },
    { daysAgo: 33, score: 73, notes: 'Consistent progress. Aiden annotating independently.', promptLevel: 'independent' },
    { daysAgo: 26, score: 75, notes: 'Hit target! Strong session with science text.', promptLevel: 'independent' },
    { daysAgo: 19, score: 72, notes: 'History text was harder. Still strong performance.', promptLevel: 'independent' },
    { daysAgo: 12, score: 77, notes: 'Above target. Aiden is building real confidence.', promptLevel: 'independent' },
  ]

  for (const entry of aidenReadingEntries) {
    await prisma.progressEntry.create({
      data: {
        studentId: aiden.id,
        goalId: aidenReadingGoal.id,
        date: subDays(new Date(), entry.daysAgo),
        score: entry.score,
        notes: entry.notes,
        promptLevel: entry.promptLevel,
        teacherId: marcus.id,
      },
    })
  }

  // Aiden's Math entries
  const aidenMathEntries = [
    { daysAgo: 80, score: 55, notes: 'Baseline: one-step equations mostly correct. Two-step inconsistent.', promptLevel: 'verbal' },
    { daysAgo: 73, score: 60, notes: 'Introduced balance model. Aiden grasps the concept.', promptLevel: 'verbal' },
    { daysAgo: 66, score: 65, notes: 'Good progress on two-step. Distribution still tricky.', promptLevel: 'gestural' },
    { daysAgo: 59, score: 70, notes: 'Solid work. Checking solutions by substituting back.', promptLevel: 'gestural' },
    { daysAgo: 45, score: 73, notes: 'Strong performance. Working on negative coefficients.', promptLevel: 'gestural' },
    { daysAgo: 31, score: 75, notes: 'Good session. Word problems remain challenging.', promptLevel: 'gestural' },
    { daysAgo: 24, score: 78, notes: 'Very close to target! Showing great algebraic thinking.', promptLevel: 'independent' },
    { daysAgo: 10, score: 80, notes: 'Hit target! Strong independent work on mixed problem set.', promptLevel: 'independent' },
  ]

  for (const entry of aidenMathEntries) {
    await prisma.progressEntry.create({
      data: {
        studentId: aiden.id,
        goalId: aidenMathGoal.id,
        date: subDays(new Date(), entry.daysAgo),
        score: entry.score,
        notes: entry.notes,
        promptLevel: entry.promptLevel,
        teacherId: marcus.id,
      },
    })
  }

  // Student 5: Priya Patel
  const priya = await prisma.student.create({
    data: {
      name: 'Priya Patel',
      grade: '8th',
      dateOfBirth: new Date('2010-07-29'),
      disabilityCategory: 'Autism Spectrum Disorder',
      iepStartDate: new Date('2024-09-01'),
      iepEndDate: new Date('2025-08-31'),
      teacherId: marcus.id,
    },
  })

  const priyaCommunicationGoal = await prisma.goal.create({
    data: {
      studentId: priya.id,
      area: 'Communication',
      description: 'Priya will ask clarifying questions when instructions are unclear, demonstrating this skill in 4 out of 5 structured opportunities.',
      baseline: 'Currently does not ask for clarification; tends to attempt tasks without understanding or shuts down',
      target: 'Asks clarifying questions in 4/5 opportunities',
      measurementType: 'frequency',
    },
  })

  const priyaSocialGoal = await prisma.goal.create({
    data: {
      studentId: priya.id,
      area: 'Social Skills',
      description: 'Priya will participate in small group (2-3 peers) collaborative activities by contributing at least one verbal idea or response per session, in 4 out of 5 opportunities.',
      baseline: 'Participates silently or not at all in group activities; contributes verbally in 0-1 out of 10 opportunities',
      target: 'Contributes verbally in 4/5 small group opportunities',
      measurementType: 'frequency',
    },
  })

  // Priya's Communication entries (slower start, building)
  const priyaCommEntries = [
    { daysAgo: 79, score: 15, notes: 'Baseline. Priya did not ask any clarifying questions during structured opportunities.', promptLevel: 'physical' },
    { daysAgo: 72, score: 20, notes: 'Introduced question sentence starters. Some awareness building.', promptLevel: 'verbal' },
    { daysAgo: 65, score: 28, notes: 'Asked one question with full verbal prompt. Major milestone!', promptLevel: 'verbal' },
    { daysAgo: 58, score: 35, notes: 'Using question starter card. Asked 2 questions.', promptLevel: 'gestural' },
    { daysAgo: 51, score: 42, notes: 'Good session. Gestural prompts sufficient.', promptLevel: 'gestural' },
    { daysAgo: 44, score: 45, notes: 'Asking questions more regularly. Building habit.', promptLevel: 'gestural' },
    { daysAgo: 30, score: 52, notes: 'Consistent use of clarifying questions with visual support.', promptLevel: 'gestural' },
    { daysAgo: 16, score: 58, notes: 'Strong progress. Sometimes asks without prompting.', promptLevel: 'independent' },
    { daysAgo: 9, score: 62, notes: 'Good session. Priya initiated clarifying questions independently twice.', promptLevel: 'independent' },
  ]

  for (const entry of priyaCommEntries) {
    await prisma.progressEntry.create({
      data: {
        studentId: priya.id,
        goalId: priyaCommunicationGoal.id,
        date: subDays(new Date(), entry.daysAgo),
        score: entry.score,
        notes: entry.notes,
        promptLevel: entry.promptLevel,
        teacherId: marcus.id,
      },
    })
  }

  // Priya's Social entries
  const priyaSocialEntries = [
    { daysAgo: 77, score: 10, notes: 'Baseline. Priya sat with group but did not speak.', promptLevel: 'physical' },
    { daysAgo: 70, score: 18, notes: 'Paired with one supportive peer first. Whispered response.', promptLevel: 'verbal' },
    { daysAgo: 63, score: 25, notes: 'Small group with familiar peers. One verbal contribution!', promptLevel: 'verbal' },
    { daysAgo: 56, score: 30, notes: 'Two contributions in group. Priya is more comfortable.', promptLevel: 'gestural' },
    { daysAgo: 42, score: 38, notes: 'Good session. Group chose a topic Priya enjoys (science).', promptLevel: 'gestural' },
    { daysAgo: 28, score: 45, notes: 'Strong contribution. Priya shared an idea about the project topic.', promptLevel: 'gestural' },
    { daysAgo: 14, score: 50, notes: 'Consistent participation. Building confidence.', promptLevel: 'gestural' },
    { daysAgo: 7, score: 55, notes: 'Good session. Responded to peer question independently.', promptLevel: 'independent' },
  ]

  for (const entry of priyaSocialEntries) {
    await prisma.progressEntry.create({
      data: {
        studentId: priya.id,
        goalId: priyaSocialGoal.id,
        date: subDays(new Date(), entry.daysAgo),
        score: entry.score,
        notes: entry.notes,
        promptLevel: entry.promptLevel,
        teacherId: marcus.id,
      },
    })
  }

  console.log('Database seeded successfully!')
  console.log(`Created 2 teachers, 5 students, and progress entries`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
