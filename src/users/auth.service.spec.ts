import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersService } from "./users.service";



describe("AuthService", () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake compy of the user service
    const users: User[] = [];

    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },

      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 9999), email, password } as User
        users.push(user);
        return Promise.resolve(user);
      }
    }

    const module = await Test.createTestingModule({
      providers: [AuthService, {
        provide: UsersService,
        useValue: fakeUsersService
      }]
    }).compile();

    service = module.get(AuthService);
  })

  it("can create an instance of  auth service", async () => {
    expect(service).toBeDefined();
  })

  it("creates a new user with salted and hased password", async () => {
    const user = await service.signup("email@email.com", "password");
    expect(user.password).not.toEqual("password");

    const [salt, hash] = user.password.split(".");
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  })

  it("throws an error is user signup with email that is in use", async () => {
    await service.signup("email@email.com", "password");

    const promise = service.signup("email@email.com", "password");

    await expect(promise).rejects.toBeInstanceOf(BadRequestException);
  })


  it("throws if signin is called with an unused email", async () => {
    const promise = service.signin("enail@email.com", "password");
    await expect(promise).rejects.toBeInstanceOf(NotFoundException);
  })

  it("throws if an invalid password is provided", async () => {
    await service.signup("email@email.com", "password");
  
    const promise = service.signin("email@email.com", "passwordy")
    
    await expect(promise).rejects.toBeInstanceOf(BadRequestException);
  })

  it("Returns a user if correct password is provided", async () => {
    await service.signup("email@email.com", "password");
    const user = await service.signin("email@email.com", "password");
    expect(user).toBeDefined()
  })
})

