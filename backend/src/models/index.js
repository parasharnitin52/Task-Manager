import { User } from './User.js';
import { Project } from './Project.js';
import { ProjectMember } from './ProjectMember.js';
import { Task } from './Task.js';
import { TaskAssignee } from './TaskAssignee.js';
import { TaskComment } from './TaskComment.js';
import { RolePermission } from './RolePermission.js';

User.hasMany(Project, { foreignKey: 'ownerId', as: 'ownedProjects', onDelete: 'CASCADE' });
Project.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

Project.belongsToMany(User, {
  through: ProjectMember,
  foreignKey: 'projectId',
  otherKey: 'userId',
  as: 'members'
});
User.belongsToMany(Project, {
  through: ProjectMember,
  foreignKey: 'userId',
  otherKey: 'projectId',
  as: 'memberProjects'
});

Project.hasMany(ProjectMember, { foreignKey: 'projectId', as: 'projectMembers', onDelete: 'CASCADE' });
ProjectMember.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
User.hasMany(ProjectMember, { foreignKey: 'userId', as: 'memberships', onDelete: 'CASCADE' });
ProjectMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks', onDelete: 'CASCADE' });
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
Task.belongsTo(User, { foreignKey: 'assigneeId', as: 'assignee' });
Task.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
User.hasMany(Task, { foreignKey: 'assigneeId', as: 'assignedTasks' });
User.hasMany(Task, { foreignKey: 'createdBy', as: 'createdTasks' });

Task.belongsToMany(User, {
  through: TaskAssignee,
  foreignKey: 'taskId',
  otherKey: 'userId',
  as: 'assignees'
});
User.belongsToMany(Task, {
  through: TaskAssignee,
  foreignKey: 'userId',
  otherKey: 'taskId',
  as: 'multiAssignedTasks'
});

Task.hasMany(TaskComment, { foreignKey: 'taskId', as: 'comments', onDelete: 'CASCADE' });
TaskComment.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });
TaskComment.belongsTo(User, { foreignKey: 'userId', as: 'author' });
User.hasMany(TaskComment, { foreignKey: 'userId', as: 'taskComments' });

export { Project, ProjectMember, RolePermission, Task, TaskAssignee, TaskComment, User };
