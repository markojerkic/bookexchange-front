import {ImageFileExtension} from "./enum";

export interface Image {
  uuid?: string;
  imageOrder: number;
  imageFileExtension: ImageFileExtension
}
