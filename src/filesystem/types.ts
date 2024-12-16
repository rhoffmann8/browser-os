import { ApplicationRegistry } from "../application";

const READ_MASK = 0b100;
const WRITE_MASK = 0b010;
const EXECUTE_MASK = 0b001;

export enum FileObjectType {
  UNKNOWN,

  TEXT,
  PDF,
  LINK,

  APPLICATION,
}

export class FileObject {
  private id: string;
  private type: FileObjectType;

  private mode = 0b000;

  constructor() {
    this.id = crypto.randomUUID();
  }

  canRead() {
    return this.mode & READ_MASK;
  }

  canWrite() {
    return this.mode & WRITE_MASK;
  }

  canExecute() {
    return this.mode & EXECUTE_MASK;
  }

  setMode(mode: number) {
    this.mode = mode;
  }

  getType() {
    return this.type;
  }
}

export class FileSystem {
  static execute(file: FileObject) {
    const app = ApplicationRegistry.getApplicationForFileType(file.getType());
    // app.execute(file);
  }
}
