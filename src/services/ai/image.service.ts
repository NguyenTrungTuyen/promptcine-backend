import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageService {
  async generateImage(prompt: string): Promise<string> {
    // Tạm giả lập, bạn có thể dùng Stable Diffusion API, DALL·E, v.v.
    const imageUrl = `https://dummyimage.com/1024x576/000/fff&text=${encodeURIComponent(
      prompt.slice(0, 50),
    )}`;
    return imageUrl;
  }
}
