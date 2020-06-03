import Server from './app';

const port = process.env.PORT;

function init() {
  Server.listen(port);
  console.log(`Server running on port ${port}`);
}

init();
