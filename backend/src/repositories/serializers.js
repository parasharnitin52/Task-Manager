export const toPlain = (record) => {
  if (!record) return record;
  return typeof record.get === 'function' ? record.get({ plain: true }) : record;
};

export const publicUser = (user) => {
  const data = toPlain(user) ?? user;
  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    avatar: data.avatar,
    isActive: data.isActive,
    createdAt: data.createdAt,
    permissions: data.permissions ?? (data.rolePermission?.permissions)
  };
};

export const projectSummary = (project) => {
  const data = toPlain(project) ?? project;
  if (!data) return null;
  const tasks = data.tasks ?? [];

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    status: data.status,
    ownerId: data.ownerId,
    dueDate: data.dueDate,
    createdAt: data.createdAt,
    ownerName: data.owner?.name,
    taskCount: tasks.length,
    doneCount: tasks.filter((task) => task.status === 'DONE').length
  };
};

export const memberSummary = (member) => {
  const data = toPlain(member) ?? member;
  const user = data.user ?? data;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role ?? data.role ?? data.ProjectMember?.role,
    projectRole: data.role ?? data.ProjectMember?.role,
    addedAt: data.createdAt ?? data.ProjectMember?.createdAt
  };
};

export const taskSummary = (task) => {
  const data = toPlain(task) ?? task;
  if (!data) return null;

  return {
    id: data.id,
    projectId: data.projectId,
    title: data.title,
    description: data.description,
    status: data.status,
    progress: data.progress,
    assigneeId: data.assigneeId,
    assigneeIds: data.assignees?.map((assignee) => assignee.id) ?? (data.assigneeId ? [data.assigneeId] : []),
    assigneeName: data.assignees?.length
      ? data.assignees.map((assignee) => assignee.name).join(', ')
      : data.assignee?.name,
    assignees: data.assignees?.map(publicUser) ?? [],
    createdBy: data.createdBy,
    creatorName: data.creator?.name,
    dueDate: data.dueDate,
    createdAt: data.createdAt,
    projectName: data.project?.name
  };
};

export const commentSummary = (comment) => {
  const data = toPlain(comment) ?? comment;
  if (!data) return null;

  return {
    id: data.id,
    taskId: data.taskId,
    body: data.body,
    createdAt: data.createdAt,
    author: data.author ? publicUser(data.author) : null
  };
};
