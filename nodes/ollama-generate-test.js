
module.exports = function(RED) {
    const { Ollama } = require('ollama');

    function OllamaGenerateNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', async function(msg) {
            // Extract prompt and images from the input payload
            const { prompt, images } = msg.payload;

            // Other parameters from node config
            const {
                model,
                suffix,
                system,
                template,
                raw,
                format,
                stream,
                keep_alive,
                options
            } = config;

            const ollama = new Ollama({ host: config.host });

            // Pass both msg.payload values (prompt and images) and config values into the generate request
            const response = await ollama.generate({
                model,
                prompt,  // Comes from the input payload
                suffix,
                system,
                template,
                raw,
                images,  // Comes from the input payload
                format,
                stream,
                keep_alive,
                options
            }).catch(error => {
                node.error(error);
            });

            msg.payload = response;
            node.send(msg);
        });
    }

    RED.nodes.registerType('ollama-generate', OllamaGenerateNode);
}
