import { HttpResponse, HttpResponseError, HttpResponseStatus } from "@infra/models/http/http-response";

export class Conflict extends HttpResponse {
  public constructor(httpResponseError: HttpResponseError) {
    super(HttpResponseStatus.ERROR, 409, "CONFLICT", httpResponseError);
  }
}
