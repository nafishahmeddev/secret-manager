declare  interface ApiResponse<TResult = undefined> {
  code: string;
  message: string;
  result: TResult;
}

declare type ApiPaginatedResponse<T> = ApiResponse<{
  records: T[];
  count: number;
}>;