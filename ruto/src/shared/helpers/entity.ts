import crypto from "node:crypto";

import { UUID } from "@shared/domain/models/uuid";

export abstract class Entity<T> {
  protected props: T;
  protected readonly _id: UUID;

  protected constructor(props: T, id?: UUID) {
    this._id = id ?? UUID.reconstitute({ value: crypto.randomUUID() });
    this.props = props;
  }

  public isEquals(entity: Entity<T>): boolean {
    return entity.getId().isEquals(this.getId());
  }

  public getId(): UUID {
    return this._id;
  }
}
