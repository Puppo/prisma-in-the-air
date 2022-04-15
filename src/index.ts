import server from "./server";

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    const address = await server.listen(PORT, "0.0.0.0");
    console.log(`Server listening at ${address}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
