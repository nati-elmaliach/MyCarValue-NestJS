import { rm } from "fs/promises";
import { join } from "path";
import { getConnection } from "typeorm";

// run before every single test in our spec files
global.beforeEach(async () => {
  try {
    await rm(join(__dirname, "..", "test.sqlite"))

  } catch (error) {
    console.log("Sqlite File does not exists")
  }
})

// Close the connecton after every test
global.afterEach(async () => {
  const connection = getConnection();
  await connection.close()
})