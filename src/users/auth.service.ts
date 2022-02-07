import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { randomBytes, scrypt as _script } from "crypto";
import { promisify } from "util";
import { UsersService } from "./users.service";

const scrypt = promisify(_script);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) { }

  async signup(email: string, password: string) {
    // See if email is in use
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException("email in use")
    }

    // Hash the users password

    //Generate a salt
    const salt = randomBytes(8).toString("hex");

    // Hash the salt and password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hased result and the salt generator
    const result = salt + "." + hash.toString("hex");

    // Create a new user and save it
    const user = this.usersService.create(email, result);

    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const [salt, storedHash] = user.password.split(".");

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString("hex")) {
      throw new BadRequestException("Wrong usermail or password");
    }
    
    return user;
  }
}