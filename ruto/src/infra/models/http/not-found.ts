import { HttpResponse, HttpResponseError, HttpResponseStatus } from "@infra/models/http/http-response";

export class NotFound extends HttpResponse {
  public constructor(httpResponseError: HttpResponseError) {
    super(HttpResponseStatus.ERROR, 404, "NOT_FOUND", httpResponseError);
  }
}
