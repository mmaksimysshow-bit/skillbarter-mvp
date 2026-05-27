"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  computeOverallProgress,
  defaultSettings,
  getMentorById,
  initialConfirmedCases,
  initialLessons,
  initialProjectStates,
  initialSkillId,
  initialTasks,
  mentorMockReplies,
  mockProjects,
  mockUser,
} from "@/data/mock";
import type {
  ActivityItem,
  Booking,
  ChatMessage,
  ConfirmedCase,
  ContactRequest,
  EarnedSkill,
  Lesson,
  LessonStatus,
  Notification,
  NotificationType,
  ProjectState,
  SkillIdPillar,
  Task,
  TaskStatus,
  UserProfile,
  UserSettings,
  UserWorkspace,
} from "@/types";

type LoginResult = { success: true; userId: string } | { success: false; message: string };
type RegisterPayload = {
  name: string;
  identifier: string;
  direction: string;
  roleLabel: string;
};

interface AppState {
  accounts: Record<string, UserWorkspace>;
  activeUserId: string | null;
  hasDemoAccess: boolean;
  user: UserProfile;
  settings: UserSettings;
  lessons: Lesson[];
  tasks: Task[];
  skillId: SkillIdPillar[];
  earnedSkills: EarnedSkill[];
  confirmedCases: ConfirmedCase[];
  activities: ActivityItem[];
  chats: Record<string, ChatMessage[]>;
  bookings: Booking[];
  notifications: Notification[];
  projectStates: ProjectState[];
  contactRequests: ContactRequest[];
  activeChatMentorId: string;
  typingMentorId: string | null;
  toastMessage: string | null;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  registerAccount: (payload: RegisterPayload) => LoginResult;
  loginAccount: (identifier: string, password?: string) => LoginResult;
  logout: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;
  saveSettings: (settings: UserSettings) => void;
  setActiveChatMentor: (mentorId: string) => void;
  sendChatMessage: (mentorId: string, text: string) => void;
  createBooking: (booking: Omit<Booking, "id">) => void;
  joinProject: (projectId: string) => void;
  submitContactRequest: (payload: Omit<ContactRequest, "id" | "createdAt">) => void;
  markAllNotificationsRead: () => void;
  clearToast: () => void;
  startLesson: (lessonId: string) => void;
  completeLesson: (lessonId: string) => void;
  takeTask: (taskId: string) => void;
  submitTask: (taskId: string, link: string, comment: string, fileName: string) => void;
  confirmTask: (taskId: string) => void;
  getOverallProgress: () => number;
  getCompletedTasksCount: () => number;
  getUnreadNotificationsCount: () => number;
  getSkillIdGrowth: () => number;
  getSkillIdRating: () => number;
}

type PersistedState = Partial<AppState> & Record<string, unknown>;

const DEMO_IDENTIFIER = "demo@skillbarter.ru";
const DEMO_PASSWORD = "skill2026";

const baseSkillId = initialSkillId.reduce<Record<string, number>>((acc, pillar) => {
  acc[pillar.id] = pillar.percent;
  return acc;
}, {});

const lessonPillarMap: Record<string, string> = {
  l1: "ui",
  l2: "copy",
  l3: "ui",
  l4: "ui",
  l5: "ui",
  l6: "presentation",
  l7: "cases",
  l8: "smm",
  l9: "copy",
  l10: "video",
  l11: "presentation",
  l12: "cases",
};

function nowIso() {
  return new Date().toISOString();
}

function formatRelativeNow() {
  return "Только что";
}

function formatTime() {
  return new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "SB";
}

function normalizeIdentifier(value: string) {
  return value.trim().toLowerCase();
}

function createGuestUser(): UserProfile {
  return {
    ...mockUser,
    id: "guest",
    name: "Гость",
    email: "",
    login: "",
    contact: "",
    avatarInitials: "Г",
    joinedAt: nowIso(),
  };
}

function createCleanLessons(): Lesson[] {
  const firstLessonIds = new Set(
    [...new Map(
      initialLessons
        .filter((lesson) => lesson.courseId)
        .sort((left, right) => left.order - right.order)
        .map((lesson) => [lesson.courseId!, lesson.id]),
    ).values()],
  );

  return initialLessons.map((lesson) => ({
    ...lesson,
    status: firstLessonIds.has(lesson.id) ? "available" : "locked",
    progress: 0,
  }));
}

function createCleanTasks(): Task[] {
  return initialTasks.map((task) => ({
    ...task,
    status: "pending",
    dueLabel: task.deadline,
    submission: undefined,
  }));
}

function createInitialWorkspace(userData: Partial<UserProfile>): UserWorkspace {
  const roleLabel = userData.roleLabel ?? "Студент";
  const skillIdPrivacy = userData.skillIdPrivacy ?? true;
  const joinedAt = userData.joinedAt ?? nowIso();
  const role = userData.role ?? "student";
  const user: UserProfile = {
    ...mockUser,
    ...userData,
    id: userData.id ?? `user-${Date.now()}`,
    name: userData.name ?? "Новый пользователь",
    email: userData.email ?? "",
    login: userData.login ?? normalizeIdentifier(userData.email ?? ""),
    role,
    roleLabel,
    direction: userData.direction ?? "Выберите направление",
    city: userData.city ?? "Москва",
    contact: userData.contact ?? userData.email ?? "",
    avatarInitials: userData.avatarInitials ?? getInitials(userData.name ?? "Новый пользователь"),
    joinedAt,
    skillIdPrivacy,
  };

  const settings: UserSettings = {
    ...defaultSettings,
    name: user.name,
    contact: user.contact,
    direction: user.direction,
    roleLabel: user.roleLabel,
    skillIdPublic: user.skillIdPrivacy,
  };

  const lessons = createCleanLessons();
  const tasks = createCleanTasks();
  const activities: ActivityItem[] = [
    { id: `a-${user.id}-created`, text: "Профиль создан", time: formatRelativeNow(), type: "message" },
  ];
  const notifications: Notification[] = [
    {
      id: `n-${user.id}-welcome`,
      type: "message",
      title: "Добро пожаловать",
      text: "Создайте демо-профиль, чтобы пройти путь от урока до подтверждённого кейса.",
      time: formatRelativeNow(),
      read: false,
      href: "/demo",
    },
  ];

  return {
    user,
    settings,
    lessons,
    tasks,
    earnedSkills: [],
    confirmedCases: [],
    skillId: [...initialSkillId],
    projectStates: mockProjects.map((project) => ({ projectId: project.id, joined: false })),
    bookings: [],
    chats: {},
    notifications,
    activities,
    contactRequests: [],
    activeChatMentorId: "m1",
  };
}

function mapTaskStatus(status: unknown): TaskStatus {
  if (status === "completed" || status === "submitted" || status === "in_progress") return status;
  if (status === "open") return "pending";
  return "pending";
}

function mapLessonStatus(status: unknown): LessonStatus {
  if (status === "completed" || status === "in_progress" || status === "locked") return status;
  if (status === "not_started" || status === "open") return "available";
  return "available";
}

function getPillarForLesson(lesson: Lesson) {
  return lessonPillarMap[lesson.id];
}

function getPillarForTaskCategory(category: string) {
  const normalized = category.toLowerCase();
  if (normalized.includes("ui") || normalized.includes("дизайн") || normalized.includes("лендинг")) return "ui";
  if (normalized.includes("копирайт")) return "copy";
  if (normalized.includes("презента")) return "presentation";
  if (normalized.includes("smm")) return "smm";
  if (normalized.includes("видео")) return "video";
  return "cases";
}

function buildSkillId(earnedSkills: EarnedSkill[], confirmedCases: ConfirmedCase[]) {
  const values = { ...baseSkillId };

  earnedSkills.forEach((skill) => {
    const lesson = initialLessons.find((item) => item.id === skill.sourceId);
    const pillar =
      skill.sourceType === "lesson" && lesson
        ? getPillarForLesson(lesson)
        : getPillarForTaskCategory(initialTasks.find((item) => item.id === skill.sourceId)?.category ?? "Кейсы");

    if (pillar) {
      values[pillar] = Math.min(100, (values[pillar] ?? 0) + (skill.sourceType === "lesson" ? 8 : 5));
    }
  });

  if (confirmedCases.length > 0) {
    values.cases = Math.min(100, (values.cases ?? 0) + confirmedCases.length * 12);
  }

  return initialSkillId.map((pillar) => ({
    ...pillar,
    percent: Math.min(100, values[pillar.id] ?? pillar.percent),
  }));
}

function normalizeLessons(value: unknown, fallbackLessons = initialLessons) {
  const source = Array.isArray(value) ? value : fallbackLessons;

  return initialLessons.map((initialLesson) => {
    const persisted = source.find(
      (candidate): candidate is Partial<Lesson> =>
        Boolean(candidate) && typeof candidate === "object" && candidate.id === initialLesson.id,
    );

    if (!persisted) return initialLesson;

    const status = mapLessonStatus(persisted.status);
    return {
      ...initialLesson,
      ...persisted,
      status,
      progress:
        status === "completed"
          ? 100
          : status === "in_progress"
            ? Math.max(40, Number(persisted.progress ?? initialLesson.progress))
            : Number(persisted.progress ?? initialLesson.progress),
    };
  });
}

function normalizeTasks(value: unknown) {
  const source = Array.isArray(value) ? value : initialTasks;

  return initialTasks.map((initialTask) => {
    const persisted = source.find(
      (candidate): candidate is Partial<Task> =>
        Boolean(candidate) && typeof candidate === "object" && candidate.id === initialTask.id,
    );

    if (!persisted) return initialTask;

    return {
      ...initialTask,
      ...persisted,
      status: mapTaskStatus(persisted.status),
      submission:
        persisted.submission && typeof persisted.submission === "object"
          ? {
              link: String(persisted.submission.link ?? ""),
              comment: String(persisted.submission.comment ?? ""),
              fileName: String(persisted.submission.fileName ?? ""),
              submittedAt: String(persisted.submission.submittedAt ?? ""),
            }
          : undefined,
      dueLabel: String(persisted.dueLabel ?? initialTask.dueLabel ?? initialTask.deadline),
      skills:
        Array.isArray(persisted.skills) && persisted.skills.length > 0
          ? persisted.skills.map(String)
          : Array.isArray(persisted.skillNames) && persisted.skillNames.length > 0
            ? persisted.skillNames.map(String)
            : initialTask.skills,
      skillNames:
        Array.isArray(persisted.skillNames) && persisted.skillNames.length > 0
          ? persisted.skillNames.map(String)
          : initialTask.skillNames ?? initialTask.skills,
    };
  });
}

function normalizeConfirmedCases(value: unknown) {
  if (!Array.isArray(value)) return [...initialConfirmedCases];

  const unique = new Map<string, ConfirmedCase>();
  value.forEach((item) => {
    if (!item || typeof item !== "object" || typeof item.taskId !== "string") return;
    unique.set(item.taskId, {
      id: String(item.id ?? `case-${item.taskId}`),
      taskId: item.taskId,
      title: String(item.title ?? "Подтверждённый кейс"),
      client: String(item.client ?? ""),
      category: String(item.category ?? ""),
      skills: Array.isArray(item.skills) ? item.skills.map(String) : [],
      mentorId: item.mentorId ? String(item.mentorId) : undefined,
      mentorName: item.mentorName ? String(item.mentorName) : undefined,
      resultLink: String(item.resultLink ?? ""),
      comment: String(item.comment ?? ""),
      confirmedAt: String(item.confirmedAt ?? nowIso()),
      reviewText: String(item.reviewText ?? "Работа подтверждена наставником."),
      rating: Number(item.rating ?? 5),
    });
  });

  return [...unique.values()];
}

function upsertEarnedSkill(
  earnedSkills: EarnedSkill[],
  payload: Omit<EarnedSkill, "id" | "earnedAt"> & { earnedAt?: string },
) {
  const existing = earnedSkills.find((skill) => skill.name === payload.name);

  if (existing) {
    return earnedSkills.map((skill) =>
      skill.id === existing.id
        ? {
            ...skill,
            sourceType: payload.sourceType,
            sourceId: payload.sourceId,
            sourceTitle: payload.sourceTitle,
            lastUpdatedAt: payload.earnedAt ?? nowIso(),
          }
        : skill,
    );
  }

  return [
    {
      id: `skill-${payload.sourceType}-${payload.sourceId}-${earnedSkills.length + 1}`,
      name: payload.name,
      sourceType: payload.sourceType,
      sourceId: payload.sourceId,
      sourceTitle: payload.sourceTitle,
      earnedAt: payload.earnedAt ?? nowIso(),
    },
    ...earnedSkills,
  ];
}

function normalizeEarnedSkills(value: unknown, lessons: Lesson[], confirmedCases: ConfirmedCase[]) {
  let earnedSkills: EarnedSkill[] = [];

  if (Array.isArray(value)) {
    earnedSkills = value
      .filter((item): item is Partial<EarnedSkill> => Boolean(item) && typeof item === "object")
      .map((item, index) => ({
        id: String(item.id ?? `skill-${index}`),
        name: String(item.name ?? ""),
        sourceType: (item.sourceType === "task" ? "task" : "lesson") as EarnedSkill["sourceType"],
        sourceId: String(item.sourceId ?? ""),
        sourceTitle: String(item.sourceTitle ?? ""),
        earnedAt: String(item.earnedAt ?? nowIso()),
        lastUpdatedAt: item.lastUpdatedAt ? String(item.lastUpdatedAt) : undefined,
      }))
      .filter((item) => item.name && item.sourceId);
  }

  if (earnedSkills.length === 0) {
    lessons
      .filter((lesson) => lesson.status === "completed" && lesson.skillName)
      .forEach((lesson) => {
        earnedSkills = upsertEarnedSkill(earnedSkills, {
          name: lesson.skillName!,
          sourceType: "lesson",
          sourceId: lesson.id,
          sourceTitle: lesson.title,
        });
      });

    confirmedCases.forEach((skillCase) => {
      skillCase.skills.forEach((skillName) => {
        earnedSkills = upsertEarnedSkill(earnedSkills, {
          name: skillName,
          sourceType: "task",
          sourceId: skillCase.taskId,
          sourceTitle: skillCase.title,
          earnedAt: skillCase.confirmedAt,
        });
      });
    });
  }

  return earnedSkills;
}

function normalizeWorkspace(value: unknown, fallbackUser?: Partial<UserProfile>): UserWorkspace {
  const workspaceSource = value && typeof value === "object" ? (value as Partial<UserWorkspace>) : {};
  const userSource = workspaceSource.user ?? fallbackUser ?? mockUser;
  const user: UserProfile = {
    ...mockUser,
    ...fallbackUser,
    ...userSource,
    id: String(userSource.id ?? fallbackUser?.id ?? `user-${Date.now()}`),
    name: String(userSource.name ?? fallbackUser?.name ?? mockUser.name),
    email: String(userSource.email ?? fallbackUser?.email ?? ""),
    login: String(userSource.login ?? fallbackUser?.login ?? normalizeIdentifier(userSource.email ?? fallbackUser?.email ?? "")),
    contact: String(userSource.contact ?? fallbackUser?.contact ?? ""),
    direction: String(userSource.direction ?? fallbackUser?.direction ?? mockUser.direction),
    city: String(userSource.city ?? fallbackUser?.city ?? mockUser.city),
    role: userSource.role === "mentor" ? "mentor" : "student",
    roleLabel: String(userSource.roleLabel ?? fallbackUser?.roleLabel ?? mockUser.roleLabel),
    avatarInitials: String(userSource.avatarInitials ?? fallbackUser?.avatarInitials ?? getInitials(String(userSource.name ?? fallbackUser?.name ?? mockUser.name))),
    joinedAt: String(userSource.joinedAt ?? fallbackUser?.joinedAt ?? nowIso()),
    skillIdPrivacy: Boolean(userSource.skillIdPrivacy ?? fallbackUser?.skillIdPrivacy ?? true),
  };

  const lessons = normalizeLessons(workspaceSource.lessons);
  const tasks = normalizeTasks(workspaceSource.tasks);
  const confirmedCases = normalizeConfirmedCases(workspaceSource.confirmedCases);
  const earnedSkills = normalizeEarnedSkills(workspaceSource.earnedSkills, lessons, confirmedCases);
  const settings: UserSettings = {
    ...defaultSettings,
    ...(workspaceSource.settings ?? {}),
    name: user.name,
    contact: user.contact,
    direction: user.direction,
    roleLabel: user.roleLabel,
    skillIdPublic: workspaceSource.settings?.skillIdPublic ?? user.skillIdPrivacy,
  };

  return {
    user,
    settings,
    lessons,
    tasks,
    earnedSkills,
    confirmedCases,
    skillId: buildSkillId(earnedSkills, confirmedCases),
    projectStates: Array.isArray(workspaceSource.projectStates)
      ? workspaceSource.projectStates.map((item) => ({
          projectId: String(item.projectId),
          joined: Boolean(item.joined),
          joinedAt: item.joinedAt ? String(item.joinedAt) : undefined,
        }))
      : initialProjectStates.map((item) => ({ ...item })),
    bookings: Array.isArray(workspaceSource.bookings) ? workspaceSource.bookings : [],
    chats:
      workspaceSource.chats && typeof workspaceSource.chats === "object"
        ? (workspaceSource.chats as Record<string, ChatMessage[]>)
        : {},
    notifications: Array.isArray(workspaceSource.notifications) ? workspaceSource.notifications : [],
    activities: Array.isArray(workspaceSource.activities) ? workspaceSource.activities : [],
    contactRequests: Array.isArray(workspaceSource.contactRequests) ? workspaceSource.contactRequests : [],
    activeChatMentorId:
      typeof workspaceSource.activeChatMentorId === "string" ? workspaceSource.activeChatMentorId : "m1",
  };
}

function createLegacyWorkspace(persisted?: PersistedState) {
  const userSource = persisted?.user && typeof persisted.user === "object" ? (persisted.user as Partial<UserProfile>) : mockUser;
  return normalizeWorkspace(
    {
      user: userSource,
      settings: persisted?.settings,
      lessons: persisted?.lessons,
      tasks: persisted?.tasks,
      earnedSkills: persisted?.earnedSkills,
      confirmedCases: persisted?.confirmedCases,
      projectStates: persisted?.projectStates,
      bookings: persisted?.bookings,
      chats: persisted?.chats,
      notifications: persisted?.notifications,
      activities: persisted?.activities,
      contactRequests: persisted?.contactRequests,
      activeChatMentorId: persisted?.activeChatMentorId,
    },
    userSource,
  );
}

function getAccountsFromPersistedState(persisted?: PersistedState) {
  if (persisted?.accounts && typeof persisted.accounts === "object" && !Array.isArray(persisted.accounts)) {
    const entries = Object.entries(persisted.accounts as Record<string, unknown>).map(([userId, workspace]) => [
      userId,
      normalizeWorkspace(workspace, { id: userId }),
    ] as const);
    return Object.fromEntries(entries);
  }

  if (persisted && (persisted.user || persisted.lessons || persisted.tasks)) {
    const legacyWorkspace = createLegacyWorkspace(persisted);
    return { [legacyWorkspace.user.id]: legacyWorkspace };
  }

  return {};
}

function getActiveUserId(accounts: Record<string, UserWorkspace>, persisted?: PersistedState) {
  if (persisted?.activeUserId && typeof persisted.activeUserId === "string" && accounts[persisted.activeUserId]) {
    return persisted.activeUserId;
  }
  return Object.keys(accounts)[0] ?? null;
}

function getActiveWorkspace(accounts: Record<string, UserWorkspace>, activeUserId: string | null) {
  if (!activeUserId || !accounts[activeUserId]) return null;
  return accounts[activeUserId];
}

function getInitialState(persisted?: PersistedState) {
  const accounts = getAccountsFromPersistedState(persisted);
  const activeUserId = getActiveUserId(accounts, persisted);
  const activeWorkspace = getActiveWorkspace(accounts, activeUserId);
  const user = activeWorkspace?.user ?? createGuestUser();

  return {
    accounts,
    activeUserId,
    hasDemoAccess: Boolean(activeUserId),
    user,
    settings: activeWorkspace?.settings ?? defaultSettings,
    lessons: activeWorkspace?.lessons ?? createCleanLessons(),
    tasks: activeWorkspace?.tasks ?? createCleanTasks(),
    skillId: activeWorkspace?.skillId ?? [...initialSkillId],
    earnedSkills: activeWorkspace?.earnedSkills ?? [],
    confirmedCases: activeWorkspace?.confirmedCases ?? [],
    activities: activeWorkspace?.activities ?? [],
    chats: activeWorkspace?.chats ?? {},
    bookings: activeWorkspace?.bookings ?? [],
    notifications: activeWorkspace?.notifications ?? [],
    projectStates: activeWorkspace?.projectStates ?? initialProjectStates.map((item) => ({ ...item })),
    contactRequests: activeWorkspace?.contactRequests ?? [],
    activeChatMentorId: activeWorkspace?.activeChatMentorId ?? "m1",
    typingMentorId: null as string | null,
    toastMessage: null as string | null,
    sidebarOpen: false,
    sidebarCollapsed: Boolean(persisted?.sidebarCollapsed),
  };
}

function buildAppSliceFromWorkspace(
  accounts: Record<string, UserWorkspace>,
  activeUserId: string | null,
  extra?: Partial<Pick<AppState, "typingMentorId" | "toastMessage" | "sidebarOpen" | "sidebarCollapsed">>,
) {
  const activeWorkspace = getActiveWorkspace(accounts, activeUserId);
  const fallbackUser = createGuestUser();

  return {
    accounts,
    activeUserId,
    hasDemoAccess: Boolean(activeUserId),
    user: activeWorkspace?.user ?? fallbackUser,
    settings: activeWorkspace?.settings ?? defaultSettings,
    lessons: activeWorkspace?.lessons ?? createCleanLessons(),
    tasks: activeWorkspace?.tasks ?? createCleanTasks(),
    skillId: activeWorkspace?.skillId ?? [...initialSkillId],
    earnedSkills: activeWorkspace?.earnedSkills ?? [],
    confirmedCases: activeWorkspace?.confirmedCases ?? [],
    activities: activeWorkspace?.activities ?? [],
    chats: activeWorkspace?.chats ?? {},
    bookings: activeWorkspace?.bookings ?? [],
    notifications: activeWorkspace?.notifications ?? [],
    projectStates: activeWorkspace?.projectStates ?? initialProjectStates.map((item) => ({ ...item })),
    contactRequests: activeWorkspace?.contactRequests ?? [],
    activeChatMentorId: activeWorkspace?.activeChatMentorId ?? "m1",
    ...(extra ?? {}),
  };
}

function updateWorkspaceAccounts(
  state: AppState,
  updater: (workspace: UserWorkspace) => UserWorkspace,
  extra?: Partial<Pick<AppState, "typingMentorId" | "toastMessage" | "sidebarOpen">>,
) {
  if (!state.activeUserId || !state.accounts[state.activeUserId]) return state;
  const nextWorkspace = updater(state.accounts[state.activeUserId]);
  const accounts = { ...state.accounts, [state.activeUserId]: nextWorkspace };
  return buildAppSliceFromWorkspace(accounts, state.activeUserId, {
    typingMentorId: extra?.typingMentorId ?? state.typingMentorId,
    toastMessage: extra?.toastMessage ?? state.toastMessage,
    sidebarOpen: extra?.sidebarOpen ?? state.sidebarOpen,
    sidebarCollapsed: state.sidebarCollapsed,
  });
}

function addActivity(activities: ActivityItem[], text: string, type: ActivityItem["type"]) {
  return [{ id: `a-${Date.now()}`, text, time: formatRelativeNow(), type }, ...activities].slice(0, 30);
}

function pushNotification(
  notifications: Notification[],
  payload: { type: NotificationType; title: string; text: string; href?: string },
) {
  const item: Notification = {
    id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: payload.type,
    title: payload.title,
    text: payload.text,
    href: payload.href,
    read: false,
    time: formatRelativeNow(),
  };

  return [item, ...notifications].slice(0, 30);
}

function appendChatMessage(chats: Record<string, ChatMessage[]>, mentorId: string, msg: ChatMessage) {
  return { ...chats, [mentorId]: [...(chats[mentorId] ?? []), msg] };
}

function withTaskNotification(settings: UserSettings, notifications: Notification[], payload: Parameters<typeof pushNotification>[1]) {
  return settings.notifyTasks ? pushNotification(notifications, payload) : notifications;
}

function withLessonNotification(settings: UserSettings, notifications: Notification[], payload: Parameters<typeof pushNotification>[1]) {
  return settings.notifyLessons ? pushNotification(notifications, payload) : notifications;
}

function createTaskSystemMessage(task: Task, text: string): ChatMessage | null {
  if (!task.mentorId) return null;
  return {
    id: `msg-sys-${task.id}-${Date.now()}`,
    sender: "system",
    text,
    time: formatTime(),
  };
}

function getSkillIdGrowth(lessons: Lesson[], confirmedCases: ConfirmedCase[]) {
  const completedLessons = lessons.filter((lesson) => lesson.status === "completed").length;
  return Math.min(100, completedLessons * 6 + confirmedCases.length * 14);
}

function getSkillIdRating(confirmedCases: ConfirmedCase[]) {
  if (confirmedCases.length === 0) return 0;
  const total = confirmedCases.reduce((sum, skillCase) => sum + skillCase.rating, 0);
  return Number((total / confirmedCases.length).toFixed(1));
}

function createUserProfileFromRegistration(payload: RegisterPayload, existingCount: number): UserProfile {
  const identifier = payload.identifier.trim();
  const isEmail = identifier.includes("@");
  const login = normalizeIdentifier(isEmail ? identifier.split("@")[0] : identifier);
  const email = isEmail ? normalizeIdentifier(identifier) : `${login}@skillbarter.local`;

  return {
    ...mockUser,
    id: `user-${Date.now()}-${existingCount + 1}`,
    name: payload.name.trim(),
    email,
    login,
    role: "student",
    roleLabel: payload.roleLabel,
    direction: payload.direction.trim(),
    contact: isEmail ? email : `@${login}`,
    avatarInitials: getInitials(payload.name),
    joinedAt: nowIso(),
    skillIdPrivacy: true,
  };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...getInitialState(),

      registerAccount: (payload) => {
        const identifier = normalizeIdentifier(payload.identifier);
        const state = get();
        const exists = Object.values(state.accounts).find(
          (workspace) =>
            normalizeIdentifier(workspace.user.email) === identifier ||
            normalizeIdentifier(workspace.user.login) === identifier,
        );

        if (exists) {
          return { success: false, message: "Профиль с таким email/login уже существует." };
        }

        const user = createUserProfileFromRegistration(payload, Object.keys(state.accounts).length);
        const workspace = createInitialWorkspace(user);
        const accounts = { ...state.accounts, [user.id]: workspace };
        set({
          ...buildAppSliceFromWorkspace(accounts, user.id, {
            typingMentorId: null,
            toastMessage: "Профиль создан",
            sidebarOpen: false,
            sidebarCollapsed: state.sidebarCollapsed,
          }),
        });

        return { success: true, userId: user.id };
      },

      loginAccount: (identifier, password) => {
        const normalized = normalizeIdentifier(identifier);
        const state = get();

        if (normalized === DEMO_IDENTIFIER) {
          if (password !== DEMO_PASSWORD) {
            return { success: false, message: "Неверный demo-пароль." };
          }

          const existingDemo = Object.values(state.accounts).find(
            (workspace) => normalizeIdentifier(workspace.user.email) === DEMO_IDENTIFIER,
          );

          if (existingDemo) {
            set({
              ...buildAppSliceFromWorkspace(state.accounts, existingDemo.user.id, {
                typingMentorId: null,
                toastMessage: "С возвращением",
                sidebarOpen: false,
                sidebarCollapsed: state.sidebarCollapsed,
              }),
            });
            return { success: true, userId: existingDemo.user.id };
          }

          const demoUser: UserProfile = {
            ...mockUser,
            id: "demo-user",
            name: "Demo User",
            email: DEMO_IDENTIFIER,
            login: "demo",
            contact: "@demo_skillbarter",
            avatarInitials: "DU",
            direction: "Продуктовый дизайн · MVP",
            role: "student",
            roleLabel: "Студент",
            joinedAt: nowIso(),
            skillIdPrivacy: true,
          };
          const workspace = createInitialWorkspace(demoUser);
          const accounts = { ...state.accounts, [demoUser.id]: workspace };
          set({
            ...buildAppSliceFromWorkspace(accounts, demoUser.id, {
              typingMentorId: null,
              toastMessage: "Демо-профиль создан",
              sidebarOpen: false,
              sidebarCollapsed: state.sidebarCollapsed,
            }),
          });
          return { success: true, userId: demoUser.id };
        }

        const account = Object.values(state.accounts).find(
          (workspace) =>
            normalizeIdentifier(workspace.user.email) === normalized ||
            normalizeIdentifier(workspace.user.login) === normalized,
        );

        if (!account) {
          return { success: false, message: "Профиль не найден. Создайте новый demo-профиль." };
        }

        set({
          ...buildAppSliceFromWorkspace(state.accounts, account.user.id, {
            typingMentorId: null,
            toastMessage: "С возвращением",
            sidebarOpen: false,
            sidebarCollapsed: state.sidebarCollapsed,
          }),
        });
        return { success: true, userId: account.user.id };
      },

      logout: () =>
        set((state) => ({
          ...buildAppSliceFromWorkspace(state.accounts, null, {
            typingMentorId: null,
            toastMessage: null,
            sidebarOpen: false,
            sidebarCollapsed: state.sidebarCollapsed,
          }),
        })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      toggleSidebarCollapsed: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      saveSettings: (settings) =>
        set((state) =>
          updateWorkspaceAccounts(state, (workspace) => {
            const user = {
              ...workspace.user,
              name: settings.name,
              contact: settings.contact,
              direction: settings.direction,
              roleLabel: settings.roleLabel,
              avatarInitials: getInitials(settings.name),
              skillIdPrivacy: settings.skillIdPublic,
            };
            return {
              ...workspace,
              settings,
              user,
            };
          }),
        ),

      setActiveChatMentor: (mentorId) =>
        set((state) =>
          updateWorkspaceAccounts(state, (workspace) => ({
            ...workspace,
            activeChatMentorId: mentorId,
          })),
        ),

      clearToast: () => set({ toastMessage: null }),

      markAllNotificationsRead: () =>
        set((state) =>
          updateWorkspaceAccounts(state, (workspace) => ({
            ...workspace,
            notifications: workspace.notifications.map((notification) => ({ ...notification, read: true })),
          })),
        ),

      sendChatMessage: (mentorId, text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const mentor = getMentorById(mentorId);
        const userMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          sender: "user",
          text: trimmed,
          time: formatTime(),
        };

        set((state) =>
          updateWorkspaceAccounts(
            state,
            (workspace) => ({
              ...workspace,
              chats: appendChatMessage(workspace.chats, mentorId, userMsg),
              activities: addActivity(
                workspace.activities,
                `Сообщение наставнику ${mentor?.name ?? ""}: «${trimmed.slice(0, 40)}…»`,
                "message",
              ),
            }),
            { typingMentorId: mentorId },
          ),
        );

        setTimeout(() => {
          const currentState = get();
          if (!currentState.activeUserId || !currentState.accounts[currentState.activeUserId]) return;

          const replyText = mentorMockReplies[Math.floor(Math.random() * mentorMockReplies.length)];
          const reply: ChatMessage = {
            id: `msg-${Date.now()}-m`,
            sender: "mentor",
            text: replyText,
            time: formatTime(),
          };

          set((state) =>
            updateWorkspaceAccounts(
              state,
              (workspace) => ({
                ...workspace,
                chats: appendChatMessage(workspace.chats, mentorId, reply),
                activities: addActivity(
                  workspace.activities,
                  `${mentor?.name ?? "Наставник"}: новый ответ в чате`,
                  "message",
                ),
                notifications: pushNotification(workspace.notifications, {
                  type: "message",
                  title: "Новое сообщение",
                  text: `${mentor?.name ?? "Наставник"} ответил в чате`,
                  href: "/messages",
                }),
              }),
              { typingMentorId: null },
            ),
          );
        }, 1000);
      },

      createBooking: (data) => {
        const booking: Booking = { ...data, id: `b-${Date.now()}` };
        const systemMsg: ChatMessage = {
          id: `msg-sys-${Date.now()}`,
          sender: "system",
          text: `Запись создана: ${data.date}, ${data.time}, тема: ${data.topic}`,
          time: formatTime(),
        };

        set((state) =>
          updateWorkspaceAccounts(
            state,
            (workspace) => ({
              ...workspace,
              bookings: [booking, ...workspace.bookings],
              chats: appendChatMessage(workspace.chats, data.mentorId, systemMsg),
              activities: addActivity(
                workspace.activities,
                `Запись к ${data.mentorName}: ${data.topic} (${data.date}, ${data.time})`,
                "meeting",
              ),
              notifications: pushNotification(workspace.notifications, {
                type: "booking",
                title: "Запись к наставнику",
                text: `${data.mentorName} · ${data.topic}`,
                href: "/demo",
              }),
            }),
            { toastMessage: "Вы записались к наставнику" },
          ),
        );
      },

      joinProject: (projectId) =>
        set((state) =>
          updateWorkspaceAccounts(
            state,
            (workspace) => {
              const existing = workspace.projectStates.find((project) => project.projectId === projectId);
              if (existing?.joined) return workspace;
              const project = mockProjects.find((item) => item.id === projectId);
              const projectStates = existing
                ? workspace.projectStates.map((projectState) =>
                    projectState.projectId === projectId ? { ...projectState, joined: true, joinedAt: nowIso() } : projectState,
                  )
                : [...workspace.projectStates, { projectId, joined: true, joinedAt: nowIso() }];

              return {
                ...workspace,
                projectStates,
                activities: addActivity(
                  workspace.activities,
                  `Вы присоединились к проекту «${project?.title ?? projectId}»`,
                  "task",
                ),
                notifications: withTaskNotification(workspace.settings, workspace.notifications, {
                  type: "task_submitted",
                  title: "Проект активирован",
                  text: project?.title ?? "Проект добавлен в ваш активный список",
                  href: `/projects/${projectId}`,
                }),
              };
            },
            { toastMessage: "Вы присоединились к проекту" },
          ),
        ),

      submitContactRequest: (payload) =>
        set((state) =>
          updateWorkspaceAccounts(
            state,
            (workspace) => ({
              ...workspace,
              contactRequests: [
                {
                  id: `contact-${Date.now()}`,
                  name: payload.name,
                  contact: payload.contact,
                  topic: payload.topic,
                  message: payload.message,
                  createdAt: nowIso(),
                },
                ...workspace.contactRequests,
              ],
              activities: addActivity(workspace.activities, `Отправлена обратная связь: ${payload.topic}`, "message"),
            }),
            { toastMessage: "Сообщение отправлено" },
          ),
        ),

      startLesson: (lessonId) =>
        set((state) =>
          updateWorkspaceAccounts(state, (workspace) => {
            const lesson = workspace.lessons.find((item) => item.id === lessonId);
            if (!lesson || lesson.status === "locked" || lesson.status === "completed") return workspace;

            const alreadyStarted = lesson.status === "in_progress";
            return {
              ...workspace,
              lessons: workspace.lessons.map((item) =>
                item.id === lessonId
                  ? { ...item, status: "in_progress" as LessonStatus, progress: Math.max(40, item.progress) }
                  : item,
              ),
              activities: alreadyStarted
                ? workspace.activities
                : addActivity(workspace.activities, `Начат урок «${lesson.title}»`, "lesson"),
              notifications: alreadyStarted
                ? workspace.notifications
                : withLessonNotification(workspace.settings, workspace.notifications, {
                    type: "lesson_completed",
                    title: "Урок начат",
                    text: lesson.title,
                    href: `/lessons/${lessonId}`,
                  }),
            };
          }),
        ),

      completeLesson: (lessonId) =>
        set((state) =>
          updateWorkspaceAccounts(state, (workspace) => {
            const lesson = workspace.lessons.find((item) => item.id === lessonId);
            if (!lesson || lesson.status === "locked" || lesson.status === "completed") return workspace;

            const lessons = workspace.lessons.map((item) =>
              item.id === lessonId ? { ...item, status: "completed" as LessonStatus, progress: 100 } : item,
            );

            if (lesson.courseId) {
              const nextLesson = lessons
                .filter((item) => item.courseId === lesson.courseId && item.order > lesson.order)
                .sort((left, right) => left.order - right.order)[0];

              if (nextLesson?.status === "locked") {
                const nextIndex = lessons.findIndex((item) => item.id === nextLesson.id);
                lessons[nextIndex] = { ...nextLesson, status: "available" };
              }
            }

            const earnedSkills = lesson.skillName
              ? upsertEarnedSkill(workspace.earnedSkills, {
                  name: lesson.skillName,
                  sourceType: "lesson",
                  sourceId: lesson.id,
                  sourceTitle: lesson.title,
                })
              : workspace.earnedSkills;

            const confirmedCases = workspace.confirmedCases;
            return {
              ...workspace,
              lessons,
              earnedSkills,
              skillId: buildSkillId(earnedSkills, confirmedCases),
              activities: addActivity(workspace.activities, `Завершён урок «${lesson.title}»`, "lesson"),
              notifications: withLessonNotification(workspace.settings, workspace.notifications, {
                type: "lesson_completed",
                title: "Урок завершён",
                text: lesson.title,
                href: `/lessons/${lessonId}`,
              }),
            };
          }),
        ),

      takeTask: (taskId) =>
        set((state) =>
          updateWorkspaceAccounts(state, (workspace) => {
            const task = workspace.tasks.find((item) => item.id === taskId);
            if (!task || task.status !== "pending") return workspace;
            if (task.relatedLessonId) {
              const relatedLesson = workspace.lessons.find((lesson) => lesson.id === task.relatedLessonId);
              if (relatedLesson && relatedLesson.status !== "completed") {
                return workspace;
              }
            }

            return {
              ...workspace,
              tasks: workspace.tasks.map((item) =>
                item.id === taskId ? { ...item, status: "in_progress" as TaskStatus, dueLabel: "В работе" } : item,
              ),
              activities: addActivity(workspace.activities, `Взята задача «${task.title}»`, "task"),
            };
          }),
        ),

      submitTask: (taskId, link, comment, fileName) =>
        set((state) =>
          updateWorkspaceAccounts(state, (workspace) => {
            const task = workspace.tasks.find((item) => item.id === taskId);
            if (!task || task.status === "completed" || task.status === "submitted") return workspace;

            const submission = {
              link: link.trim(),
              comment: comment.trim(),
              fileName: fileName.trim(),
              submittedAt: nowIso(),
            };

            const tasks = workspace.tasks.map((item) =>
              item.id === taskId
                ? { ...item, status: "submitted" as TaskStatus, dueLabel: "На проверке", submission }
                : item,
            );

            const systemMessage = createTaskSystemMessage(
              { ...task, submission },
              `Сдана задача «${task.title}»: ${submission.link || submission.fileName || "без ссылки"}`,
            );

            return {
              ...workspace,
              tasks,
              chats:
                systemMessage && task.mentorId
                  ? appendChatMessage(workspace.chats, task.mentorId, systemMessage)
                  : workspace.chats,
              activities: addActivity(
                workspace.activities,
                `Сдана задача «${task.title}» (${submission.fileName || "файл"})`,
                "task",
              ),
              notifications: withTaskNotification(workspace.settings, workspace.notifications, {
                type: "task_submitted",
                title: "Задача на проверке",
                text: task.title,
                href: `/tasks/${taskId}`,
              }),
            };
          }),
        ),

      confirmTask: (taskId) =>
        set((state) =>
          updateWorkspaceAccounts(state, (workspace) => {
            const task = workspace.tasks.find((item) => item.id === taskId);
            if (!task || task.status === "completed" || (task.status !== "submitted" && task.status !== "in_progress")) {
              return workspace;
            }

            const existingCase = workspace.confirmedCases.find((skillCase) => skillCase.taskId === taskId);
            const submittedAt = task.submission?.submittedAt ?? nowIso();
            const confirmedAt = nowIso();
            const mentor = task.mentorId ? getMentorById(task.mentorId) : undefined;
            const skills = task.skills ?? task.skillNames ?? [];
            const nextCase: ConfirmedCase =
              existingCase ?? {
                id: `case-${taskId}`,
                taskId,
                title: task.title,
                client: task.client,
                category: task.category,
                skills,
                mentorId: task.mentorId,
                mentorName: task.mentor ?? mentor?.name,
                resultLink: task.submission?.link ?? "",
                comment: task.submission?.comment ?? "",
                confirmedAt,
                reviewText: `Наставник подтвердил кейс по задаче «${task.title}».`,
                rating: mentor?.rating ? Math.round(mentor.rating) : 5,
              };

            const confirmedCases = existingCase
              ? workspace.confirmedCases.map((skillCase) =>
                  skillCase.taskId === taskId
                    ? {
                        ...skillCase,
                        ...nextCase,
                        confirmedAt,
                        resultLink: task.submission?.link ?? skillCase.resultLink,
                        comment: task.submission?.comment ?? skillCase.comment,
                      }
                    : skillCase,
                )
              : [nextCase, ...workspace.confirmedCases];

            let earnedSkills = workspace.earnedSkills;
            skills.forEach((skillName) => {
              earnedSkills = upsertEarnedSkill(earnedSkills, {
                name: skillName,
                sourceType: "task",
                sourceId: taskId,
                sourceTitle: task.title,
                earnedAt: submittedAt,
              });
            });

            const tasks = workspace.tasks.map((item) =>
              item.id === taskId ? { ...item, status: "completed" as TaskStatus, dueLabel: "Завершена" } : item,
            );

            const systemMessage = createTaskSystemMessage(
              task,
              `Кейс по задаче «${task.title}» подтверждён наставником.`,
            );

            return {
              ...workspace,
              tasks,
              earnedSkills,
              confirmedCases,
              skillId: buildSkillId(earnedSkills, confirmedCases),
              chats:
                systemMessage && task.mentorId
                  ? appendChatMessage(workspace.chats, task.mentorId, systemMessage)
                  : workspace.chats,
              activities: addActivity(workspace.activities, `Подтверждена задача «${task.title}»`, "case"),
              notifications: withTaskNotification(workspace.settings, workspace.notifications, {
                type: "task_confirmed",
                title: "Задача подтверждена",
                text: task.title,
                href: `/tasks/${taskId}`,
              }),
            };
          }),
        ),

      getOverallProgress: () => computeOverallProgress(get().lessons, get().tasks),
      getCompletedTasksCount: () => get().tasks.filter((task) => task.status === "completed").length,
      getUnreadNotificationsCount: () => get().notifications.filter((item) => !item.read).length,
      getSkillIdGrowth: () => getSkillIdGrowth(get().lessons, get().confirmedCases),
      getSkillIdRating: () => getSkillIdRating(get().confirmedCases),
    }),
    {
      name: "skillbarter-storage-v3",
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...getInitialState((persistedState as PersistedState) ?? {}),
      }),
      partialize: (state) => ({
        accounts: state.accounts,
        activeUserId: state.activeUserId,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);
