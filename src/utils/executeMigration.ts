import establishConnection from './establishConnection';

async function execute() {
  const connection = await establishConnection({logging: true});
  await connection.runMigrations();
  await connection.close();
  return 0;
}

execute().then(process.exit).catch(error => {
    console.log(error);
    process.exit(1);
});
