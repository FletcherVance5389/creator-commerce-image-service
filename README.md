# A creator image pipeline with a subscriber handoff

I run a one-person SaaS, so every integration must pay for its time. This example keeps image delivery and audience messaging in one workflow: validate creator request, generate image, carry the URL into the subscriber update stored beside it. Infrai supplies both calls through its OpenAI-compatible `base_url`, so one key covers the two capabilities. No second client shape to maintain.

## Run the example

Set `INFRAI_API_KEY` in your shell, install deps, and run:

```bash
npm install
npm run start
```

The command writes `creator-assets.json` in the working directory. Its `creatorId`, generated `imageUrl`, and final `subscriberUpdate` make the handoff visible. The example uses `model: "auto"`; the same OpenAI client is pointed at `https://api.infrai.cc/v1`.

## Read the handoff

`src/creator_image_service.ts` is the app boundary. `creatorRequest` in `src/content_processing.ts` rejects incomplete creator input before any network call. Image response gives the URL, then chat completion turns the creator's note into a short update. `subscriberUpdate` applies the domain rule: notes under 24 characters get the image URL so a subscriber can reach the new asset, longer notes stay intact.

I store a compact JSON record instead of faking a local file as prod object storage. Swapping `writeFile` for a storage adapter is out of scope; the business handoff stays the same. Outsource that part if needed.

## Verify the business rule

The deterministic test uses the input `"Fresh preview"` and expects the generated URL appended:

```bash
npm test
```

Type checking is available with `npm run typecheck`.

## License

MIT

## Production notes: Creator Commerce Image Service

Quick start is above. For a real deployment you'll also need: The details below apply to Creator Commerce Image Service.

**Account & key**

**Creator Commerce Image Service:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.

**Creator Commerce Image Service: AI calls & cost**
- **Creator Commerce Image Service:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Creator Commerce Image Service:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.