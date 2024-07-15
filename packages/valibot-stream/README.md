# Valibot Stream

Define structured response models for OpenAI or Anyscale completions using Valibot schemas and enable partial streaming of that json so that it can be used safely and right away.

## Basic Usage

```ts
import { OAIStream } from "@techmely/valibot-stream/OAIStream";
import { withResponseModel } from "@techmely/valibot-stream/response-model";

import OpenAI from "openai";
import * as v from "valibot";

const oai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"] ?? undefined,
  organization: process.env["OPENAI_ORG_ID"] ?? undefined,
});

export async function POST(request: Request) {
  const { messages } = await request.json();

  const params = withResponseModel({
    response_model: { schema: v.object({ content: v.string() }), name: "Content response" },
    params: {
      messages,
      model: "gpt-4",
    },
    mode: "TOOLS",
  });

  const extractionStream = await oai.chat.completions.create({
    ...params,
    stream: true,
  });

  return new Response(
    OAIStream({
      res: extractionStream,
    }),
  );
}
```

Consuming the structured stream elsewhere, maybe in the browser.

```ts
const client = new ValibotStream();

const stream = await client.create({
  completionPromise: async () => {
    const response = fetch("/api/get-stream", {
      body: JSON.stringify({ messages: [] }),
      method: "POST",
    });

    return response.body;
  },
  response_model: {
    // should match model expected to be returned by the completion.
    schema: v.object({
      content: v.string(),
    }),
  },
});

for await (const chunk of extractionStream) {
  console.log(chunk); // safe to parse partial json
}
```
