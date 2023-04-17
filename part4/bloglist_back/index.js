const app = require("./app.js");
const { info } = require("./utils/logger.js");
const config = require("./utils/config.js");

app.listen(config.PORT, () => {
  info(`Server running on http://localhost:${config.PORT}`);
});
