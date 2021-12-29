import {environment} from "../../environments/environment";
import {Image} from "../model";

export class ImageUtil {

  public static getImageUrl(image: Image): string {
    const backendEndpoint = `${environment.BACKEND_ENDPOINT}/image`;
    return `${backendEndpoint}/${image.uuid!}`;
  }

  public static setImageUrl(image: Image): Image {
    const backendEndpoint = `${environment.BACKEND_ENDPOINT}/image`;
    image.imageUrl = `${backendEndpoint}/${image.uuid!}`;
    return image;
  }
}
