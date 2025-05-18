## Privacy
Unlike other companies who wants to **take your sexy conversations and sell them to data brokers**, the Phantasy team doesn't want to take your data let alone even know who you are.

### Whatever Happens With Rally, Stays With Rally
![Rally making a shushing noise](https://r2.rally.sh/rally-pfp.png)

#### NO DATABASE: NO USER ACCOUNTS
Our platform doesn't maintain a database of user information. The only database is the one storing the AI companion's memories, which are chunked and recorded as vector embeddings (numerical representations of text).

#### PRIVATE AI TEXT INFERENCE
For now, text inference is done using [Venice.AI](https://venice.ai/blog/how-venice-handles-your-privacy), a private and uncensored LLM provider. Any message history seen on our platform comes from data that was saved on your device's [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). We plan to host models on our own servers for further verifiable privacy.

#### Media (Audio, Image, Video) Generation
Media generation is done privately on our locally hosted servers. All generated media will be wiped from the servers after 24 hours—so make sure to save any photos or pictures received. The only data ever collected would be from the AI Companion's memory of sending that picture the user (which is stored as vector embeddings)

## Resources
<hr/>

1. https://venice.ai/privacy

2. https://venice.ai/blog/how-venice-handles-your-privacy

3. https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage