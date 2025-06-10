## Privacy
Unlike other companies who wants to take your sexy conversations and sell them to data brokers, we don't save or even peek at your data (we would probably need to rip our eyes out if we did.)

### Can You Keep a Secret?
![Rally making a shushing noise](https://r2.rally.sh/photos/litepaper/rally-privacy.png)

#### No User Data Stored
Our platform doesn't need to maintain a database of user information to use our applications. Everything is done through blockchain technology. The only database is the one storing the AI companion's memories, which are chunked and recorded as vector embeddings (numerical representations of text).

#### Private AI Text Inference
For now, text inference is done using [Venice.AI](https://venice.ai/blog/how-venice-handles-your-privacy), a private and uncensored LLM provider. Any message history seen on our platform comes from data that was saved on your device's [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). We plan to host models on our own servers for further verifiable privacy.

#### Media (Audio, Image, Video) Generation
Media generation is done privately on our locally hosted servers. All generated media will be wiped from the servers after 24 hours—so make sure to save any photos or pictures received. The only data ever collected would be from the AI Companion's memory of sending that picture the user (which is stored as vector embeddings.)

## Resources
<hr/>
<div class="resources-section">
<h3>Works Cited</h3>
    <ol>
        <li><a target="_blank" href="https://venice.ai/privacy">https://venice.ai/privacy</a></li>
        <li><a target="_blank" href="https://venice.ai/blog/how-venice-handles-your-privacy<">https://venice.ai/blog/how-venice-handles-your-privacy</a></li>
        <li><a target="_blank" href="https://www.ibm.com/think/topics/vector-embedding">https://www.ibm.com/think/topics/vector-embedding</a></li>
        <li><a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage">https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage</a></li>
    </ol>
</div>