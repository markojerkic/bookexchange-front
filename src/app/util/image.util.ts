import {environment} from "../../environments/environment";
import {Image} from "../model";

export class ImageUtil {

  public static getImageUrl(image: Image): string {
    const backendEndpoint = `${environment.BACKEND_ENDPOINT}/image`;
    console.log(image);
    console.log(`${backendEndpoint}/${image.uuid!}`)
    return `${backendEndpoint}/${image.uuid!}`;
  }
}
