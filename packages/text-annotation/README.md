# Text Annotation

Structured text extraction for llms, designed for simplicity, transparency, and control.

## Basic use

```ts
import Annotator from "@techmely/text-annotation";
import OpenAI from "openai";
import * as v from "valibot";

const oai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? undefined,
  organization: process.env.OPENAI_ORG_ID ?? undefined,
});

const client = Annotator({
  client: oai,
  mode: "TOOLS",
});

const UserSchema = v.object({
  // Description will be used in the prompt
  age: v.number().describe("The age of the user"),
  name: v.string(),
  character: v.string(),
});

// User will be of type z.infer<typeof UserSchema>
const user = await client.chat.completions.create({
  messages: [{ role: "user", content: "Harry Tran is 30 years old. He is handsome guy" }],
  model: "gpt-4",
  response_model: {
    schema: UserSchema,
    name: "User",
  },
});

console.log(user);
// { age: 30, name: "Harry Tran", character: "handsome" }
```

## Advanced Use

### Automate Detect Right Schema

```ts
import Annotator from "@techmely/text-annotation";
import OpenAI from "openai";
import * as v from "valibot";

const oai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? undefined,
  organization: process.env.OPENAI_ORG_ID ?? undefined,
});

const UserSchema = v.object({
  // Description will be used in the prompt
  age: v.number().describe("The age of the user"),
  name: v.string(),
  character: v.string(),
});

const client = Annotator({
  client: oai,
  mode: "auto",
  pools: [UserSchema, PostSchema, XyzSchema],
});

// User will be of type z.infer<typeof UserSchema>
const user = await client.chat.completions.create({
  messages: [{ role: "user", content: "Harry Tran is 30 years old. He is handsome guy" }],
  model: "gpt-4",
});

console.log(user);
// { age: 30, name: "Harry Tran", character: "handsome" }
```
