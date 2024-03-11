import { HttpResponse, HttpResponseError, HttpResponseStatus } from "@infra/models/http/http-response";

export class Created extends HttpResponse {
  public constructor(data: unknown) {
    super(HttpResponseStatus.SUCCESS, 201, "CREATED", undefined, data);
  }
}
