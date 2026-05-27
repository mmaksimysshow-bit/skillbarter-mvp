export type LessonStatus = "locked" | "available" | "in_progress" | "completed";
export type TaskStatus = "pending" | "in_progress" | "submitted" | "completed";
export type UserRole = "student" | "mentor";

export interface LessonTheoryBlock {
  title: string;
  text: string;
  keyPoints: string[];
}

export interface LessonExampleBlock {
  title: string;
  situation: string;
  badExample: string;
  goodExample: string;
  explanation: string;
}

export interface LessonStep {
  title: string;
  description: string;
  action: string;
}

export interface LessonQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonMiniPractice {
  title: string;
  description: string;
  deliverable: string;
  timeEstimate: string;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  courseId?: string;
  mentorId: string;
  duration: string;
  durationMin: number;
  level: string;
  skillName?: string;
  shortDescription: string;
  learningGoal: string;
  whyItMatters: string;
  theoryBlocks: LessonTheoryBlock[];
  exampleBlock: LessonExampleBlock;
  stepByStep: LessonStep[];
  commonMistakes: string[];
  checklist: string[];
  miniPractice: LessonMiniPractice;
  miniQuiz: LessonQuizQuestion[];
  relatedTaskId?: string;
  resultAfterLesson: string;
  status: LessonStatus;
  order: number;
  progress: number;
}

export interface TaskSubmission {
  link: string;
  comment: string;
  fileName: string;
  submittedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  category: string;
  mentor?: string;
  mentorId?: string;
  dueLabel?: string;
  difficulty: string;
  deadline: string;
  client: string;
  projectId?: string;
  relatedLessonId?: string;
  context: string;
  problem: string;
  goal: string;
  whatToDo: string[];
  deliverables: string[];
  criteria: string[];
  exampleResult: string;
  submissionTips: string[];
  skills: string[];
  skillNames?: string[];
  estimatedHours: string;
  submission?: TaskSubmission;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  direction: string;
  level: string;
  lessonsCount: number;
  progress: number;
  mentorId?: string;
  recommendedTaskId?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  direction: string;
  goal: string;
  mentorId?: string;
  mentorName?: string;
  taskIds: string[];
}

export interface ProjectState {
  projectId: string;
  joined: boolean;
  joinedAt?: string;
}

export interface ContactRequest {
  id: string;
  name: string;
  contact: string;
  topic: string;
  message: string;
  createdAt: string;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  specialty: string;
  direction: string;
  experience: string;
  helpsWith: string;
  rating: number;
  sessions: number;
  avatarInitials: string;
  online: boolean;
  statusLabel: string;
}

export interface Meeting {
  id: string;
  title: string;
  mentor: string;
  datetime: string;
  type: "review" | "mentor" | "group" | "deadline";
}

export interface ActivityItem {
  id: string;
  text: string;
  time: string;
  type: "lesson" | "task" | "case" | "meeting" | "message";
}

export interface Booking {
  id: string;
  mentorId: string;
  mentorName: string;
  topic: string;
  direction: string;
  date: string;
  time: string;
  comment: string;
}

export type NotificationType =
  | "message"
  | "booking"
  | "task_submitted"
  | "task_confirmed"
  | "lesson_completed";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  text: string;
  time: string;
  read: boolean;
  href?: string;
}

export interface SkillIdPillar {
  id: string;
  label: string;
  percent: number;
}

export interface SkillIdCase {
  id: string;
  title: string;
  confirmed: boolean;
}

export interface EarnedSkill {
  id: string;
  name: string;
  sourceType: "lesson" | "task";
  sourceId: string;
  sourceTitle: string;
  earnedAt: string;
  lastUpdatedAt?: string;
}

export interface ConfirmedCase {
  id: string;
  taskId: string;
  title: string;
  client: string;
  category: string;
  skills: string[];
  mentorId?: string;
  mentorName?: string;
  resultLink: string;
  comment: string;
  confirmedAt: string;
  reviewText: string;
  rating: number;
}

export interface SkillIdReview {
  id: string;
  author: string;
  text: string;
  rating: number;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  login: string;
  role: UserRole;
  direction: string;
  city: string;
  contact: string;
  avatarInitials: string;
  joinedAt: string;
  skillIdPrivacy: boolean;
}

export interface UserProfile extends UserAccount {
  roleLabel: string;
}

export interface UserSettings {
  name: string;
  contact: string;
  direction: string;
  roleLabel: string;
  notifyLessons: boolean;
  notifyTasks: boolean;
  skillIdPublic: boolean;
}

export interface UserWorkspace {
  user: UserProfile;
  settings: UserSettings;
  lessons: Lesson[];
  tasks: Task[];
  earnedSkills: EarnedSkill[];
  confirmedCases: ConfirmedCase[];
  skillId: SkillIdPillar[];
  projectStates: ProjectState[];
  bookings: Booking[];
  chats: Record<string, ChatMessage[]>;
  notifications: Notification[];
  activities: ActivityItem[];
  contactRequests: ContactRequest[];
  activeChatMentorId: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "mentor" | "system";
  text: string;
  time: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
}
