import {ImageFileExtension} from "./image-file-extension.enum";

export interface Image {
  uuid?: string;
  imageOrder: number;
  imageFileExtension: ImageFileExtension
}
