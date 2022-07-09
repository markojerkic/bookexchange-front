import { z } from "zod";

enum ImageFileExtension {
  JPEG = ' JPEG', PNG = 'PNG', JPG = 'JPG'
}
const imageFileExtensionValidator = z.enum([
  'JPEG', 'PNG', 'JPG'
]);

export { ImageFileExtension, imageFileExtensionValidator };