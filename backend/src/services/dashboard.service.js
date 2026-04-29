import { dashboardRepository } from '../repositories/dashboard.repository.js';

export const dashboardService = {
  async get(user) {
    const [stats, overdueTasks, distribution] = await Promise.all([
      dashboardRepository.getStats(user),
      dashboardRepository.getOverdueTasks(user),
      dashboardRepository.getDistribution(user)
    ]);

    return { stats, overdueTasks, distribution };
  }
};
