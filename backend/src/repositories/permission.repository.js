import { RolePermission } from '../models/index.js';

const defaults = {
  ADMIN: {
    dashboard: true,
    projects: true,
    tasks: true,
    profile: true,
    users: true,
    permissions: true
  },
  MEMBER: {
    dashboard: true,
    projects: true,
    tasks: true,
    profile: true,
    users: false,
    permissions: false
  }
};

export const permissionRepository = {
  defaults,

  async ensureDefaults() {
    await Promise.all(Object.entries(defaults).map(([role, permissions]) =>
      RolePermission.findOrCreate({ where: { role }, defaults: { permissions } })
    ));
  },

  async list() {
    await this.ensureDefaults();
    const rows = await RolePermission.findAll({ order: [['role', 'ASC']] });
    return rows.map((row) => row.get({ plain: true }));
  },

  async update(role, permissions) {
    const [row] = await RolePermission.findOrCreate({
      where: { role },
      defaults: { permissions: defaults[role] ?? {} }
    });
    await row.update({ permissions });
    return row.get({ plain: true });
  },

  async getByRole(role) {
    await this.ensureDefaults();
    const [row] = await RolePermission.findOrCreate({
      where: { role },
      defaults: { permissions: defaults[role] ?? defaults.MEMBER }
    });
    return row.get({ plain: true });
  },

  async create(role, permissions = defaults.MEMBER) {
    const normalizedRole = role.trim().toUpperCase().replace(/\s+/g, '_');
    const [row, created] = await RolePermission.findOrCreate({
      where: { role: normalizedRole },
      defaults: { permissions }
    });
    return { role: row.get({ plain: true }), created };
  }
};
