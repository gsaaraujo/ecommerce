export enum HttpResponseStatus {
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
}

export type HttpResponseError = {
  message: string;
  suggestion?: string;
  path: string;
  timestamp: string;
};

export class HttpResponse {
  public readonly status: HttpResponseStatus;
  public readonly statusCode: number;
  public readonly statusText: string;
  public readonly error?: HttpResponseError;
  public readonly data?: unknown;

  public constructor(
    status: HttpResponseStatus,
    statusCode: number,
    statusText: string,
    error?: HttpResponseError,
    data?: unknown,
  ) {
    this.status = status;
    this.statusCode = statusCode;
    this.statusText = statusText;
    this.error = error;
    this.data = data;
  }
}
