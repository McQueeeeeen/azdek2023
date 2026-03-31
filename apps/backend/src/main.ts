import { createApp } from "./app.factory";

async function bootstrap(): Promise<void> {
  const { app, port } = await createApp();
  await app.listen(port);
}

bootstrap();
