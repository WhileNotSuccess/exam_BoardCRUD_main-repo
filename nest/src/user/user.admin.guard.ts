import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { DataSource } from "typeorm";
import { Admin } from "./entities/admin.entity";

@Injectable()
export class AdminGuard implements CanActivate{
    constructor(private datasource:DataSource){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request=context.switchToHttp().getRequest()
        // console.log(request.user)
        const validate:Promise<boolean>=this.datasource.manager.exists(Admin,{where:{id:request.user.id}})
        return validate
    }
}