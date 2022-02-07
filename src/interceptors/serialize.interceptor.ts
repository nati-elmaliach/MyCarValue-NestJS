import { NestInterceptor, ExecutionContext, CallHandler, UseInterceptors } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

interface ClassConstructor { // any class interface
  new(...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) { }

  intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    // run something before a request is handled
    // console.log(`Im running before the handler`, context)

    return handler.handle().pipe(
      map((data: any) => {
        // run something before the response i sent out
        // console.log("Im running before respnse is sent out")

        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true
        });
      })
    )
  }
}

