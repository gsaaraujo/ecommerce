import { HttpResponse, HttpResponseError, HttpResponseStatus } from "@infra/models/http/http-response";

export class BadRequest extends HttpResponse {
  public constructor(httpResponseError: HttpResponseError) {
    super(HttpResponseStatus.ERROR, 400, "BAD_REQUEST", httpResponseError);
  }
}
