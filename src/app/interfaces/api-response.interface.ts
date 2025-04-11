export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  pagination: {
    total: number;
    page: number;
    per_page: number;
  };
  data: T;
}
