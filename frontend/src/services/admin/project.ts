import { ApiRequest } from "../../lib/axios";

export default class AdminProjectService {

  static async getAllProjects({ search }: { search: string }): Promise<ApiResponse<Project[]>> {
    const response = await ApiRequest.post('/api/v1/admin/projects', { search });
    return response.data;
  }
  static async getProjectById(key: string): Promise<ApiResponse<Project>> {
    const response = await ApiRequest.get(`/api/v1/admin/projects/${key}`);
    return response.data;
  }

  static async createProject(project: { name: string; description?: string }): Promise<ApiResponse<Project>> {
    const response = await ApiRequest.put('/api/v1/admin/projects', project);
    return response.data;
  }


  static async updateProject(key: string, project: { name?: string; description?: string, allowedIps?: string[] }): Promise<ApiResponse<Project>> {
    const response = await ApiRequest.put(`/api/v1/admin/projects/${key}`, project);
    return response.data;
  }

  static async deleteProject(key: string): Promise<ApiResponse<void>> {
    const response = await ApiRequest.delete(`/api/v1/admin/projects/${key}`);
    return response.data;
  }



  /// Secrets Management
  static async getSecretsByProjectId(key: string): Promise<ApiResponse<Record<string, string>>> {
    const response = await ApiRequest.get(`/api/v1/admin/projects/${key}/secrets`);
    return response.data;
  }

  static async updateSecrets(key: string, secrets: Record<string, string>): Promise<ApiResponse<Record<string, string>>> {
    const response = await ApiRequest.post(`/api/v1/admin/projects/${key}/secrets`, secrets);
    return response.data;
  }

  //api keys
  static async createApiSecret(projectId: string): Promise<ApiResponse<void>> {
    const response = await ApiRequest.post(`/api/v1/admin/projects/${projectId}/regenerate-api-key`);
    return response.data;
  }

}

