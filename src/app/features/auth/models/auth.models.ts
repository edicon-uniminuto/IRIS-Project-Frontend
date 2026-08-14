export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthPayload {
  accessToken: string;
  user: User;
}

export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: { code: string; message: string; details: unknown };
}
