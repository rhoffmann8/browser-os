// import { UniqueIdentifier } from "@dnd-kit/core";
// import { Moveable, Position, Dimensionable } from "../types";
// import { Application } from "../types/application";

// // UNUSED -- see if it makes sense

// export interface WidgetProps extends Dimensionable, Moveable {
//   title: string;
//   application: Application;
// }

// class WidgetManager {
//   static stackIndex = 0;

//   static getStackIndex() {
//     return this.stackIndex++;
//   }
// }

// export class Widget implements Moveable, Dimensionable {
//   dimensions: { height: number; width: number };
//   position: Position;

//   private id: UniqueIdentifier;
//   private title: string;
//   private application: Application;
//   private stackIndex: number;

//   static stackIndex = 0;

//   constructor({ title, application, dimensions, position }: WidgetProps) {
//     this.title = title;
//     this.application = application;
//     this.dimensions = dimensions;
//     this.position = position;

//     this.id = crypto.randomUUID();
//     this.stackIndex = WidgetManager.getStackIndex();
//   }

//   getId() {
//     return this.id;
//   }

//   getTitle() {
//     return this.title;
//   }

//   getApplcation() {
//     return this.application;
//   }

//   getStackIndex() {
//     return this.stackIndex;
//   }
// }

// export function createWidget(props: WidgetProps): Widget {
//   return new Widget(props);
// }
