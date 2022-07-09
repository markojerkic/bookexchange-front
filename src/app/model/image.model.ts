import { z } from "zod";
import {ImageFileExtension, imageFileExtensionValidator} from "./enum";

interface Image {
  uuid?: string;
  imageOrder: number;
  imageFileExtension: ImageFileExtension;

  imageUrl?: string;
}

const imageValidator = z.object({
  uuid: z.string().optional(),
  imageOrder: z.number(),
  imageFileExtension: imageFileExtensionValidator,
  imageUrl: z.string().optional(),
});

const test = (t: string) => t;

test(imageValidator);

export { Image, imageValidator };